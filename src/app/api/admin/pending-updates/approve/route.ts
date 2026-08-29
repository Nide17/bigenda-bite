import { NextResponse, NextRequest } from 'next/server'
import { requireEditor } from '@/lib/auth/authorize'
import { connectToDatabase } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'
import { createClient } from '@sanity/client'
import { sendDiscordNotification } from '@/lib/discord'
import { parseJson, requireFields, fail } from '@/lib/api/validate'

function createSanityClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  })
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireEditor(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const parsed = await parseJson<{ updateId: string }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['updateId'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    const { updateId } = parsed.data

    const db = await connectToDatabase()
    const pendingUpdates = db.collection('pendingUpdates')

    const update = await pendingUpdates.findOne({ _id: new ObjectId(updateId) })

    if (!update) {
      return NextResponse.json(fail('Pending update not found', 404), { status: 404 })
    }

    if (update.status !== 'pending') {
      return NextResponse.json(fail('Update is not pending'), { status: 400 })
    }

    const sanityClient = createSanityClient()
    const doc = update.update as unknown as Record<string, unknown> & { _id?: string }

    try {
      if (update.documentId && update.documentId.startsWith('process_')) {
        await sanityClient.createOrReplace(doc as Parameters<typeof sanityClient.createOrReplace>[0])
      } else {
        await sanityClient.create(doc as Parameters<typeof sanityClient.create>[0])
      }
    } catch (error) {
      console.error('Sanity write failed:', error)
      return NextResponse.json({ error: 'Failed to write to Sanity' }, { status: 500 })
    }

    await pendingUpdates.updateOne(
      { _id: new ObjectId(updateId) },
      { $set: { status: 'approved', approvedAt: new Date() } }
    )

    const title = update.documentId || 'Unknown update'
    await sendDiscordNotification(
      `Update approved for ${title}`,
      [
        {
          title: '✅ Content Update Approved',
          description: `The update for "${title}" has been approved and published to Sanity.`,
          color: 0x10b981,
        },
      ]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error approving update:', error)
    return NextResponse.json({ error: 'Failed to approve update' }, { status: 500 })
  }
}



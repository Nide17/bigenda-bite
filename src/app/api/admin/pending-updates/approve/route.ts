import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'
import { createClient } from '@sanity/client'
import { sendDiscordNotification } from '@/lib/discord'

interface CookiesRequest extends Request {
  cookies?: {
    get(name: string): { value?: string }
  }
}

function createSanityClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  })
}

export async function POST(request: Request) {
  try {
    const session = await getSession((request as CookiesRequest).cookies?.get('next-auth.session-token')?.value || null)
    if (!session?.user || session.user.role !== 'editor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { updateId } = body

    if (!updateId) {
      return NextResponse.json({ error: 'updateId is required' }, { status: 400 })
    }

    const db = await connectToDatabase()
    const pendingUpdates = db.collection('pendingUpdates')

    const update = await pendingUpdates.findOne({ _id: new ObjectId(updateId) })

    if (!update) {
      return NextResponse.json({ error: 'Pending update not found' }, { status: 404 })
    }

    if (update.status !== 'pending') {
      return NextResponse.json({ error: 'Update is not pending' }, { status: 400 })
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

    await sendDiscordNotification(
      `Update approved for ${(() => { const t = (doc as Record<string, unknown>).translations as Record<string, unknown> | undefined; const en = (t as Record<string, unknown> | undefined)?.en as Record<string, unknown> | undefined; return en?.title || update.documentId })()}`,
      [
        {
          title: '✅ Content Update Approved',
          description: `The update for "${(() => { const t = (doc as Record<string, unknown>).translations as Record<string, unknown> | undefined; const en = (t as Record<string, unknown> | undefined)?.en as Record<string, unknown> | undefined; return en?.title || update.documentId })()}" has been approved and published to Sanity.`,
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


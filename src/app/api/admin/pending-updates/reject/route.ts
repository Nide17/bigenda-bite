import { NextResponse, NextRequest } from 'next/server'
import { requireEditor } from '@/lib/auth/authorize'
import { connectToDatabase } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'
import { sendDiscordNotification } from '@/lib/discord'
import { parseJson, requireFields, fail } from '@/lib/api/validate'

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

    await pendingUpdates.updateOne(
      { _id: new ObjectId(updateId) },
      { $set: { status: 'rejected', rejectedAt: new Date() } }
    )

    const title = update.documentId || 'Unknown update'
    await sendDiscordNotification(
      `Update rejected for ${title}`,
      [
        {
          title: '❌ Content Update Rejected',
          description: `The update for "${title}" has been rejected.`,
          color: 0xef4444,
        },
      ]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error rejecting update:', error)
    return NextResponse.json({ error: 'Failed to reject update' }, { status: 500 })
  }
}



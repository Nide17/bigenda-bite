import { NextResponse, NextRequest } from 'next/server'
import { requireEditor } from '@/lib/auth/authorize'
import { connectToDatabase } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'
import { sendDiscordNotification } from '@/lib/discord'

export async function POST(request: NextRequest) {
  try {
    const auth = await requireEditor(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
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



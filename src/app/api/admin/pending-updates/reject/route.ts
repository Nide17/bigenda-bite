import { NextResponse, NextRequest } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'
import { sendDiscordNotification } from '@/lib/discord'

export async function POST(request: Request) {
  try {
    const session = await getSession((request as any).cookies?.get('next-auth.session-token')?.value || null)
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

    await pendingUpdates.updateOne(
      { _id: new ObjectId(updateId) },
      { $set: { status: 'rejected', rejectedAt: new Date() } }
    )

    const doc = update.update as any
    await sendDiscordNotification(
      `Update rejected for ${doc.translations?.en?.title || update.documentId}`,
      [
        {
          title: '❌ Content Update Rejected',
          description: `The update for "${doc.translations?.en?.title || update.documentId}" has been rejected.`,
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


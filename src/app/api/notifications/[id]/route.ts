import { NextResponse, NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth/authorize'
import { connectToDatabase } from '@/lib/db/mongodb'
import { markNotificationRead } from '@/lib/notifications'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const session = auth.session!
    const { id } = await params
    const db = await connectToDatabase()

    const notification = await db.collection('notifications').findOne({
      _id: new (await import('mongodb')).ObjectId(id),
    })

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await markNotificationRead(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json({ error: 'Failed to mark notification as read' }, { status: 500 })
  }
}

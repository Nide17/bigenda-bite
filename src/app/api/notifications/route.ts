import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db/mongodb'
import { createNotification, getUserNotifications, markAllNotificationsRead } from '@/lib/notifications'

export async function GET(request: Request) {
  try {
    const session = await getSession((request as any).cookies?.get('next-auth.session-token')?.value || null)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    if (unreadOnly) {
      const count = await db.collection('notifications').countDocuments({
        userId: session.user.id,
        read: false,
      })
      return NextResponse.json({ count })
    }

    const notifications = await db
      .collection('notifications')
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    const unreadCount = await db.collection('notifications').countDocuments({
      userId: session.user.id,
      read: false,
    })

    return NextResponse.json({
      notifications: notifications.map((n) => ({
        id: n._id.toString(),
        type: n.type,
        title: n.title,
        body: n.body,
        read: n.read,
        metadata: n.metadata,
        createdAt: n.createdAt,
      })),
      unreadCount,
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession((request as any).cookies?.get('next-auth.session-token')?.value || null)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, title, body: bodyText, metadata } = body

    if (!type || !title || !bodyText) {
      return NextResponse.json({ error: 'type, title, and body are required' }, { status: 400 })
    }

    const notificationId = await createNotification(
      session.user.id,
      type,
      title,
      bodyText,
      metadata
    )

    return NextResponse.json({ id: notificationId }, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}


import { NextResponse, NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth/authorize'
import { connectToDatabase } from '@/lib/db/mongodb'
import { createNotification } from '@/lib/notifications'
import { parseJson, requireFields } from '@/lib/api/validate'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const session = auth.session!
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

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const session = auth.session!
    const parsed = await parseJson<{ type: string; title: string; body: string; metadata?: Record<string, unknown> }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['type', 'title', 'body'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    const { type, title, body: bodyText, metadata } = parsed.data

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



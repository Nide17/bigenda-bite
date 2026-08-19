import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db/mongodb'
import { markNotificationRead } from '@/lib/notifications'

interface CookiesRequest extends Request {
  cookies?: {
    get(name: string): { value?: string }
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession((request as CookiesRequest).cookies?.get('next-auth.session-token')?.value || null)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

import { NextResponse, NextRequest } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db/mongodb'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request.cookies.get('next-auth.session-token')?.value || null)
    if (!session?.user || session.user.role !== 'editor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await connectToDatabase()
    const users = await db.collection('users').find({}).sort({ createdAt: -1 }).limit(100).toArray()

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession(request.cookies.get('next-auth.session-token')?.value || null)
    if (!session?.user || session.user.role !== 'editor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, role, banned } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const db = await connectToDatabase()
    const update: Record<string, unknown> = {}

    if (role) update.role = role
    if (typeof banned === 'boolean') update.banned = banned

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const result = await db.collection('users').updateOne(
      { _id: new (await import('mongodb')).ObjectId(userId) },
      { $set: update }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

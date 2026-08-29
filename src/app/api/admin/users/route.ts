import { NextResponse, NextRequest } from 'next/server'
import { requireAdmin } from '@/lib/auth/authorize'
import { connectToDatabase } from '@/lib/db/mongodb'
import { parseJson, requireFields, fail } from '@/lib/api/validate'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
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
    const auth = await requireAdmin(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const parsed = await parseJson<{ userId: string; role?: string; banned?: boolean }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['userId'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    const { userId, role, banned } = parsed.data

    if (role && !['reader', 'editor', 'admin', 'superadmin'].includes(role)) {
      return NextResponse.json(fail('Invalid role'), { status: 400 })
    }

    const db = await connectToDatabase()
    const update: Record<string, unknown> = {}

    if (role) update.role = role
    if (typeof banned === 'boolean') update.banned = banned

    if (Object.keys(update).length === 0) {
      return NextResponse.json(fail('No fields to update'), { status: 400 })
    }

    const result = await db.collection('users').updateOne(
      { _id: new (await import('mongodb')).ObjectId(userId) },
      { $set: update }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(fail('User not found', 404), { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}



import { NextResponse, NextRequest } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'
import { requireAuth } from '@/lib/auth/authorize'
import { parseJson } from '@/lib/api/validate'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const session = auth.session!

    const db = await connectToDatabase()
    const users = db.collection('users')
    const user = await users.findOne({ _id: new ObjectId(session.user.id) })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified || false,
      isForeigner: user.isForeigner || false,
    })
  } catch (error) {
    console.error('Get account error:', error)
    return NextResponse.json({ error: 'Failed to load account' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const session = auth.session!

    const parsed = await parseJson<{ displayName?: string; email?: string; isForeigner?: boolean }>(request)
    if (!parsed.ok) return parsed.response

    const { displayName, email, isForeigner } = parsed.data

    if (!displayName && !email && isForeigner === undefined) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const db = await connectToDatabase()
    const users = db.collection('users')
    const userId = new ObjectId(session.user.id)

    const update: Record<string, unknown> = {}

    if (displayName) {
      if (displayName.trim().length < 2) {
        return NextResponse.json({ error: 'Display name must be at least 2 characters' }, { status: 400 })
      }
      update.displayName = displayName.trim()
    }

    if (email && email !== session.user.email) {
      const existing = await users.findOne({ email, _id: { $ne: userId } })
      if (existing) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
      }
      update.email = email
      update.emailVerified = false
    }

    if (isForeigner !== undefined) {
      update.isForeigner = isForeigner
    }

    if (Object.keys(update).length > 0) {
      update.updatedAt = new Date()
      await users.updateOne({ _id: userId }, { $set: update })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update account error:', error)
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 })
  }
}

import { NextResponse, NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'
import { requireAuth } from '@/lib/auth/authorize'
import { parseJson, requireFields, fail } from '@/lib/api/validate'

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const session = auth.session!

    const parsed = await parseJson<{ currentPassword: string; newPassword: string }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['currentPassword', 'newPassword'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    const { currentPassword, newPassword } = parsed.data

    if (newPassword.length < 8) {
      return NextResponse.json(fail('Password must be at least 8 characters'), { status: 400 })
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(fail('New password must be different from current password'), { status: 400 })
    }

    const db = await connectToDatabase()
    const users = db.collection('users')

    const user = await users.findOne({ _id: new ObjectId(session.user.id) })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await users.updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
  }
}

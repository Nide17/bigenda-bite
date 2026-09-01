import { NextResponse, NextRequest } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'
import { parseJson, requireFields, fail } from '@/lib/api/validate'

export async function POST(request: NextRequest) {
  try {
    const parsed = await parseJson<{ token: string }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['token'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    const { token } = parsed.data

    const db = await connectToDatabase()
    const emailVerifications = db.collection('emailVerifications')

    const verification = await emailVerifications.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    })

    if (!verification) {
      return NextResponse.json(fail('Invalid or expired verification token', 400), { status: 400 })
    }

    const users = db.collection('users')

    await users.updateOne(
      { _id: new ObjectId(verification.userId) },
      { $set: { emailVerified: true, emailVerifiedAt: new Date() } }
    )

    await emailVerifications.updateOne(
      { _id: verification._id },
      { $set: { used: true, usedAt: new Date() } }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Verify email error:', error)
    return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 })
  }
}

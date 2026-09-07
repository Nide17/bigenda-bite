import { NextResponse, NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'
import { parseJson, requireFields, fail } from '@/lib/api/validate'
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(request, {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000,
    keyGenerator: (req) => {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
      return `reset-password:${ip}`
    },
  })

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.resetAt)
  }
  try {
    const parsed = await parseJson<{ token: string; password: string }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['token', 'password'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    const { token, password } = parsed.data

    if (password.length < 8) {
      return NextResponse.json(fail('Password must be at least 8 characters'), { status: 400 })
    }

    const db = await connectToDatabase()
    const passwordResets = db.collection('passwordResets')

    const resetRecord = await passwordResets.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    })

    if (!resetRecord) {
      const expired = await passwordResets.findOne({
        token,
        used: { $ne: true },
        expiresAt: { $lte: new Date() },
      })

      if (expired) {
        return NextResponse.json(fail('Reset link expired. Please request a new one.', 400), { status: 400 })
      }

      return NextResponse.json(fail('Invalid or expired reset token', 400), { status: 400 })
    }

    const users = db.collection('users')
    const hashedPassword = await bcrypt.hash(password, 10)

    await users.updateOne(
      { _id: new ObjectId(resetRecord.userId) },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    )

    await passwordResets.updateOne(
      { _id: resetRecord._id },
      { $set: { used: true, usedAt: new Date() } }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

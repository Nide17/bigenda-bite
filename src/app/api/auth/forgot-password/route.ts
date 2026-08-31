import { NextResponse, NextRequest } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import { randomBytes } from 'crypto'
import { parseJson, requireFields } from '@/lib/api/validate'

const RESET_TOKEN_EXPIRY_HOURS = 1

export async function POST(request: NextRequest) {
  try {
    const parsed = await parseJson<{ email: string; lang?: string }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['email'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    const { email } = parsed.data

    const db = await connectToDatabase()
    const users = db.collection('users')
    const passwordResets = db.collection('passwordResets')

    const user = await users.findOne({ email })

    if (user) {
      const token = randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)

      await passwordResets.insertOne({
        userId: user._id,
        email,
        token,
        expiresAt,
        used: false,
        createdAt: new Date(),
      })

      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

      const resetUrl = `${baseUrl}/en/reset-password?token=${token}`

      console.log(`Password reset link for ${email}: ${resetUrl}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

import { NextResponse, NextRequest } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import { randomBytes } from 'crypto'
import { parseJson, requireFields } from '@/lib/api/validate'
import { sendMail } from '@/lib/email'

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
      await passwordResets.updateMany(
        { email, used: false },
        { $set: { used: true, revokedAt: new Date() } }
      )

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

      await sendMail({
        to: email,
        subject: 'Reset your Bigenda Bite password',
        text: `You requested a password reset for your Bigenda Bite account.\n\nClick the link below to set a new password. This link expires in ${RESET_TOKEN_EXPIRY_HOURS} hour.\n\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email.`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1e1b4b; margin-bottom: 16px;">Reset your password</h2>
            <p style="color: #404040; line-height: 1.5;">You requested a password reset for your Bigenda Bite account.</p>
            <p style="color: #404040; line-height: 1.5;">Click the button below to set a new password. This link expires in <strong>${RESET_TOKEN_EXPIRY_HOURS} hour</strong>.</p>
            <a href="${resetUrl}" style="display: inline-block; background: #1e1b4b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">Reset password</a>
            <p style="color: #737373; font-size: 14px;">If the button doesn't work, copy and paste this link:<br>${resetUrl}</p>
            <p style="color: #737373; font-size: 14px; margin-top: 24px;">If you did not request this, you can safely ignore this email.</p>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

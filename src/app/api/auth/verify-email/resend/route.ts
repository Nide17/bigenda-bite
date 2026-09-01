import { NextResponse, NextRequest } from 'next/server'
import { randomBytes } from 'crypto'
import { connectToDatabase } from '@/lib/db/mongodb'
import { parseJson, requireFields, fail } from '@/lib/api/validate'
import { sendMail } from '@/lib/email'

const VERIFICATION_TOKEN_EXPIRY_HOURS = 24

export async function POST(request: NextRequest) {
  try {
    const parsed = await parseJson<{ email: string }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['email'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    const { email } = parsed.data

    const db = await connectToDatabase()
    const users = db.collection('users')
    const emailVerifications = db.collection('emailVerifications')

    const user = await users.findOne({ email })

    if (!user) {
      return NextResponse.json({ success: true, message: 'If an account exists, a verification email has been sent.' })
    }

    if (user.emailVerified) {
      return NextResponse.json(fail('Email is already verified', 400), { status: 400 })
    }

    await emailVerifications.updateMany(
      { email, used: false },
      { $set: { used: true, revokedAt: new Date() } }
    )

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)

    await emailVerifications.insertOne({
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

    const verifyUrl = `${baseUrl}/en/verify-email?token=${token}`

    await sendMail({
      to: email,
      subject: 'Verify your Bigenda Bite email',
      text: `Hi ${user.displayName},\n\nPlease verify your email address by clicking the link below. This link expires in ${VERIFICATION_TOKEN_EXPIRY_HOURS} hours.\n\n${verifyUrl}\n\nIf you did not request this, you can safely ignore this email.`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 48px; height: 48px; background: #1e1b4b; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">BB</div>
          </div>
          <h2 style="color: #1e1b4b; margin-bottom: 16px;">Verify your email</h2>
          <p style="color: #404040; line-height: 1.5;">Hi ${user.displayName},</p>
          <p style="color: #404040; line-height: 1.5;">Please verify your email address by clicking the button below. This link expires in <strong>${VERIFICATION_TOKEN_EXPIRY_HOURS} hours</strong>.</p>
          <a href="${verifyUrl}" style="display: inline-block; background: #1e1b4b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">Verify email</a>
          <p style="color: #737373; font-size: 14px;">If the button doesn't work, copy and paste this link:<br>${verifyUrl}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true, message: 'Verification email sent.' })
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { connectToDatabase } from '@/lib/db/mongodb'
import { parseJson, requireFields, fail } from '@/lib/api/validate'
import { sendMail } from '@/lib/email'

const VERIFICATION_TOKEN_EXPIRY_HOURS = 24

export async function POST(request: Request) {
  try {
    const parsed = await parseJson<{ name: string; email: string; password: string }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['name', 'email', 'password'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    const { name, email, password } = parsed.data

    if (password.length < 8) {
      return NextResponse.json(fail('Password must be at least 8 characters'), { status: 400 })
    }

    const db = await connectToDatabase()
    const users = db.collection('users')
    const emailVerifications = db.collection('emailVerifications')

    const existing = await users.findOne({ email })
    if (existing) {
      return NextResponse.json(fail('User already exists', 409), { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const insertResult = await users.insertOne({
      displayName: name,
      email,
      password: hashedPassword,
      role: 'reader',
      reputationScore: 0,
      contributionCount: 0,
      emailVerified: false,
      createdAt: new Date(),
    })

    await emailVerifications.updateMany(
      { email, used: false },
      { $set: { used: true, revokedAt: new Date() } }
    )

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)

    await emailVerifications.insertOne({
      userId: insertResult.insertedId,
      email,
      token,
      expiresAt,
      used: false,
      createdAt: new Date(),
    })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      || 'https://bigenda-bite.vercel.app'

    const verifyUrl = `${baseUrl}/en/verify-email?token=${token}`

    await sendMail({
      to: email,
      subject: 'Verify your Bigenda Bite email',
      text: `Hi ${name},\n\nWelcome to Bigenda Bite! Please verify your email address by clicking the link below. This link expires in ${VERIFICATION_TOKEN_EXPIRY_HOURS} hours.\n\n${verifyUrl}\n\nIf you did not create an account, you can safely ignore this email.\n\nBest regards,\nThe Bigenda Bite Team`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 48px; height: 48px; background: #1e1b4b; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">BB</div>
          </div>
          <h2 style="color: #1e1b4b; margin-bottom: 16px;">Verify your email</h2>
          <p style="color: #404040; line-height: 1.5;">Hi ${name},</p>
          <p style="color: #404040; line-height: 1.5;">Welcome to Bigenda Bite! Please verify your email address by clicking the button below. This link expires in <strong>${VERIFICATION_TOKEN_EXPIRY_HOURS} hours</strong>.</p>
          <a href="${verifyUrl}" style="display: inline-block; background: #1e1b4b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">Verify email</a>
          <p style="color: #737373; font-size: 14px;">If the button doesn't work, copy and paste this link:<br>${verifyUrl}</p>
          <p style="color: #737373; font-size: 14px; margin-top: 24px;">If you did not create an account, you can safely ignore this email.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true, message: 'Registration successful. Please check your email to verify your account.' }, { status: 201 })
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 })
  }
}


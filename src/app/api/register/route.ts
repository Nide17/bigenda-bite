import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/db/mongodb'
import { parseJson, requireFields, fail } from '@/lib/api/validate'
import { sendMail } from '@/lib/email'

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

    const existing = await users.findOne({ email })
    if (existing) {
      return NextResponse.json(fail('User already exists', 409), { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await users.insertOne({
      displayName: name,
      email,
      password: hashedPassword,
      role: 'reader',
      reputationScore: 0,
      contributionCount: 0,
      createdAt: new Date(),
    })

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    await sendMail({
      to: email,
      subject: 'Welcome to Bigenda Bite!',
      text: `Hi ${name},\n\nWelcome to Bigenda Bite! Your account has been created successfully.\n\nYou can now sign in at ${baseUrl}/en/login and start exploring official processes, guides, and business directories in Rwanda.\n\nIf you have any questions, feel free to reach out.\n\nBest regards,\nThe Bigenda Bite Team`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 48px; height: 48px; background: #1e1b4b; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">BB</div>
          </div>
          <h2 style="color: #1e1b4b; margin-bottom: 16px;">Welcome to Bigenda Bite!</h2>
          <p style="color: #404040; line-height: 1.5;">Hi ${name},</p>
          <p style="color: #404040; line-height: 1.5;">Your account has been created successfully. You can now sign in and start exploring official processes, guides, and business directories in Rwanda.</p>
          <a href="${baseUrl}/en/login" style="display: inline-block; background: #1e1b4b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">Sign in to your account</a>
          <p style="color: #737373; font-size: 14px; margin-top: 24px;">If you have any questions, feel free to reach out.</p>
          <p style="color: #737373; font-size: 14px;">Best regards,<br>The Bigenda Bite Team</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 })
  }
}


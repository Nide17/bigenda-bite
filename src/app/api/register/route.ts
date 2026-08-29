import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/db/mongodb'
import { parseJson, requireFields, fail } from '@/lib/api/validate'

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

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 })
  }
}


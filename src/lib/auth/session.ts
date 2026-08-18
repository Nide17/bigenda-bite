import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'

const SESSION_COOKIE = 'next-auth.session-token'

export async function getSession(requestOrCookie: NextRequest | string | null) {
  const token = typeof requestOrCookie === 'string'
    ? requestOrCookie
    : requestOrCookie?.cookies?.get(SESSION_COOKIE)?.value

  if (!token) return null

  try {
    const db = await connectToDatabase()
    const session = await db.collection('sessions').findOne({ sessionToken: token })
    
    if (!session || new Date(session.expires) < new Date()) {
      return null
    }

    const users = db.collection('users')
    const user = await users.findOne({ _id: session.userId })
    
    if (!user) return null

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    }
  } catch (error) {
    console.error('getSession error:', error)
    return null
  }
}


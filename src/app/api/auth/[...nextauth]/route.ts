import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

const SESSION_COOKIE = 'next-auth.session-token'
const SESSION_MAX_AGE = 30 * 24 * 60 * 60

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const action = url.searchParams.get('action') || url.pathname.split('/').pop()

    if (action === 'csrf') {
      const token = randomUUID()
      const res = NextResponse.json({ csrfToken: token })
      res.cookies.set('next-auth.csrf-token', token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60,
      })
      return res
    }

    if (action === 'providers') {
      return NextResponse.json({
        credentials: {
          id: 'credentials',
          name: 'Credentials',
          type: 'credentials',
        },
      })
    }

    if (action === 'session') {
      return getSessionFromRequest(request)
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  } catch (error) {
    console.error('Auth GET error:', error)
    return NextResponse.json({ error: 'Server error', details: String(error) }, { status: 500 })
  }
}

async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token')?.value
  if (!token) {
    return NextResponse.json({ user: null })
  }

  try {
    const db = await connectToDatabase()
    const session = await db.collection('sessions').findOne({ sessionToken: token })
    
    if (!session || new Date(session.expires) < new Date()) {
      return NextResponse.json({ user: null })
    }

    const users = db.collection('users')
    const user = await users.findOne({ _id: session.userId })
    
    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Session GET error:', error)
    return NextResponse.json({ user: null })
  }
}

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const action = url.searchParams.get('action') || url.pathname.split('/').pop()

    if (action === 'csrf') {
      const token = randomUUID()
      const res = NextResponse.json({ csrfToken: token })
      res.cookies.set('next-auth.csrf-token', token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60,
      })
      return res
    }

    if (action === 'signin' || action === 'callback' || action === 'credentials') {
      const body = await request.text()
      const params = new URLSearchParams(body)
      const email = params.get('email')
      const password = params.get('password')
      const callbackUrl = params.get('callbackUrl') || '/en'

      if (!email || !password) {
        return NextResponse.redirect(new URL('/api/auth/error?error=MissingCredentials', request.url))
      }

      try {
        const db = await connectToDatabase()
        const users = db.collection('users')
        const user = await users.findOne({ email })

        if (!user) {
          return NextResponse.redirect(new URL('/api/auth/error?error=InvalidEmail', request.url))
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
          return NextResponse.redirect(new URL('/api/auth/error?error=InvalidPassword', request.url))
        }

        const sessionToken = randomUUID()
        const expires = new Date()
        expires.setTime(expires.getTime() + SESSION_MAX_AGE * 1000)

        await db.collection('sessions').insertOne({
          sessionToken,
          userId: user._id,
          expires: expires.toISOString(),
        })

        const res = NextResponse.redirect(new URL(callbackUrl, request.url))
        res.cookies.set(SESSION_COOKIE, sessionToken, {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: SESSION_MAX_AGE,
        })
        
        return res
      } catch (error) {
        console.error('Credentials POST error:', error)
        return NextResponse.redirect(new URL('/api/auth/error?error=ServerError', request.url))
      }
    }

    if (action === 'signout') {
      const token = request.cookies.get(SESSION_COOKIE)?.value
      if (token) {
        try {
          const db = await connectToDatabase()
          await db.collection('sessions').deleteOne({ sessionToken: token })
        } catch (error) {
          console.error('Signout error:', error)
        }
      }
      
      const res = NextResponse.redirect(new URL('/en', request.url))
      res.cookies.set(SESSION_COOKIE, '', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      })
      return res
    }

    return NextResponse.json({ error: 'Not found', action }, { status: 404 })
  } catch (error) {
    console.error('Auth POST error:', error)
    return NextResponse.json({ error: 'Server error', details: String(error) }, { status: 500 })
  }
}

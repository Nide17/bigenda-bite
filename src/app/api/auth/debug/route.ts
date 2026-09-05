import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import { getSession } from '@/lib/auth/session'

export async function GET() {
  const env = {
    MONGODB_URI: process.env.MONGODB_URI ? 'set' : 'missing',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'missing',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'set' : 'missing',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'set' : 'missing',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'set' : 'missing',
  }

  let mongoStatus: unknown = 'not_tested'
  try {
    const db = await connectToDatabase()
    const adminDb = db.command({ ping: 1 })
    mongoStatus = { ok: true, ping: adminDb }
  } catch (error) {
    mongoStatus = {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
      code: error && typeof error === 'object' && 'code' in error ? (error as { code: number }).code : undefined,
      codeName: error && typeof error === 'object' && 'codeName' in error ? (error as { codeName: string }).codeName : undefined,
    }
  }

  let sessionStatus: unknown = 'not_tested'
  try {
    const session = await getSession()
    sessionStatus = session ? { user: session.user ? { id: session.user.id, email: session.user.email, role: session.user.role } : null } : null
  } catch (error) {
    sessionStatus = {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    }
  }

  return NextResponse.json({
    env,
    mongo: mongoStatus,
    session: sessionStatus,
  })
}

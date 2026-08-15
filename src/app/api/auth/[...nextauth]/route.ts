import { NextRequest, NextResponse } from 'next/server'
import NextAuth from 'next-auth'
import { authOptions } from './options'

export const dynamic = 'force-dynamic'

const handler = NextAuth(authOptions)

export async function GET(request: NextRequest) {
  try {
    return await handler(request)
  } catch (error) {
    console.error('Auth GET error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    return await handler(request)
  } catch (error) {
    console.error('Auth POST error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
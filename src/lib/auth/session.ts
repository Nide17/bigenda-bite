/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import type { AppSession } from '@/app/api/auth/[...nextauth]/options'
import type { NextRequest } from 'next/server'

if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = 'http://localhost:3000'
}

const sessionOptions = {
  ...authOptions,
  adapter: undefined,
  providers: undefined,
}

export async function getSession(request?: NextRequest): Promise<AppSession | null> {
  try {
    const session = request
      ? await (getServerSession as any)(request, undefined, sessionOptions)
      : await getServerSession(sessionOptions)
    return session as AppSession | null
  } catch {
    return null
  }
}

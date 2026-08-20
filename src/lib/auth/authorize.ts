import { getSession } from './session'
import type { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'

export type AuthenticatedSession = {
  user: {
    id: string
    email: string
    displayName: string
    role: string
  }
  expires: string
}

export type AuthResult = {
  session: AuthenticatedSession
  error: null
  status: number
} | {
  session: null
  error: string
  status: number
}

export async function requireAuth(request?: NextRequest): Promise<AuthResult> {
  const session = await getSession()

  if (!session?.user) {
    if (request) {
      return { session: null, error: 'Unauthorized', status: 401 }
    }

    redirect('/en/login')
  }

  return { session: session! as AuthenticatedSession, error: null, status: 200 }
}

export async function requireRole(request?: NextRequest, roles: string[] = []): Promise<AuthResult> {
  const auth = await requireAuth(request)

  if (auth.error) {
    return auth
  }

  const session = auth.session!
  if (!roles.includes(session.user.role)) {
    return { session: null, error: 'Forbidden', status: 403 }
  }

  return auth
}

export async function requireEditor(request?: NextRequest): Promise<AuthResult> {
  return requireRole(request, ['editor'])
}

export async function requireBusinessOwner(request?: NextRequest): Promise<AuthResult> {
  return requireRole(request, ['business_owner'])
}

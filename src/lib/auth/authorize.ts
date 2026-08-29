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

export const ROLES = {
  reader: 'reader',
  editor: 'editor',
  admin: 'admin',
  superadmin: 'superadmin',
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

const ROLE_HIERARCHY: Record<Role, number> = {
  [ROLES.reader]: 1,
  [ROLES.editor]: 2,
  [ROLES.admin]: 3,
  [ROLES.superadmin]: 4,
}

export function hasRole(userRole: string, allowedRoles: Role[]): boolean {
  const userLevel = ROLE_HIERARCHY[userRole as Role]
  if (userLevel === undefined) return false
  return allowedRoles.some(role => ROLE_HIERARCHY[role] <= userLevel)
}

export async function requireAuth(request?: NextRequest): Promise<AuthResult> {
  const session = await getSession(request)

  if (!session?.user) {
    if (request) {
      return { session: null, error: 'Unauthorized', status: 401 }
    }
    redirect('/en/login')
  }

  return { session: session as AuthenticatedSession, error: null, status: 200 }
}

export async function requireRole(request?: NextRequest, allowedRoles: Role[] = []): Promise<AuthResult> {
  const auth = await requireAuth(request)

  if (auth.error) {
    return auth
  }

  const session = auth.session!
  if (!hasRole(session.user.role, allowedRoles)) {
    return { session: null, error: 'Forbidden', status: 403 }
  }

  return auth
}

export async function requireEditor(request?: NextRequest): Promise<AuthResult> {
  return requireRole(request, [ROLES.editor, ROLES.admin, ROLES.superadmin])
}

export async function requireAdmin(request?: NextRequest): Promise<AuthResult> {
  return requireRole(request, [ROLES.admin, ROLES.superadmin])
}

export async function requireSuperadmin(request?: NextRequest): Promise<AuthResult> {
  return requireRole(request, [ROLES.superadmin])
}

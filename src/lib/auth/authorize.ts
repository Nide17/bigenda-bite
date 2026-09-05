import { getSession } from './session'

export type AuthenticatedSession = {
  user: {
    id: string
    email: string
    displayName: string
    role: string
    isForeigner: boolean
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

export async function requireAuth(): Promise<AuthResult> {
  const session = await getSession()

  if (!session?.user) {
    return { session: null, error: 'Unauthorized', status: 401 }
  }

  return { session: session as AuthenticatedSession, error: null, status: 200 }
}

export async function requireRole(allowedRoles: Role[] = []): Promise<AuthResult> {
  const auth = await requireAuth()

  if (auth.error) {
    return auth
  }

  const session = auth.session!
  if (!hasRole(session.user.role, allowedRoles)) {
    return { session: null, error: 'Forbidden', status: 403 }
  }

  return auth
}

export async function requireEditor(): Promise<AuthResult> {
  return requireRole([ROLES.editor, ROLES.admin, ROLES.superadmin])
}

export async function requireAdmin(): Promise<AuthResult> {
  return requireRole([ROLES.admin, ROLES.superadmin])
}

export async function requireSuperadmin(): Promise<AuthResult> {
  return requireRole([ROLES.superadmin])
}

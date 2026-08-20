import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import type { AppSession } from '@/app/api/auth/[...nextauth]/options'

const sessionOptions = {
  ...authOptions,
  adapter: undefined,
  providers: undefined,
}

export async function getSession(): Promise<AppSession | null> {
  const session = await getServerSession(sessionOptions)
  return session as AppSession | null
}

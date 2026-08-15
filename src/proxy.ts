import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

const createIntlMiddleware = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await getServerSession(authOptions as any)
  const user = (session as any)?.user

  if (pathname?.startsWith('/membership') && (!user || user.role !== 'business_owner')) {
    const locale = pathname.split('/')[1] || 'en'
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  if (pathname.includes('/contribute') && !user) {
    const locale = pathname.split('/')[1] || 'en'
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  return createIntlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|studio|.*\..*).*)'],
}

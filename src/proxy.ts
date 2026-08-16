import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

const createIntlMiddleware = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await getSession(request)
  const user = session?.user

  if (pathname?.startsWith('/membership') && (!user || user.role !== 'business_owner')) {
    const locale = pathname.split('/')[1] || 'en'
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  if (pathname.includes('/contribute') && !user) {
    const locale = pathname.split('/')[1] || 'en'
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  if (pathname?.startsWith('/admin') && (!user || user.role !== 'editor')) {
    return NextResponse.redirect(new URL('/en/login', request.url))
  }

  return createIntlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|studio|.*\..*).*)'],
}

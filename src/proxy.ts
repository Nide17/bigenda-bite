import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { isValidLocale, defaultLocale } from '@/i18n/routing'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await getSession(request)
  const user = session?.user

  const locale = pathname.split('/')[1]
  const validLocale = isValidLocale(locale) ? locale : defaultLocale

  if (pathname?.startsWith('/membership') && (!user || user.role !== 'business_owner')) {
    return NextResponse.redirect(new URL(`/${validLocale}/login`, request.url))
  }

  if (pathname.includes('/contribute') && !user) {
    return NextResponse.redirect(new URL(`/${validLocale}/login`, request.url))
  }

  if (pathname?.startsWith('/admin') && (!user || user.role !== 'editor')) {
    return NextResponse.redirect(new URL('/en/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|studio|.*\..*).*)'],
}

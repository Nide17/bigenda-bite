import { NextResponse } from 'next/server'

export function addSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  return response
}

export function sanitizedErrorResponse(error: unknown, fallback = 'An unexpected error occurred') {
  const message = error instanceof Error ? error.message : String(error)
  
  if (message.includes('MONGODB_URI') || message.includes('password') || message.includes('secret') || message.includes('token')) {
    return NextResponse.json({ error: fallback }, { status: 500 })
  }

  return NextResponse.json({ error: fallback }, { status: 500 })
}

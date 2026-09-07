const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export type RateLimitOptions = {
  maxRequests: number
  windowMs: number
  keyGenerator?: (request: Request) => string
}

export function checkRateLimit(request: Request, options: RateLimitOptions): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const key = options.keyGenerator ? options.keyGenerator(request) : getDefaultKey(request)

  const record = rateLimitMap.get(key)
  if (!record || now > record.resetAt) {
    const resetAt = now + options.windowMs
    rateLimitMap.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: options.maxRequests - 1, resetAt }
  }

  if (record.count >= options.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt }
  }

  record.count += 1
  return { allowed: true, remaining: options.maxRequests - record.count, resetAt: record.resetAt }
}

function getDefaultKey(request: Request): string {
  const url = new URL(request.url)
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  return `${ip}:${url.pathname}`
}

export function rateLimitResponse(resetAt: number) {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000)
  return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': retryAfter.toString(),
    },
  })
}

export function cleanupRateLimits() {
  const now = Date.now()
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(key)
    }
  }
}

setInterval(cleanupRateLimits, 60000)

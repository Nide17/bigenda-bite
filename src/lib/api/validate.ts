import { NextResponse, NextRequest } from 'next/server'

export type ApiError = {
  error: string
  status: number
}

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

export function fail(message: string, status = 400): ApiError {
  return { error: message, status }
}

export async function parseJson<T>(request: Request | NextRequest): Promise<{ ok: true; data: T } | { ok: false; response: ReturnType<typeof NextResponse.json> }> {
  try {
    const data = await request.json()
    return { ok: true, data: data as T }
  } catch {
    return { ok: false, response: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }) }
  }
}

export function requireFields(data: Record<string, unknown>, fields: string[]): ApiError | null {
  for (const field of fields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      return fail(`Missing required field: ${field}`)
    }
  }
  return null
}

export function methodNotAllowed(allowed: string[]) {
  return NextResponse.json({ error: `Method not allowed. Allowed: ${allowed.join(', ')}` }, { status: 405 })
}

const ALLOWED_URL_SCHEMES = ['http:', 'https:']

export function isValidUrl(value: unknown): boolean {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return ALLOWED_URL_SCHEMES.includes(url.protocol)
  } catch {
    return false
  }
}

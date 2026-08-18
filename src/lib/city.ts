import { cookies } from 'next/headers'

const CITY_COOKIE = 'bigenda-city'
const DEFAULT_CITY = 'Kigali'

export async function getCityFromQuery(request: Request): Promise<string | null> {
  const url = new URL(request.url)
  return url.searchParams.get('city')
}

export async function getCityFromCookie(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get(CITY_COOKIE)?.value || DEFAULT_CITY
}

export async function setCityCookie(city: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(CITY_COOKIE, city, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  })
}

export async function resolveCity(request: Request): Promise<string> {
  const queryCity = await getCityFromQuery(request)
  if (queryCity) {
    await setCityCookie(queryCity)
    return queryCity
  }
  return getCityFromCookie()
}


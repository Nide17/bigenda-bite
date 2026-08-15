import { notFound } from 'next/navigation'
import { routing } from './routing'

const locales = routing.locales

export async function getRequestConfig(request: Request) {
  const url = new URL(request.url)
  const locale = url.pathname.split('/')[1]

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound()
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
}

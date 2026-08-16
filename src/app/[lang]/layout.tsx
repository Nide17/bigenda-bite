import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { routing } from '@/i18n/routing'
import { Navigation } from '@/components/Navigation'
import { I18nProvider } from '@/components/I18nProvider'
import { trackEvent } from '@/lib/analytics'
import { getCityFromCookie } from '@/lib/city'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bigenda Bite - Rwanda Life Guide',
  description: 'Your everyday guide to life and administrative processes in Rwanda.',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!routing.locales.includes(lang as (typeof routing.locales)[number])) {
    notFound()
  }

  const messages = (await import(`@/i18n/messages/${lang}.json`)).default

  const headersList = await headers()
  const requestUrl = headersList.get('x-invoke-path') || `/${lang}`
  const pathname = new URL(requestUrl, 'http://localhost').pathname
  const city = await getCityFromCookie()

  trackEvent({
    type: 'page_view',
    metadata: { path: pathname, lang, city },
  }).catch(() => {})

  return (
    <I18nProvider messages={messages} locale={lang}>
      <Navigation lang={lang} messages={messages} />
      {children}
    </I18nProvider>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { routing } from '@/i18n/routing'
import Navigation from '@/components/Navigation'
import { I18nProvider } from '@/components/I18nProvider'
import { trackEvent } from '@/lib/analytics'
import { getCityFromCookie } from '@/lib/city'
import { JsonLd } from '@/components/JsonLd'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })
const baseUrl = 'https://bigendabite.com'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const headersList = await headers()
  const requestUrl = headersList.get('x-invoke-path') || `/${lang}`
  const pathname = new URL(requestUrl, 'http://localhost').pathname
  const url = `${baseUrl}${pathname}`

  return {
    title: 'Bigenda Bite - Rwanda Life Guide',
    description: 'Official processes, how-to guides, business directory, alerts, and membership — everything you need to navigate life in Rwanda.',
    openGraph: {
      title: 'Bigenda Bite - Rwanda Life Guide',
      description: 'Official processes, how-to guides, business directory, alerts, and membership — everything you need to navigate life in Rwanda.',
      type: 'website',
      url,
      siteName: 'Bigenda Bite',
      locale: lang === 'rw' ? 'rw_RW' : lang === 'fr' ? 'fr_FR' : 'en_US',
    },
    twitter: {
      card: 'summary',
      title: 'Bigenda Bite - Rwanda Life Guide',
      description: 'Official processes, how-to guides, business directory, alerts, and membership — everything you need to navigate life in Rwanda.',
    },
    alternates: {
      canonical: url,
    },
  }
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

  const orgLd = organizationJsonLd(baseUrl)
  const websiteLd = websiteJsonLd(baseUrl)

  return (
    <I18nProvider messages={messages} locale={lang}>
      <Navigation lang={lang} messages={messages} />
      <JsonLd data={orgLd} />
      <JsonLd data={websiteLd} />
      {children}
    </I18nProvider>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { routing } from '@/i18n/routing'
import Navigation from '@/components/Navigation'
import { I18nProvider } from '@/components/I18nProvider'
import { getSession } from '@/lib/auth/session'
import { trackEvent } from '@/lib/analytics'
import { JsonLd } from '@/components/JsonLd'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo'
import '../globals.css'
import messagesEn from '@/i18n/messages/en.json'
import messagesFr from '@/i18n/messages/fr.json'
import messagesRw from '@/i18n/messages/rw.json'

const messagesMap: Record<string, Record<string, string>> = { en: messagesEn, fr: messagesFr, rw: messagesRw }

const baseUrl = 'https://bigendabite.com'
const locales = routing.locales

function hreflangAlternates(pathname: string) {
  return {
    canonical: `${baseUrl}${pathname}`,
    languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}${pathname === '/en' ? '' : pathname.replace(/^\/(en|fr|rw)/, '')}`])),
  }
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const headersList = await headers()
  const requestUrl = headersList.get('x-invoke-path') || `/${lang}`
  const pathname = new URL(requestUrl, 'http://localhost').pathname.replace(/^\/(en|fr|rw)/, '') || '/'

  return {
    title: 'Bigenda Bite - Rwanda Life Guide',
    description: 'Official processes, trusted guides, verified businesses, and important alerts — all in one place.',
    openGraph: {
      title: 'Bigenda Bite - Rwanda Life Guide',
      description: 'Official processes, trusted guides, verified businesses, and important alerts — all in one place.',
      type: 'website',
      url: `${baseUrl}/${lang}${pathname}`,
      siteName: 'Bigenda Bite',
      locale: lang === 'rw' ? 'rw_RW' : lang === 'fr' ? 'fr_FR' : 'en_US',
    },
    twitter: {
      card: 'summary',
      title: 'Bigenda Bite - Rwanda Life Guide',
      description: 'Official processes, trusted guides, verified businesses, and important alerts — all in one place.',
    },
    alternates: hreflangAlternates(pathname === '/' ? '/en' : `/${lang}${pathname}`),
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

  const messages = messagesMap[lang as keyof typeof messagesMap] || messagesMap.en

  const headersList = await headers()
  const requestUrl = headersList.get('x-invoke-path') || `/${lang}`
  const pathname = new URL(requestUrl, 'http://localhost').pathname.replace(/^\/(en|fr|rw)/, '') || '/'

  let pageViewError: unknown = null
  try {
    trackEvent({
      type: 'page_view',
      metadata: { path: pathname, lang, city: '' },
    })
  } catch (error) {
    pageViewError = error
  } finally {
    if (pageViewError) {
      console.error('Analytics page_view failed:', pageViewError)
    }
  }

  const orgLd = organizationJsonLd(baseUrl)
  const websiteLd = websiteJsonLd(baseUrl)

  const session = await getSession()
  const user = session?.user || null

  return (
    <I18nProvider messages={messages} locale={lang}>
      <Navigation lang={lang} user={user} />
      <JsonLd data={orgLd} />
      <JsonLd data={websiteLd} />
      {children}
    </I18nProvider>
  )
}

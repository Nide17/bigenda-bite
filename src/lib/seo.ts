import type { Metadata } from 'next'

const baseUrl = 'https://bigendabite.com'
const allLocales = ['en', 'fr', 'rw'] as const

export type JsonLd = Record<string, unknown>

export function organizationJsonLd(baseUrl: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bigenda Bite',
    url: baseUrl,
    description: 'Your everyday guide to life and administrative processes in Rwanda.',
  }
}

export function websiteJsonLd(baseUrl: string, searchUrl?: string): JsonLd {
  const target = searchUrl || `${baseUrl}/search?q={search_term_string}`
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: baseUrl,
    name: 'Bigenda Bite',
    description: 'Your everyday guide to life and administrative processes in Rwanda.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: target,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbJsonLd(baseUrl: string, items: { name: string; url: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  }
}

export function howToJsonLd(baseUrl: string, data: {
  title: string
  summary?: string
  slug: string
  category?: string
  lang: string
  lastReviewedDate?: string | Date
  steps?: { text?: string; estimatedTime?: string }[]
}): JsonLd {
  const url = `${baseUrl}/${data.lang}/guides/${data.category || ''}/${data.slug}`
  const schema: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.title,
    description: data.summary || '',
    url,
    ...(data.lastReviewedDate ? { dateModified: new Date(data.lastReviewedDate).toISOString() } : {}),
    ...(data.steps && data.steps.length > 0 ? {
      step: data.steps.map((step) => ({
        '@type': 'HowToStep',
        text: step.text || '',
        ...(step.estimatedTime ? { estimatedTime: step.estimatedTime } : {}),
      })),
    } : {}),
  }
  return schema
}

export function localBusinessJsonLd(baseUrl: string, data: {
  name: string
  category?: string
  city?: string
  slug: string
  lang: string
  contact?: { phone?: string }
}): JsonLd {
  const url = `${baseUrl}/${data.lang}/directory/${data.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: data.name,
    category: data.category,
    address: data.city ? { '@type': 'PostalAddress', addressLocality: data.city } : undefined,
    url,
    ...(data.contact?.phone ? { telephone: data.contact.phone } : {}),
  }
}

export function hreflangAlternates(pathname: string) {
  const cleanPath = pathname.replace(/^\/(en|fr|rw)/, '') || '/'
  return {
    canonical: `${baseUrl}${cleanPath}`,
    languages: Object.fromEntries(allLocales.map((l) => [l, `${baseUrl}/${l}${cleanPath}`])),
  }
}

export function pageMetadata({
  title,
  description,
  pathname,
  locale,
  ogImage,
  keywords,
}: {
  title: string
  description: string
  pathname: string
  locale: string
  ogImage?: string
  keywords?: string[]
}): Metadata {
  const cleanPath = pathname.replace(/^\/(en|fr|rw)/, '') || '/'
  const url = `${baseUrl}/${locale}${cleanPath}`
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Bigenda Bite',
      locale: locale === 'rw' ? 'rw_RW' : locale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: url,
      languages: Object.fromEntries(allLocales.map((l) => [l, `${baseUrl}/${l}${cleanPath}`])),
    },
  }
}

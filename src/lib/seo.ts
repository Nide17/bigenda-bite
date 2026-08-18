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

export function processJsonLd(baseUrl: string, data: {
  title: string
  summary?: string
  slug: string
  category?: string
  lang: string
  lastVerifiedDate?: string | Date
}): JsonLd {
  const url = `${baseUrl}/${data.lang}/processes/${data.category || ''}/${data.slug}`
  const schema: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.title,
    description: data.summary || '',
    url,
  }
  if (data.lastVerifiedDate) {
    schema.dateModified = new Date(data.lastVerifiedDate).toISOString()
  }
  return schema
}

export function guideJsonLd(baseUrl: string, data: {
  title: string
  summary?: string
  slug: string
  category?: string
  lang: string
  lastReviewedDate?: string | Date
}): JsonLd {
  const url = `${baseUrl}/${data.lang}/guides/${data.category || ''}/${data.slug}`
  const schema: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.title,
    description: data.summary || '',
    url,
  }
  if (data.lastReviewedDate) {
    schema.dateModified = new Date(data.lastReviewedDate).toISOString()
  }
  return schema
}

export function businessJsonLd(baseUrl: string, data: {
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
    ...(data.contact?.phone && { telephone: data.contact.phone }),
  }
}


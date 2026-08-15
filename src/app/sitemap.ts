import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bigendabite.com'

  const urls: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    urls.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    })

    urls.push({
      url: `${baseUrl}/${locale}/processes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })

    urls.push({
      url: `${baseUrl}/${locale}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })

    urls.push({
      url: `${baseUrl}/${locale}/directory`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })

    urls.push({
      url: `${baseUrl}/${locale}/alerts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    })
  }

  return urls
}

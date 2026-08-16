import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getProcesses, getGuides } from '@/lib/cms/sanity'
import { connectToDatabase } from '@/lib/db/mongodb'
import { toSlug } from '@/lib/slug'

const baseUrl = 'https://bigendabite.com'
const locales = routing.locales

const staticRoutes = [
  { path: '/', priority: 1, changeFrequency: 'daily' as const },
  { path: '/processes', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/guides', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/directory', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/alerts', priority: 0.7, changeFrequency: 'daily' as const },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const route of staticRoutes) {
      const localizedPath = route.path === '/' ? `/${locale}` : `/${locale}${route.path}`
      urls.push({
        url: `${baseUrl}${localizedPath}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}${route.path === '/' ? `/${l}` : `/${l}${route.path}`}`])),
        },
      })
    }
  }

  try {
    const processes = await getProcesses('en')
    const guides = await getGuides('en')

    for (const process of processes) {
      const slug = toSlug(process.slug?.current || process.translations?.en?.title || process._id)
      const category = process.category || ''
      const lastModified = process._updatedAt ? new Date(process._updatedAt) : new Date()
      for (const locale of locales) {
        urls.push({
          url: `${baseUrl}/${locale}/processes/${category}/${slug}`,
          lastModified,
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: {
            languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/processes/${category}/${slug}`])),
          },
        })
      }
    }

    for (const guide of guides) {
      const slug = toSlug(guide.slug?.current || guide.translations?.en?.title || guide._id)
      const category = guide.category || ''
      const lastModified = guide._updatedAt ? new Date(guide._updatedAt) : new Date()
      for (const locale of locales) {
        urls.push({
          url: `${baseUrl}/${locale}/guides/${category}/${slug}`,
          lastModified,
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: {
            languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/guides/${category}/${slug}`])),
          },
        })
      }
    }
  } catch (error) {
    console.error('Failed to fetch Sanity sitemap entries:', error)
  }

  try {
    const db = await connectToDatabase()
    const businesses = await db.collection('businesses').find({}).sort({ name: 1 }).limit(500).toArray()

    for (const business of businesses) {
      const slug = business.slug
      if (!slug) continue
      for (const locale of locales) {
        urls.push({
          url: `${baseUrl}/${locale}/directory/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
          alternates: {
            languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/directory/${slug}`])),
          },
        })
      }
    }
  } catch (error) {
    console.error('Failed to fetch business sitemap entries:', error)
  }

  return urls
}

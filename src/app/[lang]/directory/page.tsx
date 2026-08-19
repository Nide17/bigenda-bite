import { connectToDatabase } from '@/lib/db/mongodb'
import Link from 'next/link'
import PageContainer from '@/components/PageContainer'
import EmptyState from '@/components/ui/EmptyState'
import messagesEn from '@/i18n/messages/en.json'
import messagesFr from '@/i18n/messages/fr.json'
import messagesRw from '@/i18n/messages/rw.json'
import type { Metadata } from 'next'
import type { Business } from '@/types'
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/JsonLd'

const messagesMap: Record<string, Record<string, string>> = { en: messagesEn, fr: messagesFr, rw: messagesRw }

const baseUrl = 'https://bigendabite.com'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return pageMetadata({
    title: 'Business Directory | Bigenda Bite',
    description: 'Discover businesses and services across Rwanda. Find trusted local vendors, restaurants, clinics, and more.',
    pathname: '/directory',
    locale: lang,
    keywords: ['Rwanda business directory', 'local businesses', 'services', 'Kigali', 'vendors'],
  })
}

export default async function DirectoryPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ city?: string }> }) {
  const { lang } = await params
  const { city } = await searchParams
  const db = await connectToDatabase()

  const query: Record<string, unknown> = {}
  if (city && city !== 'all') {
    query.city = city
  }

  const businesses = await db.collection('businesses').find(query).sort({ name: 1 }).limit(50).toArray() as unknown as Business[]
  const messages = messagesMap[lang as keyof typeof messagesMap] || messagesMap.en
  const t = (key: string) => messages[key] || key

  const breadcrumbLd = breadcrumbJsonLd(baseUrl, [
    { name: t('directory'), url: `/${lang}/directory` },
  ])

  return (
    <PageContainer>
      <JsonLd data={breadcrumbLd} />
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">{t('directory')}</h1>
        <p className="text-neutral-600">Discover businesses and services across Rwanda.</p>
      </div>

      <form method="get" className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <select name="city" defaultValue={city || 'all'} className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm font-medium text-neutral-900 shadow-sm hover:border-primary hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150">
            <option value="all">All Cities</option>
            <option value="Kigali">Kigali</option>
            <option value="Musanze">Musanze</option>
            <option value="Rubavu">Rubavu</option>
            <option value="Huye">Huye</option>
            <option value="Mombasa">Mombasa</option>
          </select>
          <button type="submit" className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-colors">
            Filter
          </button>
        </div>
      </form>

      {businesses.length === 0 ? (
        <EmptyState
          icon="🏢"
          title="No businesses found"
          description="Try adjusting your filters or check back later."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {businesses.map((business) => (
            <Link
              key={business._id.toString()}
              href={`/${lang}/directory/${business.slug || business._id.toString()}`}
              className="group block bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200"
            >
              <h2 className="text-lg font-semibold text-primary group-hover:text-primary-hover transition-colors mb-2">
                {business.name}
              </h2>
              <p className="text-sm text-neutral-600 mb-1">
                {business.category}
              </p>
              <p className="text-sm text-neutral-500">
                {business.city || 'Nationwide'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
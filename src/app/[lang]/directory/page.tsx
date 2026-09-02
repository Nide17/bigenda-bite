import { connectToDatabase } from '@/lib/db/mongodb'
import Link from 'next/link'
import PageContainer from '@/components/PageContainer'
import EmptyState from '@/components/ui/EmptyState'
import Badge from '@/components/ui/Badge'
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

interface FilterState {
  city: string
  englishSpeaking: boolean
  acceptsMomo: boolean
  bigendaVerified: boolean
}

export default async function DirectoryPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ city?: string; englishSpeaking?: string; acceptsMomo?: string; bigendaVerified?: string }> }) {
  const { lang } = await params
  const sp = await searchParams

  const filters: FilterState = {
    city: sp.city || 'all',
    englishSpeaking: sp.englishSpeaking === '1',
    acceptsMomo: sp.acceptsMomo === '1',
    bigendaVerified: sp.bigendaVerified === '1',
  }

  const db = await connectToDatabase()

  const query: Record<string, unknown> = {}
  if (filters.city && filters.city !== 'all') {
    query.city = filters.city
  }
  if (filters.englishSpeaking) {
    query.englishSpeaking = true
  }
  if (filters.acceptsMomo) {
    query.acceptsMomo = true
  }
  if (filters.bigendaVerified) {
    query.bigendaVerified = true
  }

  const businesses = await db.collection('businesses').find(query).sort({ name: 1 }).limit(50).toArray() as unknown as Business[]
  const messages = messagesMap[lang as keyof typeof messagesMap] || messagesMap.en
  const t = (key: string) => messages[key] || key

  const breadcrumbLd = breadcrumbJsonLd(baseUrl, [
    { name: t('directory'), url: `/${lang}/directory` },
  ])

  const activeFilterCount = [
    filters.englishSpeaking,
    filters.acceptsMomo,
    filters.bigendaVerified,
    filters.city !== 'all',
  ].filter(Boolean).length

  return (
    <PageContainer>
      <JsonLd data={breadcrumbLd} />
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">{t('directory')}</h1>
        <p className="text-neutral-600">Discover businesses and services across Rwanda.</p>
      </div>

      <form method="get" className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <select name="city" defaultValue={filters.city} className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm font-medium text-neutral-900 shadow-sm hover:border-primary hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150">
            <option value="all">All Cities</option>
            <option value="Kigali">Kigali</option>
            <option value="Musanze">Musanze</option>
            <option value="Rubavu">Rubavu</option>
            <option value="Huye">Huye</option>
          </select>
          <button type="submit" className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-colors">
            Apply Filters
          </button>
          {activeFilterCount > 0 && (
            <Link
              href={`/${lang}/directory`}
              className="px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-lg transition-colors"
            >
              Clear ({activeFilterCount})
            </Link>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <label className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-colors ${filters.englishSpeaking ? 'bg-primary/10 border-primary text-primary' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'}`}>
            <input
              type="checkbox"
              name="englishSpeaking"
              value="1"
              defaultChecked={filters.englishSpeaking}
              className="rounded border-neutral-300 text-primary focus:ring-primary"
              aria-label="English-Speaking Staff"
            />
            <span className="text-sm font-medium">🗣️ English-Speaking Staff</span>
          </label>

          <label className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-colors ${filters.acceptsMomo ? 'bg-primary/10 border-primary text-primary' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'}`}>
            <input
              type="checkbox"
              name="acceptsMomo"
              value="1"
              defaultChecked={filters.acceptsMomo}
              className="rounded border-neutral-300 text-primary focus:ring-primary"
              aria-label="Accepts MTN/Airtel MoMo"
            />
            <span className="text-sm font-medium">📱 Accepts MTN/Airtel MoMo</span>
          </label>

          <label className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-colors ${filters.bigendaVerified ? 'bg-primary/10 border-primary text-primary' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'}`}>
            <input
              type="checkbox"
              name="bigendaVerified"
              value="1"
              defaultChecked={filters.bigendaVerified}
              className="rounded border-neutral-300 text-primary focus:ring-primary"
              aria-label="Bigenda Bite Verified"
            />
            <span className="text-sm font-medium">✅ Bigenda Bite Verified</span>
          </label>
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
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="text-lg font-semibold text-primary group-hover:text-primary-hover transition-colors">
                  {business.name}
                </h2>
                {business.bigendaVerified && (
                  <Badge variant="success" className="text-xs">
                    ✅ Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-neutral-600 mb-1">
                {business.category}
              </p>
              <p className="text-sm text-neutral-500">
                {business.city || 'Nationwide'}
              </p>
              {(business.englishSpeaking || business.acceptsMomo) && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {business.englishSpeaking && (
                    <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">🗣️ English</span>
                  )}
                  {business.acceptsMomo && (
                    <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">📱 MoMo</span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  )
}

import { getProcesses, getGuides, getAlerts } from '@/lib/cms/sanity'
import { connectToDatabase } from '@/lib/db/mongodb'
import { getCityFromCookie } from '@/lib/city'
import AdBanner from '@/components/AdBanner'
import CitySelector from '@/components/CitySelector'
import Search from '@/components/Search'
import Link from 'next/link'
import PageContainer from '@/components/PageContainer'
import messagesEn from '@/i18n/messages/en.json'
import messagesFr from '@/i18n/messages/fr.json'
import messagesRw from '@/i18n/messages/rw.json'
import type { Metadata } from 'next'
import type { Process, Guide, Alert } from '@/types'
import type { Business } from '@/types'
import { pageMetadata } from '@/lib/seo'

const messagesMap: Record<string, Record<string, string>> = { en: messagesEn, fr: messagesFr, rw: messagesRw }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return pageMetadata({
    title: 'Find your way in Rwanda | Bigenda Bite',
    description: 'Official processes, trusted guides, verified businesses, and important alerts — all in one place.',
    pathname: '/',
    locale: lang,
    keywords: ['Rwanda', 'government processes', 'how-to guides', 'business directory', 'alerts'],
  })
}

export default async function HomePage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ city?: string }> }) {
  const { lang } = await params
  const { city } = await searchParams
  const cityName = city || await getCityFromCookie()

  let processes: Process[] = []
  let guides: Guide[] = []
  let alerts: Alert[] = []
  let businesses: Business[] = []

  try {
    const [processesResult, guidesResult, alertsResult] = await Promise.all([
      getProcesses(lang),
      getGuides(lang),
      getAlerts(),
    ])
    processes = processesResult
    guides = guidesResult
    alerts = alertsResult

    const db = await connectToDatabase()
    businesses = (await db.collection('businesses')
      .find({ city: cityName, status: 'approved' })
      .sort({ name: 1 })
      .limit(6)
      .toArray()) as unknown as Business[]
  } catch (error) {
    console.error('Home page data fetch error:', error)
  }

  const messages = messagesMap[lang as keyof typeof messagesMap] || messagesMap.en
  const t = (key: string) => messages[key] || key

  const categories = Array.from(new Set([
    ...processes.map(p => p.category).filter((c): c is string => Boolean(c)),
    ...guides.map(g => g.category).filter((c): c is string => Boolean(c)),
  ]))

  return (
    <div className="min-h-screen">
      <header>
        <section className="bg-[#1e1b4b] text-white py-12 md:py-16">
          <PageContainer maxWidth="xl">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                {t('hero_task_title')}
              </h1>
              <p className="text-base md:text-lg text-white/80 leading-relaxed mb-8">
                {t('hero_task_subtitle')}
              </p>
              <div className="mb-6">
                <Search lang={lang} placeholder={t('search_placeholder')} />
              </div>
              <div className="flex items-center justify-center gap-2 text-white/90">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-sm">{t('all_cities')}:</span>
                <CitySelector cityName={cityName} />
              </div>
              <div className="flex items-center justify-center gap-3 mt-6">
                <Link
                  href={`/${lang}/processes`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  {t('browse_processes')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href={`/${lang}/guides`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all border border-white/20"
                >
                  {t('read_guides')}
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>
      </header>

      <main>
        <PageContainer maxWidth="xl">
          {processes.length > 0 && (
            <section className="py-10 md:py-14" aria-labelledby="popular-tasks-heading">
              <div className="max-w-2xl mb-6">
                <h2 id="popular-tasks-heading" className="text-xl md:text-2xl font-bold text-primary mb-2">
                  {t('popular_tasks_title')}
                </h2>
                <p className="text-neutral-600">
                  {t('popular_tasks_subtitle')}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {processes.slice(0, 6).map((process: Process) => (
                  <Link
                    key={process._id}
                    href={`/${lang}/processes/${process.category}/${process.slug?.current || process._id}`}
                    className="group block bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
                  >
                    <h3 className="font-semibold text-primary group-hover:text-primary-hover transition-colors mb-1">
                      {process.translations?.[lang]?.title || process.translations?.en?.title}
                    </h3>
                    {(process.translations?.[lang]?.summary || process.translations?.en?.summary) && (
                      <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">
                        {process.translations?.[lang]?.summary || process.translations?.en?.summary}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {alerts.length > 0 && (
            <section className="py-6" aria-labelledby="alerts-heading">
              <h2 id="alerts-heading" className="text-xl md:text-2xl font-bold text-primary mb-4">
                {t('important_alerts_title')}
              </h2>
              <div className="space-y-3">
                {alerts.slice(0, 3).map((alert: Alert) => (
                  <div key={alert._id} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-amber-900">
                          {typeof alert.translations?.en === 'string' ? alert.translations.en : (alert.translations?.[lang] || alert.translations?.en || '')}
                        </p>
                        {alert.expiresAt && (
                          <p className="text-xs text-amber-700 mt-1">
                            Expires: {new Date(alert.expiresAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {categories.length > 0 && (
            <section className="py-10 md:py-14" aria-labelledby="categories-heading">
              <div className="max-w-2xl mb-6">
                <h2 id="categories-heading" className="text-xl md:text-2xl font-bold text-primary mb-2">
                  {t('browse_by_category_title')}
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/${lang}/processes?category=${encodeURIComponent(category)}`}
                    className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:border-primary hover:text-primary transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {guides.length > 0 && (
            <section className="py-10 md:py-14" aria-labelledby="latest-guides-heading">
              <div className="flex items-center justify-between mb-6">
                <h2 id="latest-guides-heading" className="text-xl md:text-2xl font-bold text-primary">
                  {t('latest_guides')}
                </h2>
                <Link
                  href={`/${lang}/guides`}
                  className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  {t('view_all')}
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {guides.slice(0, 6).map((guide: Guide) => (
                  <Link
                    key={guide._id}
                    href={`/${lang}/guides/${guide.category}/${guide.slug?.current || guide._id}`}
                    className="group block bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
                  >
                    <h3 className="font-semibold text-primary group-hover:text-primary-hover transition-colors mb-1">
                      {guide.translations?.[lang]?.title || guide.translations?.en?.title}
                    </h3>
                    {(guide.translations?.[lang]?.summary || guide.translations?.en?.summary) && (
                      <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">
                        {guide.translations?.[lang]?.summary || guide.translations?.en?.summary}
                      </p>
                    )}
                    {guide.category && (
                      <span className="inline-block mt-3 px-2.5 py-1 bg-accent-light text-amber-700 text-xs font-medium rounded-full">
                        {guide.category}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {businesses.length > 0 && (
            <section className="py-10 md:py-14" aria-labelledby="businesses-heading">
              <div className="flex items-center justify-between mb-6">
                <h2 id="businesses-heading" className="text-xl md:text-2xl font-bold text-primary">
                  {t('businesses_near_you_title')}
                </h2>
                <Link
                  href={`/${lang}/directory`}
                  className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  {t('view_all')}
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {businesses.map((business: Business) => (
                  <Link
                    key={business._id.toString()}
                    href={`/${lang}/directory/${business.slug || business._id.toString()}`}
                    className="group block bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
                  >
                    <h3 className="font-semibold text-primary group-hover:text-primary-hover transition-colors mb-1">
                      {business.name}
                    </h3>
                    <p className="text-sm text-neutral-600">{business.category}</p>
                    <p className="text-sm text-neutral-500">{business.city || cityName}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {processes.length > 0 && (
            <section className="pb-10 md:pb-14" aria-labelledby="updates-heading">
              <div className="flex items-center justify-between mb-6">
                <h2 id="updates-heading" className="text-xl md:text-2xl font-bold text-primary">
                  {t('latest_updates_title')}
                </h2>
                <Link
                  href={`/${lang}/processes`}
                  className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  {t('view_all')}
                </Link>
              </div>
              <ul className="space-y-3">
                {processes.slice(0, 5).map((process: Process) => (
                  <li key={process._id}>
                    <Link
                      href={`/${lang}/processes/${process.category}/${process.slug?.current || process._id}`}
                      className="group block bg-white border border-neutral-200 rounded-lg p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
                    >
                      <h3 className="font-semibold text-primary group-hover:text-primary-hover transition-colors mb-1">
                        {process.translations?.[lang]?.title || process.translations?.en?.title}
                      </h3>
                      {(process.translations?.[lang]?.summary || process.translations?.en?.summary) && (
                        <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">
                          {process.translations?.[lang]?.summary || process.translations?.en?.summary}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="pb-10 md:pb-14">
            <AdBanner placement="top" city={cityName} />
          </section>
        </PageContainer>
      </main>
    </div>
  )
}

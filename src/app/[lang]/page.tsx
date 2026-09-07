import { getProcesses, getGuides, getAlerts } from '@/lib/cms/sanity'
import { connectToDatabase } from '@/lib/db/mongodb'
import { getCityFromCookie } from '@/lib/city'
import AlertsSection from '@/components/AlertsSection'
import Search from '@/components/Search'
import Link from 'next/link'
import PageContainer from '@/components/PageContainer'
import EmptyState from '@/components/ui/EmptyState'
import { getMessages } from '@/lib/i18n'
import type { Metadata } from 'next'
import type { Process, Guide, Alert } from '@/types'
import type { Business } from '@/types'
import { pageMetadata } from '@/lib/seo'

export const revalidate = 120

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
  const t = getMessages(lang)

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

  if (process.env.NODE_ENV === 'production') {
    console.log('Home page data counts:', {
      processes: processes.length,
      guides: guides.length,
      alerts: alerts.length,
      businesses: businesses.length,
      city: cityName,
    })
  }

  const categories = Array.from(new Set([
    ...processes.map(p => p.category).filter((c): c is string => Boolean(c)),
    ...guides.map(g => g.category).filter((c): c is string => Boolean(c)),
  ]))

  return (
    <div className="min-h-screen">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-primary focus:rounded-lg focus:shadow-lg">
        Skip to main content
      </a>

      <header>
        <section className="bg-[#1e1b4b] text-white py-12 md:py-20 lg:py-24">
          <PageContainer maxWidth="xl">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 tracking-tight">
                {t('hero_task_title')}
              </h1>
              <p className="text-base md:text-lg text-white/80 leading-relaxed mb-8 md:mb-10">
                {t('hero_task_subtitle')}
              </p>

              <div className="mb-6 md:mb-8">
                <div className="bg-white rounded-2xl p-2 shadow-2xl shadow-black/20">
                  <Search
                    lang={lang}
                    placeholder={t('search_placeholder')}
                    placeholders={[
                      t('search_placeholder_1'),
                      t('search_placeholder_2'),
                      t('search_placeholder_3'),
                      t('search_placeholder_4'),
                    ]}
                    scenarios={[
                      { label: t('search_scenario_1'), query: t('search_scenario_1_query') },
                      { label: t('search_scenario_2'), query: t('search_scenario_2_query') },
                      { label: t('search_scenario_3'), query: t('search_scenario_3_query') },
                      { label: t('search_scenario_4'), query: t('search_scenario_4_query') },
                    ]}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={`/${lang}/processes`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl min-h-[44px]"
                >
                  {t('browse_processes')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href={`/${lang}/guides`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20 min-h-[44px]"
                >
                  {t('read_guides')}
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>
      </header>

      <main id="main-content">
        <PageContainer maxWidth="xl">
          {processes.length > 0 ? (
            <section className="py-10 md:py-14" aria-labelledby="popular-tasks-heading">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 id="popular-tasks-heading" className="text-xl md:text-2xl font-bold text-primary mb-1">
                    {t('popular_tasks_title')}
                  </h2>
                  <p className="text-neutral-600 text-sm md:text-base">
                    {t('popular_tasks_subtitle')}
                  </p>
                </div>
                <Link
                  href={`/${lang}/processes`}
                  className="text-sm font-medium text-primary hover:text-primary-hover transition-colors hidden sm:inline-flex items-center gap-1 min-h-[44px]"
                >
                  {t('view_all')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {processes.slice(0, 6).map((process: Process) => (
                  <Link
                    key={process._id}
                    href={`/${lang}/processes/${process.category}/${process.slug?.current || process._id}`}
                    className="group block bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <h3 className="font-semibold text-primary group-hover:text-primary-hover transition-colors mb-1.5 text-base">
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
              <div className="mt-6 sm:hidden">
                <Link
                  href={`/${lang}/processes`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  {t('view_all')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </section>
          ) : (
            <section className="py-10 md:py-14" aria-labelledby="popular-tasks-heading">
              <h2 id="popular-tasks-heading" className="text-xl md:text-2xl font-bold text-primary mb-6">
                {t('popular_tasks_title')}
              </h2>
              <EmptyState
                icon="📋"
                title={t('no_processes_found')}
                description={t('check_back_processes')}
              />
            </section>
          )}

          {alerts.length > 0 ? (
            <section className="py-10 md:py-14" aria-labelledby="alerts-heading">
              <AlertsSection
                alerts={alerts.slice(0, 3)}
                lang={lang}
                variant="compact"
                t={t}
              />
            </section>
          ) : (
            <section className="py-10 md:py-14" aria-labelledby="alerts-heading">
              <h2 id="alerts-heading" className="text-xl md:text-2xl font-bold text-primary mb-4">
                {t('important_alerts_title')}
              </h2>
              <div className="bg-white border border-neutral-200 rounded-xl p-6 text-center">
                <p className="text-sm text-neutral-600">{t('alerts_all_clear')}</p>
              </div>
            </section>
          )}

          {guides.length > 0 ? (
            <section className="py-10 md:py-14" aria-labelledby="latest-guides-heading">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 id="latest-guides-heading" className="text-xl md:text-2xl font-bold text-primary mb-1">
                    {t('latest_guides')}
                  </h2>
                  <p className="text-neutral-600 text-sm md:text-base">
                    {t('guides_page_subtitle')}
                  </p>
                </div>
                <Link
                  href={`/${lang}/guides`}
                  className="text-sm font-medium text-primary hover:text-primary-hover transition-colors hidden sm:inline-flex items-center gap-1 min-h-[44px]"
                >
                  {t('view_all')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {guides.slice(0, 6).map((guide: Guide) => (
                  <Link
                    key={guide._id}
                    href={`/${lang}/guides/${guide.category}/${guide.slug?.current || guide._id}`}
                    className="group block bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <h3 className="font-semibold text-primary group-hover:text-primary-hover transition-colors mb-1.5 text-base">
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
              <div className="mt-6 sm:hidden">
                <Link
                  href={`/${lang}/guides`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  {t('view_all')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </section>
          ) : (
            <section className="py-10 md:py-14" aria-labelledby="latest-guides-heading">
              <h2 id="latest-guides-heading" className="text-xl md:text-2xl font-bold text-primary mb-6">
                {t('latest_guides')}
              </h2>
              <EmptyState
                icon="📚"
                title={t('no_guides_found')}
                description={t('check_back_later')}
              />
            </section>
          )}

          {businesses.length > 0 ? (
            <section className="py-10 md:py-14" aria-labelledby="businesses-heading">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 id="businesses-heading" className="text-xl md:text-2xl font-bold text-primary mb-1">
                    {t('businesses_near_you_title')}
                  </h2>
                  <p className="text-neutral-600 text-sm md:text-base">
                    {t('directory_subtitle')}
                  </p>
                </div>
                <Link
                  href={`/${lang}/directory`}
                  className="text-sm font-medium text-primary hover:text-primary-hover transition-colors hidden sm:inline-flex items-center gap-1 min-h-[44px]"
                >
                  {t('view_all')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {businesses.map((business: Business) => (
                  <Link
                    key={business._id.toString()}
                    href={`/${lang}/directory/${business.slug || business._id.toString()}`}
                    className="group block bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <h3 className="font-semibold text-primary group-hover:text-primary-hover transition-colors mb-1.5 text-base">
                      {business.name}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-1">{business.category}</p>
                    <p className="text-sm text-neutral-500">{business.city || cityName}</p>
                  </Link>
                ))}
              </div>
              <div className="mt-6 sm:hidden">
                <Link
                  href={`/${lang}/directory`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  {t('view_all')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </section>
          ) : (
            <section className="py-10 md:py-14" aria-labelledby="businesses-heading">
              <h2 id="businesses-heading" className="text-xl md:text-2xl font-bold text-primary mb-6">
                {t('businesses_near_you_title')}
              </h2>
              <EmptyState
                icon="🏢"
                title={t('no_businesses_found')}
                description={t('try_adjusting_filters')}
                action={
                  <Link
                    href={`/${lang}/directory`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-colors min-h-[44px]"
                  >
                    {t('directory')}
                  </Link>
                }
              />
            </section>
          )}

          {categories.length > 0 && (
            <section className="py-10 md:py-14" aria-labelledby="categories-heading">
              <div className="max-w-2xl mb-5">
                <h2 id="categories-heading" className="text-lg md:text-xl font-bold text-primary mb-1.5">
                  {t('browse_by_category_title')}
                </h2>
                <p className="text-sm text-neutral-600">
                  {t('home_browse_categories_subtitle')}
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/${lang}/processes?category=${encodeURIComponent(category)}`}
                    className="px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700 hover:border-primary hover:text-primary transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[44px] inline-flex items-center"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="pb-10 md:pb-14">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-semibold text-primary mb-1">{t('home_organizations_title')}</h3>
                  <p className="text-sm text-neutral-600">{t('home_organizations_subtitle')}</p>
                </div>
                <Link
                  href="/membership"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-colors shadow-md min-h-[44px] w-full md:w-auto"
                >
                  {t('home_become_member')}
                </Link>
              </div>
            </div>
          </section>
        </PageContainer>
      </main>
    </div>
  )
}

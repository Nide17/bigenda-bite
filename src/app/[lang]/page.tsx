import { getProcesses, getGuides } from '@/lib/cms/sanity'
import { resolveCity } from '@/lib/city'
import AdBanner from '@/components/AdBanner'
import CitySelector from '@/components/CitySelector'
import Search from '@/components/Search'
import Link from 'next/link'
import PageContainer from '@/components/PageContainer'
import messagesEn from '@/i18n/messages/en.json'
import messagesFr from '@/i18n/messages/fr.json'
import messagesRw from '@/i18n/messages/rw.json'
import type { Metadata } from 'next'
import type { Process, Guide } from '@/types'
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

const LANG_OPTIONS = [
  { code: 'en', labelKey: 'lang_en' },
  { code: 'fr', labelKey: 'lang_fr' },
  { code: 'rw', labelKey: 'lang_rw' },
] as const

function LangSwitcher({ currentLang }: { currentLang: string }) {
  return (
    <div className="inline-flex items-center gap-1 bg-white/10 rounded-lg p-1" role="group" aria-label="Language">
      {LANG_OPTIONS.map((lang) => {
        const isActive = currentLang === lang.code
        return (
          <Link
            key={lang.code}
            href={`/${lang.code}`}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              isActive
                ? 'bg-white text-[#1e1b4b] shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
            aria-current={isActive ? 'true' : undefined}
          >
            {lang.code.toUpperCase()}
          </Link>
        )
      })}
    </div>
  )
}

function PopularActionLink({ title, href, currentLang }: { title: string; href: string; currentLang: string }) {
  return (
    <li>
      <Link
        href={`/${currentLang}${href}`}
        className="group flex items-baseline gap-2 py-2 border-b border-neutral-100 last:border-b-0 hover:border-neutral-200 transition-colors"
      >
        <span className="text-accent group-hover:text-accent-hover transition-colors" aria-hidden="true">
          →
        </span>
        <span className="text-neutral-900 group-hover:text-primary transition-colors font-medium">
          {title}
        </span>
      </Link>
    </li>
  )
}

export default async function HomePage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ city?: string }> }) {
  const { lang } = await params
  const { city } = await searchParams
  const cityName = city || await resolveCity(new Request('http://localhost:3000'))
  const [processes, guides] = await Promise.all([
    getProcesses(lang),
    getGuides(lang),
  ])
  const messages = messagesMap[lang as keyof typeof messagesMap] || messagesMap.en
  const t = (key: string) => messages[key] || key

  return (
    <div className="min-h-screen">
      <header>
        <section className="bg-[#1e1b4b] text-white py-10 md:py-14">
          <PageContainer maxWidth="xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-2xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                  {t('hero_title')}
                </h1>
                <p className="text-base md:text-lg text-white/80 leading-relaxed mb-5">
                  {t('hero_subtitle')}
                </p>
                <div className="mb-6">
                  <Search lang={lang} placeholder={t('search_placeholder')} />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
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
              <div className="flex flex-col items-start md:items-end gap-4">
                <LangSwitcher currentLang={lang} />
                <div className="flex items-center gap-2 text-white/90">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium text-sm">{t('all_cities')}:</span>
                  <CitySelector cityName={cityName} />
                </div>
              </div>
            </div>
          </PageContainer>
        </section>
      </header>

      <main>
        <PageContainer maxWidth="xl">
          <section className="py-10 md:py-14" aria-labelledby="popular-heading">
            <div className="max-w-2xl mb-6">
              <h2 id="popular-heading" className="text-xl md:text-2xl font-bold text-primary mb-2">
                {t('popular_things_title')}
              </h2>
              <p className="text-neutral-600">
                {t('popular_things_subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                  {t('processes')}
                </h3>
                <ul className="divide-y divide-neutral-100">
                  {processes.slice(0, 4).map((process: Process) => (
                    <PopularActionLink
                      key={process._id}
                      title={process.translations?.[lang]?.title || process.translations?.en?.title || ''}
                      href={`/processes/${process.category}/${process.slug?.current || process._id}`}
                      currentLang={lang}
                    />
                  ))}
                </ul>
                {processes.length > 4 && (
                  <Link
                    href={`/${lang}/processes`}
                    className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                  >
                    {t('view_all')}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                  {t('guides')}
                </h3>
                <ul className="divide-y divide-neutral-100">
                  {guides.slice(0, 4).map((guide: Guide) => (
                    <PopularActionLink
                      key={guide._id}
                      title={guide.translations?.[lang]?.title || guide.translations?.en?.title || ''}
                      href={`/guides/${guide.category}/${guide.slug?.current || guide._id}`}
                      currentLang={lang}
                    />
                  ))}
                </ul>
                {guides.length > 4 && (
                  <Link
                    href={`/${lang}/guides`}
                    className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                  >
                    {t('view_all')}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </section>

          <section className="pb-10 md:pb-14" aria-labelledby="latest-heading">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-10">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 id="latest-heading" className="text-xl md:text-2xl font-bold text-primary">
                      {t('latest_processes')}
                    </h2>
                    <Link
                      href={`/${lang}/processes`}
                      className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                    >
                      {t('view_all')}
                    </Link>
                  </div>
                  {processes.length === 0 ? (
                    <p className="text-neutral-600">{t('no_processes_found')}</p>
                  ) : (
                    <ul className="space-y-3">
                      {processes.slice(0, 5).map((process: Process) => (
                        <li key={process._id}>
                          <Link
                            href={`/${lang}/processes/${process.category}/${process.slug?.current || process.translations?.en?.title || process._id}`}
                            className="group block bg-white border border-neutral-200 rounded-lg p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
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
                  )}
                </div>

                <div>
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
                  {guides.length === 0 ? (
                    <p className="text-neutral-600">{t('no_guides_found')}</p>
                  ) : (
                    <ul className="space-y-3">
                      {guides.slice(0, 5).map((guide: Guide) => (
                        <li key={guide._id}>
                          <Link
                            href={`/${lang}/guides/${guide.category}/${guide.slug?.current || guide.translations?.en?.title || guide._id}`}
                            className="group block bg-white border border-neutral-200 rounded-lg p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
                          >
                            <h3 className="font-semibold text-primary group-hover:text-primary-hover transition-colors mb-1">
                              {guide.translations?.[lang]?.title || guide.translations?.en?.title}
                            </h3>
                            {(guide.translations?.[lang]?.summary || guide.translations?.en?.summary) && (
                              <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">
                                {guide.translations?.[lang]?.summary || guide.translations?.en?.summary}
                              </p>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <AdBanner placement="sidebar" city={cityName} />
                </div>
              </aside>
            </div>
          </section>
        </PageContainer>
      </main>
    </div>
  )
}

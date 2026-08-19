import { getProcesses } from '@/lib/cms/sanity'
import { getGuides } from '@/lib/cms/sanity'
import { resolveCity } from '@/lib/city'
import AdBanner from '@/components/AdBanner'
import CitySelector from '@/components/CitySelector'
import Link from 'next/link'
import PageContainer from '@/components/PageContainer'
import messagesEn from '@/i18n/messages/en.json'
import messagesFr from '@/i18n/messages/fr.json'
import messagesRw from '@/i18n/messages/rw.json'

const messagesMap: Record<string, { common: Record<string, string> }> = { en: { common: messagesEn }, fr: { common: messagesFr }, rw: { common: messagesRw } }

export const dynamic = 'force-dynamic'

export default async function HomePage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ city?: string }> }) {
  const { lang } = await params
  const { city } = await searchParams
  const cityName = city || await resolveCity(new Request('http://localhost:3000'))
  const [processes, guides] = await Promise.all([
    getProcesses(lang),
    getGuides(lang),
  ])
  const messages = messagesMap[lang as keyof typeof messagesMap] || messagesMap.en
  const t = (key: string) => messages.common?.[key] || key

  const quickLinks = [
    { href: `/${lang}/processes`, label: t('processes'), icon: '📋', description: 'Official government processes and procedures' },
    { href: `/${lang}/guides`, label: t('guides'), icon: '📖', description: 'How-to guides for everyday life in Rwanda' },
    { href: `/${lang}/directory`, label: t('directory'), icon: '🏢', description: 'Find businesses and services near you' },
    { href: `/${lang}/alerts`, label: t('alerts'), icon: '🔔', description: 'Important updates and announcements' },
  ]

  return (
    <div className="min-h-screen">
      <section className="bg-[#1e1b4b] text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <PageContainer maxWidth="xl">
          <div className="relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 tracking-tight">
                {t('welcome')}
              </h1>
              <p className="text-base md:text-lg text-white/80 mb-6 leading-relaxed">
                {t('tagline')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/${lang}/processes`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Browse Processes
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href={`/${lang}/guides`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all border border-white/20"
                >
                  Read Guides
                </Link>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2 text-white/90">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">Your city:</span>
                <CitySelector cityName={cityName} />
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <PageContainer maxWidth="xl">
        <section className="py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="text-4xl mb-3">{link.icon}</div>
                <h3 className="text-lg font-semibold text-primary mb-1 group-hover:text-primary-hover transition-colors">
                  {link.label}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {link.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="pb-12 md:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
                  {t('processes')}
                </h2>
                {processes.length === 0 ? (
                  <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center">
                    <p className="text-neutral-600">No processes found.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {processes.slice(0, 5).map((process: { _id: string; category: string; slug?: { current?: string }; translations?: Record<string, { title?: string; summary?: string }> }) => (
                      <Link
                        key={process._id}
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
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
                  {t('guides')}
                </h2>
                {guides.length === 0 ? (
                  <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center">
                    <p className="text-neutral-600">No guides found.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {guides.slice(0, 5).map((guide: { _id: string; category: string; slug?: { current?: string }; translations?: Record<string, { title?: string; summary?: string }> }) => (
                      <Link
                        key={guide._id}
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
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <AdBanner placement="sidebar" city={cityName} />
              </div>
            </div>
          </div>
        </section>
      </PageContainer>
    </div>
  )
}

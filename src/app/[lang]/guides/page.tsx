import { getGuides } from '@/lib/cms/sanity'
import Link from 'next/link'
import PageContainer from '@/components/PageContainer'
import EmptyState from '@/components/ui/EmptyState'
import messagesEn from '@/i18n/messages/en.json'
import messagesFr from '@/i18n/messages/fr.json'
import messagesRw from '@/i18n/messages/rw.json'
import type { Metadata } from 'next'
import type { Guide } from '@/types'
import { pageMetadata } from '@/lib/seo'

const messagesMap: Record<string, Record<string, string>> = { en: messagesEn, fr: messagesFr, rw: messagesRw }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return pageMetadata({
    title: 'How-To Guides | Bigenda Bite',
    description: 'Step-by-step how-to guides for everyday life in Rwanda. Practical advice for living, working, and settling in Rwanda.',
    pathname: '/guides',
    locale: lang,
    keywords: ['Rwanda guides', 'how-to', 'everyday life', 'tips', 'advice'],
  })
}

export default async function GuidesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const guides = await getGuides(lang)
  const messages = messagesMap[lang as keyof typeof messagesMap] || messagesMap.en
  const t = (key: string) => messages[key] || key

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">{t('guides')}</h1>
        <p className="text-neutral-600">Step-by-step how-to guides for everyday life in Rwanda.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {guides.length === 0 ? (
          <div className="md:col-span-2">
            <EmptyState
              icon="📖"
              title="No guides found"
              description="Check back later for new guides."
            />
          </div>
        ) : (
          guides.map((guide: Guide) => (
            <Link
              key={guide._id}
              href={`/${lang}/guides/${guide.category}/${guide.slug?.current || guide._id}`}
              className="group block bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-primary group-hover:text-primary-hover transition-colors mb-2">
                    {guide.translations?.[lang]?.title || guide.translations?.en?.title}
                  </h2>
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
                </div>
                <svg className="w-5 h-5 text-neutral-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))
        )}
      </div>
    </PageContainer>
  )
}

import { getProcesses } from '@/lib/cms/sanity'
import Link from 'next/link'
import PageContainer from '@/components/PageContainer'
import EmptyState from '@/components/ui/EmptyState'
import messagesEn from '@/i18n/messages/en.json'
import messagesFr from '@/i18n/messages/fr.json'
import messagesRw from '@/i18n/messages/rw.json'
import type { Metadata } from 'next'
import type { Process } from '@/types'
import { pageMetadata } from '@/lib/seo'

const messagesMap: Record<string, Record<string, string>> = { en: messagesEn, fr: messagesFr, rw: messagesRw }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return pageMetadata({
    title: 'Official Processes | Bigenda Bite',
    description: 'Browse official government processes and procedures in Rwanda. Verified and regularly updated.',
    pathname: '/processes',
    locale: lang,
    keywords: ['Rwanda processes', 'government procedures', 'RDB', 'RRA', 'Irembo'],
  })
}

export default async function ProcessesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const processes = await getProcesses(lang)
  const messages = messagesMap[lang as keyof typeof messagesMap] || messagesMap.en
  const t = (key: string) => messages[key] || key

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">{t('processes')}</h1>
        <p className="text-neutral-600">Official government processes and procedures, verified and updated regularly.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {processes.length === 0 ? (
          <div className="md:col-span-2">
            <EmptyState
              icon="📋"
              title="No processes found"
              description="Check back later for new official processes."
            />
          </div>
        ) : (
          processes.map((process: Process) => (
            <Link
              key={process._id}
              href={`/${lang}/processes/${process.category}/${process.slug?.current || process.translations?.en?.title || process._id}`}
              className="group block bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-primary group-hover:text-primary-hover transition-colors mb-2">
                    {process.translations?.[lang]?.title || process.translations?.en?.title}
                  </h2>
                  {(process.translations?.[lang]?.summary || process.translations?.en?.summary) && (
                    <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">
                      {process.translations?.[lang]?.summary || process.translations?.en?.summary}
                    </p>
                  )}
                  {process.category && (
                    <span className="inline-block mt-3 px-2.5 py-1 bg-primary-light text-primary text-xs font-medium rounded-full">
                      {process.category}
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

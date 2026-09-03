import { getProcessBySlug } from '@/lib/cms/sanity'
import { getSession } from '@/lib/auth/session'
import { notFound } from 'next/navigation'
import PageContainer from '@/components/PageContainer'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import TaskBlueprint from '@/components/TaskBlueprint'
import BeforeYouGo from '@/components/BeforeYouGo'
import ShareButton from '@/components/ShareButton'
import messagesEn from '@/i18n/messages/en.json'
import messagesFr from '@/i18n/messages/fr.json'
import messagesRw from '@/i18n/messages/rw.json'
import type { Metadata } from 'next'
import type { ProcessStep, Fee } from '@/types'
import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/JsonLd'

const messagesMap: Record<string, Record<string, string>> = { en: messagesEn, fr: messagesFr, rw: messagesRw }

const baseUrl = 'https://bigendabite.com'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string; category: string; slug: string }> }): Promise<Metadata> {
  const { lang, category, slug } = await params
  const process = await getProcessBySlug(slug)
  if (!process) return pageMetadata({ title: 'Process Not Found', description: 'The requested process could not be found.', pathname: `/processes/${category}/${slug}`, locale: lang })

  const title = process.translations?.[lang]?.title || process.translations?.en?.title || 'Process Details'
  const description = process.translations?.[lang]?.summary || process.translations?.en?.summary || 'Official government process in Rwanda.'
  const pathname = `/processes/${category}/${process.slug?.current || slug}`

  return pageMetadata({
    title: `${title} | Bigenda Bite`,
    description,
    pathname,
    locale: lang,
    keywords: [category, 'Rwanda', 'government process', title],
  })
}

export default async function ProcessDetailPage({ params }: { params: Promise<{ lang: string; category: string; slug: string }> }) {
  const { lang, slug } = await params
  const process = await getProcessBySlug(slug)
  const session = await getSession()
  const isForeigner = session?.user?.isForeigner ?? false
  const messages = messagesMap[lang as keyof typeof messagesMap] || messagesMap.en
  const t = (key: string) => messages[key] || key

  if (!process) {
    notFound()
  }

  const data = process.translations?.[lang] || process.translations?.en

  const breadcrumbLd = breadcrumbJsonLd(baseUrl, [
    { name: t('processes'), url: `/${lang}/processes` },
    { name: data?.title || 'Process Details', url: `/${lang}/processes/${process.category}/${process.slug?.current || slug}` },
  ])

  return (
    <PageContainer>
      <JsonLd data={breadcrumbLd} />
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: t('processes'), href: `/${lang}/processes` },
            { label: data?.title || 'Process Details' },
          ]}
        />
      </div>

      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">{data?.title}</h1>
          {process.sourceType === 'official_verified' && (
            <Badge variant="success" className="flex-shrink-0">
              <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Official
            </Badge>
          )}
        </div>
        <p className="text-lg text-neutral-600 leading-relaxed mb-6">{data?.summary}</p>

        {process.lastVerifiedDate && (
          <div className="flex items-center gap-2 text-sm text-neutral-600 mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Last verified: {new Date(process.lastVerifiedDate).toLocaleDateString()}
          </div>
        )}

        {process.category && (
          <span className="inline-block px-3 py-1 bg-primary-light text-primary text-sm font-medium rounded-full">
            {process.category}
          </span>
        )}
      </div>

      <TaskBlueprint data={process.taskBlueprint} />

      <BeforeYouGo
        beforeYouGo={process.beforeYouGo}
        foreignerNotes={process.foreignerNotes}
        showForeignerNotes={isForeigner}
      />

      {process.steps && process.steps.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mb-6">Steps</h2>
          <div className="space-y-4">
            {process.steps.map((step: ProcessStep, index: number) => (
              <Card key={index} className="p-5 flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {step.order || index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-neutral-900 leading-relaxed">
                    {step.text?.[lang] || step.text?.en}
                  </p>
                  {step.estimatedTime && (
                    <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {step.estimatedTime}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {process.fees && process.fees.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mb-6">Fees</h2>
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-neutral-700">Fee</th>
                  <th className="text-left p-4 font-semibold text-neutral-700">Amount</th>
                  <th className="text-left p-4 font-semibold text-neutral-700">Conditions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {process.fees.map((fee: Fee, index: number) => (
                  <tr key={index} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4 font-medium text-neutral-900">{fee.label}</td>
                    <td className="p-4">
                      <span className={`font-semibold ${fee.amountRWF ? (fee.amountRWF > 0 ? 'text-primary' : 'text-emerald-700') : ''}`}>
                        {fee.amountRWF ? (fee.amountRWF > 0 ? `${fee.amountRWF.toLocaleString()} RWF` : 'Free') : '—'}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-600">{fee.conditions || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {process.requiredDocuments && process.requiredDocuments.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mb-6">Required Documents</h2>
          <ul className="space-y-3">
            {process.requiredDocuments.map((doc: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-neutral-700">{doc}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {process.officialPortal && (
        <section className="mb-10">
          <a
            href={process.officialPortal}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-all duration-150 shadow-md hover:shadow-lg"
          >
            Visit Official Portal
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </section>
      )}

      <div className="mt-8 pt-8 border-t border-neutral-200">
        <h2 className="text-xl font-semibold text-neutral-700 mb-4">Share this process</h2>
        <ShareButton
          title={data?.title || 'Bigenda Bite Process'}
          url={`${globalThis.process.env.NEXT_PUBLIC_BASE_URL || 'https://bigendabite.com'}/${lang}${process.slug?.current ? `/processes/${process.category}/${process.slug.current}` : ''}`}
        />
      </div>
    </PageContainer>
  )
}

import { getGuideBySlug } from '@/lib/cms/sanity'
import { connectToDatabase } from '@/lib/db/mongodb'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { toSlug } from '@/lib/slug'
import PageContainer from '@/components/PageContainer'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import TaskBlueprint from '@/components/TaskBlueprint'
import type { Metadata } from 'next'
import type { CommunityContribution } from '@/types'
import { pageMetadata, breadcrumbJsonLd, howToJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/JsonLd'

const baseUrl = 'https://bigendabite.com'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string; category: string; slug: string }> }): Promise<Metadata> {
  const { lang, category, slug } = await params
  const guide = await getGuideBySlug(slug)
  if (!guide) return pageMetadata({ title: 'Guide Not Found', description: 'The requested guide could not be found.', pathname: `/guides/${category}/${slug}`, locale: lang })

  const title = guide.translations?.[lang]?.title || guide.translations?.en?.title || 'Guide Details'
  const description = guide.translations?.[lang]?.summary || guide.translations?.en?.summary || 'How-to guide for Rwanda.'
  const pathname = `/guides/${category}/${guide.slug?.current || slug}`

  return pageMetadata({
    title: `${title} | Bigenda Bite`,
    description,
    pathname,
    locale: lang,
    keywords: [category, 'how-to', 'guide', 'Rwanda', title],
  })
}

export default async function GuideDetailPage({ params }: { params: Promise<{ lang: string; category: string; slug: string }> }) {
  const { lang, slug } = await params
  const guide = await getGuideBySlug(slug)
  const messages = (await import('@/i18n/messages/' + lang + '.json')).default
  const t = (key: string) => messages[key] || key

  if (!guide) {
    notFound()
  }

  const data = guide.translations?.[lang] || guide.translations?.en

  const breadcrumbLd = breadcrumbJsonLd(baseUrl, [
    { name: t('guides'), url: `/${lang}/guides` },
    { name: data?.title || 'Guide Details', url: `/${lang}/guides/${guide.category}/${guide.slug?.current || slug}` },
  ])

  const howToLd = howToJsonLd(baseUrl, {
    title: data?.title || '',
    summary: data?.summary || '',
    slug: guide.slug?.current || slug,
    category: guide.category,
    lang,
    lastReviewedDate: guide.lastReviewedDate,
    steps: guide.steps?.map((step) => ({
      text: step.text?.[lang] || step.text?.en || '',
      estimatedTime: step.estimatedTime,
    })) || [],
  })

  const db = await connectToDatabase()
  const contributions = await db.collection('contributions')
    .find({ guideId: slug, status: 'published' })
    .sort({ submittedAt: -1 })
    .limit(20)
    .toArray() as unknown as CommunityContribution[]

  return (
    <PageContainer>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={howToLd} />
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: t('guides'), href: `/${lang}/guides` },
            { label: data?.title || 'Guide Details' },
          ]}
        />
      </div>

      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">{data?.title}</h1>
          {guide.lastReviewedDate && (
            <Badge variant="success" className="flex-shrink-0">
              <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Reviewed
            </Badge>
          )}
        </div>
        <p className="text-lg text-neutral-600 leading-relaxed mb-6">{data?.summary}</p>

        {guide.lastReviewedDate && (
          <div className="flex items-center gap-2 text-sm text-neutral-600 mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Last reviewed: {new Date(guide.lastReviewedDate).toLocaleDateString()}
          </div>
        )}

        {guide.category && (
          <span className="inline-block px-3 py-1 bg-accent-light text-amber-700 text-sm font-medium rounded-full">
            {guide.category}
          </span>
        )}
      </div>

      <TaskBlueprint data={guide.taskBlueprint} />

      {guide.steps && guide.steps.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mb-6">Steps</h2>
          <div className="space-y-4">
            {guide.steps.map((step, index: number) => (
              <Card key={index} className="p-5 flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {step.order || index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-neutral-900 leading-relaxed">
                    {step.text?.[lang] || step.text?.en}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {guide.typicalCosts && guide.typicalCosts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mb-6">Typical Costs</h2>
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-neutral-700">Item</th>
                  <th className="text-left p-4 font-semibold text-neutral-700">Cost Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {guide.typicalCosts.map((cost, index: number) => (
                  <tr key={index} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4 font-medium text-neutral-900">{cost?.label}</td>
                    <td className="p-4">
                      {cost?.rangeRWF?.length === 2 ? (
                        <span className="font-semibold text-primary">
                          {cost.rangeRWF[0].toLocaleString()} – {cost.rangeRWF[1].toLocaleString()} RWF
                        </span>
                      ) : (
                        <span className="text-neutral-600">Varies</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {guide.commonPitfalls && guide.commonPitfalls.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mb-6">Common Pitfalls</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <ul className="space-y-3">
              {guide.commonPitfalls.map((pitfall: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-amber-900">{pitfall}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {contributions.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-primary mb-6">Community Tips</h2>
          <div className="space-y-4">
            {contributions.map((contribution: CommunityContribution) => (
              <Card key={contribution._id} className="p-5">
                <p className="text-neutral-900 leading-relaxed">{contribution.text}</p>
                {contribution.city && (
                  <p className="text-sm text-neutral-500 mt-2 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {contribution.city}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      <div className="border-t border-neutral-200 pt-8">
        <Link
          href={'/' + lang + '/guides/' + guide.category + '/' + toSlug(guide.slug?.current || guide.translations?.en?.title || guide._id) + '/contribute'}
          className="inline-flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-all duration-150 shadow-md hover:shadow-lg"
        >
          Add a community tip
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      </div>
    </PageContainer>
  )
}

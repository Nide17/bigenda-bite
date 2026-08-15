import { getGuideBySlug } from '@/lib/cms/sanity'
import { connectToDatabase } from '@/lib/db/mongodb'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function GuideDetailPage({ params }: { params: Promise<{ lang: string; category: string; slug: string }> }) {
  const { lang, slug } = await params
  const guide = await getGuideBySlug(slug, lang)
  const messages = (await import('@/i18n/messages/' + lang + '.json')).default
  const t = (key: string) => messages.common?.[key] || key

  if (!guide) {
    notFound()
  }

  const data = guide.translations?.[lang] || guide.translations?.en

  const db = await connectToDatabase()
  const contributions = await db.collection('contributions')
    .find({ guideId: slug, status: 'published' })
    .sort({ submittedAt: -1 })
    .limit(20)
    .toArray()

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">{data?.title}</h1>
      <p className="text-gray-600 mb-6">{data?.summary}</p>

      {guide.lastReviewedDate && (
        <p className="text-sm text-green-600 mb-6">
          Last reviewed: {new Date(guide.lastReviewedDate).toLocaleDateString()}
        </p>
      )}

      {guide.steps && guide.steps.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Steps</h2>
          <ol className="list-decimal list-inside space-y-2">
            {guide.steps.map((step: any, index: number) => (
              <li key={index}>{step.text?.[lang] || step.text?.en}</li>
            ))}
          </ol>
        </section>
      )}

      {guide.typicalCosts && guide.typicalCosts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Typical Costs</h2>
          <ul className="space-y-2">
            {guide.typicalCosts.map((cost: any, index: number) => (
              <li key={index}>
                {cost.label}: {cost.rangeRWF?.length === 2
                  ? cost.rangeRWF[0].toLocaleString() + ' – ' + cost.rangeRWF[1].toLocaleString() + ' RWF'
                  : 'Varies'}
              </li>
            ))}
          </ul>
        </section>
      )}

      {guide.commonPitfalls && guide.commonPitfalls.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Common Pitfalls</h2>
          <ul className="list-disc list-inside">
            {guide.commonPitfalls.map((pitfall: string, index: number) => (
              <li key={index}>{pitfall}</li>
            ))}
          </ul>
        </section>
      )}

      {contributions.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Community Tips</h2>
          <ul className="space-y-2">
            {contributions.map((contribution: any) => (
              <li key={contribution._id} className="p-3 bg-gray-50 rounded border">
                {contribution.text}
                {contribution.city && <span className="text-gray-500 text-sm"> — {contribution.city}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8">
        <Link
          href={'/' + lang + '/guides/' + guide.category + '/' + guide.slug?.current + '/contribute'}
          className="text-blue-600 hover:underline"
        >
          Add a community tip →
        </Link>
      </div>
    </main>
  )
}
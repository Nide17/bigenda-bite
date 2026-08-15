import { getProcessBySlug } from '@/lib/cms/sanity'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProcessDetailPage({ params }: { params: Promise<{ lang: string; category: string; slug: string }> }) {
  const { lang, slug } = await params
  const process = await getProcessBySlug(slug, lang)
  const messages = (await import(`@/i18n/messages/${lang}.json`)).default
  const t = (key: string) => messages.common?.[key] || key

  if (!process) {
    notFound()
  }

  const data = process.translations?.[lang] || process.translations?.en

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">{data?.title}</h1>
      <p className="text-gray-600 mb-6">{data?.summary}</p>

      {process.lastVerifiedDate && (
        <p className="text-sm text-green-600 mb-6">
          Last verified: {new Date(process.lastVerifiedDate).toLocaleDateString()}
        </p>
      )}

      {process.steps && process.steps.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Steps</h2>
          <ol className="list-decimal list-inside space-y-2">
            {process.steps.map((step: any, index: number) => (
              <li key={index}>
                {step.text?.[lang] || step.text?.en}
                {step.estimatedTime && (
                  <span className="text-gray-500 ml-2">({step.estimatedTime})</span>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {process.fees && process.fees.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Fees</h2>
          <ul className="space-y-2">
            {process.fees.map((fee: any, index: number) => (
              <li key={index}>
                {fee.label}: {fee.amountRWF > 0 ? `${fee.amountRWF.toLocaleString()} RWF` : 'Free'}
                {fee.conditions && <span className="text-gray-500 ml-2">— {fee.conditions}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {process.requiredDocuments && process.requiredDocuments.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Required Documents</h2>
          <ul className="list-disc list-inside">
            {process.requiredDocuments.map((doc: string, index: number) => (
              <li key={index}>{doc}</li>
            ))}
          </ul>
        </section>
      )}

      {process.officialPortal && (
        <section className="mb-8">
          <a
            href={process.officialPortal}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Visit Official Portal →
          </a>
        </section>
      )}
    </main>
  )
}

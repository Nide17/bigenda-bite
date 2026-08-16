import Link from 'next/link'

export default async function MembershipPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const messages = (await import(`@/i18n/messages/${lang}.json`)).default
  const t = (key: string) => messages.common?.[key] || key

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">{t('membership')}</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="border p-6 rounded">
          <h2 className="text-xl font-semibold">Free</h2>
          <p className="text-2xl font-bold">0 RWF</p>
          <p className="mt-2">Basic listing, no lead capture</p>
        </div>
        <div className="border p-6 rounded">
          <h2 className="text-xl font-semibold">Basic</h2>
          <p className="text-2xl font-bold">~2,000 RWF</p>
          <p className="mt-2">Verified badge, contact button, better placement</p>
          <Link
            href={`/${lang}/membership/checkout?plan=basic`}
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
          >
            Choose Basic
          </Link>
        </div>
        <div className="border p-6 rounded">
          <h2 className="text-xl font-semibold">Pro</h2>
          <p className="text-2xl font-bold">~5,000 RWF</p>
          <p className="mt-2">Lead form + analytics, featured spot</p>
          <Link
            href={`/${lang}/membership/checkout?plan=pro`}
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
          >
            Choose Pro
          </Link>
        </div>
      </div>
    </main>
  )
}

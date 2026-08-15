import { connectToDatabase } from '@/lib/db/mongodb'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function BusinessDetailPage({ params }: { params: Promise<{ lang: string; businessSlug: string }> }) {
  const { lang, businessSlug } = await params
  const db = await connectToDatabase()
  const business = await db.collection('businesses').findOne({ slug: businessSlug })
  const messages = (await import(`@/i18n/messages/${lang}.json`)).default
  const t = (key: string) => messages.common?.[key] || key

  if (!business) {
    notFound()
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">{business.name}</h1>
      <p className="text-gray-600 mb-2">{business.category} · {business.city || 'Nationwide'}</p>
      <p className="text-gray-600 mb-4">{business.contact?.phone}</p>
      {business.leadsEnabled && (
        <form className="mt-6 max-w-md space-y-4">
          <h2 className="text-xl font-semibold">Contact this business</h2>
          <input
            type="text"
            placeholder="Your name"
            className="block w-full border rounded p-2"
            required
          />
          <input
            type="tel"
            placeholder="Your phone"
            className="block w-full border rounded p-2"
            required
          />
          <textarea
            placeholder="Message"
            className="block w-full border rounded p-2"
            rows={3}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Send
          </button>
        </form>
      )}
    </main>
  )
}

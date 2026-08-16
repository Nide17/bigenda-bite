import { connectToDatabase } from '@/lib/db/mongodb'
import { notFound } from 'next/navigation'
import AdBanner from '@/components/AdBanner'

export const dynamic = 'force-dynamic'

export default async function DirectoryPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ city?: string }> }) {
  const { lang } = await params
  const { city } = await searchParams
  const db = await connectToDatabase()

  const query: Record<string, unknown> = {}
  if (city && city !== 'all') {
    query.city = city
  }

  const businesses = await db.collection('businesses').find(query).sort({ name: 1 }).limit(50).toArray()
  const messages = (await import(`@/i18n/messages/${lang}.json`)).default
  const t = (key: string) => messages.common?.[key] || key

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">{t('directory')}</h1>

      <form method="get" className="mb-6 flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium">City</label>
          <select name="city" defaultValue={city || 'all'} className="mt-1 block border rounded p-2">
            <option value="all">All Cities</option>
            <option value="Kigali">Kigali</option>
            <option value="Musanze">Musanze</option>
            <option value="Rubavu">Rubavu</option>
            <option value="Huye">Huye</option>
            <option value="Mombasa">Mombasa</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Filter
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {businesses.length === 0 ? (
            <p>No businesses found.</p>
          ) : (
            <ul className="space-y-4">
              {businesses.map((business: any) => (
                <li key={business._id.toString()} className="border p-4 rounded">
                  <h2 className="text-xl font-semibold">{business.name}</h2>
                  <p className="text-gray-600">{business.category} · {business.city || 'Nationwide'}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <AdBanner placement="sidebar" city={city} />
        </div>
      </div>
    </main>
  )
}
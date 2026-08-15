import { connectToDatabase } from '@/lib/db/mongodb'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DirectoryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const db = await connectToDatabase()
  const businesses = await db.collection('businesses').find({}).sort({ name: 1 }).limit(50).toArray()
  const messages = (await import(`@/i18n/messages/${lang}.json`)).default
  const t = (key: string) => messages.common?.[key] || key

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">{t('directory')}</h1>
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
    </main>
  )
}

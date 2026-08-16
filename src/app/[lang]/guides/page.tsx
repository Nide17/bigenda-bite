import { getGuides } from '@/lib/cms/sanity'
import Link from 'next/link'
import { resolveCity } from '@/lib/city'
import AdBanner from '@/components/AdBanner'

export const dynamic = 'force-dynamic'

export default async function GuidesPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ city?: string }> }) {
  const { lang } = await params
  const { city } = await searchParams
  const cityName = city || await resolveCity(new Request('http://localhost:3000'))
  const guides = await getGuides(lang)
  const messages = (await import(`@/i18n/messages/${lang}.json`)).default
  const t = (key: string) => messages.common?.[key] || key

  return (
    <main className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('guides')}</h1>
        <form method="get" className="flex gap-2">
          <input type="hidden" name="city" value={cityName || ''} />
          <select
            name="city"
            defaultValue={cityName || 'Kigali'}
            className="border rounded p-2"
            onChange={(e) => {
              const url = new URL(window.location.href)
              url.searchParams.set('city', e.target.value)
              document.cookie = `bigenda-city=${e.target.value}; path=/; max-age=${30 * 24 * 60 * 60}`
              window.location.href = url.toString()
            }}
          >
            <option value="Kigali">Kigali</option>
            <option value="Musanze">Musanze</option>
            <option value="Rubavu">Rubavu</option>
            <option value="Huye">Huye</option>
            <option value="Mombasa">Mombasa</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Filter</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {guides.length === 0 ? (
            <p>No guides found.</p>
          ) : (
            <ul className="space-y-4">
              {guides.map((guide: any) => (
                <li key={guide._id}>
                  <Link
                    href={`/${lang}/guides/${guide.category}/${guide.slug?.current}`}
                    className="text-blue-600 hover:underline"
                  >
                    {guide.translations?.[lang]?.title || guide.translations?.en?.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <AdBanner placement="sidebar" city={cityName} />
        </div>
      </div>
    </main>
  )
}

import { getProcesses } from '@/lib/cms/sanity'
import { getGuides } from '@/lib/cms/sanity'
import { resolveCity } from '@/lib/city'
import AdBanner from '@/components/AdBanner'

export const dynamic = 'force-dynamic'

export default async function HomePage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ city?: string }> }) {
  const { lang } = await params
  const { city } = await searchParams
  const cityName = city || await resolveCity(new Request('http://localhost:3000'))
  const [processes, guides] = await Promise.all([
    getProcesses(lang),
    getGuides(lang),
  ])
  const messages = (await import(`@/i18n/messages/${lang}.json`)).default
  const t = (key: string) => messages.common?.[key] || key

  return (
    <main className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">{t('welcome')}</h1>
          <p className="text-lg text-gray-600">{t('tagline')}</p>
        </div>
        <form method="get" className="flex gap-2">
          <input type="hidden" name="city" value={cityName} />
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
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('processes')}</h2>
            {processes.length === 0 ? (
              <p>No processes found.</p>
            ) : (
              <ul className="space-y-3">
                {processes.slice(0, 5).map((process: any) => (
                  <li key={process._id} className="border-b pb-2">
                    <span className="font-medium">{process.translations?.[lang]?.title || process.translations?.en?.title}</span>
                    {process.translations?.[lang]?.summary && (
                      <p className="text-gray-600 text-sm mt-1">{process.translations?.[lang]?.summary}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('guides')}</h2>
            {guides.length === 0 ? (
              <p>No guides found.</p>
            ) : (
              <ul className="space-y-3">
                {guides.slice(0, 5).map((guide: any) => (
                  <li key={guide._id} className="border-b pb-2">
                    <span className="font-medium">{guide.translations?.[lang]?.title || guide.translations?.en?.title}</span>
                    {guide.translations?.[lang]?.summary && (
                      <p className="text-gray-600 text-sm mt-1">{guide.translations?.[lang]?.summary}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <AdBanner placement="sidebar" city={cityName} />
        </div>
      </div>
    </main>
  )
}

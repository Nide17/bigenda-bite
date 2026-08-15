import { getProcesses } from '@/lib/cms/sanity'
import { getGuides } from '@/lib/cms/sanity'

export const dynamic = 'force-dynamic'

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const [processes, guides] = await Promise.all([
    getProcesses(lang),
    getGuides(lang),
  ])
  const messages = (await import(`@/i18n/messages/${lang}.json`)).default
  const t = (key: string) => messages.common?.[key] || key

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">{t('welcome')}</h1>
      <p className="text-lg text-gray-600 mb-12">{t('tagline')}</p>

      <section className="mb-12">
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
    </main>
  )
}
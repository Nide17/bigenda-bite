import { getProcesses } from '@/lib/cms/sanity'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AdBanner from '@/components/AdBanner'
import { toSlug } from '@/lib/slug'

export const dynamic = 'force-dynamic'

export default async function ProcessesPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ city?: string }> }) {
  const { lang } = await params
  const { city } = await searchParams
  const processes = await getProcesses(lang)
  const messages = (await import(`@/i18n/messages/${lang}.json`)).default
  const t = (key: string) => messages.common?.[key] || key

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">{t('processes')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {processes.length === 0 ? (
            <p>No processes found.</p>
          ) : (
            <ul className="space-y-4">
              {processes.map((process: any) => (
                <li key={process._id}>
                  <Link
                    href={`/${lang}/processes/${process.category}/${toSlug(process.slug?.current || process.translations?.en?.title || process._id)}`}
                    className="text-blue-600 hover:underline"
                  >
                    {process.translations?.[lang]?.title || process.translations?.en?.title}
                  </Link>
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

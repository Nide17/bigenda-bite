import { getProcesses } from '@/lib/cms/sanity'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ProcessesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const processes = await getProcesses(lang)
  const messages = (await import(`@/i18n/messages/${lang}.json`)).default
  const t = (key: string) => messages.common?.[key] || key

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">{t('processes')}</h1>
      {processes.length === 0 ? (
        <p>No processes found.</p>
      ) : (
        <ul className="space-y-4">
          {processes.map((process: any) => (
            <li key={process._id}>
              <Link
                href={`/${lang}/processes/${process.category}/${process.slug?.current}`}
                className="text-blue-600 hover:underline"
              >
                {process.translations?.[lang]?.title || process.translations?.en?.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

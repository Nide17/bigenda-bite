import { getGuides } from '@/lib/cms/sanity'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function GuidesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const guides = await getGuides(lang)
  const messages = (await import(`@/i18n/messages/${lang}.json`)).default
  const t = (key: string) => messages.common?.[key] || key

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">{t('guides')}</h1>
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
    </main>
  )
}

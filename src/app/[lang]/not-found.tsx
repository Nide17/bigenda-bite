'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import PageContainer from '@/components/PageContainer'
import Button from '@/components/ui/Button'
import messagesEn from '@/i18n/messages/en.json'
import messagesFr from '@/i18n/messages/fr.json'
import messagesRw from '@/i18n/messages/rw.json'

const messagesMap: Record<string, Record<string, string>> = { en: messagesEn, fr: messagesFr, rw: messagesRw }

const POPULAR_PAGES = [
  { key: 'processes', href: '/processes', icon: '📋' },
  { key: 'guides', href: '/guides', icon: '📖' },
  { key: 'directory', href: '/directory', icon: '🏢' },
  { key: 'alerts', href: '/alerts', icon: '🔔' },
]

export default function NotFound() {
  const params = useParams()
  const router = useRouter()
  const lang = (params?.lang as string) || 'en'
  const messages = messagesMap[lang] || messagesMap.en
  const t = (key: string) => messages[key] || key

  return (
    <PageContainer maxWidth="md">
      <div className="text-center py-16 md:py-24">
        <div className="text-8xl font-bold text-primary/10 mb-4">404</div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{t('not_found_title')}</h1>
        <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
          {t('not_found_message')}
        </p>

        <div className="bg-neutral-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
          <p className="text-sm font-medium text-neutral-700 mb-3">{t('not_found_search_help')}</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('search_placeholder')}
              className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const query = (e.target as HTMLInputElement).value
                  if (query.trim()) {
                    router.push(`/${lang}/search?q=${encodeURIComponent(query.trim())}`)
                  }
                }
              }}
            />
            <Button
              size="md"
              onClick={() => {
                const input = document.querySelector('input[type="text"]') as HTMLInputElement
                if (input?.value?.trim()) {
                  router.push(`/${lang}/search?q=${encodeURIComponent(input.value.trim())}`)
                }
              }}
            >
              {t('search')}
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm font-medium text-neutral-700 mb-3">{t('not_found_popular_pages')}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-lg mx-auto">
            {POPULAR_PAGES.map((page) => (
              <Link
                key={page.key}
                href={`/${lang}${page.href}`}
                className="flex flex-col items-center gap-1 p-4 bg-white border border-neutral-200 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-colors"
              >
                <span className="text-2xl">{page.icon}</span>
                <span className="text-xs font-medium text-neutral-700">{t(page.key)}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-all duration-150 shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t('error_home')}
          </Link>
          <Link
            href={`/${lang}/search`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-neutral-300 text-primary font-semibold rounded-lg hover:bg-neutral-50 transition-all duration-150"
          >
            {t('search')}
          </Link>
        </div>
      </div>
    </PageContainer>
  )
}

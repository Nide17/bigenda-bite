'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import messagesEn from '@/i18n/messages/en.json'
import messagesFr from '@/i18n/messages/fr.json'
import messagesRw from '@/i18n/messages/rw.json'

const messagesMap: Record<string, Record<string, string>> = { en: messagesEn, fr: messagesFr, rw: messagesRw }

const POPULAR_LINKS = [
  { key: 'processes', href: '/processes', icon: '📋' },
  { key: 'guides', href: '/guides', icon: '📖' },
  { key: 'directory', href: '/directory', icon: '🏢' },
  { key: 'alerts', href: '/alerts', icon: '🔔' },
]

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams()
  const router = useRouter()
  const lang = (params?.lang as string) || 'en'
  const messages = messagesMap[lang] || messagesMap.en
  const t = (key: string) => messages[key] || key

  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/${lang}/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const getErrorIcon = () => {
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      return '🌐'
    }
    return '⚠️'
  }

  const getErrorTitle = () => {
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      return t('error_network_title')
    }
    return t('error_title')
  }

  const getErrorMessage = () => {
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      return t('error_network_message')
    }
    return t('error_message')
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{getErrorIcon()}</div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-3">{getErrorTitle()}</h1>
          <p className="text-neutral-600">{getErrorMessage()}</p>
        </div>

        <div className="bg-neutral-50 rounded-xl p-6 mb-6">
          <p className="text-sm font-medium text-neutral-700 mb-3">{t('error_search_help')}</p>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <Button type="submit" size="md">
              {t('search')}
            </Button>
          </form>
        </div>

        <div className="mb-8">
          <p className="text-sm font-medium text-neutral-700 mb-3">{t('error_popular_links')}</p>
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_LINKS.map((link) => (
              <Link
                key={link.key}
                href={`/${lang}${link.href}`}
                className="flex items-center gap-2 p-3 bg-white border border-neutral-200 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-colors"
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-sm font-medium text-neutral-700">{t(link.key)}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="primary">
            {t('error_retry')}
          </Button>
          <Button onClick={() => router.back()} variant="outline">
            {t('error_go_back')}
          </Button>
          <Link
            href={`/${lang}`}
            className="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-neutral-300 text-primary font-semibold rounded-lg hover:bg-neutral-50 transition-all"
          >
            {t('error_home')}
          </Link>
        </div>
      </div>
    </div>
  )
}

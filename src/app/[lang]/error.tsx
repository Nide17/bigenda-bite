'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import messagesEn from '@/i18n/messages/en.json'
import messagesFr from '@/i18n/messages/fr.json'
import messagesRw from '@/i18n/messages/rw.json'

const messagesMap: Record<string, Record<string, string>> = { en: messagesEn, fr: messagesFr, rw: messagesRw }

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams()
  const lang = (params?.lang as string) || 'en'
  const messages = messagesMap[lang] || messagesMap.en
  const t = (key: string) => messages[key] || key

  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-3xl font-bold text-[#1e1b4b] mb-3">{t('error_title')}</h1>
        <p className="text-neutral-600 mb-8">
          {t('error_message')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="primary">
            {t('error_retry')}
          </Button>
          <Link
            href={`/${lang}`}
            className="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-neutral-300 text-[#1e1b4b] font-semibold rounded-lg hover:bg-neutral-50 transition-all"
          >
            {t('error_home')}
          </Link>
        </div>
      </div>
    </div>
  )
}

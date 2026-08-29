import { Suspense } from 'react'
import SearchResults from './SearchResults'
import Search from '@/components/Search'
import PageContainer from '@/components/PageContainer'
import messagesEn from '@/i18n/messages/en.json'
import messagesFr from '@/i18n/messages/fr.json'
import messagesRw from '@/i18n/messages/rw.json'
import type { Metadata } from 'next'

const messagesMap: Record<string, Record<string, string>> = { en: messagesEn, fr: messagesFr, rw: messagesRw }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: _lang } = await params
  return {
    title: 'Search | Bigenda Bite',
    description: 'Search processes, guides, businesses, and alerts across Rwanda.',
  }
}

interface SearchPageProps {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ q?: string; type?: string }>
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { lang } = await params
  const { q, type } = await searchParams
  const messages = messagesMap[lang as keyof typeof messagesMap] || messagesMap.en
  const t = (key: string) => messages[key] || key

  return (
    <PageContainer>
      <div className="py-8 md:py-12">
        <div className="max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">{t('search_title')}</h1>
          <p className="text-neutral-600 mb-6">{t('search_subtitle')}</p>
          <Search lang={lang} placeholder={t('search_placeholder')} initialQuery={q || ''} />
        </div>

        <Suspense fallback={<div className="text-neutral-600">Loading...</div>}>
          <SearchResults query={q || ''} typeFilter={type || ''} lang={lang} />
        </Suspense>
      </div>
    </PageContainer>
  )
}

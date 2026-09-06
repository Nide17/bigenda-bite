import { Suspense } from 'react'
import AccountSettingsContent from './AccountSettingsContent'
import PageContainer from '@/components/PageContainer'
import messagesEn from '@/i18n/messages/en.json'
import messagesFr from '@/i18n/messages/fr.json'
import messagesRw from '@/i18n/messages/rw.json'

const messagesMap: Record<string, Record<string, string>> = { en: messagesEn, fr: messagesFr, rw: messagesRw }

export default async function AccountSettingsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const messages = messagesMap[lang as keyof typeof messagesMap] || messagesMap.en
  const t = (key: string) => messages[key] || key

  return (
    <PageContainer maxWidth="md">
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">{t('account_settings_title')}</h1>
          <p className="text-sm text-neutral-600 mt-1">{t('account_settings_subtitle')}</p>
        </div>
        <Suspense fallback={<div className="text-center text-neutral-500">Loading...</div>}>
          <AccountSettingsContent lang={lang} />
        </Suspense>
      </div>
    </PageContainer>
  )
}

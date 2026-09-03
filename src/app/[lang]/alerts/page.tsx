import { getAlerts } from '@/lib/cms/sanity'
import PageContainer from '@/components/PageContainer'
import AlertsSection from '@/components/AlertsSection'
import EmptyState from '@/components/ui/EmptyState'
import messagesEn from '@/i18n/messages/en.json'
import messagesFr from '@/i18n/messages/fr.json'
import messagesRw from '@/i18n/messages/rw.json'
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

const messagesMap: Record<string, Record<string, string>> = { en: messagesEn, fr: messagesFr, rw: messagesRw }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return pageMetadata({
    title: 'Alerts | Bigenda Bite',
    description: 'Important updates and announcements from official sources in Rwanda.',
    pathname: '/alerts',
    locale: lang,
    keywords: ['Rwanda alerts', 'official updates', 'announcements', 'government notices'],
  })
}

export default async function AlertsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const alerts = await getAlerts()
  const messages = messagesMap[lang as keyof typeof messagesMap] || messagesMap.en
  const t = (key: string) => messages[key] || key

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">{t('alerts')}</h1>
        <p className="text-neutral-600">Important updates and announcements from official sources.</p>
      </div>
      {alerts.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="No active alerts"
          description="All clear! Check back later for updates."
        />
      ) : (
        <AlertsSection alerts={alerts} lang={lang} variant="list" />
      )}
    </PageContainer>
  )
}
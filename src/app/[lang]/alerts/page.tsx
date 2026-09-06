import { getAlerts } from '@/lib/cms/sanity'
import PageContainer from '@/components/PageContainer'
import AlertsSection from '@/components/AlertsSection'
import EmptyState from '@/components/ui/EmptyState'
import { getMessages } from '@/lib/i18n'
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return pageMetadata({
    title: 'Alerts | Bigenda Bite',
    description: 'Important updates and announcements from official sources in Rwanda.',
    pathname: '/alerts',
    locale: lang,
    keywords: ['alerts', 'announcements', 'Rwanda', 'updates'],
  })
}

export default async function AlertsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = getMessages(lang)
  const alerts = await getAlerts()

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
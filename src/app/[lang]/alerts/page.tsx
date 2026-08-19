import { getAlerts } from '@/lib/cms/sanity'
import PageContainer from '@/components/PageContainer'
import EmptyState from '@/components/ui/EmptyState'
import Badge from '@/components/ui/Badge'
import messagesEn from '@/i18n/messages/en.json'
import messagesFr from '@/i18n/messages/fr.json'
import messagesRw from '@/i18n/messages/rw.json'
import type { Metadata } from 'next'
import type { Alert } from '@/types'
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

  const severityColors: Record<string, 'error' | 'warning' | 'info' | 'success'> = {
    high: 'error',
    medium: 'warning',
    low: 'info',
    critical: 'error',
  }

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
        <div className="space-y-4">
          {alerts.map((alert: Alert) => (
            <div
              key={alert._id}
              className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-lg font-semibold text-primary">
                      {alert.translations?.[lang] || alert.translations?.en}
                    </h2>
                    {alert.severity && (
                      <Badge variant={severityColors[alert.severity] || 'info'}>
                        {alert.severity}
                      </Badge>
                    )}
                  </div>
                  <p className="text-neutral-600 leading-relaxed">
                    {alert.translations?.[lang] || alert.translations?.en}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  )
}

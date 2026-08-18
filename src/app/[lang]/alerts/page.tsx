import { getAlerts } from '@/lib/cms/sanity'
import PageContainer from '@/components/PageContainer'
import EmptyState from '@/components/ui/EmptyState'
import Badge from '@/components/ui/Badge'

export const dynamic = 'force-dynamic'

export default async function AlertsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const alerts = await getAlerts()
  const messages = (await import(`@/i18n/messages/${lang}.json`)).default
  const t = (key: string) => messages.common?.[key] || key

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
          {alerts.map((alert: any) => (
            <div
              key={alert._id}
              className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-lg font-semibold text-primary">
                      {alert.translations?.[lang]?.title || alert.translations?.en?.title}
                    </h2>
                    {alert.severity && (
                      <Badge variant={severityColors[alert.severity] || 'info'}>
                        {alert.severity}
                      </Badge>
                    )}
                  </div>
                  <p className="text-neutral-600 leading-relaxed">
                    {alert.translations?.[lang]?.summary || alert.translations?.en?.summary}
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

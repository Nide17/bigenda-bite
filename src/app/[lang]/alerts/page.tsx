import { getAlerts } from '@/lib/cms/sanity'

export const dynamic = 'force-dynamic'

export default async function AlertsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const alerts = await getAlerts()
  const messages = (await import(`@/i18n/messages/${lang}.json`)).default
  const t = (key: string) => messages.common?.[key] || key

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">{t('alerts')}</h1>
      {alerts.length === 0 ? (
        <p>No active alerts.</p>
      ) : (
        <ul className="space-y-4">
          {alerts.map((alert: any) => (
            <li key={alert._id} className="border-l-4 border-yellow-500 p-4">
              <p className="font-semibold">{alert.translations?.[lang] || alert.translations?.en}</p>
              <p className="text-sm text-gray-500">Severity: {alert.severity}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

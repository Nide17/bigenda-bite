import type { Alert } from '@/types'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'

interface AlertsSectionProps {
  alerts: Alert[]
  lang: string
  limit?: number
  variant?: 'compact' | 'list'
  locale?: Record<string, string>
  t?: (key: string) => string
}

const severityColors: Record<string, 'error' | 'warning' | 'info' | 'success'> = {
  critical: 'error',
  high: 'error',
  medium: 'warning',
  low: 'info',
}

export function deduplicateAlerts(alerts: Alert[]): Alert[] {
  const seen = new Set<string>()
  return alerts.filter((alert) => {
    const title =
      typeof alert.translations?.en === 'string'
        ? alert.translations.en
        : alert.translations?.[Object.keys(alert.translations || {})[0]] || ''
    const key = `${alert._id}-${title}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export default function AlertsSection({
  alerts,
  lang,
  limit,
  variant = 'list',
  t,
}: AlertsSectionProps) {
  const deduped = deduplicateAlerts(alerts)
  const displayAlerts = limit ? deduped.slice(0, limit) : deduped

  if (displayAlerts.length === 0) return null

  return (
    <section aria-labelledby="alerts-heading">
      {t && (
        <h2
          id="alerts-heading"
          className="text-xl md:text-2xl font-bold text-primary mb-4"
        >
          {t('important_alerts_title')}
        </h2>
      )}
      <div className="space-y-3">
        {displayAlerts.map((alert) => {
          const title =
            typeof alert.translations?.en === 'string'
              ? alert.translations.en
              : alert.translations?.[lang] || alert.translations?.en || ''

          return (
            <div
              key={alert._id}
              className={`bg-amber-50 border border-amber-200 rounded-xl p-4 ${
                variant === 'compact' ? 'p-3' : 'p-4'
              }`}
            >
              <div className="flex items-start gap-3">
                <svg
                  className={`text-amber-600 flex-shrink-0 ${variant === 'compact' ? 'w-4 h-4 mt-0.5' : 'w-5 h-5 mt-0.5'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`font-medium text-amber-900 ${variant === 'compact' ? 'text-sm' : 'text-sm'}`}
                    >
                      {title}
                    </p>
                    {alert.severity && (
                      <Badge
                        variant={severityColors[alert.severity] || 'info'}
                        className="text-xs"
                      >
                        {alert.severity}
                      </Badge>
                    )}
                  </div>
                  {alert.expiresAt && (
                    <p className="text-xs text-amber-700 mt-1">
                      Expires: {new Date(alert.expiresAt).toLocaleDateString()}
                    </p>
                  )}
                  {alert.type && variant === 'list' && (
                    <Link
                      href={`/${lang}/alerts`}
                      className="text-xs text-amber-700 hover:underline mt-1 inline-block"
                    >
                      {alert.type}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

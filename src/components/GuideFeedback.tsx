'use client'

import { useState, useCallback } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useTranslations } from '@/components/I18nProvider'

type ReportReason = 'cost' | 'documents' | 'location' | 'other'

function daysAgo(dateString?: string): number | null {
  if (!dateString) return null
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return null
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return diffDays
}

interface GuideFeedbackProps {
  guideId: string
  lastVerifiedDate?: string
  outdatedReportsCount?: number
}

export default function GuideFeedback({ guideId, lastVerifiedDate, outdatedReportsCount = 0 }: GuideFeedbackProps) {
  const t = useTranslations()
  const [submitting, setSubmitting] = useState(false)
  const [showReportOptions, setShowReportOptions] = useState(false)
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null)
  const [feedbackState, setFeedbackState] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const days = daysAgo(lastVerifiedDate)

  const REASONS: { value: ReportReason; label: string }[] = [
    { value: 'cost', label: t('guide_report_reasons_cost') },
    { value: 'documents', label: t('guide_report_reasons_documents') },
    { value: 'location', label: t('guide_report_reasons_location') },
    { value: 'other', label: t('guide_report_reasons_other') },
  ]

  const handleVerify = useCallback(async () => {
    setSubmitting(true)
    setFeedbackState('idle')
    setErrorMessage('')

    try {
      const res = await fetch(`/api/guides/${guideId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify' }),
      })

      if (res.ok) {
        setFeedbackState('success')
        setShowReportOptions(false)
      } else {
        const data = await res.json().catch(() => ({}))
        setFeedbackState('error')
        setErrorMessage(data.error || 'Something went wrong')
      }
    } catch {
      setFeedbackState('error')
      setErrorMessage('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }, [guideId])

  const handleReport = useCallback(async () => {
    if (!selectedReason) return

    setSubmitting(true)
    setFeedbackState('idle')
    setErrorMessage('')

    try {
      const res = await fetch(`/api/guides/${guideId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'report', reason: selectedReason }),
      })

      if (res.ok) {
        setFeedbackState('success')
        setShowReportOptions(false)
        setSelectedReason(null)
      } else {
        const data = await res.json().catch(() => ({}))
        setFeedbackState('error')
        setErrorMessage(data.error || 'Something went wrong')
      }
    } catch {
      setFeedbackState('error')
      setErrorMessage('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }, [guideId, selectedReason])

  if (feedbackState === 'success') {
    return (
      <Card className="p-4 sm:p-5">
        <div className="flex items-center gap-2 text-emerald-700">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm font-medium">{t('guide_feedback_thank_you')}</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral-900">
            {days !== null && days >= 0 ? (
              <>
                ✅ {t('guide_last_verified_by_community', { when: days === 0 ? t('guide_verified_today') : t('guide_verified_days_ago', { days: days.toString(), plural: days === 1 ? '' : 's' }) })}
              </>
            ) : (
              <>⚠️ {t('guide_not_verified')}</>
            )}
          </p>
          {outdatedReportsCount > 0 && (
            <p className="text-xs text-neutral-500 mt-1">
              {t('guide_outdated_reports', { count: outdatedReportsCount.toString(), plural: outdatedReportsCount === 1 ? '' : 's' })}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleVerify}
            loading={submitting}
            disabled={submitting}
            className="min-h-[44px]"
          >
            👍 {t('guide_worked')}
          </Button>

          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowReportOptions(!showReportOptions)}
              disabled={submitting}
              className="min-h-[44px]"
            >
              👎 {t('guide_report_outdated')}
            </Button>

            {showReportOptions && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 overflow-hidden">
                <div className="p-2">
                  <p className="text-xs font-medium text-neutral-500 mb-2 px-2">{t('guide_report_what_changed')}</p>
                  {REASONS.map((reason) => (
                    <button
                      key={reason.value}
                      type="button"
                      onClick={() => {
                        setSelectedReason(reason.value)
                        handleReport()
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors min-h-[44px] flex items-center justify-between ${
                        selectedReason === reason.value
                          ? 'bg-primary text-white'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{reason.label}</span>
                      {selectedReason === reason.value && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {feedbackState === 'error' && (
        <div className="mt-3 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
          {errorMessage}
        </div>
      )}
    </Card>
  )
}
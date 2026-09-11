'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import type { SubmissionType } from '@/types'
import { useTranslations } from '@/components/I18nProvider'
import { toast } from 'sonner'

interface SubmissionFormProps {
  contentType: string
  contentId: string
  contentSlug?: string
  onSuccess?: () => void
}

const SUBMISSION_TYPES: { value: SubmissionType; label: string; description: string }[] = [
  { value: 'comment', label: 'Comment', description: 'General feedback or question' },
  { value: 'edit_suggestion', label: 'Suggest Edit', description: 'Propose a change to this content' },
  { value: 'additional_info', label: 'Add Info', description: 'Share an extra tip or detail' },
  { value: 'review', label: 'Review', description: 'Rate and review your experience' },
]

export default function SubmissionForm({ contentType, contentId, contentSlug, onSuccess }: SubmissionFormProps) {
  const t = useTranslations()
  const [type, setType] = useState<SubmissionType>('comment')
  const [text, setText] = useState('')
  const [rating, setRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          contentType,
          contentId,
          contentSlug,
          text,
          rating: type === 'review' ? rating : undefined,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        onSuccess?.()
        toast.success(t('submission_thank_you'))
      } else {
        const data = await res.json().catch(() => ({}))
        const message = data.error || t('submission_failed')
        setError(message)
        toast.error(message)
      }
    } catch {
      const message = t('submission_failed')
      setError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      {submitted ? (
        <div className="text-center py-6">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">{t('submission_thank_you')}</h3>
          <p className="text-sm text-neutral-600">{t('submission_sent')}</p>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-primary mb-4">{t('submission_contribute_title')}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">{t('submission_choose_action')}</label>
          <div className="grid grid-cols-2 gap-2">
            {SUBMISSION_TYPES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setType(option.value)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  type === option.value
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="text-sm font-medium">{t(option.label.toLowerCase().replace(/ /g, '_'))}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{t(option.description.toLowerCase().replace(/ /g, '_'))}</div>
              </button>
            ))}
          </div>
        </div>

        {type === 'review' && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">{t('submission_rating_label')}</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-colors ${star <= rating ? 'text-amber-400' : 'text-neutral-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {type === 'edit_suggestion' ? t('submission_describe_changes') : t('submission_your_message')}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            rows={4}
            required
            placeholder={
              type === 'edit_suggestion'
                ? t('submission_placeholder_edit')
                : type === 'review'
                ? t('submission_placeholder_review')
                : t('submission_placeholder_default')
            }
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" loading={submitting} className="w-full">
          {t('submission_submit_btn')}
        </Button>
      </form>
      </>
    )}
  </Card>
  )
}

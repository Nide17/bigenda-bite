'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import type { SubmissionType } from '@/types'

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
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Submission failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-lg font-semibold text-primary mb-2">Thank you!</h3>
          <p className="text-neutral-600">Your submission has been sent for review.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-primary mb-4">Contribute to this page</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">What would you like to do?</label>
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
                <div className="text-sm font-medium">{option.label}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {type === 'review' && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Rating</label>
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
            {type === 'edit_suggestion' ? 'Describe the changes you suggest' : 'Your message'}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border border-neutral-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            rows={4}
            required
            placeholder={
              type === 'edit_suggestion'
                ? 'e.g., The fee amount is outdated, should be 1,500 RWF...'
                : type === 'review'
                ? 'Share your experience...'
                : 'Your comment or additional information...'
            }
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" loading={submitting} className="w-full">
          Submit for Review
        </Button>
      </form>
    </Card>
  )
}

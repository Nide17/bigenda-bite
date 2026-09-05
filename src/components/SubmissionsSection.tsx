'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import type { UserSubmission, SubmissionType } from '@/types'

interface SubmissionsSectionProps {
  contentType: string
  contentId: string
  contentSlug?: string | undefined
}

const typeConfig: Record<SubmissionType, { label: string; variant: 'info' | 'warning' | 'success' | 'neutral'; icon: string }> = {
  comment: { label: 'Comment', variant: 'info', icon: '💬' },
  edit_suggestion: { label: 'Edit Suggestion', variant: 'warning', icon: '✏️' },
  additional_info: { label: 'Additional Info', variant: 'success', icon: 'ℹ️' },
  review: { label: 'Review', variant: 'neutral', icon: '⭐' },
}

export default function SubmissionsSection({ contentType, contentId }: SubmissionsSectionProps) {
  const [submissions, setSubmissions] = useState<UserSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const params = new URLSearchParams({ contentType, contentId })
        const res = await fetch(`/api/submissions?${params}`)
        if (res.ok) {
          const data = await res.json()
          setSubmissions(data)
        }
      } catch (error) {
        console.error('Failed to fetch submissions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [contentType, contentId])

  if (loading) {
    return (
      <div className="mt-8 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-neutral-200 rounded-xl p-5 animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-1/4 mb-3" />
            <div className="h-4 bg-neutral-200 rounded w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (submissions.length === 0) {
    return null
  }

  return (
    <div className="mt-8 pt-8 border-t border-neutral-200">
      <h2 className="text-xl font-semibold text-primary mb-4">Community Contributions</h2>
      <div className="space-y-3">
        {submissions.map((submission) => {
          const config = typeConfig[submission.type]
          return (
            <Card key={submission._id} className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">{config.icon}</span>
                    <Badge variant={config.variant} className="text-xs">
                      {config.label}
                    </Badge>
                    <span className="text-xs text-neutral-500">
                      by {submission.userDisplayName}
                    </span>
                    {submission.rating && (
                      <span className="text-xs text-amber-600">
                        {'★'.repeat(submission.rating)}{'☆'.repeat(5 - submission.rating)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-700 whitespace-pre-wrap">{submission.text}</p>
                  {submission.suggestedFields && Object.keys(submission.suggestedFields).length > 0 && (
                    <div className="mt-2 p-3 bg-neutral-50 rounded-lg">
                      <p className="text-xs font-medium text-neutral-600 mb-1">Suggested changes:</p>
                      <pre className="text-xs text-neutral-700 whitespace-pre-wrap">
                        {JSON.stringify(submission.suggestedFields, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

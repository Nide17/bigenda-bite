'use client'

import { useState } from 'react'
import type { UserSubmission } from '@/types'

interface AdminClientProps {
  submissions: UserSubmission[]
}

export default function AdminClient({ submissions: initialSubmissions }: AdminClientProps) {
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'published'>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({})

  const filtered = filter === 'all' ? submissions : submissions.filter((s) => s.status === filter)

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'publish') => {
    setActionLoading(id)
    try {
      const res = await fetch(`/api/admin/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, id, reviewNote: reviewNote[id] || '' }),
      })

      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) => {
            if (s._id !== id) return s
            const update: Record<string, unknown> = { status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'published' }
            if (action === 'publish') update.publishedAt = new Date().toISOString()
            return { ...s, ...update }
          })
        )
      }
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const pendingCount = submissions.filter((s) => s.status === 'pending').length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected', 'published'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:border-primary'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              {status === 'pending' && pendingCount > 0 && (
                <span className="ml-2 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            No submissions found.
          </div>
        ) : (
          filtered.map((submission) => (
            <div
              key={submission._id}
              className="bg-white border border-neutral-200 rounded-xl p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-primary">
                      {submission.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {submission.contentType} / {submission.contentId}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        submission.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : submission.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : submission.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {submission.status}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-900 mb-2">{submission.text}</p>
                  {submission.suggestedFields && Object.keys(submission.suggestedFields).length > 0 && (
                    <div className="mb-3 p-3 bg-neutral-50 rounded-lg">
                      <p className="text-xs font-medium text-neutral-600 mb-1">Suggested changes:</p>
                      <pre className="text-xs text-neutral-700 whitespace-pre-wrap">
                        {JSON.stringify(submission.suggestedFields, null, 2)}
                      </pre>
                    </div>
                  )}
                  {submission.rating && (
                    <p className="text-sm text-amber-600 mb-2">
                      {'★'.repeat(submission.rating)}{'☆'.repeat(5 - submission.rating)}
                    </p>
                  )}
                  <div className="text-xs text-neutral-500">
                    By {submission.userDisplayName} ({submission.userEmail}) on{' '}
                    {new Date(submission.createdAt).toLocaleString()}
                  </div>
                </div>
                {submission.status === 'pending' && (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={reviewNote[submission._id] || ''}
                      onChange={(e) => setReviewNote((prev) => ({ ...prev, [submission._id]: e.target.value }))}
                      placeholder="Review note (optional)"
                      className="w-48 text-xs border border-neutral-300 rounded p-2"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(submission._id, 'approve')}
                        disabled={actionLoading === submission._id}
                        className="px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(submission._id, 'reject')}
                        disabled={actionLoading === submission._id}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                      {submission.type === 'edit_suggestion' && (
                        <button
                          onClick={() => handleAction(submission._id, 'publish')}
                          disabled={actionLoading === submission._id}
                          className="px-3 py-1.5 bg-primary text-white text-xs rounded hover:bg-primary-hover disabled:opacity-50"
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

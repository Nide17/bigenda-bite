'use client'

import { useState } from 'react'
import type { UserSubmission } from '@/types'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface AdminClientProps {
  submissions: UserSubmission[]
}

export default function AdminClient({ submissions: initialSubmissions }: AdminClientProps) {
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'published'>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({})

  const filtered = filter === 'all' ? submissions : submissions.filter((s) => s.status === filter)
  const pendingCount = submissions.filter((s) => s.status === 'pending').length

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
        toast.success(`Submission ${action}d successfully`)
      } else {
        toast.error(`Failed to ${action} submission`)
      }
    } catch {
      toast.error('Action failed. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'pending', 'approved', 'rejected', 'published'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-[#1e1b4b] text-white'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:border-[#1e1b4b] hover:text-[#1e1b4b]'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              {status === 'pending' && pendingCount > 0 && (
                <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  filter === status ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-700'
                }`}>
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
        <p className="text-sm text-neutral-500">
          Showing {filtered.length} of {submissions.length} submissions
        </p>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-neutral-600">No submissions found.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((submission) => (
            <Card key={submission._id} className="p-0 overflow-hidden">
              <div className="p-5 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-[#1e1b4b] uppercase tracking-wide">
                        {submission.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {submission.contentType} / {submission.contentId}
                      </span>
                      <Badge
                        variant={
                          submission.status === 'pending'
                            ? 'warning'
                            : submission.status === 'approved' || submission.status === 'published'
                              ? 'success'
                              : 'error'
                        }
                      >
                        {submission.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-neutral-900 mb-3 whitespace-pre-wrap">{submission.text}</p>

                    {submission.suggestedFields && Object.keys(submission.suggestedFields).length > 0 && (
                      <div className="mb-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
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
                    <div className="flex flex-col gap-2 lg:ml-4 lg:min-w-[12rem]">
                      <textarea
                        value={reviewNote[submission._id] || ''}
                        onChange={(e) => setReviewNote((prev) => ({ ...prev, [submission._id]: e.target.value }))}
                        placeholder="Review note (optional)"
                        className="w-full text-xs border border-neutral-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#1e1b4b]/10 focus:border-[#1e1b4b]"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1"
                          loading={actionLoading === submission._id}
                          onClick={() => handleAction(submission._id, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="flex-1"
                          loading={actionLoading === submission._id}
                          onClick={() => handleAction(submission._id, 'reject')}
                        >
                          Reject
                        </Button>
                      </div>
                      {submission.type === 'edit_suggestion' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          loading={actionLoading === submission._id}
                          onClick={() => handleAction(submission._id, 'publish')}
                        >
                          Publish
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

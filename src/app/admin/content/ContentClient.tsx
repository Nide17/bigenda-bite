'use client'

import { useState } from 'react'
import type { PendingUpdate } from '@/types'
import { toast } from 'sonner'
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default function ContentClient({ items }: { items: PendingUpdate[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  async function handleAction(updateId: string, action: 'approve' | 'reject') {
    setLoadingId(updateId)

    try {
      const res = await fetch(`/api/admin/pending-updates/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updateId }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Failed to ${action}`)
      }

      toast.success(`Successfully ${action === 'approve' ? 'approved' : 'rejected'} content.`)
      setTimeout(() => window.location.reload(), 800)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to ${action}`)
    } finally {
      setLoadingId(null)
    }
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { variant: 'warning' as const, label: 'Pending' }
      case 'approved':
        return { variant: 'success' as const, label: 'Approved' }
      case 'rejected':
        return { variant: 'error' as const, label: 'Rejected' }
      default:
        return { variant: 'neutral' as const, label: status }
    }
  }

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-neutral-600">No content items found.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isExpanded = expandedIds.has(item._id)
        const status = getStatusColor(item.status || 'pending')
        const confidence = Math.round((item.confidenceScore ?? 0) * 100)

        return (
          <Card key={item._id} className="p-0 overflow-hidden">
            <div className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-semibold text-[#1e1b4b] font-mono text-xs sm:text-sm">{item.documentId}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                    <span className="capitalize">{item.collection}</span>
                    <span>{new Date(item.detectedAt ?? new Date().toISOString()).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={confidence >= 80 ? 'success' : confidence >= 50 ? 'warning' : 'error'}>
                    {confidence}% match
                  </Badge>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-medium text-neutral-500 mb-1">Diff Summary</p>
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
                  {item.diffSummary}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => toggleExpand(item._id)}
                  className="inline-flex items-center gap-1 text-sm text-[#1e1b4b] hover:text-[#312e6b] font-medium"
                >
                  {isExpanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
                  {isExpanded ? 'Hide details' : 'View details'}
                </button>

                {item.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      loading={loadingId === item._id}
                      onClick={() => handleAction(item._id, 'approve')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      loading={loadingId === item._id}
                      onClick={() => handleAction(item._id, 'reject')}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>

              {isExpanded && (
                <div className="mt-4">
                  <pre className="rounded-lg border border-neutral-200 bg-white p-4 overflow-auto text-xs text-neutral-700">
                    {JSON.stringify(item, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}

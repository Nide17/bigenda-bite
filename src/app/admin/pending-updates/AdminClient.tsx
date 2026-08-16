'use client'

import { useState } from 'react'

export interface PendingUpdate {
  _id: string
  collection: string
  documentId: string
  update: Record<string, unknown>
  status: string
  confidenceScore: number
  diffSummary: string
  sourceProcessId: string
  detectedAt: string
  currentSanityDoc: Record<string, unknown> | null
}

export default function AdminClient({ updates }: { updates: PendingUpdate[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleAction(updateId: string, action: 'approve' | 'reject') {
    setLoadingId(updateId)
    setMessage(null)

    try {
      const res = await fetch(`/api/admin/pending-updates/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updateId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || `Failed to ${action}`)
      }

      setMessage(`Successfully ${action === 'approve' ? 'approved' : 'rejected'} update.`)
      window.location.reload()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Failed to ${action}`)
    } finally {
      setLoadingId(null)
    }
  }

  if (updates.length === 0) {
    return <p className="text-gray-600">No pending updates at this time.</p>
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">{message}</div>
      )}

      {updates.map((update) => (
        <div key={update._id} className="border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">
                {(update.update as any)?.translations?.en?.title || update.documentId}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Detected: {new Date(update.detectedAt).toLocaleString()} | Confidence:{' '}
                {Math.round((update.confidenceScore || 0) * 100)}%
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
              {update.status}
            </span>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Diff Summary</h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded">{update.diffSummary}</p>
          </div>

          {update.currentSanityDoc && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Current Sanity Content</h4>
              <pre className="p-4 bg-yellow-50 border border-yellow-200 rounded overflow-auto text-sm">
                {JSON.stringify(update.currentSanityDoc, null, 2)}
              </pre>
            </div>
          )}

          <details className="mb-4">
            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
              View full proposed update
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-sm">
              {JSON.stringify(update.update, null, 2)}
            </pre>
          </details>

          <div className="flex gap-3">
            <button
              onClick={() => handleAction(update._id, 'approve')}
              disabled={loadingId === update._id}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loadingId === update._id ? 'Processing...' : 'Approve'}
            </button>
            <button
              onClick={() => handleAction(update._id, 'reject')}
              disabled={loadingId === update._id}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {loadingId === update._id ? 'Processing...' : 'Reject'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

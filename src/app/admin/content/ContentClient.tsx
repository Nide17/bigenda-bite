'use client'

import { useState } from 'react'

export interface ContentItem {
  _id: string
  collection: string
  documentId: string
  status: string
  confidenceScore: number
  diffSummary: string
  detectedAt: string
  approvedAt: string | null
  rejectedAt: string | null
}

export default function ContentClient({ items }: { items: ContentItem[] }) {
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
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Failed to ${action}`)
      }

      setMessage(`Successfully ${action === 'approve' ? 'approved' : 'rejected'} content.`)
      window.location.reload()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Failed to ${action}`)
    } finally {
      setLoadingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">{message}</div>
      )}

      {items.length === 0 ? (
        <p className="text-gray-600">No content items found.</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Document ID</th>
                <th className="text-left p-3">Collection</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Confidence</th>
                <th className="text-left p-3">Detected</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-3 font-mono text-xs">{item.documentId}</td>
                  <td className="p-3">{item.collection}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3">{Math.round((item.confidenceScore || 0) * 100)}%</td>
                  <td className="p-3">{new Date(item.detectedAt).toLocaleString()}</td>
                  <td className="p-3">
                    {item.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(item._id, 'approve')}
                          disabled={loadingId === item._id}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-xs"
                        >
                          {loadingId === item._id ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleAction(item._id, 'reject')}
                          disabled={loadingId === item._id}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-xs"
                        >
                          {loadingId === item._id ? 'Processing...' : 'Reject'}
                        </button>
                      </div>
                    )}
                    {item.status === 'approved' && (
                      <span className="text-xs text-green-600">Published to Sanity</span>
                    )}
                    {item.status === 'rejected' && (
                      <span className="text-xs text-red-600">Rejected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}



'use client'

import { useState } from 'react'

export interface AdRecord {
  _id: string
  title: string
  placement: string
  city: string
  linkUrl: string
  imageUrl: string
  active: boolean
  impressions: number
  clicks: number
  startDate: string | null
  endDate: string | null
}

export default function AdsClient({ ads }: { ads: AdRecord[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingAd, setEditingAd] = useState<AdRecord | null>(null)

  const [form, setForm] = useState({
    title: '',
    placement: 'sidebar',
    city: '',
    linkUrl: '',
    imageUrl: '',
    active: true,
    startDate: '',
    endDate: '',
  })

  function openCreate() {
    setEditingAd(null)
    setForm({
      title: '',
      placement: 'sidebar',
      city: '',
      linkUrl: '',
      imageUrl: '',
      active: true,
      startDate: '',
      endDate: '',
    })
    setShowForm(true)
  }

  function openEdit(ad: AdRecord) {
    setEditingAd(ad)
    setForm({
      title: ad.title,
      placement: ad.placement,
      city: ad.city,
      linkUrl: ad.linkUrl,
      imageUrl: ad.imageUrl,
      active: ad.active,
      startDate: ad.startDate ? ad.startDate.slice(0, 10) : '',
      endDate: ad.endDate ? ad.endDate.slice(0, 10) : '',
    })
    setShowForm(true)
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault()
    setLoadingId(editingAd ? editingAd._id : 'new')
    setMessage(null)

    try {
      const url = editingAd ? `/api/admin/ads?id=${editingAd._id}` : '/api/admin/ads'
      const method = editingAd ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Failed to ${editingAd ? 'update' : 'create'} ad`)
      }

      setMessage(`Ad ${editingAd ? 'updated' : 'created'} successfully`)
      setShowForm(false)
      window.location.reload()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Failed to ${editingAd ? 'update' : 'create'} ad`)
    } finally {
      setLoadingId(null)
    }
  }

  async function deleteAd(adId: string) {
    if (!confirm('Are you sure you want to delete this ad?')) return

    setLoadingId(adId)
    setMessage(null)

    try {
      const res = await fetch(`/api/admin/ads?id=${adId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete ad')
      }

      setMessage('Ad deleted successfully')
      window.location.reload()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to delete ad')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">{message}</div>
      )}

      {showForm && (
        <div className="border rounded p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">{editingAd ? 'Edit Ad' : 'Create New Ad'}</h2>
          <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Placement</label>
              <select
                value={form.placement}
                onChange={(e) => setForm({ ...form, placement: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="sidebar">Sidebar</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="inline">Inline</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Link URL</label>
              <input
                type="url"
                value={form.linkUrl}
                onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              <label htmlFor="active" className="text-sm">Active</label>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={loadingId !== null}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loadingId !== null ? 'Saving...' : editingAd ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="flex justify-end">
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Ad
          </button>
        </div>
      )}

      <div className="overflow-x-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Placement</th>
              <th className="text-left p-3">City</th>
              <th className="text-left p-3">Link</th>
              <th className="text-left p-3">Image</th>
              <th className="text-left p-3">Active</th>
              <th className="text-left p-3">Stats</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-gray-500 text-center">No ads found</td>
              </tr>
            ) : (
              ads.map((ad) => (
                <tr key={ad._id} className="border-t">
                  <td className="p-3">{ad.title}</td>
                  <td className="p-3">{ad.placement}</td>
                  <td className="p-3">{ad.city || '-'}</td>
                  <td className="p-3">
                    <a href={ad.linkUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate block max-w-xs">
                      {ad.linkUrl}
                    </a>
                  </td>
                  <td className="p-3">
                    <a href={ad.imageUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate block max-w-xs">
                      {ad.imageUrl}
                    </a>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${ad.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {ad.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="text-xs">
                      <div>{ad.impressions} impressions</div>
                      <div>{ad.clicks} clicks</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(ad)}
                        disabled={loadingId === ad._id}
                        className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteAd(ad._id)}
                        disabled={loadingId === ad._id}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}



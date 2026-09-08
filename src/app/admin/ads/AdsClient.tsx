'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { PlusIcon, PencilIcon, Trash2Icon, ExternalLinkIcon } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

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

      toast.success(`Ad ${editingAd ? 'updated' : 'created'} successfully`)
      setShowForm(false)
      setTimeout(() => window.location.reload(), 800)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to ${editingAd ? 'update' : 'create'} ad`)
    } finally {
      setLoadingId(null)
    }
  }

  async function deleteAd(adId: string) {
    if (!confirm('Are you sure you want to delete this ad?')) return

    setLoadingId(adId)

    try {
      const res = await fetch(`/api/admin/ads?id=${adId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete ad')
      }

      toast.success('Ad deleted successfully')
      setTimeout(() => window.location.reload(), 800)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete ad')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {showForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#1e1b4b]">{editingAd ? 'Edit Ad' : 'Create New Ad'}</h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-neutral-500 hover:text-neutral-900"
            >
              Cancel
            </button>
          </div>
          <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e1b4b]/10 focus:border-[#1e1b4b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Placement</label>
              <select
                value={form.placement}
                onChange={(e) => setForm({ ...form, placement: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e1b4b]/10 focus:border-[#1e1b4b]"
              >
                <option value="sidebar">Sidebar</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="inline">Inline</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e1b4b]/10 focus:border-[#1e1b4b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Link URL</label>
              <input
                type="url"
                value={form.linkUrl}
                onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                required
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e1b4b]/10 focus:border-[#1e1b4b]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Image URL</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                required
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e1b4b]/10 focus:border-[#1e1b4b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e1b4b]/10 focus:border-[#1e1b4b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e1b4b]/10 focus:border-[#1e1b4b]"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="rounded border-neutral-300 text-[#1e1b4b] focus:ring-[#1e1b4b]"
              />
              <label htmlFor="active" className="text-sm text-neutral-700">Active</label>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <Button type="submit" variant="primary" loading={loadingId !== null}>
                {editingAd ? 'Update' : 'Create'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {!showForm && (
        <div className="flex justify-end">
          <Button variant="primary" onClick={openCreate}>
            <PlusIcon className="h-4 w-4" />
            Create Ad
          </Button>
        </div>
      )}

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left p-3 font-semibold text-neutral-700">Title</th>
                <th className="text-left p-3 font-semibold text-neutral-700">Placement</th>
                <th className="text-left p-3 font-semibold text-neutral-700">City</th>
                <th className="text-left p-3 font-semibold text-neutral-700">Link</th>
                <th className="text-left p-3 font-semibold text-neutral-700">Image</th>
                <th className="text-left p-3 font-semibold text-neutral-700">Active</th>
                <th className="text-left p-3 font-semibold text-neutral-700">Stats</th>
                <th className="text-left p-3 font-semibold text-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {ads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-neutral-500 text-center">No ads found</td>
                </tr>
              ) : (
                ads.map((ad) => (
                  <tr key={ad._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3 font-medium text-neutral-900">{ad.title}</td>
                    <td className="p-3 capitalize">{ad.placement}</td>
                    <td className="p-3">{ad.city || '-'}</td>
                    <td className="p-3">
                      <a href={ad.linkUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#1e1b4b] hover:text-[#312e6b] text-xs truncate max-w-[10rem]">
                        <ExternalLinkIcon className="h-3 w-3 shrink-0" />
                        <span className="truncate">{ad.linkUrl}</span>
                      </a>
                    </td>
                    <td className="p-3">
                      <a href={ad.imageUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#1e1b4b] hover:text-[#312e6b] text-xs truncate max-w-[10rem]">
                        <ExternalLinkIcon className="h-3 w-3 shrink-0" />
                        <span className="truncate">Image</span>
                      </a>
                    </td>
                    <td className="p-3">
                      <Badge variant={ad.active ? 'success' : 'neutral'}>
                        {ad.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="text-xs text-neutral-600">
                        <div>{ad.impressions.toLocaleString()} impressions</div>
                        <div>{ad.clicks.toLocaleString()} clicks</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          loading={loadingId === ad._id}
                          onClick={() => openEdit(ad)}
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          loading={loadingId === ad._id}
                          onClick={() => deleteAd(ad._id)}
                        >
                          <Trash2Icon className="h-4 w-4 text-red-600" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

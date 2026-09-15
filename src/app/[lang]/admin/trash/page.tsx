'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import PageContainer from '@/components/PageContainer'
import { useTranslations } from '@/components/I18nProvider'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

interface DeletedDoc {
  _id: string
  _type: string
  deletedAt?: string
  translations?: Record<string, { title?: string; summary?: string }>
}

export default function AdminTrashPage() {
  const t = useTranslations()
  const pathname = usePathname() || ''
  const lang = pathname.split('/')[1] || 'en'
  const [docs, setDocs] = useState<DeletedDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/sanity/trash', { method: 'GET' })
      if (!res.ok) throw new Error('Failed to load trash')
      const data = await res.json()
      setDocs(data.documents || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load trash')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function restore(id: string) {
    try {
      const res = await fetch('/api/sanity/studio-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore', type: 'process', id }),
      })
      if (res.ok) {
        load()
      } else {
        setError('Failed to restore document')
      }
    } catch {
      setError('Failed to restore document')
    }
  }

  async function hardDelete(id: string) {
    if (!confirm(t('trash_hard_delete_confirm'))) return
    try {
      const res = await fetch('/api/sanity/studio-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'hard_delete', type: 'process', id }),
      })
      if (res.ok) {
        load()
      } else {
        setError('Failed to permanently delete document')
      }
    } catch {
      setError('Failed to permanently delete document')
    }
  }

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">{t('trash_title')}</h1>
        <p className="text-neutral-600 mt-1">{t('trash_subtitle')}</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-neutral-500">{t('trash_loading')}</p>
      ) : docs.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-neutral-600">{t('trash_empty')}</p>
        </Card>
      ) : (
        <div className="rounded-xl border border-neutral-200 bg-white divide-y divide-neutral-100">
          {docs.map((doc) => (
            <div key={doc._id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-neutral-900">
                  {doc.translations?.en?.title || doc.translations?.[lang]?.title || doc._id}
                </p>
                <p className="truncate text-xs text-neutral-500">
                  {doc._type} · {doc._id} · {t('trash_deleted_at', { date: doc.deletedAt ? new Date(doc.deletedAt).toLocaleDateString() : '' })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => restore(doc._id)}>
                  {t('trash_restore')}
                </Button>
                <Button variant="danger" size="sm" onClick={() => hardDelete(doc._id)}>
                  {t('trash_hard_delete')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
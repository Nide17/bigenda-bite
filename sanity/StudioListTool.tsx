'use client'
import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@sanity/client'
import {
  DocumentIcon,
  DocumentTextIcon,
  ErrorOutlineIcon,
  AddIcon,
  SearchIcon,
} from '@sanity/icons'

const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fallback',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

const DOCUMENT_TYPES = [
  { name: 'process', title: 'Official Process', icon: DocumentTextIcon, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'guide', title: 'How-To Guide', icon: DocumentIcon, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { name: 'alert', title: 'Alert', icon: ErrorOutlineIcon, color: 'bg-amber-50 text-amber-700 border-amber-200' },
]

export default function StudioListTool() {
  const [selectedType, setSelectedType] = useState('process')
  const [documents, setDocuments] = useState<Array<{_id: string; translations?: Record<string, { title?: string }>; status?: string}>>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadDocuments = useCallback(async (type?: string) => {
    if (!type) return
    setLoading(true)
    try {
      const docs = await readClient.fetch(
        '*[_type == $type] | order(_createdAt desc)[0...100]',
        { type }
      )
      setDocuments(docs)
    } catch (e) {
      console.error('Failed to load documents', e)
    } finally {
      setLoading(false)
    }
  }, [])

  const onTypeChange = useCallback((type: string) => {
    setSelectedType(type)
    setSearch('')
    loadDocuments(type)
  }, [loadDocuments])

  useEffect(() => {
    loadDocuments(selectedType)
    // Data load on mount and when selectedType changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [loadDocuments, selectedType])

  const filtered = documents.filter((doc) => {
    const title = doc.translations?.en?.title || ''
    return title.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="p-4 h-full">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1e1b4b]">Content</h1>
            <p className="text-sm text-neutral-500">Browse, search, and create content.</p>
          </div>
          <CreateButton selectedType={selectedType} onCreated={loadDocuments} />
        </div>

        <div className="flex gap-2 mb-4">
          {DOCUMENT_TYPES.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.name}
                className={
                  'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ' +
                  (selectedType === t.name ? t.color : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300')
                }
                onClick={() => onTypeChange(t.name)}
              >
                <Icon className="h-4 w-4" />
                {t.title}
              </button>
            )
          })}
        </div>

        <div className="mb-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="w-full rounded-lg border border-neutral-200 pl-9 pr-3 py-2 text-sm outline-none focus:border-[#1e1b4b] focus:ring-2 focus:ring-[#1e1b4b]/10"
            />
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white">
          {loading ? (
            <div className="p-6 text-center text-sm text-neutral-500">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center text-sm text-neutral-500">No documents found.</div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {filtered.map((doc) => (
                <a
                  key={doc._id}
                  href={`/studio/content/${selectedType};${doc._id}?mode=edit`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {doc.translations?.en?.title || doc._id}
                    </p>
                    <p className="truncate text-xs text-neutral-500">{doc._id}</p>
                  </div>
                  {doc.status && (
                    <span className="ml-3 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize">
                      {doc.status}
                    </span>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CreateButton({ selectedType, onCreated }: { selectedType: string; onCreated: (type?: string) => void }) {
  const [creating, setCreating] = useState(false)

  async function createDocument() {
    setCreating(true)
    try {
      const title = prompt('Enter title:')
      if (!title) return
      const res = await fetch('/api/sanity/studio-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          type: selectedType,
          data: {
            status: 'published',
            translations: {
              en: { title, summary: '' },
              fr: { title, summary: '' },
              rw: { title, summary: '' },
            },
          },
        }),
      })
      if (res.ok) {
        alert('Created successfully')
        onCreated(selectedType)
      } else {
        alert('Failed to create document')
      }
    } catch (e) {
      console.error('Failed to create document', e)
      alert('Failed to create document')
    } finally {
      setCreating(false)
    }
  }

  return (
    <button
      className="inline-flex items-center gap-2 rounded-lg bg-[#1e1b4b] px-3 py-2 text-sm font-medium text-white hover:bg-[#2d2a63] disabled:opacity-60"
      onClick={createDocument}
      disabled={creating}
    >
      <AddIcon className="h-4 w-4" />
      {creating ? 'Creating...' : 'Create new'}
    </button>
  )
}

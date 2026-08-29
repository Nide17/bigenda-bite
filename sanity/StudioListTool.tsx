'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@sanity/client'

const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fallback',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

const DOCUMENT_TYPES = [
  { name: 'process', title: 'Official Process' },
  { name: 'guide', title: 'How-To Guide' },
  { name: 'alert', title: 'Alert' },
]

export default function StudioListTool() {
  const [documents, setDocuments] = useState<Array<{_id: string; translations?: Record<string, { title?: string }>}>>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState('process')
  const [creating, setCreating] = useState(false)
  const initialized = useRef(false)

  const loadDocuments = useCallback(async () => {
    setLoading(true)
    try {
      const docs = await readClient.fetch('*[_type == $type] | order(_createdAt desc)', { type: selectedType })
      setDocuments(docs)
    } catch (e) {
      console.error('Failed to load documents', e)
    } finally {
      setLoading(false)
    }
  }, [selectedType])

  if (!initialized.current) {
    initialized.current = true
    loadDocuments()
  }

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
        const result = await res.json()
        alert('Created: ' + result.document._id)
        loadDocuments()
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
    <div className="p-4 h-full">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Content</h1>
        <div className="flex gap-2">
          {DOCUMENT_TYPES.map((t) => (
            <button
              key={t.name}
              className={"px-3 py-1.5 rounded " + (selectedType === t.name ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800')}
              onClick={() => setSelectedType(t.name)}
            >
              {t.title}
            </button>
          ))}
        </div>
        <button
          className="px-3 py-1.5 bg-green-600 text-white rounded"
          onClick={createDocument}
          disabled={creating}
        >
          {creating ? 'Creating...' : 'Create new'}
        </button>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc._id} className="p-3 bg-white shadow rounded border">
                {doc.translations?.en?.title || doc._id}
              </div>
            ))}
            {documents.length === 0 && <p className="text-gray-500">No documents found.</p>}
          </div>
        )}
      </div>
    </div>
  )
}



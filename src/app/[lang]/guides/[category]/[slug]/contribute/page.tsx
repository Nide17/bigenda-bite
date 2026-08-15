'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from '@/components/I18nProvider'

export default function ContributePage() {
  const params = useParams()
  const lang = params.lang as string
  const [text, setText] = useState('')
  const [city, setCity] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const t = useTranslations('common')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/contributions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, city }),
    })

    if (res.ok) {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-2xl font-bold">Thank you!</h1>
        <p>Your tip has been submitted for review.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Add a Community Tip</h1>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium">Your tip</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">City (optional)</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit Tip
        </button>
      </form>
    </main>
  )
}

'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface LeadFormProps {
  businessId: string
  businessName: string
}

export default function LeadForm({ businessId, businessName }: LeadFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          contactName: name,
          contactPhone: phone,
          message,
          source: 'directory_page',
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to send message')
      }

      setStatus('success')
      setName('')
      setPhone('')
      setMessage('')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="text-center">
          <div className="text-4xl mb-3">✓</div>
          <h3 className="text-lg font-semibold text-green-800 mb-1">Message sent!</h3>
          <p className="text-sm text-green-700 mb-4">
            {businessName} will receive your message and contact you soon.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatus('idle')}
          >
            Send another message
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-primary-light border-primary/10">
      <h2 className="text-xl font-semibold text-primary mb-2">Contact this business</h2>
      <p className="text-sm text-neutral-600 mb-4">
        Send a message directly to {businessName}. They will get back to you shortly.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Your name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            disabled={status === 'loading'}
          />
          <Input
            label="Your phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+250788000000"
            required
            disabled={status === 'loading'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell them what you need..."
            rows={4}
            className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            required
            disabled={status === 'loading'}
          />
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}
        <Button type="submit" size="lg" loading={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Card>
  )
}

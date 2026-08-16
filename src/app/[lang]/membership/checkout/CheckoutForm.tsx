'use client'

import { useState } from 'react'
import { useTrackEvent } from '@/lib/use-analytics'

const PLANS: Record<string, { id: string; name: string; price: number; features: string[] }> = {
  basic: { id: 'basic', name: 'Basic', price: 2000, features: ['Verified badge', 'Contact button', 'Better placement'] },
  pro: { id: 'pro', name: 'Pro', price: 5000, features: ['Lead form + analytics', 'Featured spot', 'Priority support'] },
}

export default function CheckoutForm({ planId }: { planId: string }) {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle')
  const [transactionId, setTransactionId] = useState('')
  const [error, setError] = useState('')

  const plan = PLANS[planId] || PLANS.basic
  const trackPayment = useTrackEvent('payment_initiated', { planId: plan.id, amount: plan.price })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    trackPayment()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/momo/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          amount: plan.price,
          phoneNumber: phone.replace(/^\+/, ''),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Payment initiation failed')
      setTransactionId(data.transactionId)
      setStatus('pending')
      pollStatus(data.transactionId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  const pollStatus = async (tid: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/momo/status?transactionId=${tid}`)
        const data = await res.json()
        if (data.status === 'SUCCESSFUL') {
          clearInterval(interval)
          setStatus('success')
          setLoading(false)
          setTimeout(() => { window.location.href = '/en/membership' }, 2000)
        } else if (data.status === 'FAILED' || data.status === 'CANCELLED') {
          clearInterval(interval)
          setStatus('failed')
          setLoading(false)
        }
      } catch { /* keep polling */ }
    }, 3000)
    setTimeout(() => clearInterval(interval), 5 * 60 * 1000)
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Checkout - {plan.name}</h1>
      {status === 'success' && (
        <div className="max-w-md p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800">Payment successful! Redirecting...</p>
        </div>
      )}
      {status === 'failed' && (
        <div className="max-w-md p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">Payment failed or cancelled. Please try again.</p>
        </div>
      )}
      {status === 'idle' && (
        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{plan.name} Plan</h2>
            <p className="text-2xl font-bold">{plan.price.toLocaleString()} RWF</p>
            <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
              {plan.features.map((feature) => (<li key={feature}>{feature}</li>))}
            </ul>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <label className="block text-sm font-medium">Phone Number (MTN MoMo)</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+250788000000" className="mt-1 block w-full border rounded p-2" required disabled={loading} />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded" disabled={loading}>
            {loading ? 'Processing...' : `Pay ${plan.price.toLocaleString()} RWF`}
          </button>
        </form>
      )}
    </main>
  )
}
'use client'

import { useState } from 'react'
import { useTrackEvent } from '@/lib/use-analytics'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-md">
        {status === 'success' && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-primary mb-2">Payment Successful!</h2>
            <p className="text-neutral-600 mb-6">Your membership is being activated. Redirecting...</p>
            <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }} />
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-primary mb-2">Payment Failed</h2>
            <p className="text-neutral-600 mb-6">The transaction was cancelled or failed. Please try again.</p>
            <Button onClick={() => setStatus('idle')} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {status === 'idle' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-primary mb-1">Checkout</h1>
              <p className="text-sm text-neutral-600">Complete your payment to activate your membership</p>
            </div>

            <div className="bg-primary-light border border-primary/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-primary">{plan.name} Plan</h2>
                <Badge variant="info">Popular</Badge>
              </div>
              <p className="text-3xl font-bold text-primary mb-3">{plan.price.toLocaleString()} RWF</p>
              <ul className="space-y-1.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-neutral-700">
                    <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Phone Number (MTN MoMo)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+250788000000"
              required
              disabled={loading}
              helperText="Enter the phone number linked to your MTN MoMo account"
            />

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {loading ? 'Processing...' : `Pay ${plan.price.toLocaleString()} RWF`}
            </Button>

            <p className="text-xs text-neutral-500 text-center">
              Secured by MTN Mobile Money. You will receive a prompt on your phone to authorize the payment.
            </p>
          </form>
        )}
      </Card>
    </div>
  )
}
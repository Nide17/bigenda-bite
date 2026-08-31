'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

function ForgotPasswordFormContent({ lang }: { lang: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, lang }),
    })

    if (res.ok) {
      setSuccess(true)
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <Card className="p-6 sm:p-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-primary mb-2">Check your email</h2>
          <p className="text-sm text-neutral-600 mb-6">
            If an account exists with that email, a reset link has been sent.
          </p>
          <Button variant="outline" className="w-full" onClick={() => router.push(`/${lang}/login`)}>
            Back to sign in
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Button type="submit" className="w-full" loading={loading}>
          Send reset link
        </Button>
        <p className="text-sm text-neutral-600 text-center">
          <a href={`/${lang}/login`} className="text-primary font-medium hover:underline">
            Back to sign in
          </a>
        </p>
      </form>
    </Card>
  )
}

export default function ForgotPasswordForm({ lang }: { lang: string }) {
  return (
    <Suspense fallback={<div className="text-center text-neutral-500">Loading...</div>}>
      <ForgotPasswordFormContent lang={lang} />
    </Suspense>
  )
}

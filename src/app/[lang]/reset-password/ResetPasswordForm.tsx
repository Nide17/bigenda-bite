'use client'

import { useState, Suspense, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from '@/components/I18nProvider'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

function ResetPasswordFormContent({ lang }: { lang: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)

  const token = useMemo(() => searchParams?.get('token') || '', [searchParams])

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTokenValid(false)
      return
    }
    fetch('/api/auth/reset-password/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (res.ok) {
          setTokenValid(true)
        } else {
          setTokenValid(false)
        }
      })
      .catch(() => setTokenValid(false))
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('passwords_do_not_match'))
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    if (res.ok) {
      setSuccess(true)
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (tokenValid === false) {
    return (
      <Card className="p-6 sm:p-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-primary mb-2">Invalid or expired link</h2>
          <p className="text-sm text-neutral-600 mb-6">
            This reset link is invalid or has expired. Please request a new one.
          </p>
          <Button variant="outline" className="w-full" onClick={() => router.push(`/${lang}/forgot-password`)}>
            Request new link
          </Button>
        </div>
      </Card>
    )
  }

  if (success) {
    return (
      <Card className="p-6 sm:p-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-primary mb-2">Password reset successful</h2>
          <p className="text-sm text-neutral-600 mb-6">
            Your password has been reset. You can now sign in.
          </p>
          <Button className="w-full" onClick={() => router.push(`/${lang}/login`)}>
            Sign in
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
          label="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
        <Input
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
        <Button type="submit" className="w-full" loading={loading}>
          Reset password
        </Button>
      </form>
    </Card>
  )
}

export default function ResetPasswordForm({ lang }: { lang: string }) {
  return (
    <Suspense fallback={<div className="text-center text-neutral-500">Loading...</div>}>
      <ResetPasswordFormContent lang={lang} />
    </Suspense>
  )
}

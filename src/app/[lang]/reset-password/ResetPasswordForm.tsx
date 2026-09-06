'use client'

import { useState, Suspense, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from '@/components/I18nProvider'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

function LockIcon() {
  return (
    <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4" />
    </svg>
  )
}

function ResetPasswordFormContent({ lang }: { lang: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(() => (searchParams?.get('token') ? null : 'missing'))
  const [tokenValid, setTokenValid] = useState<boolean | null>(() => (searchParams?.get('token') ? null : false))
  const token = useMemo(() => searchParams?.get('token') || '', [searchParams])

  useEffect(() => {
    if (!token) {
      return
    }
    fetch('/api/auth/reset-password/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json().catch(() => ({})))
      .then((data) => {
        if (data && data.valid) {
          setTokenValid(true)
          setValidationError(null)
        } else {
          setTokenValid(false)
          setValidationError(data?.reason || 'invalid')
        }
      })
      .catch(() => {
        setTokenValid(false)
        setValidationError('invalid')
      })
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
      setError(data.error || t('reset_password_error'))
    }
    setLoading(false)
  }

  if (tokenValid === false) {
    let title = t('reset_password_invalid_title')
    let description = t('reset_password_invalid_text')

    if (validationError === 'expired') {
      title = t('reset_password_expired_title')
      description = t('reset_password_expired_text')
    } else if (validationError === 'used') {
      title = t('reset_password_used_title')
      description = t('reset_password_used_text')
    } else if (validationError === 'missing') {
      title = t('reset_password_missing_title')
      description = t('reset_password_missing_text')
    }

    return (
      <Card className="p-8 sm:p-10">
        <div className="text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-primary mb-2">{title}</h2>
          <p className="text-sm text-neutral-600 mb-8">{description}</p>
          <Button variant="outline" className="w-full" onClick={() => router.push(`/${lang}/forgot-password`)} size="md">
            {t('reset_password_request_new')}
          </Button>
        </div>
      </Card>
    )
  }

  if (success) {
    return (
      <Card className="p-8 sm:p-10">
        <div className="text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-primary mb-2">{t('password_reset_success')}</h2>
          <p className="text-sm text-neutral-600 mb-8">
            {t('reset_password_success_text')}
          </p>
          <Button className="w-full" onClick={() => router.push(`/${lang}/login`)} size="md">
            {t('sign_in')}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-8 sm:p-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}
        <div className="space-y-5">
          <Input
            label={t('new_password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            leftIcon={<LockIcon />}
          />
          <Input
            label={t('confirm_password')}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            leftIcon={<LockIcon />}
          />
        </div>
        <Button type="submit" className="w-full" loading={loading} size="md">
          {t('reset_password')}
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

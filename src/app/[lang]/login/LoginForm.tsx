'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useTranslations } from '@/components/I18nProvider'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4" />
    </svg>
  )
}

function LoginFormContent({ lang }: { lang: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState<'general' | 'unverified'>('general')
  const [csrfToken, setCsrfToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const callbackUrl = searchParams?.get('callbackUrl') || `/${lang}`
  const oauthError = searchParams?.get('error') || null

  useEffect(() => {
    fetch('/api/auth/csrf')
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken || ''))
      .catch(() => setCsrfToken(''))
  }, [])

  const oauthErrorMessage = oauthError === 'OAuthAccountNotLinked'
    ? 'This Google account is already linked to a different sign-in method. Please use your original sign-in method.'
    : oauthError === 'AccessDenied'
      ? t('oauth_cancelled')
      : oauthError
        ? t('oauth_error')
        : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setErrorType('general')
    setResendSuccess(false)

    const res = await fetch('/api/auth/callback/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        csrfToken,
        email,
        password,
        callbackUrl,
        redirect: 'false',
      }),
    })

    const data = await res.json().catch(() => ({}))
    const authError = (data as { error?: string }).error

    if (authError) {
      if (authError === 'email_not_verified') {
        setErrorType('unverified')
        setError('Please verify your email before signing in. Check your inbox for the verification link.')
      } else {
        setErrorType('general')
        setError('Invalid email or password')
      }
      setLoading(false)
    } else if (res.ok) {
      router.push(callbackUrl)
    } else {
      setErrorType('general')
      setError('Invalid email or password')
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setResendLoading(true)
    setResendSuccess(false)

    const res = await fetch('/api/auth/verify-email/resend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setResendSuccess(true)
    }
    setResendLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError('')
    await signIn('google', { callbackUrl })
  }

  return (
    <Card className="p-8 sm:p-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="hidden" name="csrfToken" value={csrfToken} />
        {(oauthErrorMessage || error) && (
          <div className={`rounded-xl p-4 text-sm ${errorType === 'unverified' ? 'bg-amber-50 border border-amber-200 text-amber-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            {oauthErrorMessage || error}
            {errorType === 'unverified' && !oauthErrorMessage && (
              <div className="mt-3">
                {resendSuccess ? (
                  <span className="text-green-700 font-medium">Verification email sent! Check your inbox.</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="text-amber-800 font-medium underline hover:no-underline disabled:opacity-50"
                  >
                    {resendLoading ? 'Sending...' : 'Resend verification email'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        <div className="space-y-5">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <MailIcon />
            </div>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="pl-10"
            />
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <LockIcon />
            </div>
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2.5 text-sm text-neutral-600 cursor-pointer select-none">
            <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 text-[#1e1b4b] focus:ring-[#1e1b4b]" />
            {t('remember_me')}
          </label>
          <a href={`/${lang}/forgot-password`} className="text-sm font-medium text-[#1e1b4b] hover:text-[#312e6b] hover:underline">
            {t('forgot_password')}
          </a>
        </div>
        <Button type="submit" className="w-full" loading={loading} size="lg">
          {t('login')}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-neutral-500">{t('or_continue_with_google')}</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          size="lg"
          loading={googleLoading}
          onClick={handleGoogleSignIn}
        >
          <GoogleIcon />
          {t('continue_with_google')}
        </Button>
        <p className="text-sm text-neutral-600 text-center">
          Don&apos;t have an account?{' '}
          <a href={`/${lang}/register`} className="font-medium text-[#1e1b4b] hover:text-[#312e6b] hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </Card>
  )
}

export default function LoginForm({ lang }: { lang: string }) {
  return (
    <Suspense fallback={<div className="text-center text-neutral-500">Loading...</div>}>
      <LoginFormContent lang={lang} />
    </Suspense>
  )
}

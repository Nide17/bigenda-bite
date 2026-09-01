'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from '@/components/I18nProvider'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

function VerifyEmailContent({ lang }: { lang: string }) {
  const searchParams = useSearchParams()
  const t = useTranslations()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = searchParams?.get('token')
    if (!token) {
      setStatus('error')
      setMessage('Verification token is missing.')
      return
    }

    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (res.ok) {
          setStatus('success')
          setMessage('Your email has been verified successfully!')
        } else {
          setStatus('error')
          setMessage('This verification link is invalid or has expired.')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      })
  }, [searchParams])

  if (status === 'loading') {
    return (
      <Card className="p-6 sm:p-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-primary mb-2">Verifying your email...</h2>
          <p className="text-sm text-neutral-600">Please wait while we verify your email address.</p>
        </div>
      </Card>
    )
  }

  if (status === 'success') {
    return (
      <Card className="p-6 sm:p-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-primary mb-2">Email verified!</h2>
          <p className="text-sm text-neutral-600 mb-6">{message}</p>
          <Button className="w-full" onClick={() => { window.location.href = `/${lang}/login` }}>
            Sign in
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 sm:p-8">
      <div className="text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-primary mb-2">Verification failed</h2>
        <p className="text-sm text-neutral-600 mb-6">{message}</p>
        <Button variant="outline" className="w-full" onClick={() => { window.location.href = `/${lang}/login` }}>
          Back to sign in
        </Button>
      </div>
    </Card>
  )
}

export default function VerifyEmailContentWrapper({ lang }: { lang: string }) {
  return (
    <Suspense fallback={<div className="text-center text-neutral-500">Loading...</div>}>
      <VerifyEmailContent lang={lang} />
    </Suspense>
  )
}

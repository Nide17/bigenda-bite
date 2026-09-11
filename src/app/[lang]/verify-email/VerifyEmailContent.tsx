'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTranslations } from '@/components/I18nProvider'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

function VerifyEmailContent({ lang }: { lang: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const t = useTranslations()
  const token = searchParams?.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      return
    }

    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (res.ok) {
          setStatus('success')
          setMessage((data as { message?: string })?.message || t('verify_email_success_message'))
        } else {
          setStatus('error')
          setMessage((data as { error?: string })?.error || t('verify_email_error'))
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage(t('verify_email_error'))
      })
  }, [token, t])

  if (!token && status === 'loading') {
    return (
      <Card className="p-8 sm:p-10">
        <div className="text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-primary mb-2">{t('reset_password_missing_title')}</h2>
          <p className="text-sm text-neutral-600 mb-8">{t('reset_password_missing_text')}</p>
            <Button variant="outline" className="w-full" onClick={() => router.push(`/${lang}/login`)} size="md">
              {t('forgot_password_back_to_login')}
            </Button>
        </div>
      </Card>
    )
  }

  if (status === 'loading') {
    return (
      <Card className="p-8 sm:p-10">
        <div className="text-center">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-primary mb-2">{t('verify_email_verifying_title')}</h2>
          <p className="text-sm text-neutral-600">{t('verify_email_verifying_text')}</p>
        </div>
      </Card>
    )
  }

  if (status === 'success') {
    return (
      <Card className="p-8 sm:p-10">
        <div className="text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-primary mb-2">{t('verify_email_success_title')}</h2>
          <p className="text-sm text-neutral-600 mb-8">{message}</p>
          <Button className="w-full" onClick={() => router.push(`/${lang}/login`)} size="md">
            {t('sign_in')}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-8 sm:p-10">
      <div className="text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-primary mb-2">{t('verify_email_failed_title')}</h2>
        <p className="text-sm text-neutral-600 mb-8">{message}</p>
        <Button variant="outline" className="w-full" onClick={() => router.push(`/${lang}/login`)} size="md">
          {t('forgot_password_back_to_login')}
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

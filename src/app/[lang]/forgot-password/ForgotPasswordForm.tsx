'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from '@/components/I18nProvider'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

function MailIcon() {
  return (
    <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function ForgotPasswordFormContent({ lang }: { lang: string }) {
  const router = useRouter()
  const t = useTranslations()
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
      setError(data.error || t('forgot_password_error'))
    }
    setLoading(false)
  }

  if (success) {
    return (
      <Card className="p-8 sm:p-10">
        <div className="text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-primary mb-2">{t('forgot_password_check_email_title')}</h2>
          <p className="text-sm text-neutral-600 mb-8">
            {t('forgot_password_success_text')}
          </p>
          <Button variant="outline" className="w-full" onClick={() => router.push(`/${lang}/login`)} size="md">
            {t('forgot_password_back_to_login')}
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
        <Input
          label={t('email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          leftIcon={<MailIcon />}
        />
        <Button type="submit" className="w-full" loading={loading} size="md">
          {t('send_reset_link')}
        </Button>
        <p className="text-sm text-neutral-600 text-center">
          <a href={`/${lang}/login`} className="font-medium text-[#1e1b4b] hover:text-[#312e6b] hover:underline">
            {t('forgot_password_back_to_login')}
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

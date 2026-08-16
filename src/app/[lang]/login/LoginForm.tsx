'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from '@/components/I18nProvider'

export default function LoginForm({ lang }: { lang: string }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [csrfToken, setCsrfToken] = useState('')
  const t = useTranslations('common')

  useEffect(() => {
    fetch('/api/auth/csrf')
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken || ''))
      .catch(() => setCsrfToken(''))
  }, [])

  return (
    <form
      action="/api/auth/callback/credentials"
      method="POST"
      className="w-full max-w-md space-y-4"
    >
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <input type="hidden" name="callbackUrl" value={'/' + lang} />
      <input type="hidden" name="redirect" value="false" />

      <h1 className="text-2xl font-bold">{t('login')}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          required
        />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {t('login')}
      </button>
    </form>
  )
}

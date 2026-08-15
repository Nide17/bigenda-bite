'use client'

import { signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from '@/components/I18nProvider'

export default function LoginForm({ lang }: { lang: string }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const t = useTranslations('common')

  useEffect(() => {
    const urlError = searchParams.get('error')
    if (urlError) {
      setError('Invalid email or password')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    await signIn('credentials', {
      email,
      password,
      redirect: true,
      callbackUrl: '/' + lang,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <h1 className="text-2xl font-bold">{t('login')}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
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
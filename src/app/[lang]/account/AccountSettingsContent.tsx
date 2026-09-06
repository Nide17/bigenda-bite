'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useTranslations } from '@/components/I18nProvider'
import { toast } from 'sonner'

interface UserProfile {
  displayName: string
  email: string
  role: string
  emailVerified: boolean
  isForeigner: boolean
}

export default function AccountSettingsContent({ lang }: { lang: string }) {
  const router = useRouter()
  const t = useTranslations()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isForeigner, setIsForeigner] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetch('/api/account')
      .then((res) => {
        if (res.ok) return res.json()
        if (res.status === 401) {
          router.push(`/${lang}/login?callbackUrl=/${lang}/account`)
          return null
        }
        return res.json().then((data) => { throw new Error(data.error || 'Failed to load profile') })
      })
      .then((data) => {
        if (cancelled) return
        if (data) {
          setProfile(data)
          setDisplayName(data.displayName)
          setEmail(data.email)
          setIsForeigner(data.isForeigner || false)
        }
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load profile')
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [lang, router])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)

    const res = await fetch('/api/account', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName, email, isForeigner }),
    })

    const data = await res.json().catch(() => ({} as { error?: string }))

    if (res.ok) {
      setProfile((prev) => prev ? { ...prev, displayName, email, isForeigner } : prev)
      toast.success(t('account_profile_updated'))
    } else {
      toast.error(data.error || t('account_profile_update_failed'))
    }
    setProfileLoading(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error(t('account_passwords_do_not_match'))
      return
    }

    if (newPassword.length < 8) {
      toast.error(t('account_password_min_length'))
      return
    }

    setPasswordLoading(true)

    const res = await fetch('/api/account/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    const data = await res.json().catch(() => ({} as { error?: string }))

    if (res.ok) {
      toast.success(t('account_password_changed'))
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      toast.error(data.error || t('account_password_change_failed'))
    }
    setPasswordLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {error}
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-primary mb-4">{t('account_profile_information')}</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <Input
            label={t('account_display_name')}
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <Input
            label={t('email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            helperText={!profile.emailVerified ? t('account_email_not_verified') : undefined}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">{t('account_role_label')}</span>
            <span className="text-sm font-medium text-primary capitalize">{profile.role}</span>
          </div>
          <div className="flex items-start justify-between py-3 border-t border-neutral-200">
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">{t('account_foreigner_mode')}</label>
              <p className="text-xs text-neutral-500">
                {t('account_foreigner_mode_description')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsForeigner(!isForeigner)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isForeigner ? 'bg-primary' : 'bg-neutral-300'
              }`}
              aria-checked={isForeigner}
              role="switch"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  isForeigner ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={profileLoading}>
              {t('account_save_changes')}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-primary mb-4">{t('account_change_password')}</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label={t('account_current_password')}
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <Input
            label={t('new_password')}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
          <Input
            label={t('account_confirm_new_password')}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
          <div className="flex justify-end">
            <Button type="submit" loading={passwordLoading}>
              {t('account_change_password_btn')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

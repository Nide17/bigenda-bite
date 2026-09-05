'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface UserProfile {
  displayName: string
  email: string
  role: string
  emailVerified: boolean
  isForeigner: boolean
}

export default function AccountSettingsContent({ lang }: { lang: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isForeigner, setIsForeigner] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
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
    setProfileMessage(null)

    const res = await fetch('/api/account', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName, email, isForeigner }),
    })

    const data = await res.json().catch(() => ({} as { error?: string }))

    if (res.ok) {
      setProfileMessage({ type: 'success', text: 'Profile updated successfully.' })
      setProfile((prev) => prev ? { ...prev, displayName, email, isForeigner } : prev)
    } else {
      setProfileMessage({ type: 'error', text: data.error || 'Failed to update profile.' })
    }
    setProfileLoading(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage(null)

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' })
      return
    }

    if (newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters.' })
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
      setPasswordMessage({ type: 'success', text: 'Password changed successfully.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      setPasswordMessage({ type: 'error', text: data.error || 'Failed to change password.' })
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
        <h2 className="text-lg font-semibold text-primary mb-4">Profile Information</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          {profileMessage && (
            <div className={`rounded-lg p-3 text-sm ${profileMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
              {profileMessage.text}
            </div>
          )}
          <Input
            label="Display Name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            helperText={!profile.emailVerified ? 'Email not verified. Check your inbox or request a new verification link.' : undefined}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">Role:</span>
            <span className="text-sm font-medium text-primary capitalize">{profile.role}</span>
          </div>
          <div className="flex items-start justify-between py-3 border-t border-neutral-200">
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">Foreigner Mode</label>
              <p className="text-xs text-neutral-500">
                Show content specific to non-Rwandan visitors (e.g. visa info, foreigner-exclusive tips).
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
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {passwordMessage && (
            <div className={`rounded-lg p-3 text-sm ${passwordMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
              {passwordMessage.text}
            </div>
          )}
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
          <div className="flex justify-end">
            <Button type="submit" loading={passwordLoading}>
              Change Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

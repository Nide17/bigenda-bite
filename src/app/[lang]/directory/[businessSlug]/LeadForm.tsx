'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useTranslations } from '@/components/I18nProvider'
import { toast } from 'sonner'

interface LeadFormProps {
  businessId: string
  businessName: string
}

export default function LeadForm({ businessId, businessName }: LeadFormProps) {
  const t = useTranslations()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          contactName: name,
          contactPhone: phone,
          message,
          source: 'directory_page',
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || t('lead_form_failed'))
      }

      setStatus('success')
      setName('')
      setPhone('')
      setMessage('')
      toast.success(t('lead_form_success_title'))
    } catch (err) {
      setStatus('error')
      const message = err instanceof Error ? err.message : t('lead_form_error')
      setError(message)
      toast.error(message)
    }
  }

  return (
    <Card className="p-6 bg-primary-light border-primary/10">
      <h2 className="text-xl font-semibold text-primary mb-2">{t('contact_business')}</h2>
      <p className="text-sm text-neutral-600 mb-4">
        {t('lead_form_description').replace('{businessName}', businessName)}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('lead_form_name_label')}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('lead_form_name_placeholder')}
            required
            disabled={status === 'loading'}
          />
          <Input
            label={t('lead_form_phone_label')}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('lead_form_phone_placeholder')}
            required
            disabled={status === 'loading'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t('lead_form_message_label')}</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('lead_form_message_placeholder')}
            rows={4}
            className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-base bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            required
            disabled={status === 'loading'}
          />
        </div>
        {error && status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}
        <Button type="submit" size="lg" loading={status === 'loading'}>
          {status === 'loading' ? t('lead_form_sending') : t('lead_form_submit_btn')}
        </Button>
      </form>
    </Card>
  )
}

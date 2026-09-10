'use client'

import { useState } from 'react'
import { useTranslations } from '@/components/I18nProvider'
import { toast } from 'sonner'
import { MailIcon, MapPinIcon, PhoneIcon, SendIcon } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function ContactPage() {
  const t = useTranslations()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success(t('contact_success'))
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        toast.error(t('contact_error'))
      }
    } catch {
      toast.error(t('contact_error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1e1b4b] mb-8">{t('contact_title')}</h1>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#1e1b4b]">{t('contact_info_title')}</h2>
            <p className="text-neutral-700">{t('contact_info_text')}</p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#1e1b4b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MailIcon className="w-5 h-5 text-[#1e1b4b]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#1e1b4b]">{t('contact_email_label')}</h3>
                  <p className="text-neutral-700">hello@bigendabite.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#1e1b4b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="w-5 h-5 text-[#1e1b4b]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#1e1b4b]">{t('contact_phone_label')}</h3>
                  <p className="text-neutral-700">+250 788 000 000</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#1e1b4b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPinIcon className="w-5 h-5 text-[#1e1b4b]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#1e1b4b]">{t('contact_address_label')}</h3>
                  <p className="text-neutral-700">{t('contact_address_text')}</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-neutral-200 rounded-xl p-6 md:p-8">
            <h2 className="text-xl font-semibold text-[#1e1b4b]">{t('contact_form_title')}</h2>
            <p className="text-neutral-600">{t('contact_form_subtitle')}</p>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                {t('contact_name_label')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e1b4b]/10 focus:border-[#1e1b4b]"
                placeholder={t('contact_name_placeholder')}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                {t('contact_email_label')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e1b4b]/10 focus:border-[#1e1b4b]"
                placeholder={t('contact_email_placeholder')}
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                {t('contact_subject_label')} <span className="text-red-500">*</span>
              </label>
              <select
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e1b4b]/10 focus:border-[#1e1b4b]"
              >
                <option value="">{t('contact_subject_select')}</option>
                <option value="general">{t('contact_subject_general')}</option>
                <option value="business">{t('contact_subject_business')}</option>
                <option value="content">{t('contact_subject_content')}</option>
                <option value="technical">{t('contact_subject_technical')}</option>
                <option value="advertising">{t('contact_subject_advertising')}</option>
                <option value="partnership">{t('contact_subject_partnership')}</option>
                <option value="other">{t('contact_subject_other')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                {t('contact_message_label')} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1e1b4b]/10 focus:border-[#1e1b4b] resize-none"
                placeholder={t('contact_message_placeholder')}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              <SendIcon className="w-4 h-4 mr-2" />
              {loading ? t('contact_sending') : t('contact_send_btn')}
            </Button>

            <p className="text-xs text-neutral-500 text-center">
              {t('contact_form_privacy')}
            </p>
          </form>
        </div>

        <div className="bg-neutral-50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#1e1b4b] mb-3">{t('contact_faq_title')}</h2>
          <div className="space-y-3 text-sm text-neutral-700">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer font-medium">
                {t('contact_faq_response')}
                <span className="text-neutral-400">+</span>
              </summary>
              <p className="mt-2 text-neutral-600">{t('contact_faq_response_text')}</p>
            </details>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer font-medium">
                {t('contact_faq_business')}
                <span className="text-neutral-400">+</span>
              </summary>
              <p className="mt-2 text-neutral-600">{t('contact_faq_business_text')}</p>
            </details>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer font-medium">
                {t('contact_faq_content')}
                <span className="text-neutral-400">+</span>
              </summary>
              <p className="mt-2 text-neutral-600">{t('contact_faq_content_text')}</p>
            </details>
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer font-medium">
                {t('contact_faq_advertising')}
                <span className="text-neutral-400">+</span>
              </summary>
              <p className="mt-2 text-neutral-600">{t('contact_faq_advertising_text')}</p>
            </details>
          </div>
        </div>
      </div>
    </main>
  )
}
'use client'

import { useState } from 'react'
import { useTranslations } from '@/components/I18nProvider'

interface ShareButtonProps {
  title: string
  url: string
  className?: string
}

export default function ShareButton({ title, url, className = '' }: ShareButtonProps) {
  const t = useTranslations()
  const [copied, setCopied] = useState(false)

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${title} ${url}`)
    const whatsappUrl = `https://wa.me/?text=${text}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        handleWhatsAppShare()
      }
    } else {
      handleWhatsAppShare()
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      handleWhatsAppShare()
    }
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <button
        type="button"
        onClick={handleNativeShare}
        className="group inline-flex items-center justify-center gap-2.5 px-5 py-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#25D366]/40 focus:ring-offset-2"
        aria-label={t('share_on_whatsapp')}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.67 0 4.73-1.95 5.27-4.55A5.97 5.97 0 0118 9c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6c1.58 0 3.03.6 4.12 1.57-.7.18-1.43.45-2.12.83A6.02 6.02 0 0012 4c-3.31 0-6 2.69-6 6s2.69 6 6 6z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.5V18m0 0v.01M12 18h.01M12 18a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
        <span>{t('share')}</span>
      </button>

      <button
        type="button"
        onClick={handleCopyLink}
        className={`group inline-flex items-center justify-center gap-2.5 px-5 py-2.5 font-semibold rounded-xl border transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-400/40 focus:ring-offset-2 ${
          copied
            ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
            : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50'
        }`}
        aria-label={t('copy_link')}
      >
        {copied ? (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{t('copied')}</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m2 4v6a2 2 0 01-2 2h-6a2 2 0 01-2-2v-6a2 2 0 012-2h6a2 2 0 012 2z" />
            </svg>
            <span>{t('copy_link')}</span>
          </>
        )}
      </button>
    </div>
  )
}
'use client'

import { useState } from 'react'

interface ShareButtonProps {
  title: string
  url: string
  className?: string
}

export default function ShareButton({ title, url, className = '' }: ShareButtonProps) {
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
    <div className={`flex gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleNativeShare}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold rounded-lg transition-all duration-150 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#25D366]/30"
        aria-label="Share on WhatsApp"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.67 0 4.73-1.95 5.27-4.55A5.97 5.97 0 0118 9c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6c1.58 0 3.03.6 4.12 1.57-.7.18-1.43.45-2.12.83A6.02 6.02 0 0012 4c-3.31 0-6 2.69-6 6s2.69 6 6 6z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.5V18m0 0v.01M12 18h.01M12 18a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
        Share
      </button>

      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-neutral-400/30"
        aria-label="Copy link"
      >
        {copied ? '✓ Copied!' : 'Copy Link'}
      </button>
    </div>
  )
}

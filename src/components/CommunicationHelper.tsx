'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export interface CommunicationScript {
  lang?: string
  text?: string
}

export interface CommunicationHelperProps {
  businessName?: string
  hasWhatsApp?: boolean
  hasEmail?: boolean
  scripts?: CommunicationScript[]
  whatsappNumber?: string
  culturalTip?: string
}

const FALLBACK_CULTURAL_TIP = "💡 Tip: In Kigali markets, always greet with 'Muraho' before asking for a price."

function WhatsAppLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 font-semibold rounded-lg border transition-all duration-150 bg-[#25D366] text-white hover:bg-[#128C7E] border-transparent px-4 py-2 text-sm"
    >
      {children}
    </a>
  )
}

function EmailLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 font-semibold rounded-lg border transition-all duration-150 bg-[#f59e0b] text-white hover:bg-[#d97706] border-transparent px-4 py-2 text-sm"
    >
      {children}
    </a>
  )
}

export default function CommunicationHelper({
  businessName,
  hasWhatsApp = false,
  hasEmail = false,
  scripts = [],
  whatsappNumber,
  culturalTip,
}: CommunicationHelperProps) {
  const [tipOpen, setTipOpen] = useState(false)

  const defaultScript = scripts?.[0]?.text || ''
  const whatsappMessage = encodeURIComponent(defaultScript)
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}` : null

  if (!hasWhatsApp && !hasEmail && (!scripts || scripts.length === 0)) {
    return null
  }

  return (
    <Card className="p-5 sm:p-6 border-indigo-200 bg-indigo-50/40">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-lg">
          🤫
        </div>
        <div>
          <h3 className="text-base font-semibold text-indigo-900">
            Prefer not to call? Here’s how to reach out:
          </h3>
          {businessName && (
            <p className="text-sm text-indigo-700 mt-0.5">
              Contacting <span className="font-medium">{businessName}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {hasWhatsApp && whatsappHref && (
          <WhatsAppLink href={whatsappHref}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.67 0 4.73-1.95 5.27-4.55A5.97 5.97 0 0118 9c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6c1.58 0 3.03.6 4.12 1.57-.7.18-1.43.45-2.12.83A6.02 6.02 0 0012 4c-3.31 0-6 2.69-6 6s2.69 6 6 6z" />
            </svg>
            WhatsApp
          </WhatsAppLink>
        )}

        {hasEmail && (
          <EmailLink href={`mailto:?subject=${encodeURIComponent(`Inquiry about ${businessName || 'services'}`)}&body=${encodeURIComponent(defaultScript)}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email
          </EmailLink>
        )}

        {scripts.map((script, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(script.text || '').catch(() => {})
            }}
            className="text-indigo-700 hover:text-indigo-800"
          >
            Copy {script.lang?.toUpperCase() || ''} script
          </Button>
        ))}
      </div>

      <div className="mt-4 border-t border-indigo-200/60">
        <button
          type="button"
          onClick={() => setTipOpen(!tipOpen)}
          className="flex items-center justify-between w-full py-2 text-left"
          aria-expanded={tipOpen}
        >
          <span className="text-sm font-medium text-indigo-800">Cultural Tip</span>
          <svg
            className={`w-4 h-4 text-indigo-600 transition-transform ${tipOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {tipOpen && (
          <p className="text-sm text-indigo-800 leading-relaxed mt-1">
            {culturalTip || FALLBACK_CULTURAL_TIP}
          </p>
        )}
      </div>
    </Card>
  )
}

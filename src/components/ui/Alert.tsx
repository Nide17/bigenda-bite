'use client'

import { useState } from 'react'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

const variantConfig: Record<AlertVariant, { bg: string; border: string; text: string; icon: string }> = {
  info: { bg: 'bg-[#eef2ff]', border: 'border-[#1e1b4b]/20', text: 'text-[#1e1b4b]', icon: 'ℹ️' },
  success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: '✓' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: '⚠' },
  error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: '✕' },
}

interface AlertProps {
  children: React.ReactNode
  variant?: AlertVariant
  title?: string
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

export default function Alert({
  children,
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
  className = '',
}: AlertProps) {
  const [visible, setVisible] = useState(true)
  const config = variantConfig[variant]

  if (!visible) return null

  const handleDismiss = () => {
    setVisible(false)
    onDismiss?.()
  }

  return (
    <div
      className={`
        ${config.bg} ${config.border} ${config.text}
        border rounded-lg p-4 flex gap-3
        transition-all duration-200
        ${className}
      `}
      role="alert"
    >
      <span className="text-lg leading-none mt-0.5 flex-shrink-0" aria-hidden="true">
        {config.icon}
      </span>
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-semibold text-sm mb-1">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}



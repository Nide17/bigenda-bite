'use client'

import { createContext, useContext, ReactNode } from 'react'

type Messages = Record<string, Record<string, string>>
type TranslationFunction = (key: string) => string

const I18nContext = createContext<{
  messages: Messages
  t: TranslationFunction
  locale: string
} | null>(null)

export function I18nProvider({ children, messages, locale }: { children: ReactNode; messages: Messages; locale: string }) {
  const t = (key: string) => {
    const keys = key.split('.')
    let value: unknown = messages.common
    for (const k of keys) {
      if (typeof value === 'object' && value !== null) {
        value = (value as Record<string, unknown>)[k]
      } else {
        return key
      }
    }
    return typeof value === 'string' ? value : key
  }

  return (
    <I18nContext.Provider value={{ messages, t, locale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslations(namespace = 'common') {
  const context = useContext(I18nContext)
  if (!context) {
    return (key: string) => key
  }
  return (key: string) => {
    const keys = key.split('.')
    let value: unknown = context.messages[namespace]
    for (const k of keys) {
      if (typeof value === 'object' && value !== null) {
        value = (value as Record<string, unknown>)[k]
      } else {
        return key
      }
    }
    return typeof value === 'string' ? value : key
  }
}

export function useLocale() {
  const context = useContext(I18nContext)
  return context?.locale || 'en'
}



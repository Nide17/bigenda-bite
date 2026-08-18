'use client'

import { createContext, useContext, ReactNode } from 'react'

type Messages = Record<string, any>
type TranslationFunction = (key: string) => string

const I18nContext = createContext<{
  messages: Messages
  t: TranslationFunction
  locale: string
} | null>(null)

export function I18nProvider({ children, messages, locale }: { children: ReactNode; messages: Messages; locale: string }) {
  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = messages.common
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
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
    let value: any = context.messages[namespace]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }
}

export function useLocale() {
  const context = useContext(I18nContext)
  return context?.locale || 'en'
}



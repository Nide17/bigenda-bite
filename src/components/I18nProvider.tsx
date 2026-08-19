'use client'

import { createContext, useContext, ReactNode } from 'react'

type Messages = Record<string, string>
type TranslationFunction = (key: string) => string

const I18nContext = createContext<{
  messages: Messages
  t: TranslationFunction
  locale: string
} | null>(null)

export function I18nProvider({ children, messages, locale }: { children: ReactNode; messages: Messages; locale: string }) {
  const t = (key: string) => {
    return messages[key] || key
  }

  return (
    <I18nContext.Provider value={{ messages, t, locale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslations() {
  const context = useContext(I18nContext)
  if (!context) {
    return (key: string) => key
  }
  return (key: string) => context.messages[key] || key
}

export function useLocale() {
  const context = useContext(I18nContext)
  return context?.locale || 'en'
}



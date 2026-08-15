'use client'

import { useTranslations } from '@/components/I18nProvider'

export default function PrivacyPage() {
  const t = useTranslations('common')

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p>Your privacy is important to us. This policy outlines how we collect, use, and protect your data.</p>
    </main>
  )
}

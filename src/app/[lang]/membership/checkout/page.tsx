'use client'

import { useTranslations } from '@/components/I18nProvider'

export default function CheckoutPage() {
  const t = useTranslations('common')

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <p>MoMo payment flow coming in Phase 3.</p>
    </main>
  )
}

'use client'

import { useTranslations } from '@/components/I18nProvider'

export default function TermsPage() {
  const t = useTranslations()

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1e1b4b] mb-8">{t('legal_terms_title')}</h1>

        <div className="prose prose-[#1e1b4b] max-w-none">
          <p className="text-neutral-700 mb-6">{t('legal_terms_intro')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_terms_acceptance_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_terms_acceptance_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_terms_use_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_terms_use_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_terms_content_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_terms_content_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_terms_accounts_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_terms_accounts_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_terms_submissions_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_terms_submissions_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_terms_ads_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_terms_ads_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_terms_payments_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_terms_payments_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_terms_disclaimer_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_terms_disclaimer_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_terms_liability_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_terms_liability_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_terms_changes_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_terms_changes_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_terms_contact_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_terms_contact_text')}</p>

          <p className="text-sm text-neutral-500 mt-8 border-t border-neutral-200 pt-4">
            {t('legal_terms_last_updated', { date: 'September 10, 2026' })}
          </p>
        </div>
      </div>
    </main>
  )
}
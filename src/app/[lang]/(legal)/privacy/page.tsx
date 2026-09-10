'use client'

import { useTranslations } from '@/components/I18nProvider'

export default function PrivacyPage() {
  const t = useTranslations()

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1e1b4b] mb-8">{t('legal_privacy_title')}</h1>

        <div className="prose prose-[#1e1b4b] max-w-none">
          <p className="text-neutral-700 mb-6">{t('legal_privacy_intro')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_privacy_data_collected_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_privacy_data_collected_text')}</p>
          <ul className="list-disc list-inside text-neutral-700 mb-4 space-y-2">
            <li>{t('legal_privacy_data_account')}</li>
            <li>{t('legal_privacy_data_usage')}</li>
            <li>{t('legal_privacy_data_location')}</li>
            <li>{t('legal_privacy_data_device')}</li>
            <li>{t('legal_privacy_data_cookies')}</li>
          </ul>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_privacy_usage_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_privacy_usage_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_privacy_sharing_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_privacy_sharing_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_privacy_ads_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_privacy_ads_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_privacy_analytics_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_privacy_analytics_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_privacy_security_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_privacy_security_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_privacy_rights_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_privacy_rights_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_privacy_retention_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_privacy_retention_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_privacy_children_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_privacy_children_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_privacy_changes_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_privacy_changes_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('legal_privacy_contact_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('legal_privacy_contact_text')}</p>

          <p className="text-sm text-neutral-500 mt-8 border-t border-neutral-200 pt-4">
            {t('legal_privacy_last_updated', { date: 'September 10, 2026' })}
          </p>
        </div>
      </div>
    </main>
  )
}
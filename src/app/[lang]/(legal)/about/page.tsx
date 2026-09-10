'use client'

import { useTranslations } from '@/components/I18nProvider'

export default function AboutPage() {
  const t = useTranslations()

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1e1b4b] mb-8">{t('about_title')}</h1>

        <div className="prose prose-[#1e1b4b] max-w-none">
          <p className="text-neutral-700 mb-6">{t('about_intro')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('about_mission_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('about_mission_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('about_team_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('about_team_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('about_approach_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('about_approach_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('about_content_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('about_content_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('about_tech_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('about_tech_text')}</p>

          <h2 className="text-xl font-semibold text-[#1e1b4b] mt-8 mb-3">{t('about_contact_title')}</h2>
          <p className="text-neutral-700 mb-4">{t('about_contact_text')}</p>
        </div>
      </div>
    </main>
  )
}
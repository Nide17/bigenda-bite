'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from '@/components/I18nProvider'

export default function Footer() {
  const t = useTranslations()
  const lang = useLocale()

  return (
    <footer className="bg-[#1e1b4b] text-neutral-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-2">Bigenda Bite</h3>
            <p className="text-sm text-neutral-400 max-w-md">
              {t('footer_tagline')}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer_explore')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${lang}/processes`} className="text-neutral-400 hover:text-white transition-colors">{t('processes')}</Link></li>
              <li><Link href={`/${lang}/guides`} className="text-neutral-400 hover:text-white transition-colors">{t('guides')}</Link></li>
              <li><Link href={`/${lang}/directory`} className="text-neutral-400 hover:text-white transition-colors">{t('directory')}</Link></li>
              <li><Link href={`/${lang}/alerts`} className="text-neutral-400 hover:text-white transition-colors">{t('alerts')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer_account')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/${lang}/membership`} className="text-neutral-400 hover:text-white transition-colors">{t('membership')}</Link></li>
              <li><Link href={`/${lang}/login`} className="text-neutral-400 hover:text-white transition-colors">{t('login')}</Link></li>
              <li><Link href={`/${lang}/register`} className="text-neutral-400 hover:text-white transition-colors">{t('register')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Bigenda Bite. {t('footer_rights')}.
          </p>
          <p className="text-xs text-neutral-600">
            {t('footer_built')}
          </p>
        </div>
      </div>
    </footer>
  )
}

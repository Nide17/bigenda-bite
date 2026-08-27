'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from '@/components/I18nProvider'
import { NotificationBell } from './NotificationBell'

interface NavItem {
  href: string
  labelKey: string
}

const navItems: NavItem[] = [
  { href: '/processes', labelKey: 'processes' },
  { href: '/guides', labelKey: 'guides' },
  { href: '/directory', labelKey: 'directory' },
  { href: '/alerts', labelKey: 'alerts' },
  { href: '/membership', labelKey: 'membership' },
]

const LANG_OPTIONS = [
  { code: 'en', labelKey: 'lang_en' },
  { code: 'fr', labelKey: 'lang_fr' },
  { code: 'rw', labelKey: 'lang_rw' },
] as const

function LangSwitcher({ currentLang }: { currentLang: string }) {
  return (
    <div className="inline-flex items-center gap-1 bg-neutral-100 rounded-lg p-1" role="group" aria-label="Language">
      {LANG_OPTIONS.map((lang) => {
        const isActive = currentLang === lang.code
        return (
          <Link
            key={lang.code}
            href={`/${lang.code}`}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              isActive
                ? 'bg-white text-[#1e1b4b] shadow-sm'
                : 'text-neutral-600 hover:text-[#1e1b4b] hover:bg-neutral-50'
            }`}
            aria-current={isActive ? 'true' : undefined}
          >
            {lang.code.toUpperCase()}
          </Link>
        )
      })}
    </div>
  )
}

export default function Navigation({ lang }: { lang: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname() || ''
  const t = useTranslations()

  const isActive = (href: string) => {
    const prefix = `/${lang}`
    if (href === prefix) return pathname === prefix
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href={`/${lang}`}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 bg-[#1e1b4b] rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:bg-[#312e6b] transition-colors">
                BB
              </div>
              <span className="font-bold text-lg text-[#1e1b4b] tracking-tight hidden sm:block">
                Bigenda Bite
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1" aria-label="Main">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={`/${lang}${item.href}`}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                    ${isActive(`/${lang}${item.href}`)
                      ? 'bg-[#eef2ff] text-[#1e1b4b]'
                      : 'text-neutral-600 hover:text-[#1e1b4b] hover:bg-neutral-50'
                    }
                  `}
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <LangSwitcher currentLang={lang} />
            <NotificationBell />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <nav className="px-4 py-3 space-y-1" aria-label="Mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${lang}${item.href}`}
                onClick={() => setMobileOpen(false)}
                className={`
                  block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive(`/${lang}${item.href}`)
                    ? 'bg-[#eef2ff] text-[#1e1b4b]'
                    : 'text-neutral-600 hover:text-[#1e1b4b] hover:bg-neutral-50'
                  }
                `}
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}



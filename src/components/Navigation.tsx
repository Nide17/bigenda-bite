'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
  { href: '/search', labelKey: 'search' },
]

const LANG_OPTIONS = [
  { code: 'en', labelKey: 'lang_en' },
  { code: 'fr', labelKey: 'lang_fr' },
  { code: 'rw', labelKey: 'lang_rw' },
] as const

function LangSwitcher({ currentLang }: { currentLang: string }) {
  return (
    <div className="inline-flex items-center gap-0.5 bg-neutral-100 rounded-lg p-0.5" role="group" aria-label="Language">
      {LANG_OPTIONS.map((lang) => {
        const isActive = currentLang === lang.code
        return (
          <Link
            key={lang.code}
            href={`/${lang.code}`}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
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
  const [accountOpen, setAccountOpen] = useState(false)
  const pathname = usePathname() || ''
  const t = useTranslations()
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const accountRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  const isHome = pathname === `/${lang}`

  const openMenu = useCallback(() => {
    previousFocusRef.current = toggleRef.current
    setMobileOpen(true)
  }, [])

  const closeMenu = useCallback(() => {
    setMobileOpen(false)
    if (previousFocusRef.current) {
      previousFocusRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
      const firstFocusable = menuRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 0)
      }
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu()
        return
      }

      if (e.key === 'Tab' && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mobileOpen, closeMenu])

  useEffect(() => {
    if (mobileOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      closeMenu()
    }
  }, [pathname, mobileOpen, closeMenu])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link
              href={`/${lang}`}
              className={`flex items-center gap-2 group ${isHome ? 'text-[#1e1b4b]' : 'text-neutral-900'}`}
            >
              <div className="w-7 h-7 bg-[#1e1b4b] rounded-md flex items-center justify-center text-white font-bold text-xs group-hover:bg-[#312e6b] transition-colors">
                BB
              </div>
              <span className="font-bold text-base text-[#1e1b4b] tracking-tight hidden sm:block">
                Bigenda Bite
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-0.5" aria-label="Main">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={`/${lang}${item.href}`}
                  className={`
                    px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-150
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

          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-1" aria-label="Account">
              <Link
                href={`/${lang}/login`}
                className={`
                  px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-150
                  ${isActive(`/${lang}/login`)
                    ? 'bg-[#eef2ff] text-[#1e1b4b]'
                    : 'text-neutral-600 hover:text-[#1e1b4b] hover:bg-neutral-50'
                  }
                `}
              >
                {t('sign_in')}
              </Link>
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className={`
                    px-2.5 py-1.5 rounded-md text-sm font-medium transition-all duration-150 flex items-center gap-1
                    ${isActive(`/${lang}/account`) || isActive(`/${lang}/membership`)
                      ? 'bg-[#eef2ff] text-[#1e1b4b]'
                      : 'text-neutral-600 hover:text-[#1e1b4b] hover:bg-neutral-50'
                    }
                  `}
                  aria-expanded={accountOpen}
                >
                  {t('account')}
                  <svg className="w-3.5 h-3.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {accountOpen && (
                  <div className="absolute right-0 mt-1 w-40 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-50">
                    <Link
                      href={`/${lang}/account`}
                      className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-[#1e1b4b] transition-colors"
                      onClick={() => setAccountOpen(false)}
                    >
                      {t('account')}
                    </Link>
                    <Link
                      href={`/${lang}/membership`}
                      className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-[#1e1b4b] transition-colors"
                      onClick={() => setAccountOpen(false)}
                    >
                      {t('membership')}
                    </Link>
                  </div>
                )}
              </div>
            </nav>
            <LangSwitcher currentLang={lang} />
            <NotificationBell />
            <button
              ref={toggleRef}
              onClick={() => (mobileOpen ? closeMenu() : openMenu())}
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
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
          <nav ref={menuRef} className="px-4 py-3 space-y-1" aria-label="Mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${lang}${item.href}`}
                onClick={closeMenu}
                className={`
                  block min-h-[44px] flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive(`/${lang}${item.href}`)
                    ? 'bg-[#eef2ff] text-[#1e1b4b]'
                    : 'text-neutral-600 hover:text-[#1e1b4b] hover:bg-neutral-50'
                  }
                `}
              >
                {t(item.labelKey)}
              </Link>
            ))}
            <div className="border-t border-neutral-100 pt-1 mt-1">
              <Link
                href={`/${lang}/account`}
                onClick={closeMenu}
                className="block min-h-[44px] flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:text-[#1e1b4b] hover:bg-neutral-50 transition-colors"
              >
                {t('account')}
              </Link>
              <Link
                href={`/${lang}/membership`}
                onClick={closeMenu}
                className="block min-h-[44px] flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:text-[#1e1b4b] hover:bg-neutral-50 transition-colors"
              >
                {t('membership')}
              </Link>
              <Link
                href={`/${lang}/login`}
                onClick={closeMenu}
                className="block min-h-[44px] flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:text-[#1e1b4b] hover:bg-neutral-50 transition-colors"
              >
                {t('sign_in')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

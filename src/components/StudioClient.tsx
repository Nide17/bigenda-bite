'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { useTranslations } from '@/components/I18nProvider'
import type { Config } from 'sanity'
import sanityConfig from '../../sanity.config'

// `sanity` ships no typed export for the Studio component, so we load it
// dynamically and cast the result to a component that accepts a `config` prop.
type StudioComponent = React.ComponentType<{ config: Config }>

const Studio = dynamic(
  () => import('sanity').then((mod) => mod.Studio as unknown as StudioComponent),
  { ssr: false, loading: () => <p>Loading Studio...</p> },
) as unknown as StudioComponent

function missingEnvVars(): string[] {
  const missing: string[] = []
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) missing.push('NEXT_PUBLIC_SANITY_PROJECT_ID')
  if (!process.env.NEXT_PUBLIC_SANITY_DATASET) missing.push('NEXT_PUBLIC_SANITY_DATASET')
  if (!process.env.NEXT_PUBLIC_SANITY_API_TOKEN) missing.push('NEXT_PUBLIC_SANITY_API_TOKEN')
  return missing
}

export default function StudioClient() {
  const t = useTranslations()
  const missing = missingEnvVars()

  useEffect(() => {
    // The embedded Sanity Studio defaults to the "releases" tool, which is not
    // useful for day-to-day content editing. Redirect to the structure tool
    // (the default document editor) instead, and handle any stale URLs left
    // over from the old custom tools.
    if (typeof window !== 'undefined') {
      const path = window.location.pathname
      if (
        path === '/studio' ||
        path === '/studio/' ||
        path === '/studio/dashboard' ||
        path === '/studio/content'
      ) {
        window.history.replaceState(null, '', '/studio/structure')
      }
    }

    if (missing.length > 0) {
      toast.error(t('studio_config_missing'), {
        description: `Missing environment variables: ${missing.join(', ')}`,
        duration: Infinity,
      })
    }
  }, [t, missing])

  if (missing.length > 0) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">{t('studio_config_missing')}</h2>
          <p className="text-sm text-red-700 mb-4">
            Missing environment variables: {missing.join(', ')}
          </p>
          <p className="text-sm text-red-700">{t('studio_config_fix')}</p>
          <ul className="list-disc pl-5 text-sm text-red-700 mt-2 space-y-1">
            <li>{t('studio_config_fix_token')}</li>
            <li>{t('studio_config_fix_deploy')}</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div id="sanity-studio" className="fixed inset-0 w-full h-full">
      <Studio config={sanityConfig} />
    </div>
  )
}
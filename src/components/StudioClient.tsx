'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { useTranslations } from '@/components/I18nProvider'

interface StudioProps {
  name: string
  title: string
  projectId: string
  dataset: string
  apiVersion: string
  basePath: string
  token?: string
}

// `sanity` ships no typed export for the Studio component, so we load it
// dynamically and cast the result to a component that accepts a `config` prop.
type StudioComponent = React.ComponentType<{ config: StudioProps }>

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
    // The default Sanity Studio has no "dashboard" tool. Redirect any stale
    // /studio/dashboard URL (left over from the old custom tool) back to the
    // Studio root so the SPA doesn't try to render a non-existent tool.
    if (typeof window !== 'undefined' && window.location.pathname === '/studio/dashboard') {
      window.history.replaceState(null, '', '/studio')
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

  const config: StudioProps = {
    name: 'bigenda-bite',
    title: 'Bigenda Bite CMS',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    basePath: '/studio',
    token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  }

  return (
    <div id="sanity-studio">
      <Studio config={config} />
    </div>
  )
}
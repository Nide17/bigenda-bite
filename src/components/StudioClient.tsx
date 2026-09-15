'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { useTranslations } from '@/components/I18nProvider'

const Studio = dynamic(() => import('sanity'), {
  ssr: false,
  loading: () => <p>Loading Studio...</p>,
})

export default function StudioClient() {
  const t = useTranslations()
  const [configError, setConfigError] = useState<string | null>(null)

  useEffect(() => {
    // The default Sanity Studio has no "dashboard" tool. Redirect any stale
    // /studio/dashboard URL (pushed by an old custom tool) back to the Studio root.
    if (typeof window !== 'undefined' && window.location.pathname === '/studio/dashboard') {
      window.history.replaceState(null, '', '/studio')
    }

    const missing: string[] = []
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) missing.push('NEXT_PUBLIC_SANITY_PROJECT_ID')
    if (!process.env.NEXT_PUBLIC_SANITY_DATASET) missing.push('NEXT_PUBLIC_SANITY_DATASET')
    if (!process.env.NEXT_PUBLIC_SANITY_API_TOKEN) missing.push('NEXT_PUBLIC_SANITY_API_TOKEN')

    if (missing.length > 0) {
      const message = `Missing environment variables: ${missing.join(', ')}`
      setConfigError(message)
      toast.error(t('studio_config_missing'), {
        description: message,
        duration: Infinity,
      })
    }
  }, [t])

  if (configError) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">{t('studio_config_missing')}</h2>
          <p className="text-sm text-red-700 mb-4">{configError}</p>
          <p className="text-sm text-red-700">
            {t('studio_config_fix')}
          </p>
          <ul className="list-disc pl-5 text-sm text-red-700 mt-2 space-y-1">
            <li>{t('studio_config_fix_token')}</li>
            <li>{t('studio_config_fix_deploy')}</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div id="sanity-studio">
      <Studio
        config={{
          name: 'bigenda-bite',
          title: 'Bigenda Bite CMS',
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
          apiVersion: '2024-01-01',
          basePath: '/studio',
          token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
        }}
      />
    </div>
  )
}
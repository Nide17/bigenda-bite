'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import PageContainer from '@/components/PageContainer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useTranslations } from '@/components/I18nProvider'
import { getSavedGuides, removeGuide, type SavedGuide } from '@/lib/offline-guides'

export default function OfflineSavedPage() {
  const pathname = usePathname() || ''
  const lang = pathname.split('/')[1] || 'en'
  const t = useTranslations()
  const [savedGuides, setSavedGuides] = useState<SavedGuide[]>(() => {
    if (typeof window === 'undefined') return []
    return getSavedGuides()
  })

  const handleDelete = useCallback((id: string) => {
    removeGuide(id)
    setSavedGuides(getSavedGuides())
  }, [])

  return (
    <PageContainer>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{t('saved_guides')}</h1>
          <p className="text-neutral-600">{t('saved_guides_subtitle')}</p>
        </div>

        {savedGuides.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-4xl mb-3">📥</div>
            <h2 className="text-lg font-semibold text-primary mb-2">{t('saved_guides_empty_title')}</h2>
            <p className="text-neutral-600 mb-4">
              {t('saved_guides_empty_text')}
            </p>
            <Link href={`/${lang}/guides`}>
              <Button>{t('browse_processes')}</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {savedGuides.map((guide) => (
              <Card key={guide.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary mb-1">{guide.title}</h3>
                    {guide.category && (
                      <span className="inline-block mb-2 px-2.5 py-1 bg-accent-light text-amber-700 text-xs font-medium rounded-full">
                        {t(`cat_${guide.category}`) || guide.category}
                      </span>
                    )}
                    <p className="text-xs text-neutral-500">
                      {t('saved_on')} {new Date(guide.savedAt).toLocaleDateString()}
                    </p>

                    <div className="mt-4 space-y-3">
                      {guide.data.estimatedTime && (guide.data.estimatedTime.online || guide.data.estimatedTime.inPerson) && (
                        <div>
                          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">{t('time')}</p>
                          <p className="text-sm text-neutral-900">
                            {guide.data.estimatedTime.online && `Online: ${guide.data.estimatedTime.online}`}
                            {guide.data.estimatedTime.inPerson && `In Person: ${guide.data.estimatedTime.inPerson}`}
                          </p>
                        </div>
                      )}

                      {guide.data.costBreakdown && guide.data.costBreakdown.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">{t('cost')}</p>
                          <ul className="text-sm text-neutral-900 space-y-1">
                            {guide.data.costBreakdown.map((cost, index) => (
                              <li key={index} className="flex justify-between gap-2">
                                <span>{cost.item}</span>
                                <span className="font-semibold">{cost.amountRWF?.toLocaleString()} RWF</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {guide.data.documentChecklist && guide.data.documentChecklist.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">{t('documents')}</p>
                          <ul className="text-sm text-neutral-900 space-y-1">
                            {guide.data.documentChecklist.map((doc, index) => (
                              <li key={index}>
                                <span className="font-medium">{doc.documentName}</span>
                                {!doc.isRequired && <span className="text-neutral-500 ml-1">({t('optional')})</span>}
                                {doc.fallbackOption && <p className="text-xs text-neutral-500">{doc.fallbackOption}</p>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {guide.data.physicalLocation && (guide.data.physicalLocation.description || guide.data.physicalLocation.mapsLink) && (
                        <div>
                          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">{t('where')}</p>
                          {guide.data.physicalLocation.description && (
                            <p className="text-sm text-neutral-900">{guide.data.physicalLocation.description}</p>
                          )}
                          {guide.data.physicalLocation.mapsLink && (
                            <a href={guide.data.physicalLocation.mapsLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-hover underline">
                              {t('view_on_map')}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link href={`/${lang}/guides/${guide.category || ''}/${guide.id}`}>
                      <Button variant="secondary" size="sm" className="w-full">
                        {t('open')}
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(guide.id)}
                      className="w-full text-red-600 hover:text-red-700"
                    >
                      {t('delete')}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}

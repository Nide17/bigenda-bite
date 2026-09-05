'use client'

import { useState, useCallback } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Clock, Banknote, FileCheck, MapPin, MessageSquare, Check, Copy, CheckCheck } from 'lucide-react'
import type { TaskBlueprint } from '@/types'

interface TaskBlueprintProps {
  data?: TaskBlueprint
}

const iconClass = 'w-5 h-5 flex-shrink-0 mt-0.5'

export default function TaskBlueprint({ data }: TaskBlueprintProps) {
  const [checkedDocs, setCheckedDocs] = useState<Set<number>>(new Set())
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const {
    estimatedTime,
    costBreakdown,
    documentChecklist,
    physicalLocation,
    culturalContext,
    copyPasteScripts,
    introvertTip,
  } = data || {}

  const totalCost = costBreakdown?.reduce((sum, item) => sum + (item.amountRWF || 0), 0) || 0
  const hasQuickInfo =
    estimatedTime ||
    (costBreakdown && costBreakdown.length > 0) ||
    (documentChecklist && documentChecklist.length > 0) ||
    physicalLocation
  const hasCulturalContext = culturalContext && culturalContext.trim().length > 0
  const hasScripts = copyPasteScripts && copyPasteScripts.length > 0

  const toggleDoc = useCallback((index: number) => {
    setCheckedDocs((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }, [])

  const copyToClipboard = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch {
      console.error('Failed to copy')
    }
  }, [])

  if (!hasQuickInfo && !hasCulturalContext && !hasScripts && !introvertTip) return null

  return (
    <div className="mb-8">
      {hasQuickInfo && (
        <Card className="p-4 sm:p-5 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {estimatedTime && (estimatedTime.online || estimatedTime.inPerson) && (
              <div className="flex items-start gap-3">
                <div className={`${iconClass} text-primary`}>
                  <Clock />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Time</p>
                  {estimatedTime.online && (
                    <p className="text-sm font-semibold text-neutral-900">Online: {estimatedTime.online}</p>
                  )}
                  {estimatedTime.inPerson && (
                    <p className="text-sm font-semibold text-neutral-900">In Person: {estimatedTime.inPerson}</p>
                  )}
                </div>
              </div>
            )}

            {(costBreakdown && costBreakdown.length > 0) && (
              <div className="flex items-start gap-3">
                <div className={`${iconClass} text-primary`}>
                  <Banknote />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Cost</p>
                  <ul className="text-sm text-neutral-900 space-y-1">
                    {costBreakdown.map((cost, index) => (
                      <li key={index} className="flex justify-between gap-2">
                        <span className="truncate">{cost.item}</span>
                        <span className="font-semibold whitespace-nowrap">{cost.amountRWF?.toLocaleString()} RWF</span>
                      </li>
                    ))}
                  </ul>
                  {totalCost > 0 && (
                    <div className="mt-2 pt-2 border-t border-neutral-200">
                      <p className="text-sm font-bold text-primary">
                        Total: {totalCost.toLocaleString()} RWF
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {documentChecklist && documentChecklist.length > 0 && (
              <div className="flex items-start gap-3">
                <div className={`${iconClass} text-primary`}>
                  <FileCheck />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">Documents</p>
                  <ul className="space-y-2">
                    {documentChecklist.map((doc, index) => (
                      <li
                        key={index}
                        className={`flex items-start gap-2 text-sm transition-colors ${
                          checkedDocs.has(index) ? 'text-neutral-400' : 'text-neutral-900'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleDoc(index)}
                          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                            checkedDocs.has(index)
                              ? 'bg-primary border-primary text-white'
                              : 'border-neutral-300 hover:border-primary'
                          }`}
                          aria-label={`${checkedDocs.has(index) ? 'Uncheck' : 'Check'} ${doc.documentName}`}
                        >
                          {checkedDocs.has(index) && <Check className="w-3 h-3" />}
                        </button>
                        <div className="min-w-0">
                          <span className="font-medium">{doc.documentName}</span>
                          {!doc.isRequired && <span className="text-neutral-500 ml-1">(optional)</span>}
                          {doc.fallbackOption && (
                            <p className="text-xs text-neutral-500 mt-0.5">{doc.fallbackOption}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {physicalLocation && (physicalLocation.description || physicalLocation.mapsLink) && (
              <div className="flex items-start gap-3">
                <div className={`${iconClass} text-primary`}>
                  <MapPin />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Where</p>
                  {physicalLocation.description && (
                    <p className="text-sm font-semibold text-neutral-900">{physicalLocation.description}</p>
                  )}
                  {physicalLocation.mapsLink && (
                    <a
                      href={physicalLocation.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary-hover underline underline-offset-2 mt-1 inline-block"
                    >
                      View on Map
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {hasCulturalContext && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.05 9.15l.9 4.2a2 2 0 01-1.9 2.4H7.9a2 2 0 01-1.9-2.4l.9-4.2M7.9 13.15l-1.05.55a2 2 0 01-2.1-1.8l1-4.2a2 2 0 012.1-1.8h4.3a2 2 0 012.1 1.8l1 4.2a2 2 0 01-2.1 1.8l-1.05-.55" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">Cultural Context</p>
              <p className="text-sm text-emerald-800 leading-relaxed">{culturalContext}</p>
            </div>
          </div>
        </div>
      )}

      {hasScripts && (
        <Card className="p-4 sm:p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Copy-Paste Scripts</p>
          </div>
          <div className="space-y-3">
            {copyPasteScripts.map((script, index) => (
              <div key={index} className="bg-neutral-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-medium text-neutral-600 uppercase">{script.language}</span>
                  <span className="text-xs text-neutral-500">• {script.scenario}</span>
                </div>
                <div className="flex items-start gap-2">
                  <p className="text-sm text-neutral-800 whitespace-pre-wrap flex-1">{script.text}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(script.text || '', index)}
                    className="flex-shrink-0 h-8 w-8 p-0"
                    aria-label="Copy script"
                  >
                    {copiedIndex === index ? (
                      <CheckCheck className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {copiedIndex === index && (
                  <p className="text-xs text-emerald-600 mt-1 font-medium">Copied!</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {introvertTip && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">Pro Tip</p>
              <p className="text-sm text-blue-800 leading-relaxed">{introvertTip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

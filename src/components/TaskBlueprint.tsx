import Card from '@/components/ui/Card'
import type { TaskBlueprint } from '@/types'

interface TaskBlueprintProps {
  data?: TaskBlueprint
}

function IconClock() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconBanknote() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )
}

function IconFileText() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function IconMapPin() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function IconLightbulb() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  )
}

function IconClipboard() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  )
}

export default function TaskBlueprint({ data }: TaskBlueprintProps) {
  if (!data) return null

  const {
    estimatedTime,
    costBreakdown,
    documentChecklist,
    physicalLocation,
    culturalContext,
    copyPasteScripts,
    introvertTip,
  } = data

  const hasQuickInfo =
    estimatedTime ||
    (costBreakdown && costBreakdown.length > 0) ||
    (documentChecklist && documentChecklist.length > 0) ||
    physicalLocation

  const hasCulturalContext = culturalContext && culturalContext.trim().length > 0
  const hasScripts = copyPasteScripts && copyPasteScripts.length > 0

  if (!hasQuickInfo && !hasCulturalContext && !hasScripts && !introvertTip) return null

  return (
    <div className="mb-8">
      {hasQuickInfo && (
        <Card className="p-5 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {estimatedTime && (estimatedTime.online || estimatedTime.inPerson) && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <IconClock />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Time</p>
                  {estimatedTime.online && <p className="text-sm font-semibold text-neutral-900">Online: {estimatedTime.online}</p>}
                  {estimatedTime.inPerson && <p className="text-sm font-semibold text-neutral-900">In Person: {estimatedTime.inPerson}</p>}
                </div>
              </div>
            )}

            {costBreakdown && costBreakdown.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <IconBanknote />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Cost</p>
                  <ul className="text-sm text-neutral-900 space-y-0.5">
                    {costBreakdown.map((cost, index) => (
                      <li key={index} className="flex justify-between gap-2">
                        <span>{cost.item}</span>
                        <span className="font-semibold">{cost.amountRWF?.toLocaleString()} RWF</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {documentChecklist && documentChecklist.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <IconFileText />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Documents</p>
                  <ul className="text-sm text-neutral-900 space-y-1">
                    {documentChecklist.map((doc, index) => (
                      <li key={index}>
                        <span className="font-medium">{doc.documentName}</span>
                        {doc.isRequired ? '' : <span className="text-neutral-500"> (optional)</span>}
                        {doc.fallbackOption && <p className="text-xs text-neutral-500">{doc.fallbackOption}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {physicalLocation && (physicalLocation.description || physicalLocation.mapsLink) && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <IconMapPin />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Where</p>
                  {physicalLocation.description && <p className="text-sm font-semibold text-neutral-900">{physicalLocation.description}</p>}
                  {physicalLocation.mapsLink && (
                    <a href={physicalLocation.mapsLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-hover">
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
        <Card className="p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
              <IconClipboard />
            </div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Copy-Paste Scripts</p>
          </div>
          <div className="space-y-3">
            {copyPasteScripts.map((script, index) => (
              <div key={index} className="bg-neutral-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-neutral-600 uppercase">{script.language}</span>
                  <span className="text-xs text-neutral-500">• {script.scenario}</span>
                </div>
                <p className="text-sm text-neutral-800 whitespace-pre-wrap">{script.text}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {introvertTip && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mt-0.5">
              <IconLightbulb />
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

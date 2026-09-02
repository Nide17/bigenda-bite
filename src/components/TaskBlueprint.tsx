import Card from '@/components/ui/Card'

export interface TaskBlueprintData {
  estimatedTime?: string
  estimatedCost?: string
  requiredDocuments?: string[]
  locationHint?: string
  introvertTip?: string
}

interface TaskBlueprintProps {
  data?: TaskBlueprintData
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

export default function TaskBlueprint({ data }: TaskBlueprintProps) {
  if (!data) return null

  const { estimatedTime, estimatedCost, requiredDocuments, locationHint, introvertTip } = data

  const hasQuickInfo = estimatedTime || estimatedCost || (requiredDocuments && requiredDocuments.length > 0) || locationHint

  if (!hasQuickInfo && !introvertTip) return null

  return (
    <div className="mb-8">
      {hasQuickInfo && (
        <Card className="p-5 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {estimatedTime && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <IconClock />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Time</p>
                  <p className="text-sm font-semibold text-neutral-900">{estimatedTime}</p>
                </div>
              </div>
            )}

            {estimatedCost && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <IconBanknote />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Cost</p>
                  <p className="text-sm font-semibold text-neutral-900">{estimatedCost}</p>
                </div>
              </div>
            )}

            {locationHint && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <IconMapPin />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Where</p>
                  <p className="text-sm font-semibold text-neutral-900">{locationHint}</p>
                </div>
              </div>
            )}

            {requiredDocuments && requiredDocuments.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <IconFileText />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Documents</p>
                  <p className="text-sm font-semibold text-neutral-900">
                    {requiredDocuments.join(', ')}
                  </p>
                </div>
              </div>
            )}
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

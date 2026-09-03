import Card from '@/components/ui/Card'

interface BeforeYouGoProps {
  beforeYouGo?: string[]
  foreignerNotes?: string[]
  showForeignerNotes?: boolean
}

function AlertTriangleIcon() {
  return (
    <svg
      className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  )
}

export default function BeforeYouGo({
  beforeYouGo,
  foreignerNotes,
  showForeignerNotes = false,
}: BeforeYouGoProps) {
  const hasBeforeYouGo = beforeYouGo && beforeYouGo.length > 0
  const hasForeignerNotes = showForeignerNotes && foreignerNotes && foreignerNotes.length > 0

  if (!hasBeforeYouGo && !hasForeignerNotes) return null

  return (
    <div className="mb-8">
      {hasBeforeYouGo && (
        <Card className="p-5 mb-4 border-amber-200 bg-amber-50">
          <div className="flex items-start gap-3">
            <AlertTriangleIcon />
            <div>
              <p className="text-xs font-medium text-amber-600 uppercase tracking-wide mb-2">
                Before You Go
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-900">
                {beforeYouGo!.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {hasForeignerNotes && (
        <Card className="p-5 border-blue-200 bg-blue-50">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-.5a4.5 4.5 0 01-4.5-4.5V9a4 4 0 118 0v2.5A2.5 2.5 0 0114.5 13h-1"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19a7 7 0 100-14 7 7 0 000 14z"
              />
            </svg>
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">
                For Non-Residents
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-900">
                {foreignerNotes!.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

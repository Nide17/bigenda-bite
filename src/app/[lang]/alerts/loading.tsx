import PageContainer from '@/components/PageContainer'

export default function AlertsLoading() {
  return (
    <PageContainer>
      <div className="mb-8">
        <div className="h-8 bg-neutral-200 rounded w-1/4 mb-2 animate-pulse" />
        <div className="h-4 bg-neutral-200 rounded w-2/3 animate-pulse" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-neutral-200 rounded-xl p-6 animate-pulse"
          >
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-neutral-200 rounded flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-4 bg-neutral-200 rounded w-12" />
                </div>
                <div className="h-4 bg-neutral-200 rounded w-full" />
                <div className="h-3 bg-neutral-200 rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}

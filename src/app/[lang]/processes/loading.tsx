import PageContainer from '@/components/PageContainer'

export default function ProcessesLoading() {
  return (
    <PageContainer>
      <div className="mb-8">
        <div className="h-8 bg-neutral-200 rounded w-1/3 mb-2 animate-pulse" />
        <div className="h-4 bg-neutral-200 rounded w-2/3 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white border border-neutral-200 rounded-xl p-6 animate-pulse"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-5 bg-neutral-200 rounded w-3/4" />
                <div className="h-4 bg-neutral-200 rounded w-full" />
                <div className="h-4 bg-neutral-200 rounded w-4/5" />
                <div className="h-4 bg-neutral-200 rounded w-1/4 mt-2" />
              </div>
              <div className="w-5 h-5 bg-neutral-200 rounded flex-shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}

import PageContainer from '@/components/PageContainer'

export default function SearchLoading() {
  return (
    <PageContainer>
      <div className="py-8 md:py-12">
        <div className="max-w-3xl mx-auto mb-8">
          <div className="h-8 bg-neutral-200 rounded w-1/4 mb-2 animate-pulse" />
          <div className="h-4 bg-neutral-200 rounded w-2/3 animate-pulse" />
        </div>
        <div className="mb-6">
          <div className="relative">
            <div className="h-14 bg-neutral-200 rounded-xl w-full animate-pulse" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-neutral-500 mb-1">Try:</span>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 bg-neutral-200 rounded-full animate-pulse w-32"
              />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-4 bg-neutral-200 rounded w-1/3 animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-neutral-200 rounded-xl p-5 animate-pulse"
              >
                <div className="h-5 bg-neutral-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-neutral-200 rounded w-full mb-2" />
                <div className="h-4 bg-neutral-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

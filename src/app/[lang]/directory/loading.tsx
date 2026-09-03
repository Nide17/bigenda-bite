import PageContainer from '@/components/PageContainer'

export default function DirectoryLoading() {
  return (
    <PageContainer>
      <div className="mb-8">
        <div className="h-8 bg-neutral-200 rounded w-1/4 mb-2 animate-pulse" />
        <div className="h-4 bg-neutral-200 rounded w-2/3 animate-pulse" />
      </div>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="h-10 bg-neutral-200 rounded-lg animate-pulse sm:w-48" />
          <div className="h-10 bg-neutral-200 rounded-lg w-24 animate-pulse" />
          <div className="h-10 bg-neutral-200 rounded-lg w-20 animate-pulse" />
        </div>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-9 bg-neutral-200 rounded-full animate-pulse w-40" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white border border-neutral-200 rounded-xl p-6 animate-pulse"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="h-5 bg-neutral-200 rounded w-2/3" />
              <div className="w-16 h-5 bg-neutral-200 rounded-full animate-pulse" />
            </div>
            <div className="h-4 bg-neutral-200 rounded w-3/4 mb-1" />
            <div className="h-4 bg-neutral-200 rounded w-1/2" />
            <div className="mt-2 h-4 bg-neutral-200 rounded w-1/4" />
          </div>
        ))}
      </div>
    </PageContainer>
  )
}

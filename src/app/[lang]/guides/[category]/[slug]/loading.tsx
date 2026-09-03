import PageContainer from '@/components/PageContainer'

export default function GuideDetailLoading() {
  return (
    <PageContainer>
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="h-4 bg-neutral-200 rounded w-20 animate-pulse" />
          <div className="h-4 bg-neutral-200 rounded w-4 animate-pulse" />
          <div className="h-4 bg-neutral-200 rounded w-24 animate-pulse" />
        </div>
      </div>

      <div className="mb-8">
        <div className="h-9 bg-neutral-200 rounded w-3/4 mb-4 animate-pulse" />
        <div className="h-6 bg-neutral-200 rounded w-full animate-pulse mb-2" />
        <div className="h-6 bg-neutral-200 rounded w-2/3 animate-pulse mb-6" />
        <div className="h-8 bg-neutral-200 rounded w-20 animate-pulse" />
      </div>

      <div className="mb-8 bg-white border border-neutral-200 rounded-xl p-5 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-4 bg-neutral-200 rounded" />
            <div className="h-4 bg-neutral-200 rounded w-4/5" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-neutral-200 rounded" />
            <div className="h-4 bg-neutral-200 rounded w-3/4" />
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="h-7 bg-neutral-200 rounded w-1/4 mb-6 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-neutral-200 rounded-xl p-5 animate-pulse"
            >
              <div className="h-4 bg-neutral-200 rounded w-full mb-2" />
              <div className="h-4 bg-neutral-200 rounded w-5/6" />
              <div className="h-3 bg-neutral-200 rounded w-1/4 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}

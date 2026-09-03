import PageContainer from '@/components/PageContainer'

export default function BusinessDetailLoading() {
  return (
    <PageContainer maxWidth="lg">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="h-4 bg-neutral-200 rounded w-20 animate-pulse" />
          <div className="h-4 bg-neutral-200 rounded w-4 animate-pulse" />
          <div className="h-4 bg-neutral-200 rounded w-24 animate-pulse" />
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8 mb-8 animate-pulse">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1 space-y-3">
            <div className="h-8 bg-neutral-200 rounded w-3/4" />
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-5 bg-neutral-200 rounded w-20" />
              <div className="h-4 bg-neutral-200 rounded w-16" />
            </div>
          </div>
          <div className="w-20 h-6 bg-neutral-200 rounded-full" />
        </div>

        <div className="h-4 bg-neutral-200 rounded w-1/3 mb-6" />
        <div className="h-4 bg-neutral-200 rounded w-full mb-2" />
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 rounded w-1/2 mt-4" />
      </div>
    </PageContainer>
  )
}

import PageContainer from '@/components/PageContainer'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

export default function ProcessDetailLoading() {
  return (
    <PageContainer>
      <div className="mb-6">
        <Breadcrumbs items={[{ label: 'Loading...' }]} />
      </div>

      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="h-9 bg-neutral-200 rounded w-3/4 animate-pulse" />
          <div className="w-20 h-6 bg-neutral-200 rounded-full animate-pulse" />
        </div>
        <div className="h-6 bg-neutral-200 rounded w-full animate-pulse mb-6" />
        <div className="h-4 bg-neutral-200 rounded w-1/3 animate-pulse mb-6" />
        <div className="h-6 bg-neutral-200 rounded w-20 animate-pulse" />
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
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-neutral-200 rounded-xl p-5 flex gap-4 animate-pulse"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-neutral-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-200 rounded" />
                <div className="h-4 bg-neutral-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}

import PageContainer from '@/components/PageContainer'

export default function Loading() {
  return (
    <PageContainer maxWidth="xl">
      <div className="py-10 md:py-14 space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-neutral-200 rounded w-full max-w-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse bg-white border border-neutral-200 rounded-xl p-6">
              <div className="h-5 bg-neutral-200 rounded w-2/3 mb-3" />
              <div className="h-4 bg-neutral-200 rounded w-full mb-2" />
              <div className="h-4 bg-neutral-200 rounded w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}

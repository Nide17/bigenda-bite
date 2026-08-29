export default function AdminLoading() {
  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-neutral-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-xl p-6">
              <div className="h-4 bg-neutral-200 rounded w-1/2 mb-3" />
              <div className="h-8 bg-neutral-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

import PageContainer from '@/components/PageContainer'
import Card from '@/components/ui/Card'
import { LayoutDashboardIcon } from 'lucide-react'

export default function AdminLoading() {
  return (
    <PageContainer>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-400">
          <LayoutDashboardIcon className="h-5 w-5" />
        </div>
        <div>
          <div className="h-6 bg-neutral-200 rounded w-40 mb-2" />
          <div className="h-4 bg-neutral-200 rounded w-56" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-5">
            <div className="h-4 bg-neutral-200 rounded w-1/2 mb-3" />
            <div className="h-8 bg-neutral-200 rounded w-1/3" />
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="h-5 bg-neutral-200 rounded w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-neutral-100 rounded-lg" />
          ))}
        </div>
      </Card>
    </PageContainer>
  )
}

import { getSession } from '@/lib/auth/session'
import { getAnalyticsSummary, getTopPages, getRevenueStats } from '@/lib/analytics'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import PageContainer from '@/components/PageContainer'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage() {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('next-auth.session-token')?.value || null)

  if (!session?.user || session.user.role !== 'editor') {
    redirect('/en/login')
  }

  const [summary, topPages, revenue] = await Promise.all([
    getAnalyticsSummary(7),
    getTopPages(7, 10),
    getRevenueStats(30),
  ])

  const metrics = [
    { label: 'Page Views', value: summary.pageViews.toLocaleString(), sub: `Last ${summary.days} days`, icon: '???' },
    { label: 'Ad Clicks', value: summary.adClicks.toLocaleString(), sub: `Last ${summary.days} days`, icon: '???' },
    { label: 'Payments', value: summary.payments.toLocaleString(), sub: `Last ${summary.days} days`, icon: '??' },
    { label: 'Contributions', value: summary.contributions.toLocaleString(), sub: `Last ${summary.days} days`, icon: '??' },
    { label: 'Leads', value: summary.leads.toLocaleString(), sub: `Last ${summary.days} days`, icon: '??' },
  ]

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold text-[#1e1b4b] mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-5">
            <div className="text-2xl mb-2">{metric.icon}</div>
            <h3 className="text-sm font-medium text-neutral-600 mb-1">{metric.label}</h3>
            <p className="text-2xl font-bold text-[#1e1b4b]">{metric.value}</p>
            <p className="text-xs text-neutral-500 mt-1">{metric.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-[#1e1b4b]">Top Pages</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="text-left p-3 font-semibold text-neutral-700">Path</th>
                  <th className="text-left p-3 font-semibold text-neutral-700">Event Type</th>
                  <th className="text-left p-3 font-semibold text-neutral-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {topPages.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-6 text-neutral-500 text-center">No page views yet</td>
                  </tr>
                ) : (
                  topPages.map((page: any) => (
                    <tr key={page._id.toString()} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-3 font-mono text-xs">{page.metadata?.path || '/'}</td>
                      <td className="p-3">
                        <Badge variant="info">{page.type}</Badge>
                      </td>
                      <td className="p-3 text-neutral-600">{new Date(page.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-[#1e1b4b]">Revenue</h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <p className="text-sm text-neutral-600 mb-1">Total Revenue (30 days)</p>
              <p className="text-4xl font-bold text-[#1e1b4b]">{revenue.total.toLocaleString()} RWF</p>
              <p className="text-sm text-neutral-500 mt-1">{revenue.count} successful payments</p>
            </div>
            {revenue.payments.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="text-left p-3 font-semibold text-neutral-700">Amount</th>
                      <th className="text-left p-3 font-semibold text-neutral-700">Plan</th>
                      <th className="text-left p-3 font-semibold text-neutral-700">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {revenue.payments.map((payment: any) => (
                      <tr key={payment._id.toString()} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-3 font-semibold text-[#1e1b4b]">{Number(payment.metadata?.amount || 0).toLocaleString()} RWF</td>
                        <td className="p-3">
                          <Badge variant="info">{payment.metadata?.planId || '-'}</Badge>
                        </td>
                        <td className="p-3 text-neutral-600">{new Date(payment.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}



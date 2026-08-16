import { getSession } from '@/lib/auth/session'
import { getAnalyticsSummary, getTopPages, getRevenueStats } from '@/lib/analytics'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

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

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="border p-6 rounded">
          <h3 className="text-sm font-semibold text-gray-600">Page Views</h3>
          <p className="text-3xl font-bold">{summary.pageViews.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Last {summary.days} days</p>
        </div>
        <div className="border p-6 rounded">
          <h3 className="text-sm font-semibold text-gray-600">Ad Clicks</h3>
          <p className="text-3xl font-bold">{summary.adClicks.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Last {summary.days} days</p>
        </div>
        <div className="border p-6 rounded">
          <h3 className="text-sm font-semibold text-gray-600">Payments</h3>
          <p className="text-3xl font-bold">{summary.payments.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Last {summary.days} days</p>
        </div>
        <div className="border p-6 rounded">
          <h3 className="text-sm font-semibold text-gray-600">Contributions</h3>
          <p className="text-3xl font-bold">{summary.contributions.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Last {summary.days} days</p>
        </div>
        <div className="border p-6 rounded">
          <h3 className="text-sm font-semibold text-gray-600">Leads</h3>
          <p className="text-3xl font-bold">{summary.leads.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Last {summary.days} days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border rounded">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Top Pages</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Path</th>
                <th className="text-left p-3">Event Type</th>
                <th className="text-left p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {topPages.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-gray-500 text-center">No page views yet</td>
                </tr>
              ) : (
                topPages.map((page: any) => (
                  <tr key={page._id.toString()} className="border-t">
                    <td className="p-3">{page.metadata?.path || '/'}</td>
                    <td className="p-3">{page.type}</td>
                    <td className="p-3">{new Date(page.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border rounded">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Revenue</h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600">Total Revenue (30 days)</p>
              <p className="text-4xl font-bold">{revenue.total.toLocaleString()} RWF</p>
              <p className="text-sm text-gray-500 mt-1">{revenue.count} successful payments</p>
            </div>
            {revenue.payments.length > 0 && (
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2">Amount</th>
                    <th className="text-left p-2">Plan</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {revenue.payments.map((payment: any) => (
                    <tr key={payment._id.toString()} className="border-t">
                      <td className="p-2">{Number(payment.metadata?.amount || 0).toLocaleString()} RWF</td>
                      <td className="p-2">{payment.metadata?.planId || '-'}</td>
                      <td className="p-2">{new Date(payment.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { getAnalyticsSummary, getTopPages, getRevenueStats } from '@/lib/analytics'

export async function GET(request: Request) {
  try {
    const session = await getSession((request as any).cookies?.get('next-auth.session-token')?.value || null)
    if (!session?.user || session.user.role !== 'editor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')

    const [summary, topPages, revenue] = await Promise.all([
      getAnalyticsSummary(days),
      getTopPages(days),
      getRevenueStats(days),
    ])

    return NextResponse.json({ summary, topPages, revenue })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
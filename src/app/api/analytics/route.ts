import { NextResponse, NextRequest } from 'next/server'
import { requireEditor } from '@/lib/auth/authorize'
import { getAnalyticsSummary, getTopPages, getRevenueStats } from '@/lib/analytics'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireEditor()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
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


import { connectToDatabase } from '@/lib/db/mongodb'

export type EventType = 'page_view' | 'ad_impression' | 'ad_click' | 'payment_initiated' | 'payment_success' | 'contribution_submitted' | 'lead_submitted'

export interface AnalyticsEvent {
  type: EventType
  userId?: string
  sessionId?: string
  metadata: Record<string, unknown>
  createdAt?: Date
}

export async function trackEvent(event: Omit<AnalyticsEvent, 'createdAt'>) {
  const db = await connectToDatabase()
  await db.collection('events').insertOne({
    ...event,
    createdAt: new Date(),
  })
}

export async function getAnalyticsSummary(days: number = 7) {
  const db = await connectToDatabase()
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const [
    pageViews,
    adClicks,
    payments,
    contributions,
    leads,
  ] = await Promise.all([
    db.collection('events').countDocuments({ type: 'page_view', createdAt: { $gte: since } }),
    db.collection('events').countDocuments({ type: 'ad_click', createdAt: { $gte: since } }),
    db.collection('events').countDocuments({ type: 'payment_success', createdAt: { $gte: since } }),
    db.collection('events').countDocuments({ type: 'contribution_submitted', createdAt: { $gte: since } }),
    db.collection('events').countDocuments({ type: 'lead_submitted', createdAt: { $gte: since } }),
  ])

  return { pageViews, adClicks, payments, contributions, leads, days }
}

export async function getTopPages(days: number = 7, limit: number = 10) {
  const db = await connectToDatabase()
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  return db.collection('events')
    .find({ type: 'page_view', createdAt: { $gte: since } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()
}

export async function getRevenueStats(days: number = 30) {
  const db = await connectToDatabase()
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const payments = await db.collection('events')
    .find({ type: 'payment_success', createdAt: { $gte: since } })
    .sort({ createdAt: -1 })
    .toArray()

  const total = payments.reduce((sum, p) => sum + (Number(p.metadata.amount) || 0), 0)

  return { total, count: payments.length, payments }
}
import { ObjectId } from 'mongodb'

export interface Ad {
  _id?: string
  title: string
  imageUrl: string
  linkUrl: string
  placement: 'sidebar' | 'top' | 'bottom' | 'inline'
  city?: string
  active: boolean
  impressions: number
  clicks: number
  startDate?: Date
  endDate?: Date
}

export async function getActiveAds(placement: string, city?: string) {
  const { connectToDatabase } = await import('@/lib/db/mongodb')
  const db = await connectToDatabase()

  const query: Record<string, unknown> = {
    placement,
    active: true,
    $or: [
      { startDate: { $lte: new Date() } },
      { startDate: { $exists: false } },
      { endDate: { $gte: new Date() } },
      { endDate: { $exists: false } },
    ],
  }

  if (city) {
    query.$or = [
      { city: city },
      { city: { $exists: false } },
      { city: '' },
    ]
  }

  return db.collection<Ad>('ads').find(query).toArray()
}

export async function trackImpression(adId: string) {
  const { connectToDatabase } = await import('@/lib/db/mongodb')
  const db = await connectToDatabase()
  await db.collection('ads').updateOne(
    { _id: new ObjectId(adId) },
    { $inc: { impressions: 1 } }
  )
}

export async function trackClick(adId: string) {
  const { connectToDatabase } = await import('@/lib/db/mongodb')
  const db = await connectToDatabase()
  await db.collection('ads').updateOne(
    { _id: new ObjectId(adId) },
    { $inc: { clicks: 1 } }
  )
}
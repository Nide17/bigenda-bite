import { requireEditor } from '@/lib/auth/authorize'
import { connectToDatabase } from '@/lib/db/mongodb'
import { redirect } from 'next/navigation'
import AdsClient from './AdsClient'

export const dynamic = 'force-dynamic'

async function getAds() {
  const db = await connectToDatabase()
  const ads = await db.collection('ads').find({}).sort({ createdAt: -1 }).limit(100).toArray()

  return ads.map((a) => ({
    _id: a._id.toString(),
    title: a.title || '',
    placement: a.placement || 'sidebar',
    city: a.city || '',
    linkUrl: a.linkUrl || '',
    imageUrl: a.imageUrl || '',
    active: a.active ?? true,
    impressions: a.impressions || 0,
    clicks: a.clicks || 0,
    startDate: a.startDate?.toISOString() || null,
    endDate: a.endDate?.toISOString() || null,
  }))
}

export default async function AdminAdsPage() {
  const auth = await requireEditor()
  if (auth.error) {
    redirect('/en/login')
    return
  }

  const serializedAds = await getAds()

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Ads Management</h1>
      <AdsClient ads={serializedAds} />
    </div>
  )
}

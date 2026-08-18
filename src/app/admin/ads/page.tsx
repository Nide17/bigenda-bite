import { getSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db/mongodb'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import AdsClient from './AdsClient'

export const dynamic = 'force-dynamic'

export default async function AdminAdsPage() {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('next-auth.session-token')?.value || null)
  const user = session?.user

  if (!user || user.role !== 'editor') {
    redirect('/en/login')
  }

  try {
    const db = await connectToDatabase()
    const ads = await db.collection('ads').find({}).sort({ createdAt: -1 }).limit(100).toArray()

    const serializedAds = ads.map((a: any) => ({
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

    return (
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">Ads Management</h1>
        <AdsClient ads={serializedAds} />
      </div>
    )
  } catch (error) {
    console.error('Admin ads page error:', error)
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">Ads Management</h1>
        <p className="text-red-500">Error loading ads. Check server logs.</p>
      </div>
    )
  }
}



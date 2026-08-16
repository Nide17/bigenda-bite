import { NextResponse } from 'next/server'
import { getActiveAds } from '@/lib/ads'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const placement = searchParams.get('placement') || 'sidebar'
    const city = searchParams.get('city') || undefined

    const ads = await getActiveAds(placement, city)

    return NextResponse.json(ads)
  } catch (error) {
    console.error('Error fetching ads:', error)
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 })
  }
}

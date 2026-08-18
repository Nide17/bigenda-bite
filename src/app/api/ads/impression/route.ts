import { NextResponse } from 'next/server'
import { trackImpression } from '@/lib/ads'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { adId } = body

    if (!adId) {
      return NextResponse.json({ error: 'adId is required' }, { status: 400 })
    }

    await trackImpression(adId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking impression:', error)
    return NextResponse.json({ error: 'Failed to track impression' }, { status: 500 })
  }
}


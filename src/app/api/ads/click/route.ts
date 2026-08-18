import { NextResponse } from 'next/server'
import { trackClick } from '@/lib/ads'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { adId } = body

    if (!adId) {
      return NextResponse.json({ error: 'adId is required' }, { status: 400 })
    }

    await trackClick(adId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking click:', error)
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
  }
}


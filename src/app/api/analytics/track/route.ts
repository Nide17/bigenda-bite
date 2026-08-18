import { NextResponse } from 'next/server'
import { trackEvent } from '@/lib/analytics'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, metadata } = body

    if (!type) {
      return NextResponse.json({ error: 'type is required' }, { status: 400 })
    }

    await trackEvent({ type, metadata: metadata || {} })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics track error:', error)
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}

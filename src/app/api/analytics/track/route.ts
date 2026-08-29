import { NextResponse } from 'next/server'
import { trackEvent, EventType } from '@/lib/analytics'
import { parseJson, requireFields, fail } from '@/lib/api/validate'

const ALLOWED_EVENT_TYPES: EventType[] = [
  'page_view',
  'ad_impression',
  'ad_click',
  'payment_initiated',
  'payment_success',
  'contribution_submitted',
  'lead_submitted',
]

export async function POST(request: Request) {
  try {
    const parsed = await parseJson<{ type: string; metadata?: Record<string, unknown> }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['type'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    const eventType = parsed.data.type as EventType

    if (!ALLOWED_EVENT_TYPES.includes(eventType)) {
      return NextResponse.json(fail('Invalid event type'), { status: 400 })
    }

    await trackEvent({ type: eventType, metadata: parsed.data.metadata || {} })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics track error:', error)
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { trackImpression } from '@/lib/ads'
import { parseJson, requireFields } from '@/lib/api/validate'

export async function POST(request: Request) {
  try {
    const parsed = await parseJson<{ adId: string }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['adId'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    await trackImpression(parsed.data.adId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking impression:', error)
    return NextResponse.json({ error: 'Failed to track impression' }, { status: 500 })
  }
}


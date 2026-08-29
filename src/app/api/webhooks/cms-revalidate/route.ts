import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { parseJson, requireFields } from '@/lib/api/validate'

export async function POST(request: Request) {
  try {
    const parsed = await parseJson<{ tag?: string }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['tag'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    const providedToken = request.headers.get('x-sanity-webhook-token')
    const expectedToken = process.env.SANITY_WEBHOOK_TOKEN

    if (!expectedToken || providedToken !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    revalidateTag(parsed.data.tag!)
    return NextResponse.json({ revalidated: true, tag: parsed.data.tag })
  } catch (error) {
    console.error('Error revalidating:', error)
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 })
  }
}



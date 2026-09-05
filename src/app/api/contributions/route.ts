import { NextResponse, NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth/authorize'
import { connectToDatabase } from '@/lib/db/mongodb'
import { parseJson, requireFields } from '@/lib/api/validate'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { searchParams } = new URL(request.url)
    const guideId = searchParams.get('guideId')
    const db = await connectToDatabase()
    const contributions = db.collection('contributions')

    const query: Record<string, unknown> = { status: 'published' }
    if (guideId) query.guideId = guideId

    const results = await contributions.find(query).sort({ submittedAt: -1 }).limit(50).toArray()

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error fetching contributions:', error)
    return NextResponse.json({ error: 'Failed to fetch contributions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const session = auth.session!
    const parsed = await parseJson<{ guideId?: string; text: string; city?: string }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['text'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    const { guideId, text, city } = parsed.data

    const db = await connectToDatabase()
    const contributions = db.collection('contributions')

    const result = await contributions.insertOne({
      guideId: guideId || null,
      city: city || null,
      authorId: session.user.id,
      text: text.trim(),
      photoUrl: null,
      status: 'pending',
      upvotes: 0,
      flags: 0,
      promoted: false,
      submittedAt: new Date(),
    })

    return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 })
  } catch (error) {
    console.error('Error creating contribution:', error)
    return NextResponse.json({ error: 'Failed to create contribution' }, { status: 500 })
  }
}




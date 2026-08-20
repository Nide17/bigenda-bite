import { NextResponse, NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth/authorize'
import { connectToDatabase } from '@/lib/db/mongodb'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
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
    const auth = await requireAuth(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const session = auth.session!
    const body = await request.json()
    const { guideId, text, city } = body as { guideId?: string; text: string; city?: string }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

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

    return NextResponse.json({ id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Error creating contribution:', error)
    return NextResponse.json({ error: 'Failed to create contribution' }, { status: 500 })
  }
}




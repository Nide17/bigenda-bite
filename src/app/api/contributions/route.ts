import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { connectToDatabase } from '@/lib/db/mongodb'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!(session as any)?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!(session as any)?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { guideId, text, city } = body

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    const db = await connectToDatabase()
    const contributions = db.collection('contributions')

    const result = await contributions.insertOne({
      guideId: guideId || null,
      city: city || null,
      authorId: (session as any).user.id,
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


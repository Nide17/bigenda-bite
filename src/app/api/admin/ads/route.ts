import { NextResponse, NextRequest } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request.cookies.get('next-auth.session-token')?.value || null)
    if (!session?.user || session.user.role !== 'editor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await connectToDatabase()
    const ads = await db.collection('ads').find({}).sort({ createdAt: -1 }).limit(100).toArray()

    return NextResponse.json(ads)
  } catch (error) {
    console.error('Error fetching ads:', error)
    return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request.cookies.get('next-auth.session-token')?.value || null)
    if (!session?.user || session.user.role !== 'editor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, placement, city, linkUrl, imageUrl, active, startDate, endDate } = body

    if (!title || !linkUrl || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = await connectToDatabase()

    const result = await db.collection('ads').insertOne({
      title,
      placement: placement || 'sidebar',
      city: city || '',
      linkUrl,
      imageUrl,
      active: active ?? true,
      impressions: 0,
      clicks: 0,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      createdAt: new Date(),
    })

    return NextResponse.json({ _id: result.insertedId.toString(), success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating ad:', error)
    return NextResponse.json({ error: 'Failed to create ad' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession(request.cookies.get('next-auth.session-token')?.value || null)
    if (!session?.user || session.user.role !== 'editor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const body = await request.json()
    const { title, placement, city, linkUrl, imageUrl, active, startDate, endDate } = body

    const db = await connectToDatabase()
    const update: Record<string, unknown> = {}

    if (title !== undefined) update.title = title
    if (placement !== undefined) update.placement = placement
    if (city !== undefined) update.city = city
    if (linkUrl !== undefined) update.linkUrl = linkUrl
    if (imageUrl !== undefined) update.imageUrl = imageUrl
    if (active !== undefined) update.active = active
    if (startDate !== undefined) update.startDate = startDate ? new Date(startDate) : undefined
    if (endDate !== undefined) update.endDate = endDate ? new Date(endDate) : undefined

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const result = await db.collection('ads').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating ad:', error)
    return NextResponse.json({ error: 'Failed to update ad' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession(request.cookies.get('next-auth.session-token')?.value || null)
    if (!session?.user || session.user.role !== 'editor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const db = await connectToDatabase()
    const result = await db.collection('ads').deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting ad:', error)
    return NextResponse.json({ error: 'Failed to delete ad' }, { status: 500 })
  }
}

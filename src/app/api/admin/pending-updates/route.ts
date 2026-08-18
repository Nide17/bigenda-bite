import { NextResponse, NextRequest } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db/mongodb'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request.cookies.get('next-auth.session-token')?.value || null)
    if (!session?.user || session.user.role !== 'editor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await connectToDatabase()
    const pendingUpdates = db.collection('pendingUpdates')

    const updates = await pendingUpdates
      .find({ status: 'pending' })
      .sort({ detectedAt: -1 })
      .limit(50)
      .toArray()

    return NextResponse.json(updates)
  } catch (error) {
    console.error('Error fetching pending updates:', error)
    return NextResponse.json({ error: 'Failed to fetch pending updates' }, { status: 500 })
  }
}


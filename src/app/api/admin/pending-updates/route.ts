import { NextResponse } from 'next/server'
import { requireEditor } from '@/lib/auth/authorize'
import { connectToDatabase } from '@/lib/db/mongodb'

export async function GET() {
  try {
    const auth = await requireEditor()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
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



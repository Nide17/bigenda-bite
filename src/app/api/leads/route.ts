import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { businessId, contactName, contactPhone, message, source } = body

    if (!businessId || !contactName || !contactPhone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = await connectToDatabase()
    const leads = db.collection('leads')

    await leads.insertOne({
      businessId,
      contactName,
      contactPhone,
      message: message || null,
      source: source || 'directory_page',
      status: 'new',
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}


import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import { parseJson, requireFields } from '@/lib/api/validate'

export async function POST(request: Request) {
  try {
    const parsed = await parseJson<{ businessId: string; contactName: string; contactPhone: string; message?: string; source?: string }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['businessId', 'contactName', 'contactPhone'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    const { businessId, contactName, contactPhone, message, source } = parsed.data

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


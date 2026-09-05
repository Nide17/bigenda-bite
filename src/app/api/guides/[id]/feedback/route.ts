import { NextResponse, NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth/authorize'
import { connectToDatabase } from '@/lib/db/mongodb'
import { createClient } from '@sanity/client'
import { parseJson, requireFields, ok } from '@/lib/api/validate'

function createSanityClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  })
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const session = auth.session!
    const { id } = await params
    const parsed = await parseJson<{ action: 'verify' | 'report'; reason?: string }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['action'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    const { action, reason } = parsed.data

    const db = await connectToDatabase()
    const feedbackCollection = db.collection('guideFeedback')

    const existing = await feedbackCollection.findOne({
      guideId: id,
      userId: session.user.id,
    })

    if (existing) {
      return NextResponse.json({ error: 'You have already submitted feedback for this guide' }, { status: 409 })
    }

    await feedbackCollection.insertOne({
      guideId: id,
      userId: session.user.id,
      userEmail: session.user.email,
      action,
      reason: reason || null,
      createdAt: new Date(),
    })

    const sanityClient = createSanityClient()

    if (action === 'verify') {
      await sanityClient.patch(id).set({
        lastVerifiedDate: new Date().toISOString(),
        outdatedReportsCount: 0,
      }).commit()
    } else if (action === 'report') {
      const guide = await sanityClient.fetch<{ outdatedReportsCount?: number }>(
        `*[_type == "guide" && _id == $id][0]`,
        { id }
      )

      const currentCount = guide?.outdatedReportsCount || 0
      await sanityClient.patch(id).set({
        outdatedReportsCount: currentCount + 1,
      }).commit()
    }

    return ok({ success: true })
  } catch (error) {
    console.error('Error submitting guide feedback:', error)
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
  }
}

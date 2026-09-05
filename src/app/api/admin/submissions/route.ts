import { NextResponse, NextRequest } from 'next/server'
import { requireEditor } from '@/lib/auth/authorize'
import { connectToDatabase } from '@/lib/db/mongodb'
import { ObjectId } from 'mongodb'
import { parseJson, requireFields, fail, ok } from '@/lib/api/validate'
import type { UserSubmission } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireEditor(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as UserSubmission['status'] | null
    const contentType = searchParams.get('contentType') as UserSubmission['contentType'] | null
    const type = searchParams.get('type') as UserSubmission['type'] | null

    const db = await connectToDatabase()
    const submissions = db.collection('userSubmissions')

    const query: Record<string, unknown> = {}
    if (status) query.status = status
    if (contentType) query.contentType = contentType
    if (type) query.type = type

    const results = await submissions.find(query).sort({ createdAt: -1 }).limit(100).toArray()

    return ok(results)
  } catch (error) {
    console.error('Error fetching admin submissions:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireEditor(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const session = auth.session!
    const parsed = await parseJson<{ action: 'approve' | 'reject' | 'publish'; id: string; reviewNote?: string }>(request)
    if (!parsed.ok) return parsed.response

    const missing = requireFields(parsed.data, ['action', 'id'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    const { action, id, reviewNote } = parsed.data
    const db = await connectToDatabase()
    const submissions = db.collection('userSubmissions')

    const submission = await submissions.findOne({ _id: new ObjectId(id) })
    if (!submission) {
      return NextResponse.json(fail('Submission not found', 404), { status: 404 })
    }

    if (submission.status !== 'pending') {
      return NextResponse.json(fail('Submission is not pending'), { status: 400 })
    }

    const update: Record<string, unknown> = {
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
      reviewNote: reviewNote || '',
    }

    if (action === 'approve') {
      update.status = 'approved'
    } else if (action === 'reject') {
      update.status = 'rejected'
    } else if (action === 'publish') {
      if ((submission as Record<string, unknown>).type !== 'edit_suggestion') {
        return NextResponse.json(fail('Only edit suggestions can be published'), { status: 400 })
      }
      update.status = 'published'
      update.publishedAt = new Date()
    } else {
      return NextResponse.json(fail('Invalid action'), { status: 400 })
    }

    await submissions.updateOne({ _id: new ObjectId(id) }, { $set: update })

    return ok({ success: true })
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 })
  }
}

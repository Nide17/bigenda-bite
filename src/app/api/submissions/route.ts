import { NextResponse, NextRequest } from 'next/server'
import { connectToDatabase } from '@/lib/db/mongodb'
import { requireAuth } from '@/lib/auth/authorize'
import { parseJson, requireFields, fail, ok } from '@/lib/api/validate'
import type { UserSubmission, SubmissionType, ContentType } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get('contentType') as ContentType | null
    const contentId = searchParams.get('contentId')
    const type = searchParams.get('type') as SubmissionType | null

    if (!contentType || !contentId) {
      return NextResponse.json(fail('contentType and contentId are required'), { status: 400 })
    }

    const db = await connectToDatabase()
    const submissions = db.collection<UserSubmission>('userSubmissions')

    const query: Record<string, unknown> = {
      contentType,
      contentId,
      status: 'approved',
    }

    if (type) {
      query.type = type
    }

    const results = await submissions.find(query).sort({ createdAt: -1 }).limit(50).toArray()

    return ok(results)
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const session = auth.session!
    const parsed = await parseJson<{
      type: SubmissionType
      contentType: ContentType
      contentId: string
      contentSlug?: string
      text: string
      suggestedFields?: Record<string, unknown>
      rating?: number
    }>(request)

    if (!parsed.ok) return parsed.response

    const { type, contentType, contentId, contentSlug, text, suggestedFields, rating } = parsed.data

    const missing = requireFields(parsed.data, ['type', 'contentType', 'contentId', 'text'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    const validTypes: SubmissionType[] = ['comment', 'edit_suggestion', 'additional_info', 'review']
    if (!validTypes.includes(type)) {
      return NextResponse.json(fail('Invalid submission type'), { status: 400 })
    }

    const validContentTypes: ContentType[] = ['process', 'guide', 'business']
    if (!validContentTypes.includes(contentType)) {
      return NextResponse.json(fail('Invalid content type'), { status: 400 })
    }

    if (type === 'review' && (!rating || rating < 1 || rating > 5)) {
      return NextResponse.json(fail('Rating must be between 1 and 5'), { status: 400 })
    }

    if (!text.trim() && !suggestedFields) {
      return NextResponse.json(fail('Text or suggestedFields are required'), { status: 400 })
    }

    const db = await connectToDatabase()
    const submissions = db.collection<UserSubmission>('userSubmissions')

    const now = new Date()
    const submission: Omit<UserSubmission, '_id'> = {
      type,
      contentType,
      contentId,
      contentSlug: contentSlug || '',
      userId: session.user.id,
      userDisplayName: session.user.displayName || session.user.email,
      userEmail: session.user.email,
      text: text.trim(),
      suggestedFields: suggestedFields || undefined,
      rating: type === 'review' ? rating : undefined,
      status: 'pending',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }

    const result = await submissions.insertOne(submission as UserSubmission)

    return ok({ id: result.insertedId.toString() }, 201)
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 })
  }
}

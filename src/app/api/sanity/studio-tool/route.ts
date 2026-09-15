import { NextResponse, NextRequest } from 'next/server'
import { requireEditor } from '@/lib/auth/authorize'
import { parseJson, requireFields, fail } from '@/lib/api/validate'
import { createClient } from '@sanity/client'

const ALLOWED_TYPES = ['process', 'guide', 'alert'] as const

function createSanityClient() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
  }
  if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET')
  }
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error('Missing SANITY_API_TOKEN')
  }
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  })
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireEditor()
    if (auth.error) {
      const message = auth.status === 401 ? 'You must be signed in as an editor or admin.' : 'You do not have permission to manage content.'
      return NextResponse.json({ error: message }, { status: auth.status })
    }

    const parsed = await parseJson<{ action?: string; type?: string; data?: Record<string, unknown>; id?: string }>(request)
    if (!parsed.ok) return parsed.response

    const { action, type } = parsed.data

    const missing = requireFields(parsed.data, ['action', 'type'])
    if (missing) return NextResponse.json(missing, { status: missing.status })

    if (!ALLOWED_TYPES.includes(type as typeof ALLOWED_TYPES[number])) {
      return NextResponse.json(fail('Invalid document type'), { status: 400 })
    }

    const sanityClient = createSanityClient()

    if (action === 'create') {
      const dataMissing = requireFields(parsed.data, ['data'])
      if (dataMissing) return NextResponse.json(dataMissing, { status: dataMissing.status })
      const doc = await sanityClient.create({
        _type: parsed.data.type!,
        ...parsed.data.data,
      })
      return NextResponse.json({ success: true, document: doc })
    }

    if (action === 'list') {
      const docs = await sanityClient.fetch('*[_type == $type] | order(_createdAt desc)', { type: parsed.data.type! })
      return NextResponse.json({ success: true, documents: docs })
    }

    if (action === 'delete') {
      const idMissing = requireFields(parsed.data, ['id'])
      if (idMissing) return NextResponse.json(idMissing, { status: idMissing.status })
      // Soft-delete: set deletedAt instead of removing the document, so it can be restored.
      await sanityClient.patch(parsed.data.id as string).set({ deletedAt: new Date().toISOString() }).commit()
      return NextResponse.json({ success: true })
    }

    if (action === 'restore') {
      const idMissing = requireFields(parsed.data, ['id'])
      if (idMissing) return NextResponse.json(idMissing, { status: idMissing.status })
      await sanityClient.patch(parsed.data.id as string).unset(['deletedAt']).commit()
      return NextResponse.json({ success: true })
    }

    if (action === 'hard_delete') {
      const idMissing = requireFields(parsed.data, ['id'])
      if (idMissing) return NextResponse.json(idMissing, { status: idMissing.status })
      await sanityClient.delete(parsed.data.id as string)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(fail('Unsupported action'), { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sanity operation failed'
    console.error('Sanity studio tool proxy error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
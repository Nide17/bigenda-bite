import { NextResponse, NextRequest } from 'next/server'
import { requireEditor } from '@/lib/auth/authorize'
import { parseJson, requireFields, fail } from '@/lib/api/validate'
import { createClient } from '@sanity/client'

const ALLOWED_TYPES = ['process', 'guide', 'alert'] as const

function createSanityClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  })
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireEditor(request)
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const parsed = await parseJson<{ action?: string; type?: string; data?: Record<string, unknown> }>(request)
    if (!parsed.ok) return parsed.response

    const { action, type, data } = parsed.data

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
        ...data,
      })
      return NextResponse.json({ success: true, document: doc })
    }

    if (action === 'list') {
      const docs = await sanityClient.fetch('*[_type == $type] | order(_createdAt desc)', { type: parsed.data.type! })
      return NextResponse.json({ success: true, documents: docs })
    }

    return NextResponse.json(fail('Unsupported action'), { status: 400 })
  } catch (error) {
    console.error('Sanity studio tool proxy error:', error)
    return NextResponse.json({ error: 'Sanity operation failed' }, { status: 500 })
  }
}

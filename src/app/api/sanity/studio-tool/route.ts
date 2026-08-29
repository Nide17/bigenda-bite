import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@sanity/client'

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
    const body = await request.json()
    const { action, type, data } = body

    if (!action || !type) {
      return NextResponse.json({ error: 'action and type are required' }, { status: 400 })
    }

    const sanityClient = createSanityClient()

    if (action === 'create') {
      if (!data) {
        return NextResponse.json({ error: 'data is required for create' }, { status: 400 })
      }
      const doc = await sanityClient.create({
        _type: type,
        ...data,
      })
      return NextResponse.json({ success: true, document: doc })
    }

    if (action === 'list') {
      const docs = await sanityClient.fetch('*[_type == $type] | order(_createdAt desc)', { type })
      return NextResponse.json({ success: true, documents: docs })
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 })
  } catch (error) {
    console.error('Sanity studio tool proxy error:', error)
    return NextResponse.json({ error: 'Sanity operation failed' }, { status: 500 })
  }
}

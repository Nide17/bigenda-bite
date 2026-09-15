import { NextResponse } from 'next/server'
import { requireEditor } from '@/lib/auth/authorize'
import { createClient } from '@sanity/client'

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

export async function GET() {
  try {
    const auth = await requireEditor()
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const client = createSanityClient()
    const documents = await client.fetch(
      `*[_type in ["process", "guide", "alert"] && defined(deletedAt)] | order(deletedAt desc)[0...200]`
    )
    return NextResponse.json({ success: true, documents })
  } catch (error) {
    console.error('Sanity trash fetch error:', error)
    return NextResponse.json({ error: 'Failed to load trash' }, { status: 500 })
  }
}
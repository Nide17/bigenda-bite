import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tag } = body

    if (!tag) {
      return NextResponse.json({ error: 'Missing tag' }, { status: 400 })
    }

    revalidateTag(tag)
    return NextResponse.json({ revalidated: true, tag })
  } catch (error) {
    console.error('Error revalidating:', error)
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 })
  }
}



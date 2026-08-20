import { NextResponse } from 'next/server'
import { getProcesses, getGuides, getAlerts } from '@/lib/cms/sanity'
import { connectToDatabase } from '@/lib/db/mongodb'
import type { SearchResponse, SearchResult } from '@/types/search'

const SUPPORTED_LANGUAGES = ['en', 'fr', 'rw'] as const

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function matchText(query: string, text: string | undefined) {
  if (!text) return false
  const escaped = escapeRegExp(query)
  return new RegExp(escaped, 'i').test(text)
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawQuery = searchParams.get('q') || ''
    const lang = searchParams.get('lang') || 'en'

    if (!SUPPORTED_LANGUAGES.includes(lang as typeof SUPPORTED_LANGUAGES[number])) {
      return NextResponse.json({ error: 'Unsupported language' }, { status: 400 })
    }

    const query = rawQuery.trim()
    if (!query || query.length < 2) {
      return NextResponse.json<SearchResponse>({
        results: [],
        query,
        language: lang,
        total: 0,
      })
    }

    const [processes, guides, alerts, db] = await Promise.all([
      getProcesses(lang),
      getGuides(lang),
      getAlerts(),
      connectToDatabase(),
    ])

    const results: SearchResult[] = []

    for (const process of processes) {
      const title = process.translations?.[lang]?.title || process.translations?.en?.title || ''
      const description = process.translations?.[lang]?.summary || process.translations?.en?.summary || ''
      if (matchText(query, title) || matchText(query, description)) {
        results.push({
          type: 'process',
          title,
          description,
          category: process.category,
          language: lang,
          url: `/${lang}/processes/${process.category}/${process.slug?.current || process._id}`,
          metadata: { sourceType: process.sourceType, lastVerifiedDate: process.lastVerifiedDate },
        })
      }
    }

    for (const guide of guides) {
      const title = guide.translations?.[lang]?.title || guide.translations?.en?.title || ''
      const description = guide.translations?.[lang]?.summary || guide.translations?.en?.summary || ''
      if (matchText(query, title) || matchText(query, description)) {
        results.push({
          type: 'guide',
          title,
          description,
          category: guide.category,
          language: lang,
          url: `/${lang}/guides/${guide.category}/${guide.slug?.current || guide._id}`,
          metadata: { lastReviewedDate: guide.lastReviewedDate },
        })
      }
    }

    for (const alert of alerts) {
      const title = typeof alert.translations === 'string' ? alert.translations : ''
      const description = title
      if (matchText(query, title) || matchText(query, description)) {
        results.push({
          type: 'alert',
          title,
          description,
          category: alert.type,
          language: lang,
          url: `/${lang}/alerts`,
          metadata: { severity: alert.severity, expiresAt: alert.expiresAt },
        })
      }
    }

    try {
      const businesses = await db.collection('businesses').find({}).limit(200).toArray()
      for (const business of businesses) {
        const name = business.name || ''
        const description = business.description || ''
        if (matchText(query, name) || matchText(query, description)) {
          results.push({
            type: 'business',
            title: name,
            description,
            category: business.category,
            language: lang,
            url: `/${lang}/directory/${business.slug || business._id.toString()}`,
            metadata: { city: business.city, contact: business.contact },
          })
        }
      }
    } catch (error) {
      console.error('Error searching businesses:', error)
    }

    const response: SearchResponse = {
      results,
      query,
      language: lang,
      total: results.length,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error performing search:', error)
    return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 })
  }
}

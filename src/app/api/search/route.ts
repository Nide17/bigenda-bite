import { NextResponse } from 'next/server'
import { getProcesses, getGuides, getAlerts } from '@/lib/cms/sanity'
import { connectToDatabase } from '@/lib/db/mongodb'
import type { SearchResponse, SearchResult } from '@/types/search'

const SUPPORTED_LANGUAGES = ['en', 'fr', 'rw'] as const
const SEARCHABLE_TYPES = ['process', 'guide', 'alert', 'business'] as const
type SearchableType = typeof SEARCHABLE_TYPES[number]

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s,./-]+/)
    .filter(Boolean)
}

function relevanceScore(queryTokens: string[], text: string): number {
  const lower = text.toLowerCase()
  let score = 0
  for (const token of queryTokens) {
    if (lower === token) {
      score += 10
    } else if (lower.startsWith(token)) {
      score += 5
    } else if (lower.includes(token)) {
      score += 1
    }
  }
  return score
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawQuery = searchParams.get('q') || ''
    const lang = searchParams.get('lang') || 'en'
    const typeFilter = searchParams.get('type') || ''
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50)

    if (!SUPPORTED_LANGUAGES.includes(lang as typeof SUPPORTED_LANGUAGES[number])) {
      return NextResponse.json({ error: 'Unsupported language' }, { status: 400 })
    }

    const typesToSearch: SearchableType[] = typeFilter
      ? typeFilter.split(',').filter((t): t is SearchableType => SEARCHABLE_TYPES.includes(t as SearchableType))
      : [...SEARCHABLE_TYPES]

    const query = rawQuery.trim()
    if (!query || query.length < 2) {
      return NextResponse.json<SearchResponse>({
        results: [],
        query,
        language: lang,
        total: 0,
      })
    }

    const queryTokens = tokenize(query)
    const [processes, guides, alerts, db] = await Promise.all([
      getProcesses(lang),
      getGuides(lang),
      getAlerts(),
      connectToDatabase(),
    ])

    const results: SearchResult[] = []

    if (typesToSearch.includes('process')) {
      for (const process of processes) {
        const title = process.translations?.[lang]?.title || process.translations?.en?.title || ''
        const description = process.translations?.[lang]?.summary || process.translations?.en?.summary || ''
        const combined = `${title} ${description} ${process.category || ''}`
        const score = relevanceScore(queryTokens, combined)
        if (score > 0 && (title.length > 0 || description.length > 0)) {
          results.push({
            type: 'process',
            title,
            description,
            category: process.category,
            language: lang,
            url: `/${lang}/processes/${process.category}/${process.slug?.current || process._id}`,
            score,
            metadata: { sourceType: process.sourceType, lastVerifiedDate: process.lastVerifiedDate },
          })
        }
      }
    }

    if (typesToSearch.includes('guide')) {
      for (const guide of guides) {
        const title = guide.translations?.[lang]?.title || guide.translations?.en?.title || ''
        const description = guide.translations?.[lang]?.summary || guide.translations?.en?.summary || ''
        const combined = `${title} ${description} ${guide.category || ''}`
        const score = relevanceScore(queryTokens, combined)
        if (score > 0 && (title.length > 0 || description.length > 0)) {
          results.push({
            type: 'guide',
            title,
            description,
            category: guide.category,
            language: lang,
            url: `/${lang}/guides/${guide.category}/${guide.slug?.current || guide._id}`,
            score,
            metadata: { lastReviewedDate: guide.lastReviewedDate },
          })
        }
      }
    }

    if (typesToSearch.includes('alert')) {
      for (const alert of alerts) {
        const title = typeof alert.translations?.en === 'string' ? alert.translations.en : ''
        if (!title) continue
        const score = relevanceScore(queryTokens, title)
        if (score > 0) {
          results.push({
            type: 'alert',
            title,
            description: title,
            category: alert.type,
            language: lang,
            url: `/${lang}/alerts`,
            score,
            metadata: { severity: alert.severity, expiresAt: alert.expiresAt },
          })
        }
      }
    }

    if (typesToSearch.includes('business')) {
      try {
        const businesses = await db.collection('businesses').find({}).limit(200).toArray()
        for (const business of businesses) {
          const name = business.name || ''
          const description = business.description || ''
          const combined = `${name} ${description} ${business.category || ''} ${business.city || ''}`
          const score = relevanceScore(queryTokens, combined)
          if (score > 0) {
            results.push({
              type: 'business',
              title: name,
              description,
              category: business.category,
              language: lang,
              url: `/${lang}/directory/${business.slug || business._id.toString()}`,
              score,
              metadata: { city: business.city, contact: business.contact },
            })
          }
        }
      } catch (error) {
        console.error('Error searching businesses:', error)
      }
    }

    results.sort((a, b) => (b.score || 0) - (a.score || 0))
    const sliced = results.slice(0, limit)

    const response: SearchResponse = {
      results: sliced,
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

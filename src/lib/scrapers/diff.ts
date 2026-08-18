import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@sanity/client'
import type { ScrapedProcess } from './types'

function createSanityClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  })
}

export interface DiffResult {
  hasChanges: boolean
  diffSummary: string
  confidenceScore: number
  normalizedDoc: ScrapedProcess
  existingDocId?: string
}

function summarizeFieldChanges(field: string, oldValue: unknown, newValue: unknown): string {
  if (JSON.stringify(oldValue) === JSON.stringify(newValue)) return ''

  const oldStr = typeof oldValue === 'object' ? JSON.stringify(oldValue) : String(oldValue || '')
  const newStr = typeof newValue === 'object' ? JSON.stringify(newValue) : String(newValue || '')

  if (oldStr.length > 120) return `${field} updated`
  return `${field}: "${oldStr.slice(0, 60)}" → "${newStr.slice(0, 60)}"`
}

export async function computeDiff(scraped: ScrapedProcess): Promise<DiffResult> {
  const client = createSanityClient()

  const existing = await client.fetch(
    `*[_type == $type && translations.en.title == $title][0]`,
    { type: scraped._type, title: scraped.translations.en.title }
  )

  const changes: string[] = []
  let magnitude = 0

  if (!existing) {
    return {
      hasChanges: true,
      diffSummary: `New ${scraped._type} detected: "${scraped.translations.en.title}"`,
      confidenceScore: scraped.confidenceScore,
      normalizedDoc: scraped,
    }
  }

  if (existing.translations?.en?.summary !== scraped.translations.en.summary) {
    const summary = summarizeFieldChanges('summary', existing.translations.en.summary, scraped.translations.en.summary)
    if (summary) { changes.push(summary); magnitude++ }
  }

  const existingSteps = existing.steps || []
  const scrapedSteps = scraped.steps || []
  if (JSON.stringify(existingSteps) !== JSON.stringify(scrapedSteps)) {
    changes.push(`steps updated (${scrapedSteps.length} steps)`); magnitude++
  }

  const existingFees = existing.fees || []
  const scrapedFees = scraped.fees || []
  if (JSON.stringify(existingFees) !== JSON.stringify(scrapedFees)) {
    changes.push(`fees updated`); magnitude++
  }

  if (existing.category !== scraped.category) {
    changes.push(`category: "${existing.category}" → "${scraped.category}"`); magnitude++
  }

  if (existing.tags?.sort().join(',') !== scraped.tags.sort().join(',')) {
    changes.push(`tags updated`); magnitude++
  }

  const hasChanges = changes.length > 0
  const confidenceScore = Math.min(0.99, scraped.confidenceScore + (hasChanges ? magnitude * 0.02 : 0))

  return {
    hasChanges,
    diffSummary: hasChanges ? changes.join('; ') : 'No significant changes detected',
    confidenceScore,
    normalizedDoc: scraped,
    existingDocId: existing._id,
  }
}


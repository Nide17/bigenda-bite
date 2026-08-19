import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { connectToDatabase } from '../src/lib/db/mongodb'
import { createClient } from '@sanity/client'
import { scrapeIrembo, scrapeRRA, scrapeRDB } from '../src/lib/scrapers'
import { computeDiff } from '../src/lib/scrapers/diff'
import { sendPendingUpdateNotification } from '../src/lib/discord'
import { launchBrowser, createPage } from '../src/lib/scrapers/browser'
import type { Page } from 'playwright'
import type { ScrapedProcess } from '../src/lib/scrapers/types'

const CONFIDENCE_THRESHOLD = 0.7
const ADMIN_URL = process.env.NEXT_PUBLIC_BASE_URL
  ? `${process.env.NEXT_PUBLIC_BASE_URL}/admin/pending-updates`
  : 'http://localhost:3000/admin/pending-updates'

function createSanityClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  })
}

async function runScraperWithPage(
  name: string,
  scraper: (page: Page) => Promise<unknown[]>,
  page: Page
) {
  try {
    console.log(`[worker] Running ${name} scraper...`)
    const results = await scraper(page)
    console.log(`[worker] ${name}: ${results.length} result(s)`)
    return results
  } catch (error) {
    console.error(`[worker] ${name} failed:`, error)
    return []
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
}

async function main() {
  console.log('[worker] Starting scraper worker...')

  const scrapers = [
    { name: 'Irembo', fn: (page: Page) => scrapeIrembo(page) },
    { name: 'RRA', fn: (page: Page) => scrapeRRA(page) },
    { name: 'RDB', fn: (page: Page) => scrapeRDB(page) },
  ]

  const browser = await launchBrowser()
  const pages = await Promise.all(scrapers.map(() => createPage(browser)))

  try {
    const allScraped = await Promise.all(
      scrapers.map((s, i) => runScraperWithPage(s.name, s.fn, pages[i]))
    )

    const flatResults = allScraped.flat() as ScrapedProcess[]
    if (flatResults.length === 0) {
      console.log('[worker] No scraped results. Exiting.')
      return
    }

    const db = await connectToDatabase()
    const pendingUpdates = db.collection('pendingUpdates')
    const sanityClient = createSanityClient()

    let inserted = 0
    let skipped = 0

    for (const scraped of flatResults) {
      try {
        const diff = await computeDiff(scraped)

        if (!diff.hasChanges) {
          console.log(`[worker] No changes for "${scraped.translations.en.title}"`)
          skipped++
          continue
        }

        if (diff.confidenceScore < CONFIDENCE_THRESHOLD) {
          console.log(`[worker] Low confidence (${diff.confidenceScore.toFixed(2)}) for "${scraped.translations.en.title}", skipping`)
          skipped++
          continue
        }

        const existing = await sanityClient.fetch(
          `*[_type == $type && translations.en.title == $title][0]`,
          { type: scraped._type, title: scraped.translations.en.title }
        )

        const documentId = existing
          ? existing._id
          : `pending-${Date.now()}-${slugify(scraped.translations.en.title)}`

        const pendingUpdate = {
          sourceType: scraped.sourceType,
          documentId,
          update: diff.normalizedDoc,
          diffSummary: diff.diffSummary,
          confidenceScore: diff.confidenceScore,
          status: 'pending',
          detectedAt: new Date(),
        }

        const { insertedId } = await pendingUpdates.insertOne(pendingUpdate)
        inserted++

        console.log(`[worker] Inserted pending update: "${scraped.translations.en.title}" (confidence: ${diff.confidenceScore.toFixed(2)})`)

        await sendPendingUpdateNotification({
          id: insertedId.toString(),
          sourceProcessId: documentId,
          diffSummary: diff.diffSummary,
          confidenceScore: diff.confidenceScore,
          detectedAt: pendingUpdate.detectedAt.toISOString(),
          adminUrl: ADMIN_URL,
        })
      } catch (error) {
        console.error(`[worker] Failed to process "${scraped.translations.en.title}":`, error)
      }
    }

    console.log(`[worker] Done. Inserted: ${inserted}, Skipped: ${skipped}`)
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error('[worker] Fatal error:', error)
  process.exit(1)
})

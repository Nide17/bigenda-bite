import { scrapePage, scrapeWithPage, isValidScrape } from './browser'
import type { ScrapedProcess } from './types'

function normalizeRDBService(title: string, content: string): ScrapedProcess {
  const lowerContent = content.toLowerCase()
  const lines = content.split('\n').filter((line) => line.trim().length > 0)

  let category = 'business'
  if (lowerContent.includes('register') && lowerContent.includes('business')) category = 'business'
  else if (lowerContent.includes('intellectual') || lowerContent.includes('patent')) category = 'intellectual_property'
  else if (lowerContent.includes('cooperative')) category = 'business'
  else if (lowerContent.includes('ngo') || lowerContent.includes('non-governmental')) category = 'ngo'

  const fees: { label: string; amountRWF: number; conditions: string }[] = []
  const feeMatch = content.match(/(\d{1,2}[,\d]*)\s*(RWF|Rwanda Franc|francs?)/i)
  if (feeMatch) {
    const amount = parseInt(feeMatch[1].replace(/,/g, ''), 10)
    fees.push({ label: 'Registration fee', amountRWF: amount || 0, conditions: 'As displayed on RDB' })
  } else {
    fees.push({ label: 'Registration fee', amountRWF: 0, conditions: 'Fee not detected from page' })
  }

  const steps = lines.slice(0, 5).map((line, index) => ({
    order: index + 1,
    text: {
      en: line.trim(),
      fr: line.trim(),
      rw: line.trim(),
    },
    estimatedTime: 'same day',
  }))

  return {
    _type: 'process',
    sourceType: 'official_verified',
    category,
    status: 'published',
    tags: ['rdb', 'business', category],
    translations: {
      en: { title: title || 'RDB Service', summary: lines.slice(0, 2).join(' ').trim() || 'Business registration service on RDB.' },
      fr: { title: title || 'Service RDB', summary: lines.slice(0, 2).join(' ').trim() || "Service d'enregistrement sur RDB." },
      rw: { title: title || 'Serivisi ya RDB', summary: lines.slice(0, 2).join(' ').trim() || 'Serivisi yo kwiyandikisha ku RDB.' },
    },
    steps,
    fees,
    officialPortal: 'https://rdb.rw/',
    sourceUrl: ['https://rdb.rw/'],
    lastVerifiedDate: new Date().toISOString(),
    confidenceScore: 0.85,
  }
}

export async function scrapeRDB(page?: any): Promise<ScrapedProcess[]> {
  try {
    const { content, title } = page
      ? await scrapeWithPage(page, 'https://rdb.rw/')
      : await scrapePage('https://rdb.rw/')
    if (!isValidScrape(title, content)) {
      console.warn('RDB scraper: blocked or error page detected, skipping')
      return []
    }
    const normalized = normalizeRDBService(title, content)
    return [normalized]
  } catch (error) {
    console.error('RDB scraper failed:', error)
    return []
  }
}

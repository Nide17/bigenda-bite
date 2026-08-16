import { scrapePage, isValidScrape } from './browser'
import type { ScrapedProcess } from './types'

function normalizeRRAService(title: string, content: string): ScrapedProcess {
  const lowerContent = content.toLowerCase()
  const lines = content.split('\n').filter((line) => line.trim().length > 0)

  let category = 'tax'
  if (lowerContent.includes('tin') || lowerContent.includes('tax identification')) category = 'tax'
  else if (lowerContent.includes('vat') || lowerContent.includes('value added')) category = 'tax'
  else if (lowerContent.includes('customs')) category = 'trade'
  else if (lowerContent.includes('withholding')) category = 'tax'

  const fees: { label: string; amountRWF: number; conditions: string }[] = []
  const feeMatch = content.match(/(\d{1,2}[,\d]*)\s*(RWF|Rwanda Franc|francs?)/i)
  if (feeMatch) {
    const amount = parseInt(feeMatch[1].replace(/,/g, ''), 10)
    fees.push({ label: 'Tax/Service fee', amountRWF: amount || 0, conditions: 'As displayed on RRA' })
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
    tags: ['rra', 'tax', category],
    translations: {
      en: { title: title || 'RRA Service', summary: lines.slice(0, 2).join(' ').trim() || 'Tax service available on RRA.' },
      fr: { title: title || 'Service RRA', summary: lines.slice(0, 2).join(' ').trim() || 'Service fiscal disponible sur RRA.' },
      rw: { title: title || 'Serivisi ya RRA', summary: lines.slice(0, 2).join(' ').trim() || "Serivisi y'imisoro ifite kuri RRA." },
    },
    steps,
    fees,
    officialPortal: 'https://www.rra.gov.rw/',
    sourceUrl: ['https://www.rra.gov.rw/'],
    lastVerifiedDate: new Date().toISOString(),
    confidenceScore: 0.85,
  }
}

export async function scrapeRRA(): Promise<ScrapedProcess[]> {
  try {
    const { content, title } = await scrapePage('https://www.rra.gov.rw/')
    if (!isValidScrape(title, content)) {
      console.warn('RRA scraper: blocked or error page detected, skipping')
      return []
    }
    const normalized = normalizeRRAService(title, content)
    return [normalized]
  } catch (error) {
    console.error('RRA scraper failed:', error)
    return []
  }
}

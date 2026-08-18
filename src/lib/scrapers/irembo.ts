import { scrapePage, scrapeWithPage, isValidScrape } from './browser'
import type { ScrapedProcess } from './types'

function normalizeIremboService(title: string, content: string): ScrapedProcess {
  const lowerContent = content.toLowerCase()
  const lines = content.split('\n').filter((line) => line.trim().length > 0)

  let category = 'identity'
  if (lowerContent.includes('passport') || lowerContent.includes('immigration')) category = 'immigration'
  else if (lowerContent.includes('driving') || lowerContent.includes('permit')) category = 'transport'
  else if (lowerContent.includes('visa')) category = 'immigration'
  else if (lowerContent.includes('birth') || lowerContent.includes('death')) category = 'civil'
  else if (lowerContent.includes('national') && lowerContent.includes('id')) category = 'identity'

  const fees: { label: string; amountRWF: number; conditions: string }[] = []
  const feeMatch = content.match(/(\d{1,2}[,\d]*)\s*(RWF|Rwanda Franc|francs?)/i)
  if (feeMatch) {
    const amount = parseInt(feeMatch[1].replace(/,/g, ''), 10)
    fees.push({ label: 'Service fee', amountRWF: amount || 0, conditions: 'As displayed on Irembo' })
  } else {
    fees.push({ label: 'Service fee', amountRWF: 0, conditions: 'Fee not detected from page' })
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
    tags: ['irembo', category],
    translations: {
      en: { title: title || 'Irembo Service', summary: lines.slice(0, 2).join(' ').trim() || 'Service available on Irembo.' },
      fr: { title: title || 'Service Irembo', summary: lines.slice(0, 2).join(' ').trim() || 'Service disponible sur Irembo.' },
      rw: { title: title || 'Serivisi ya Irembo', summary: lines.slice(0, 2).join(' ').trim() || 'Serivisi ifite kuri Irembo.' },
    },
    steps,
    fees,
    officialPortal: 'https://irembo.gov.rw/',
    sourceUrl: ['https://irembo.gov.rw/'],
    lastVerifiedDate: new Date().toISOString(),
    confidenceScore: 0.85,
  }
}

export async function scrapeIrembo(page?: any): Promise<ScrapedProcess[]> {
  try {
    const { content, title } = page
      ? await scrapeWithPage(page, 'https://irembo.gov.rw/')
      : await scrapePage('https://irembo.gov.rw/')
    if (!isValidScrape(title, content)) {
      console.warn('Irembo scraper: blocked or error page detected, skipping')
      return []
    }
    const normalized = normalizeIremboService(title, content)
    return [normalized]
  } catch (error) {
    console.error('Irembo scraper failed:', error)
    return []
  }
}


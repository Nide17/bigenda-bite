import { chromium, type Browser, type Page } from 'playwright'

const BLOCKED_PATTERNS = [
  /blocked/i,
  /access denied/i,
  /cloudflare/i,
  /403 forbidden/i,
  /404 not found/i,
  /500 internal server error/i,
  /service unavailable/i,
  /bad gateway/i,
  /gateway timeout/i,
  /your ip has been/i,
  /automated requests/i,
  /bot detected/i,
  /enable javascript/i,
  /please verify you are a human/i,
]

export function isValidScrape(title: string, content: string): boolean {
  const text = `${title}\n${content}`
  return !BLOCKED_PATTERNS.some((pattern) => pattern.test(text))
}

export async function launchBrowser(): Promise<Browser> {
  return await chromium.launch({ headless: true })
}

export async function createPage(browser: Browser): Promise<Page> {
  return await browser.newPage()
}

export async function scrapeWithPage(page: Page, url: string): Promise<{ title: string; content: string }> {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(3000)

  const title = await page.title()
  const content = await page.evaluate(() => document.body.innerText)

  return { title, content }
}

export async function scrapePage(url: string): Promise<{ title: string; content: string }> {
  const browser = await launchBrowser()
  const page = await createPage(browser)

  try {
    return await scrapeWithPage(page, url)
  } finally {
    await browser.close()
  }
}

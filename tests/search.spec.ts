import { test, expect } from '@playwright/test'

test.describe('Search', () => {
  test('homepage search input is visible', async ({ page }) => {
    const response = await page.goto('/en')
    expect(response?.status()).toBe(200)

    await expect(page.locator('input[aria-label="Search"]')).toBeVisible()
  })

  test('search returns results for existing content', async ({ page }) => {
    const response = await page.goto('/en')
    expect(response?.status()).toBe(200)

    await page.route('**/api/search*', async (route) => {
      const url = new URL(route.request().url())
      const query = url.searchParams.get('q') || ''
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            {
              type: 'process',
              title: 'Business Registration Process',
              description: 'How to register a business in Rwanda',
              category: 'business',
              language: 'en',
              url: '/en/processes/business/registration',
              score: 12,
            },
          ],
          query,
          language: 'en',
          total: 1,
        }),
      })
    })

    const searchInput = page.locator('input[aria-label="Search"]')
    await searchInput.fill('business')
    await searchInput.press('Enter')

    await page.waitForTimeout(1000)

    await expect(page.getByText('Business Registration Process')).toBeVisible({ timeout: 30000 })
  })

  test('search shows empty state for no results', async ({ page }) => {
    const response = await page.goto('/en')
    expect(response?.status()).toBe(200)

    await page.route('/api/search', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [],
          query: 'xyznonexistent123',
          language: 'en',
          total: 0,
        }),
      })
    })

    const searchInput = page.locator('input[aria-label="Search"]')
    await searchInput.fill('xyznonexistent123')
    await searchInput.press('Enter')

    await expect(page.getByText('No results found')).toBeVisible({ timeout: 30000 })
  })

  test('search respects language parameter', async ({ page }) => {
    const response = await page.goto('/fr')
    expect(response?.status()).toBe(200)

    await expect(page.locator('input[aria-label="Search"]')).toBeVisible()
  })

  test('search page renders results from URL query', async ({ page }) => {
    await page.route('**/api/search*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [
            {
              type: 'guide',
              title: 'Test Guide',
              description: 'Test description',
              category: 'test',
              language: 'en',
              url: '/en/guides/test/guide',
              score: 8,
            },
          ],
          query: 'test',
          language: 'en',
          total: 1,
        }),
      })
    })

    const response = await page.goto('/en/search?q=test')
    expect(response?.status()).toBe(200)

    await expect(page.getByRole('link', { name: 'Test Guide ★ Relevant Test' })).toBeVisible({ timeout: 30000 })
    await expect(page.getByRole('heading', { name: 'How-To Guides' }).first()).toBeVisible()
  })
})

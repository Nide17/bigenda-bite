import { test, expect } from '@playwright/test'

test.describe('Search', () => {
  test('homepage search input is visible', async ({ page }) => {
    const response = await page.goto('/en')
    expect(response?.status()).toBe(200)

    await expect(page.getByPlaceholder('What do you need to do in Rwanda?')).toBeVisible()
  })

  test('search returns results for existing content', async ({ page }) => {
    const response = await page.goto('/en')
    expect(response?.status()).toBe(200)

    await page.route('/api/search', async (route) => {
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
            },
          ],
          query,
          language: 'en',
          total: 1,
        }),
      })
    })

    const searchInput = page.getByPlaceholder('What do you need to do in Rwanda?')
    await searchInput.fill('business')
    await searchInput.press('Enter')

    const resultsText = page.getByText('results for "business"', { exact: false })
    await expect(resultsText).toBeVisible({ timeout: 30000 })
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

    const searchInput = page.getByPlaceholder('What do you need to do in Rwanda?')
    await searchInput.fill('xyznonexistent123')
    await searchInput.press('Enter')

    await expect(page.getByText('No results found')).toBeVisible({ timeout: 30000 })
  })

  test('search respects language parameter', async ({ page }) => {
    const response = await page.goto('/fr')
    expect(response?.status()).toBe(200)

    const searchInput = page.getByPlaceholder('Que devez-vous faire au Rwanda?')
    await expect(searchInput).toBeVisible()
  })
})

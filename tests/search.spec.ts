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

    const searchInput = page.getByPlaceholder('What do you need to do in Rwanda?')
    await searchInput.fill('business')
    await searchInput.press('Enter')

    await page.waitForTimeout(5000)

    const resultsHeading = page.locator('text=/results for "business"/i')
    const hasResults = page.locator('[data-testid="search-result"], .search-result, article, h3, h4').first()
    await expect(resultsHeading.or(hasResults)).toBeVisible({ timeout: 30000 })
  })

  test('search shows empty state for no results', async ({ page }) => {
    const response = await page.goto('/en')
    expect(response?.status()).toBe(200)

    const searchInput = page.getByPlaceholder('What do you need to do in Rwanda?')
    await searchInput.fill('xyznonexistent123')
    await searchInput.press('Enter')

    await page.waitForTimeout(5000)

    await expect(page.getByText('No results found')).toBeVisible({ timeout: 30000 })
  })

  test('search respects language parameter', async ({ page }) => {
    const response = await page.goto('/fr')
    expect(response?.status()).toBe(200)

    const searchInput = page.getByPlaceholder('Que devez-vous faire au Rwanda?')
    await expect(searchInput).toBeVisible()
  })
})

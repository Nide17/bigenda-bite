import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('h1')).toContainText('Welcome to Bigenda Bite')
  })

  test('should display navigation links', async ({ page }) => {
    await page.goto('/en')
    await expect(page.getByRole('link', { name: 'Processes' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Guides' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Directory' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Alerts' })).toBeVisible()
  })

  test('should have working city selector', async ({ page }) => {
    await page.goto('/en')
    const citySelect = page.locator('select[name="city"]')
    await expect(citySelect).toBeVisible()
    await expect(citySelect).toHaveValue('Kigali')
  })

  test('should navigate to processes page', async ({ page }) => {
    await page.goto('/en')
    await page.getByRole('link', { name: 'Browse Processes' }).click()
    await expect(page).toHaveURL(/\/en\/processes/)
  })

  test('should navigate to guides page', async ({ page }) => {
    await page.goto('/en')
    await page.getByRole('link', { name: 'Read Guides' }).click()
    await expect(page).toHaveURL(/\/en\/guides/)
  })
})

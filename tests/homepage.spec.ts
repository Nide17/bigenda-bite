import { test, expect } from '@playwright/test'

test.describe('Smoke tests', () => {
  test('homepage loads', async ({ page }) => {
    const response = await page.goto('/en')
    expect(response?.status()).toBe(200)
  })

  test('processes page loads', async ({ page }) => {
    const response = await page.goto('/en/processes')
    expect(response?.status()).toBe(200)
  })
})

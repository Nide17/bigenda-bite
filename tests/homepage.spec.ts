import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  const response = await page.goto('/en')
  expect(response?.status()).toBe(200)
})

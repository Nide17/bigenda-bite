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

  test('guides page loads', async ({ page }) => {
    const response = await page.goto('/en/guides')
    expect(response?.status()).toBe(200)
  })

  test('directory page loads', async ({ page }) => {
    const response = await page.goto('/en/directory')
    expect(response?.status()).toBe(200)
  })

  test('alerts page loads', async ({ page }) => {
    const response = await page.goto('/en/alerts')
    expect(response?.status()).toBe(200)
  })
})

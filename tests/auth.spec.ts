import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('login page shows email/password form', async ({ page }) => {
    const response = await page.goto('/en/login')
    expect(response?.status()).toBe(200)

    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
  })

  test('login page shows Google sign-in button', async ({ page }) => {
    const response = await page.goto('/en/login')
    expect(response?.status()).toBe(200)

    await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible()
  })

  test('login page shows divider between email and Google options', async ({ page }) => {
    const response = await page.goto('/en/login')
    expect(response?.status()).toBe(200)

    await expect(page.getByText('Or continue with Google')).toBeVisible()
  })
})

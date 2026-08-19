import { test, expect } from '@playwright/test'

test.describe('i18n', () => {
  const locales = [
    { code: 'en', hero: 'Find your way in Rwanda', processes: 'Official Processes' },
    { code: 'fr', hero: 'Trouvez votre chemin au Rwanda', processes: 'Processus officiels' },
    { code: 'rw', hero: 'Menya inzira mu Rwanda', processes: 'Imirimo ya leta' },
  ]

  for (const locale of locales) {
    test(`homepage renders ${locale.code} translations`, async ({ page }) => {
      const response = await page.goto(`/${locale.code}`)
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toContainText(locale.hero)
    })

    test(`processes page renders ${locale.code} translations`, async ({ page }) => {
      const response = await page.goto(`/${locale.code}/processes`)
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toContainText(locale.processes)
    })
  }

  test('navigation links are translated', async ({ page }) => {
    await page.goto('/en')
    const nav = page.locator('nav[aria-label="Main"]')
    await expect(nav).toBeVisible()
    const links = await nav.getByRole('link').allTextContents()
    console.log('Nav links:', links)
    await expect(nav.getByRole('link', { name: 'Official Processes' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'How-To Guides' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Business Directory' })).toBeVisible()
  })
})

# Testing

Bigenda Bite uses Playwright for E2E smoke tests.

## What's Covered

| Area | Verified |
|------|----------|
| Homepage | Loads, sections render |
| Navigation | Links visible and translated |
| i18n | EN, FR, RW pages render |
| Processes | Listing page loads |
| Guides | Listing page loads |
| Directory | Page loads |
| Alerts | Page loads |
| Search | Input visible, results render, empty state |
| Auth | Login form renders |

## Running Tests

```bash
npx playwright install chromium
npm run test:e2e
npm run test:e2e:ui     # with UI
npm run test:e2e:debug  # debug mode
```

## CI

Tests run on every PR and push to `main` via GitHub Actions.

- OS: `ubuntu-latest`
- Node: 22
- Browser: Chromium (headless)

## Test Files

- `tests/auth.spec.ts` — Auth UI
- `tests/homepage.spec.ts` — Homepage
- `tests/i18n.spec.ts` — Translations
- `tests/search.spec.ts` — Search

## Writing Tests

Use role-based selectors when possible:

```typescript
test('homepage loads', async ({ page }) => {
  const response = await page.goto('/en')
  expect(response?.status()).toBe(200)
  await expect(page.getByRole('heading', { name: 'What do you want to do?' })).toBeVisible()
})
```

## Mocking

Some tests mock APIs to avoid depending on live data:

```typescript
await page.route('**/api/search*', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ results: [], query: 'test', language: 'en', total: 0 }),
  })
})
```

## Troubleshooting

- **CI fails locally passes:** Check Node version (22), Playwright browsers installed
- **Linux install issues:** `npx playwright install --with-deps chromium`

# Testing Guide

Bigenda Bite uses Playwright for end-to-end smoke tests. This document covers the testing strategy, what is covered, and how to run the suite.

## Strategy

The test suite focuses on smoke tests that verify critical user paths work after changes. It is not a comprehensive integration test suite, but it catches regressions in navigation, i18n, search, and page rendering.

## Test Coverage

| Area | What is verified |
|------|-----------------|
| Homepage | Page loads, sections render |
| Navigation | Links are visible and translated |
| i18n | English, French, and Kinyarwanda pages render correctly |
| Processes | Process listing page loads |
| Guides | Guide listing page loads |
| Directory | Business directory page loads |
| Alerts | Alerts page loads |
| Search | Search input visible, results render, empty state, language-specific placeholders |
| Auth | Login page renders email/password form, Google button, and divider |

## Running Tests

```bash
# Install Playwright browsers
npx playwright install chromium

# Run tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run in debug mode
npm run test:e2e:debug
```

## CI Integration

Tests run automatically on every PR and push to `main` via GitHub Actions.

- OS: `ubuntu-latest`
- Node: 22
- Browser: Chromium
- Headless: true in CI

## Test Files

- `tests/auth.spec.ts` — Authentication UI smoke tests
- `tests/homepage.spec.ts` — Homepage and section loading
- `tests/i18n.spec.ts` — Translation coverage
- `tests/search.spec.ts` — Search functionality

## Writing Tests

Tests use Playwright's `test` and `expect` APIs. Prefer role-based selectors (`getByRole`, `getByLabel`) over text selectors when possible.

Example:

```typescript
test('homepage loads', async ({ page }) => {
  const response = await page.goto('/en')
  expect(response?.status()).toBe(200)
  await expect(page.getByRole('heading', { name: 'What do you want to do?' })).toBeVisible()
})
```

## Mocking

Some tests mock API responses using `page.route()` to avoid depending on live Sanity/MongoDB data:

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

### Tests fail on CI but pass locally

- Ensure Node.js version matches (22)
- Ensure Playwright browsers are installed
- Check that tests do not depend on visual state or timing

### Playwright installation fails on Linux

Use the official install command:

```bash
npx playwright install --with-deps chromium
```

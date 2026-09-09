# Testing

Bigenda Bite uses Playwright for minimal E2E smoke tests.

## Current Tests

| File | What it checks |
|------|---------------|
| `tests/homepage.spec.ts` | Homepage and processes page load |

## Running

```bash
npx playwright install chromium
npm run test:e2e
```

## CI

Tests run on every PR and push to `main` via GitHub Actions.

- OS: `ubuntu-latest`
- Node: 22
- Browser: Chromium (headless)

## Environment

E2E tests run without secrets. The app handles missing env vars gracefully in test mode.

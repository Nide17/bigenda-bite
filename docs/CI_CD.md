# CI/CD

Bigenda Bite uses GitHub Actions for continuous integration. Production deployment is handled independently by Vercel's native GitHub integration.

## CI Pipeline (`.github/workflows/ci.yml`)

The workflow runs on every pull request and push to `main`.

**Jobs:**

1. **Typecheck** — Runs `npm run typecheck` to verify TypeScript types
2. **Lint** — Runs `npm run lint` to check code quality
3. **Build** — Runs `npm run build` to verify the application compiles
4. **E2E Smoke Tests** — Runs Playwright E2E smoke tests

## Environment

- **OS:** `ubuntu-latest`
- **Node:** 22
- **Package manager:** npm with cache

## Deployment

Production deployment is handled by Vercel's native GitHub integration:
- Push to `main` triggers automatic production deployment
- Pull requests get preview deployments automatically

No Vercel secrets are required in GitHub Actions.

## Required Secrets

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel API token (for preview deployments only, if needed) |

## Local CI Testing

Run the same checks locally before pushing:

```bash
# Typecheck
npm run typecheck

# Lint
npm run lint

# Build
npm run build

# Tests (requires .env.local with valid vars)
npm run test:e2e
```

## Troubleshooting CI

### Build fails on CI but works locally

- Ensure you're using Node.js 22+
- Check that all environment variables are set
- Run `npm ci` instead of `npm install` for clean installs

### Tests fail on CI

- Playwright runs headless on CI; ensure tests don't depend on visual state
- Check that the dev server starts correctly in the CI environment
- Review Playwright trace artifacts in GitHub Actions

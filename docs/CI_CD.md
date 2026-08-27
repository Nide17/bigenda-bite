# CI/CD

Bigenda Bite uses GitHub Actions for continuous integration and deployment to Vercel.

## Workflows

### CI Pipeline (`.github/workflows/ci.yml`)

The main workflow runs on every push to `main` and every pull request.

**Jobs:**

1. **Lint** — Runs `npm run lint` to check code quality
2. **Build** — Runs `npm run build` to verify the application compiles
3. **Test** — Runs Playwright E2E smoke tests
4. **Deploy Preview** — Deploys a preview to Vercel for PRs
5. **Deploy Production** — Deploys to production on merge to `main`

## Required Secrets

Set these in your GitHub repository settings under **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel API token for deployment |
| `VERCEL_ORG_ID` | Your Vercel organization ID |
| `VERCEL_PROJECT_ID` | The Vercel project ID for Bigenda Bite |

## Getting Vercel Credentials

### VERCEL_TOKEN

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a name like "GitHub Actions"
4. Copy the token and add it as `VERCEL_TOKEN`

### VERCEL_ORG_ID

1. Go to [vercel.com/account](https://vercel.com/account)
2. Find your organization ID under "General"
3. Or run `vercel link` locally and check `.vercel/project.json`

### VERCEL_PROJECT_ID

1. Go to your project in Vercel dashboard
2. Go to **Settings → General**
3. Find "Project ID"
4. Or run `vercel link` locally and check `.vercel/project.json`

## Local CI Testing

Run the same checks locally before pushing:

```bash
# Lint
npm run lint

# Build
npm run build

# Tests (requires .env.local with valid vars)
npm run test:e2e
```

## E2E Tests

Playwright smoke tests are located in `tests/`. They cover:

- Homepage loads correctly
- Navigation links are visible
- City selector works
- Process/guide pages load
- Search functionality
- i18n translations

To run tests locally:

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

**Note:** E2E tests require a `.env.local` file with valid credentials. The test server will start even without Sanity/MongoDB credentials — pages will render with empty content states.

## CI Environment

The GitHub Actions test job runs without secrets. The app is designed to handle missing environment variables gracefully:

- **Missing Sanity credentials:** Pages render with empty content states instead of throwing errors
- **Missing MongoDB:** API routes return empty results
- **Missing MoMo/Discord:** Payment/notification features are skipped

This allows E2E smoke tests to verify routing, UI components, and page structure without exposing secrets.

## Deployment Flow

```
Push to main / Open PR
       │
       ▼
 GitHub Actions triggered
       │
       ├─► Lint job
       ├─► Build job
       ├─► Test job
       │
       ├─► If PR: Deploy Preview to Vercel
       │   └─► Comment preview URL on PR
       │
       └─► If main: Deploy Production to Vercel
           └─► Live at https://bigendabite.com
```

## Branch Strategy

- `main` — Production branch, auto-deploys to production
- Feature branches — Create PRs from feature branches, get preview deployments
- PRs require passing checks before merge

## Troubleshooting CI

### Build fails on CI but works locally

- Ensure you're using Node.js 22+ (CI uses `node-version: '22'`)
- Check that all environment variables are set in GitHub Secrets
- Run `npm ci` instead of `npm install` for clean installs

### Tests fail on CI

- Playwright runs headless on CI; ensure tests don't depend on visual state
- Check that the dev server starts correctly in the CI environment
- Review Playwright trace artifacts in GitHub Actions

### Deployment fails

- Verify Vercel credentials in GitHub Secrets
- Check that the Vercel project exists and is linked
- Review Vercel build logs for errors

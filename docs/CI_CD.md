# CI/CD

Bigenda Bite uses GitHub Actions for CI. Production deployment is handled by Vercel's GitHub integration.

## Workflow

Runs on every PR and push to `main`:

| Job | What it does |
|-----|--------------|
| `typecheck` | `tsc --noEmit` |
| `lint` | ESLint |
| `build` | Production build |
| `e2e` | Playwright smoke tests |

## Configuration

See `.github/workflows/ci.yml` for the full config.

- OS: `ubuntu-latest`
- Node: 22
- Browser: Chromium (headless)

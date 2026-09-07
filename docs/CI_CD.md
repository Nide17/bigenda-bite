# CI/CD

GitHub Actions runs on every PR and push to `main`:

| Job | Command |
|-----|---------|
| typecheck | `tsc --noEmit` |
| lint | `eslint .` |
| build | `next build` |
| e2e | `playwright test` |

Config: `.github/workflows/ci.yml`
- OS: `ubuntu-latest`
- Node: 22
- Browser: Chromium (headless)

Production deployment is handled by Vercel's GitHub integration.

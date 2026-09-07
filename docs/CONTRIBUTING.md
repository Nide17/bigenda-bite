# Contributing

## Setup

```bash
git clone https://github.com/Nide17/bigenda-bite.git
cd bigenda-bite
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test:e2e` | Playwright tests |
| `npm run scrape` | Run scraper worker |

## Commits

```
feat: add feature
fix: correct bug
docs: update docs
refactor: restructure code
```

## Pull Requests

1. Create feature branch
2. Make changes and test
3. Run `npm run build`
4. Open PR against `main`

## Code Style

- TypeScript strict mode
- Server components by default, `'use client'` only when needed
- camelCase for functions, PascalCase for components
- Use `useTranslations()` for user-facing strings
- Use `toast.success()` / `toast.error()` from `sonner` for feedback

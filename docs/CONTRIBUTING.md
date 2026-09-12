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
| `npm run start` | Start production server |
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

1. Create a feature branch
2. Make changes and test
3. Run the pre-push checklist below
4. Open PR against `main`

## Pre-Push Checklist

Run all four checks before committing and pushing:

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Never push without verifying all four pass first.

## Code Style

- TypeScript strict mode
- Server components by default, `'use client'` only when needed
- camelCase for functions, PascalCase for components
- Use `useTranslations()` for user-facing strings in client components
- Use `getMessages(lang)` for server components
- Use `toast.success()` / `toast.error()` from `sonner` for feedback

## i18n Conventions

- Translation files live in `src/i18n/messages/{en,fr,rw}.json`
- Client components call `useTranslations()` directly. Do **not** pass `t` from a server component into a client component — Next.js 15 blocks non-serializable function props across the server/client boundary. If a shared presentational component is used by both server and client, make it a client component and call `useTranslations()` inside it.
- Pure presentational components that must stay server-renderable (e.g. `AlertsSection`) accept `t` as a **required** prop and never call `useTranslations()` themselves.
- Category labels use the key pattern `cat_<slug>` (e.g. `cat_identity`, `cat_health`) with a fallback to the raw slug: `t(\`cat_${category}\`) || category`.
- Alert severity labels use `severity_<value>` (e.g. `severity_warning`, `severity_critical`) with a fallback to the raw value.
- Parametric translations use `{key}` placeholders: `t('alert_expires', { date: ... })`.
- When adding a new string, add it to **all three** locales. Missing keys fall back to the raw key string, which is how untranslated UI often slips through.

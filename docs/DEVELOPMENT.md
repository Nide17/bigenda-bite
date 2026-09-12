# Development Guide

## Prerequisites

- Node.js 22+
- MongoDB Atlas account
- Sanity account
- Git

## Setup

```bash
git clone https://github.com/Nide17/bigenda-bite.git
cd bigenda-bite
npm install
cp .env.example .env.local
# Edit .env.local with your credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md).

Minimum to start:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bigendabite
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run scrape` | Run scraper worker |
| `npm run test:e2e` | Playwright tests |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [lang]/            # Localized routes
│   │   ├── (legal)/       # Terms, privacy
│   │   ├── account/       # Account settings
│   │   ├── admin/         # Admin dashboard
│   │   ├── alerts/        # Alerts page
│   │   ├── directory/     # Business directory
│   │   ├── forgot-password/
│   │   ├── guides/        # How-to guides
│   │   ├── login/         # Login form
│   │   ├── membership/    # Plans + checkout
│   │   ├── offline-saved/ # Saved guides
│   │   ├── processes/     # Official processes
│   │   ├── register/      # Registration
│   │   ├── reset-password/
│   │   ├── search/        # Search results
│   │   └── verify-email/
│   ├── admin/             # Admin routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/                # Design system
│   ├── Navigation.tsx
│   ├── Search.tsx
│   └── ...
├── lib/                   # Core utilities
│   ├── analytics.ts
│   ├── auth/              # Authentication
│   ├── cms/               # Sanity client
│   ├── db/                # MongoDB connection
│   ├── discord/           # Discord webhooks
│   ├── email.ts
│   ├── momo/              # MTN MoMo client
│   ├── notifications.ts
│   ├── scrapers/          # Scraper logic
│   └── ...
├── i18n/                  # Translations
│   ├── messages/          # en.json, fr.json, rw.json
│   └── routing.ts
└── types/                 # TypeScript types
```

## Code Style

- TypeScript strict mode
- Server components by default, `'use client'` only when needed
- camelCase for variables/functions, PascalCase for components
- Group imports: React, Next.js, third-party, local
- Use `useTranslations()` for all user-facing strings in client components
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

## Commits

```
feat: add user profile page
fix: correct slug fallback
docs: update API reference
refactor: extract city selector to component
```

## Branching

- `main` — Production
- Feature branches — Open PRs against `main`

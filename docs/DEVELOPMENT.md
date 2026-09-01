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

See [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) for the full list.

Minimum needed to get started:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bigendabite
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm run scrape` | Run scraper worker |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run tests with UI |
| `npm run test:e2e:debug` | Run tests in debug mode |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [lang]/            # Localized routes
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/                # Design system
│   └── ...
├── lib/                   # Core utilities
│   ├── analytics.ts       # Event tracking
│   ├── auth/              # Authentication
│   ├── cms/               # Sanity client
│   ├── db/                # MongoDB
│   └── ...
├── i18n/                  # Translations
└── types/                 # TypeScript types
```

## Code Style

- TypeScript strict mode
- Server components by default, `'use client'` only when needed
- camelCase for variables/functions, PascalCase for components
- Group imports (React, Next.js, third-party, local)

## Commits

```
feat: add user profile page
fix: correct slug fallback for guides
docs: update API reference
refactor: extract city selector to component
```

## Branching

- `main` — Production
- Feature branches — Open PRs against `main`

## Related Docs

- [Architecture](ARCHITECTURE.md) — System design
- [API Reference](API.md) — API endpoints
- [Deployment](DEPLOYMENT.md) — Production setup
- [Testing](TESTING.md) — Test guide

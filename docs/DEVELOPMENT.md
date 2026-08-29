# Development Guide

This guide covers setting up a local development environment for Bigenda Bite.

## Prerequisites

- Node.js 22+
- npm
- MongoDB Atlas account
- Sanity account
- Git

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Nide17/bigenda-bite.git
cd bigenda-bite

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See [docs/ENVIRONMENT_VARIABLES.md](docs/ENVIRONMENT_VARIABLES.md) for the complete list.

Minimum required for local development:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bigendabite
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler checks |
| `npm run scrape` | Run scraper worker |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run Playwright tests with UI |
| `npm run test:e2e:debug` | Run Playwright tests in debug mode |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [lang]/            # i18n routes
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/                # Design system components
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   └── ...
├── lib/                   # Core libraries
│   ├── analytics.ts       # Event tracking
│   ├── auth/              # Authentication
│   ├── cms/               # Sanity CMS
│   ├── db/                # MongoDB connection
│   ├── momo/              # MTN MoMo payments
│   └── ...
├── i18n/                  # Internationalization
└── types/                 # TypeScript type definitions
```

## Code Style

- **Language**: TypeScript (strict mode)
- **Framework**: Next.js 15 App Router
- **Styling**: Tailwind CSS 3 with custom design system
- **Components**: Server components by default, `'use client'` only when needed
- **Imports**: Group imports (React, Next.js, third-party, local)
- **Naming**: camelCase for variables/functions, PascalCase for components

## Commit Conventions

Use clear, descriptive commit messages:

```
feat: add admin user management page
fix: resolve slug fallback for guides without slugs
docs: update API reference with new endpoints
style: improve button hover states
refactor: extract city selector to client component
test: add unit tests for analytics tracking
```

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes and test them
3. Run the build: `npm run build`
4. Commit with a clear message
5. Push to your fork
6. Open a Pull Request against `main`
7. Wait for review and address any feedback

## Branch Strategy

- `main` — Production branch
- Feature branches — Create PRs from feature branches

## Related Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) — System design and data flow
- [API.md](API.md) — API reference
- [DEPLOYMENT.md](DEPLOYMENT.md) — Production deployment guide
- [TESTING.md](TESTING.md) — Testing strategy and execution

# Bigenda Bite

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue?logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?logo=mongodb)
![Sanity](https://img.shields.io/badge/Sanity-3.8-red?logo=sanity)
![Vercel](https://img.shields.io/badge/Vercel-Ready-black?logo=vercel)
![Playwright](https://img.shields.io/badge/Playwright-E2E%20Tests-green?logo=playwright)

**Bigenda Bite** is a comprehensive platform for Rwandans to navigate official processes, access how-to guides, discover local businesses, and stay informed with real-time alerts. Built with Next.js 15, TypeScript, Tailwind CSS, MongoDB, and Sanity CMS.

## Features

- **Official Processes** — Step-by-step guides for government services (IRRDB, RRA, RDB, immigration)
- **How-To Guides** — Practical guides for everyday life in Rwanda
- **Business Directory** — City-based business listings with contact and lead capture
- **Alerts** — Real-time official announcements with severity levels
- **Membership** — Subscription plans with MTN MoMo payment integration
- **City Routing** — Content personalized by city (Kigali, Musanze, Rubavu, Huye, Mombasa)
- **Admin Dashboard** — Editor tools for content review, user management, ads, analytics
- **Analytics** — Event tracking, page views, revenue stats, top pages
- **Notifications** — In-app notification bell with unread counts
- **Ads System** — Ad placement with impression/click tracking
- **Scraper Worker** — Automated content scraping with approval workflow
- **Discord Integration** — Editor notifications for pending updates
- **i18n** — Multi-language support (English, French, Kinyarwanda)
- **CI/CD** — GitHub Actions with lint, build, test, and Vercel deployment

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Database | MongoDB (native driver) |
| CMS | Sanity v3 |
| Auth | Custom credentials auth with MongoDB sessions |
| Payments | MTN MoMo API |
| Notifications | Discord Webhooks |
| Analytics | Custom event tracking |
| Testing | Playwright |
| Deployment | Vercel |
| CI/CD | GitHub Actions |
| i18n | custom provider |

## Project Structure

```
bigenda-bite/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [lang]/            # i18n routes
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/                # Design system components
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── lib/                   # Core libraries
│   │   ├── analytics.ts       # Event tracking
│   │   ├── auth/              # Authentication
│   │   ├── cms/               # Sanity CMS
│   │   ├── db/                # MongoDB connection
│   │   ├── momo/              # MTN MoMo payments
│   │   ├── scrapers/          # Web scraping engine
│   │   └── ...
│   ├── i18n/                  # Internationalization
│   └── types/                 # TypeScript types
├── scripts/                   # Utility scripts
│   └── worker.ts              # Scraper worker
├── sanity/                    # Sanity schemas & config
├── tests/                     # Playwright E2E tests
├── docs/                      # Documentation
└── .github/workflows/         # CI/CD pipelines
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Sanity account
- MTN MoMo developer account (for payments)
- Vercel account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/bigenda-bite.git
cd bigenda-bite

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your credentials
```

### Environment Setup

Create `.env.local` in the root directory. See [docs/ENVIRONMENT_VARIABLES.md](docs/ENVIRONMENT_VARIABLES.md) for the complete list.

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_TOKEN=your_api_token
SANITY_API_TOKEN=your_api_token

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Development

```bash
# Start development server
npm run dev

# Run scraper worker
npm run scrape

# Run E2E tests
npm run test:e2e

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run scrape` | Run scraper worker |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run Playwright tests with UI |
| `npm run test:e2e:debug` | Run Playwright tests in debug mode |

## CI/CD

GitHub Actions workflows are configured in `.github/workflows/ci.yml`:

- **Lint** — ESLint check on every PR/push
- **Build** — Next.js build verification
- **Test** — Playwright smoke tests
- **Deploy Preview** — Automatic Vercel preview for PRs
- **Deploy Production** — Automatic production deployment on merge to main

Required GitHub secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Documentation

- [CONTRIBUTING.md](CONTRIBUTING.md) — Contribution guidelines
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — System design and architecture
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Deployment guide
- [docs/API.md](docs/API.md) — API reference
- [docs/SANITY_SETUP.md](docs/SANITY_SETUP.md) — Sanity CMS setup
- [docs/ENVIRONMENT_VARIABLES.md](docs/ENVIRONMENT_VARIABLES.md) — Environment variables reference

## License

Proprietary — All rights reserved.

## Support

For questions or support, contact the Bigenda Bite team.

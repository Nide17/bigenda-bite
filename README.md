# Bigenda Bite

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue?logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?logo=mongodb)
![Sanity](https://img.shields.io/badge/Sanity-3.8-red?logo=sanity)
![Vercel](https://img.shields.io/badge/Vercel-Ready-black?logo=vercel)
![Playwright](https://img.shields.io/badge/Playwright-E2E%20Tests-green?logo=playwright)

A platform for Rwandans to navigate official processes, access how-to guides, discover local businesses, and stay informed with real-time alerts.

## Features

- **Official Processes** — Step-by-step guides for government services
- **How-To Guides** — Practical guides for everyday life in Rwanda
- **Business Directory** — City-based listings with contact and lead capture
- **Alerts** — Real-time official announcements with severity levels
- **Search** — Universal search across all content types
- **Membership** — Subscription plans with MTN MoMo payments
- **Admin Dashboard** — User management, ads, analytics, content review
- **i18n** — English, French, Kinyarwanda

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Database | MongoDB (native driver) |
| CMS | Sanity v3 |
| Auth | NextAuth v4 (Google OAuth + credentials) |
| Payments | MTN MoMo API |
| Deployment | Vercel |

## Quick Start

```bash
git clone https://github.com/Nide17/bigenda-bite.git
cd bigenda-bite
npm install
cp .env.example .env.local
# Edit .env.local with your credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For detailed setup, see [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Documentation

- [Product Overview](docs/PRODUCT.md) — Features and roadmap
- [Development Guide](docs/DEVELOPMENT.md) — Local setup and scripts
- [Architecture](docs/ARCHITECTURE.md) — System design and data flow
- [API Reference](docs/API.md) — All API endpoints
- [Deployment](docs/DEPLOYMENT.md) — Production setup on Vercel
- [Testing](docs/TESTING.md) — E2E tests with Playwright
- [Security](docs/SECURITY.md) — Security practices
- [Environment Variables](docs/ENVIRONMENT_VARIABLES.md) — All env vars
- [Admin Guide](docs/ADMIN_GUIDE.md) — Admin dashboard usage
- [Content Editor Guide](docs/CONTENT_EDITOR_GUIDE.md) — Sanity CMS
- [Scraper Guide](docs/SCRAPER_GUIDE.md) — Worker setup and usage
- [Contributing](docs/CONTRIBUTING.md) — How to contribute

## License

Proprietary — All rights reserved.

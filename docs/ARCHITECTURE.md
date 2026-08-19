# Architecture

## System Overview

Bigenda Bite is a full-stack web application built with Next.js 15, serving as a comprehensive guide for Rwandans to navigate official processes, access how-to guides, discover businesses, and stay informed.

```
┌─────────────────────────────────────────────────────────────┐
│                         Client (Browser)                     │
│  Next.js 15 App Router + Tailwind CSS + custom i18n provider  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Application                      │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  Server      │  │  Server      │  │  Server         │  │
│  │  Components  │  │  Actions     │  │  API Routes     │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  Client      │  │  Admin       │  │  Webhooks       │  │
│  │  Components  │  │  Dashboard   │  │  (MoMo, CMS)    │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   MongoDB     │   │   Sanity      │   │   External    │
│   (Operational│   │   (Published  │   │   APIs        │
│    Data)      │   │   Content)    │   │               │
│               │   │               │   │ - MTN MoMo    │
│ - Users       │   │ - Processes   │   │ - Discord     │
│ - Sessions    │   │ - Guides      │   │ - IRREMBO     │
│ - Ads         │   │ - Alerts      │   │ - RRA         │
│ - Contributions│  │               │   │ - RDB         │
│ - Leads       │   │               │   │               │
│ - Payments    │   │               │   │               │
│ - Analytics   │   │               │   │               │
│ - Pending     │   │               │   │               │
│   Updates     │   │               │   │               │
│ - Notifications│  │               │   │               │
└───────────────┘   └───────────────┘   └───────────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 15 (App Router) | SSR, SSG, API routes |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS 3 | Utility-first CSS |
| i18n | custom provider | Multi-language (EN/FR/RW) |
| Database | MongoDB (native driver) | User data, sessions, ads, payments |
| CMS | Sanity v3 | Published content (processes, guides, alerts) |
| Auth | Custom credentials auth | Session-based auth with MongoDB |
| Payments | MTN MoMo API | Mobile money payments |
| Notifications | Discord Webhooks | Editor notifications |
| Analytics | Custom event tracking | Page views, clicks, conversions |
| Deployment | Vercel | Hosting and CI/CD |

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [lang]/            # i18n page routes
│   │   ├── layout.tsx     # Layout with server-side tracking
│   │   ├── page.tsx       # Homepage
│   │   ├── processes/     # Process listing & detail
│   │   ├── guides/        # Guide listing & detail
│   │   ├── directory/     # Business directory
│   │   ├── alerts/        # Alerts page
│   │   ├── membership/    # Membership & checkout
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   └── ...
│   ├── admin/             # Admin dashboard
│   │   ├── layout.tsx     # Admin layout with sidebar
│   │   ├── analytics/     # Analytics dashboard
│   │   ├── users/         # User management
│   │   ├── ads/           # Ad management
│   │   ├── content/       # Content scheduling
│   │   └── pending-updates/ # Scraper approval queue
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication
│   │   ├── analytics/     # Analytics endpoints
│   │   ├── momo/          # MTN MoMo integration
│   │   ├── ads/           # Ad tracking
│   │   ├── admin/         # Admin API
│   │   ├── notifications/ # Notification API
│   │   └── webhooks/      # Webhook handlers
│   ├── layout.tsx         # Root HTML layout
│   ├── globals.css        # Global styles
│   ├── robots.ts          # robots.txt
│   └── sitemap.ts         # sitemap.xml
├── components/            # Reusable components
│   ├── ui/                # Design system components
│   ├── Navigation.tsx     # Main navigation
│   ├── Footer.tsx         # Site footer
│   ├── AdBanner.tsx       # Ad display component
│   ├── CitySelector.tsx   # City dropdown
│   └── ...
├── lib/                   # Core utilities
│   ├── analytics.ts       # Event tracking
│   ├── auth/              # Authentication logic
│   ├── cms/               # Sanity client & queries
│   ├── db/                # MongoDB connection
│   ├── momo/              # MTN MoMo API client
│   ├── scrapers/          # Web scraping engine
│   ├── notifications.ts   # Notification helpers
│   ├── city.ts            # City resolution
│   └── seo.ts             # SEO utilities
├── i18n/                  # Internationalization
│   ├── messages/          # Translation files
│   ├── routing.ts         # i18n routing config
│   └── request.ts         # i18n request handler
└── types/                 # TypeScript type definitions
```

## Key Architectural Decisions

### 1. Dual Database Strategy

- **MongoDB** — Operational data: users, sessions, ads, payments, contributions, leads, analytics events, notifications, pending updates
- **Sanity** — Published content: processes, guides, alerts
- **Rationale**: Sanity provides a real-time CMS for editors; MongoDB handles transactional/operational data better

### 2. Custom Authentication

- NextAuth v4 was replaced with a minimal custom credentials auth
- Sessions stored in MongoDB `sessions` collection
- Server-side `getSession()` accepts `NextRequest | string | null`
- Rationale: NextAuth v4 had compatibility issues with Next.js 15 App Router

### 3. i18n Architecture

- Custom lightweight i18n provider for routing and translations
- Server components load messages via dynamic import
- URL structure: `/{lang}/...`
- Supported locales: English (`en`), French (`fr`), Kinyarwanda (`rw`)

### 4. Scraper Worker Pattern

- Standalone Node.js process (`scripts/worker.ts`)
- Launches Playwright browser, scrapes sources
- Computes diffs against existing Sanity documents
- Inserts into MongoDB `pendingUpdates` collection
- Discord webhook notifies editors for review
- Editors approve via admin dashboard, which creates/updates Sanity documents

### 5. City-Based Personalization

- `bigenda-city` cookie stores user's city preference
- Server-side resolution via `resolveCity()` (cookie or IP-based)
- Client-side `CitySelector` component for manual override
- Used for ad targeting and content filtering

### 6. Analytics Architecture

- Server-side page view tracking in layout (fire-and-forget)
- Client-side event tracking via `useTrackEvent` hook
- Events stored in MongoDB `analytics` collection
- Admin dashboard queries for summary stats
- Anonymous session ID via `bigenda-session` cookie

### 7. Payment Flow

- MTN MoMo API for payment initiation and status polling
- Client-side `CheckoutForm` with phone number input
- Server-side `/api/momo/collect` creates payment
- Client polls `/api/momo/status` for updates
- Webhook `/api/webhooks/momo` for server-side confirmation

## Data Flow

### User Registration Flow

1. User submits registration form (`/register`)
2. POST `/api/register` creates user in MongoDB
3. Password hashed with bcrypt
4. Redirect to login page

### Authentication Flow

1. User submits login form (`/login`)
2. POST `/api/auth/callback/credentials`
3. Custom auth verifies credentials against MongoDB
4. Session created and stored in `sessions` collection
5. Session cookie set
6. Subsequent requests validated via `getSession()`

### Content Publishing Flow

1. Editor creates/edits content in Sanity Studio
2. Content published with `status: "published"`
3. Next.js fetches published content via Sanity client
4. Pages rendered server-side with fresh data

### Scraper Approval Flow

1. Worker scrapes sources and computes diffs
2. Pending updates inserted into MongoDB
3. Discord webhook sends notification to editors
4. Editor reviews in `/admin/pending-updates`
5. Editor approves/rejects
6. On approve: Sanity document created/updated
7. Pending update marked as processed

### Ad Display Flow

1. Page requests ad via `AdBanner` component
2. Client fetches from `/api/ads?placement=...&city=...`
3. Ad returned with impression tracking pixel
4. Impression recorded via `/api/ads/impression`
5. Click tracked via `/api/ads/click`

## Caching Strategy

- **Static pages**: SSG where possible (`generateStaticParams`)
- **Dynamic pages**: `force-dynamic` for fresh data
- **Sanity content**: Cached with `next: { revalidate }` where applicable
- **API routes**: No caching by default, explicit headers where appropriate
- **CDN**: Vercel Edge Network for static assets

## Security Considerations

- Environment variables for all secrets
- No client-side exposure of server-only tokens
- CSRF protection on auth endpoints
- Session tokens stored in HTTP-only cookies
- Input validation on all API routes
- MongoDB injection prevention via parameterized queries
- Sanity API tokens with minimum required permissions

## CI/CD

See [docs/CI_CD.md](CI_CD.md) for the full CI/CD pipeline configuration.

**Summary:**
- GitHub Actions with lint, build, test, and deploy jobs
- Playwright E2E smoke tests
- Vercel preview deployments for PRs
- Automatic production deployment on merge to `main`

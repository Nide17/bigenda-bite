# Architecture

## Overview

Bigenda Bite is a Next.js 15 app that helps Rwandans find official processes, guides, businesses, and alerts.

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│       Next.js App Router + Tailwind CSS + custom i18n        │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Application                      │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  Server      │  │  Server      │  │  API Routes     │  │
│  │  Components  │  │  Actions     │  │                 │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  Client      │  │  Admin       │  │  Webhooks       │  │
│  │  Components  │  │  Dashboard   │  │  (MoMo, CMS)    │  │
│  │  (Toasts)    │  │              │  │                 │  │
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
│ - Payments    │   │               │   │ - RDB         │
│ - Leads       │   │               │   │               │
│ - Analytics   │   │               │   │               │
│ - Submissions │   │               │   │               │
└───────────────┘   └───────────────┘   └───────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 3 |
| i18n | Custom provider (EN/FR/RW) |
| Database | MongoDB (native driver) |
| CMS | Sanity v3 |
| Auth | Custom credentials + Google OAuth |
| Payments | MTN MoMo API |
| Notifications | Discord Webhooks + Sonner toasts |
| Deployment | Vercel |

## Key Decisions

### Dual Database

- **MongoDB** — Operational data: users, sessions, ads, payments, leads, analytics, submissions, pending updates
- **Sanity** — Published content: processes, guides, alerts
- Sanity gives editors a real-time CMS; MongoDB handles transactional data better

### Auth

NextAuth v4 with Google OAuth and custom credentials provider. Sessions stored as JWTs in HTTP-only cookies. Email verification is available but not required for login. Google OAuth users are matched by email and created automatically if not present. The `next-auth/next` import provides Next.js 15 App Router compatibility.

### i18n

Custom lightweight provider replaces next-intl. Translations are JSON files loaded by server components. URLs follow `/{lang}/...`.

### Toast Notifications

Sonner provides ephemeral toast feedback for form submissions, admin actions, and system events. Toasts appear in the bottom-right corner with rich colors.

### Scraper Worker

Standalone Node.js process using Playwright. Scrapes sources, diffs against Sanity, stores changes in MongoDB `pendingUpdates`, and notifies editors via Discord.

### City Personalization

`bigenda-city` cookie stores preference. Used for ad targeting and content filtering.

### Analytics

Server-side page view tracking in layout. Client-side events via `useTrackEvent` hook. Events stored in MongoDB.

## Data Flows

### User Registration

1. User submits form at `/register`
2. POST `/api/register` creates user in MongoDB
3. Password hashed with bcrypt
4. Redirect to login

### Content Publishing

1. Editor works in Sanity Studio
2. Content published with `status: "published"`
3. Next.js fetches via Sanity client
4. Pages rendered server-side

### Scraper Approval

1. Worker scrapes sources, computes diffs
2. Pending updates inserted into MongoDB
3. Discord notifies editors
4. Editor reviews at `/admin/pending-updates`
5. Approve creates/updates Sanity document

### Payments

1. User submits phone at checkout
2. POST `/api/momo/collect` initiates payment
3. Client polls `/api/momo/status`
4. Webhook confirms server-side

### Submissions

1. User submits feedback/edit suggestion/review from content pages
2. POST `/api/submissions` stores in MongoDB
3. Editors review at `/admin/submissions`
4. Can approve, reject, or publish to Sanity

## Security

See [SECURITY.md](SECURITY.md) for security practices.

## CI/CD

See [CI_CD.md](CI_CD.md) for the CI pipeline.

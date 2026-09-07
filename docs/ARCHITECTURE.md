# Architecture

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| i18n | Custom provider (EN/FR/RW) |
| Database | MongoDB (native driver) |
| CMS | Sanity v3 |
| Auth | Custom credentials + Google OAuth |
| Payments | MTN MoMo API |
| Notifications | Discord webhooks + Sonner |
| Deployment | Vercel |

## Data

- **MongoDB** — Users, sessions, ads, payments, leads, analytics, submissions, pending updates
- **Sanity** — Published content: processes, guides, alerts

## Key Decisions

- **Dual DB:** MongoDB for transactional data, Sanity for editorial content
- **Auth:** NextAuth v4 with JWT sessions
- **i18n:** Custom JSON-based provider, URLs follow `/{lang}/...`
- **Scraper:** Standalone Playwright worker; diffs against Sanity, stores pending updates in MongoDB
- **City routing:** `bigenda-city` cookie personalizes content and ads

## Flows

### Registration
1. Form at `/register`
2. `POST /api/register` creates user in MongoDB
3. Password hashed with bcrypt
4. Email verification sent

### Content Publishing
1. Editor works in Sanity Studio
2. Publish with `status: "published"`
3. Next.js fetches via Sanity client
4. Server-rendered pages

### Scraper Approval
1. Worker scrapes and diffs sources
2. Pending updates stored in MongoDB
3. Discord notifies editors
4. Editor approves in `/admin`
5. Sanity document created/updated

### Payments
1. User submits phone at checkout
2. `POST /api/momo/collect` initiates payment
3. Client polls `/api/momo/status`
4. Webhook confirms server-side

## Related Docs

- [Security](SECURITY.md)
- [CI/CD](CI_CD.md)
- [Deployment](DEPLOYMENT.md)

# Product Overview

Bigenda Bite is a content-driven platform that helps Rwandans navigate official government processes, access practical how-to guides, discover local businesses, and stay informed with verified alerts.

## Core Purpose

Users come to accomplish something, not to browse a website. The product is organized around task completion:

1. Search — the primary entry point
2. Popular tasks — common government processes
3. Important alerts — time-sensitive announcements
4. Browse by category — structured content discovery
5. Latest guides — recently updated how-to content
6. Businesses near you — location-aware directory
7. Latest updates — recently changed official processes

## Supported Languages

- English (`en`)
- French (`fr`)
- Kinyarwanda (`rw`)

## Supported Cities

- Kigali
- Musanze
- Rubavu
- Huye

## Feature Status

### Implemented

| Feature | Description |
|---------|-------------|
| Official Processes | Published government process guides with steps, fees, and required documents |
| How-To Guides | Practical life guides with steps, costs, and community tips |
| Business Directory | City-based business listings with contact forms and lead capture |
| Alerts | Severity-based official announcements with expiry dates |
| Search | Universal search across processes, guides, businesses, and alerts |
| City Routing | Content and ads personalized by city preference |
| i18n | Full translation coverage for EN/FR/RW |
| Authentication | Email/password and Google OAuth via NextAuth v4 |
| Membership | Subscription plans with MTN MoMo payment integration |
| Ads | Impression and click tracking with placement management |
| Admin Dashboard | Editor tools for users, ads, analytics, content, and pending updates |
| Analytics | Page views, custom events, and summary stats |
| Notifications | In-app notification bell with unread counts |
| Scraper Worker | Automated scraping with diff-based approval workflow |
| Discord Integration | Editor notifications for pending scraper updates |
| Error Boundaries | Localized error and loading states with retry |
| CI/CD | GitHub Actions for typecheck, lint, build, and E2E tests |

### Partially Implemented

| Feature | Description |
|---------|-------------|
| Scraper Content Quality | Worker and approval flow exist; data quality guardrails are still being refined |
| Payment Flow | MoMo integration is implemented; sandbox validation is incomplete |
| Search Relevance | Basic token-based scoring is in place; fuzzy matching and advanced ranking are planned |

### Planned

| Feature | Description |
|---------|-------------|
| Advanced Search | Fuzzy matching, typo tolerance, and dedicated search index |
| User Profiles | Extended profile management and preference settings |
| Content Scheduling | Future-date publishing and expiry automation |
| Rate Limiting | API-level rate limiting and abuse protection |
| Offline Support | Service worker and cached content for low-connectivity users |
| Mobile App | Native or PWA experience beyond responsive web |

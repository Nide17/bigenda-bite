# Admin Guide

This guide covers the Bigenda Bite admin dashboard for editors and administrators.

## Access

Navigate to `/admin` after logging in with an editor or admin account.

## Sections

### Pending Updates

Shows scraper updates awaiting review.

- **Approve** — Creates or updates the corresponding Sanity document
- **Reject** — Discards the proposed update
- Pending updates come from the scraper worker via MongoDB `pendingUpdates`

### Analytics

Summary statistics including:

- Page views
- Ad clicks
- Payment initiations and successes
- Community contributions
- Business leads

Filter by date range (default: last 7 days).

### Users

Manage registered users:

- View all users
- Update roles (`user`, `editor`, `admin`)
- Ban/unban users

### Content

Browse and manage published content. This is a lightweight view; detailed editing is done in Sanity Studio.

### Ads

Manage advertisement placements:

- Create new ads with title, placement, city, link URL, and image URL
- View existing ads
- Ads are served via `/api/ads` with impression and click tracking

## Roles

| Role | Description |
|------|-------------|
| `reader` | Default role for new signups |
| `editor` | Can review pending updates and manage content |
| `admin` | Full access to all admin sections |

## Notifications

Editors receive Discord webhook notifications when the scraper worker submits new pending updates.

## Approval Flow

1. Worker scrapes sources and computes diffs
2. Pending updates are inserted into MongoDB
3. Discord webhook notifies editors
4. Editor reviews in `/admin/pending-updates`
5. Editor approves or rejects
6. On approve: Sanity document is created/updated
7. Pending update is marked as processed

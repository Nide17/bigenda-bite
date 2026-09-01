# Admin Guide

For editors and administrators using the Bigenda Bite dashboard.

## Access

Go to `/admin` after signing in with an editor or admin account.

## Sections

### Pending Updates

Scraper updates waiting for review.

- **Approve** — Creates/updates the Sanity document
- **Reject** — Discards the update

### Analytics

Summary stats: page views, ad clicks, payments, contributions, leads. Filter by date range (default: 7 days).

### Users

Manage registered users:

- Search by name or email
- Filter by role or status
- Change roles (reader, editor, admin, superadmin)
- Ban/unban users
- Manually verify emails

### Content

Lightweight view of published content. For detailed editing, use Sanity Studio.

### Ads

Manage ad placements:

- Create ads with title, placement, city, link, and image
- Edit or delete existing ads

## Roles

| Role | Access |
|------|--------|
| `reader` | Default for new users |
| `editor` | Review updates, manage content |
| `admin` | Full admin access |
| `superadmin` | System configuration |

## Notifications

Editors get Discord notifications when the scraper finds updates to review.

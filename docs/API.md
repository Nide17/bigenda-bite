# API Reference

Base path: `/api`. All endpoints require authentication unless noted.

## Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/csrf` | Get CSRF token |
| POST | `/api/auth/callback/credentials` | Email/password login |
| POST | `/api/auth/callback/google` | Google OAuth login |
| POST | `/api/auth/signout` | Sign out |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password/validate` | Validate reset token |
| POST | `/api/auth/reset-password` | Set new password |
| POST | `/api/auth/verify-email` | Verify email with token |
| POST | `/api/auth/verify-email/resend` | Resend verification email |

## Auth & Users

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/register` | Create account. Body: `{ name, email, password }` |
| GET | `/api/account` | Get current user profile |
| PATCH | `/api/account` | Update profile. Body: `{ displayName?, email?, isForeigner? }` |
| PATCH | `/api/account/password` | Change password. Body: `{ currentPassword, newPassword }` |

## Search

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/search` | Search content. Query: `q`, `lang`, `type?` |

## Content

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/submissions` | Submit feedback/edit suggestion/review. Body: `{ type, contentType, contentId, text }` |
| POST | `/api/leads` | Submit business lead. Body: `{ businessId, contactName, contactPhone, message }` |

## Admin

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/users` | List users. Query: `search?`, `role?` |
| PATCH | `/api/admin/users` | Update user. Body: `{ userId, role?, banned?, emailVerified? }` |
| GET | `/api/admin/submissions` | List submissions. Query: `status?`, `contentType?`, `type?` |
| POST | `/api/admin/submissions` | Moderate. Body: `{ action: "approve" | "reject" | "publish", id, reviewNote? }` |
| GET | `/api/admin/pending-updates` | List pending scraper updates |
| POST | `/api/admin/pending-updates/approve` | Approve. Body: `{ updateId }` |
| POST | `/api/admin/pending-updates/reject` | Reject. Body: `{ updateId }` |
| GET | `/api/admin/ads` | List ads |
| POST | `/api/admin/ads` | Create ad. Body: `{ title, placement, city, linkUrl, imageUrl }` |
| PATCH | `/api/admin/ads` | Update ad. Query: `id`. Body: `{ title?, active? }` |
| DELETE | `/api/admin/ads` | Delete ad. Query: `id` |
| GET | `/api/analytics` | Summary stats. Query: `days?` (default: 7) |
| POST | `/api/analytics/track` | Track event. Body: `{ type, metadata }` |

## Payments

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/momo/collect` | Initiate payment. Body: `{ planId, amount, phoneNumber }` |
| GET | `/api/momo/status` | Check status. Query: `transactionId` |

## Notifications

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/notifications` | Get user notifications |
| PATCH | `/api/notifications/[id]` | Mark as read |

## Webhooks

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/webhooks/momo` | MoMo payment confirmation |
| POST | `/api/webhooks/cms-revalidate` | Sanity CMS revalidation |

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict |
| 500 | Server error |

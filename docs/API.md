# API Reference

Base URL: `/api`

## Authentication

Most endpoints require a session cookie (`next-auth.session-token`). Admin endpoints require `editor` role or above.

## Endpoints

### Auth

#### POST `/api/auth/callback/credentials`

Sign in with email and password.

```json
{
  "csrfToken": "string",
  "email": "user@example.com",
  "password": "password",
  "callbackUrl": "/en",
  "redirect": "false"
}
```

Returns a JSON response. On bad credentials, the body contains `{ "error": "CredentialsSignin" }`. On success, it may return a redirect or JSON with a `url` field.

#### POST `/api/register`

Create a new account.

```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

Returns `201` on success, `409` if email exists.

#### GET `/api/auth/csrf`

Get a CSRF token for auth requests.

#### POST `/api/auth/forgot-password`

Send a password reset email. Body: `{ "email": "string" }`

#### POST `/api/auth/reset-password/validate`

Validate a reset token.

#### POST `/api/auth/reset-password`

Set a new password. Body: `{ "token": "string", "password": "string" }`

#### POST `/api/auth/verify-email`

Verify email with token. Body: `{ "token": "string" }`

#### POST `/api/auth/verify-email/resend`

Resend verification email.

### Ads

#### GET `/api/ads`

Get ads for a placement and city.

Query: `placement`, `city`

#### POST `/api/ads/impression`

Record an ad impression. Body: `{ "adId": "string" }`

#### POST `/api/ads/click`

Record an ad click. Body: `{ "adId": "string" }`

### Search

#### GET `/api/search`

Search across processes, guides, and alerts.

Query: `q`, `lang`

Returns results with type, title, description, category, URL.

### Contributions

#### POST `/api/contributions`

Submit a community tip for a guide.

```json
{
  "guideId": "passport-application",
  "text": "I recommend doing this early...",
  "city": "Kigali"
}
```

### Feedback

#### POST `/api/guides/[id]/feedback`

Submit feedback for a guide.

```json
{
  "rating": 5,
  "text": "Very helpful guide"
}
```

### Submissions

#### POST `/api/submissions`

Submit user-generated content (comment, edit suggestion, review).

```json
{
  "type": "comment",
  "contentType": "guide",
  "contentId": "string",
  "contentSlug": "string",
  "text": "string",
  "rating": 5
}
```

#### POST `/api/admin/submissions`

Approve, reject, or publish a submission. Body: `{ "action": "approve", "id": "string", "reviewNote": "string" }`

### Leads

#### POST `/api/leads`

Submit a lead for a business.

```json
{
  "businessId": "string",
  "contactName": "string",
  "contactPhone": "string",
  "message": "string"
}
```

Sends an email notification to the business if they have an email on file.

### Account

#### GET `/api/account`

Get the current user's profile.

#### PATCH `/api/account`

Update profile (displayName, email). Email changes reset verification.

```json
{
  "displayName": "string",
  "email": "string",
  "isForeigner": true
}
```

#### PATCH `/api/account/password`

Change password. Requires current password.

```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

### Password Reset

#### POST `/api/auth/forgot-password`

Send a password reset email. Body: `{ "email": "string" }`

#### POST `/api/auth/reset-password/validate`

Validate a reset token.

#### POST `/api/auth/reset-password`

Set a new password. Body: `{ "token": "string", "password": "string" }`

### Email Verification

#### POST `/api/auth/verify-email`

Verify email with token. Body: `{ "token": "string" }`

#### POST `/api/auth/verify-email/resend`

Resend verification email.

### Admin — Users

#### GET `/api/admin/users`

List users (editor or above). Supports search and filters client-side.

#### PATCH `/api/admin/users`

Update a user (role, ban status, email verification).

```json
{
  "userId": "string",
  "role": "editor",
  "banned": false,
  "emailVerified": true
}
```

### Admin — Pending Updates

#### GET `/api/admin/pending-updates`

List scraper updates awaiting review.

#### POST `/api/admin/pending-updates/approve`

Approve a pending update. Body: `{ "updateId": "string" }`

#### POST `/api/admin/pending-updates/reject`

Reject a pending update. Body: `{ "updateId": "string" }`

### Admin — Submissions

#### GET `/api/admin/submissions`

List user submissions. Query: `status`, `contentType`, `type`

#### POST `/api/admin/submissions`

Approve, reject, or publish a submission. Body: `{ "action": "approve", "id": "string", "reviewNote": "string" }`

### Admin — Ads

#### GET `/api/admin/ads`

List all ads.

#### POST `/api/admin/ads`

Create an ad.

```json
{
  "title": "string",
  "placement": "sidebar",
  "city": "Kigali",
  "linkUrl": "https://...",
  "imageUrl": "https://..."
}
```

#### PATCH `/api/admin/ads`

Update an ad. Query: `id`

```json
{
  "title": "string",
  "active": true
}
```

#### DELETE `/api/admin/ads`

Delete an ad. Query: `id`

### Analytics

#### GET `/api/analytics`

Get summary stats. Query: `days` (default: 7)

#### POST `/api/analytics/track`

Track an event (public).

```json
{
  "type": "page_view",
  "metadata": { "path": "/en/processes", "lang": "en" }
}
```

Event types: `page_view`, `ad_click`, `payment_initiated`, `payment_success`, `contribution_submitted`, `lead_submitted`

### Payments

#### POST `/api/momo/collect`

Initiate a MoMo payment.

```json
{
  "planId": "basic",
  "amount": 2000,
  "phoneNumber": "250788000000"
}
```

#### GET `/api/momo/status`

Check payment status. Query: `transactionId`

### Notifications

#### GET `/api/notifications`

Get notifications for the logged-in user.

#### POST `/api/notifications`

Create a notification (system use).

#### PATCH `/api/notifications/[id]`

Mark as read.

### Webhooks

#### POST `/api/webhooks/momo`

MTN MoMo payment confirmation.

#### POST `/api/webhooks/cms-revalidate`

Sanity CMS revalidation.

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

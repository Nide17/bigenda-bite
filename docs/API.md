# API Reference

Base URL: `/api`

## Authentication

Most endpoints require authentication via session cookie (`next-auth.session-token`).

```http
Cookie: next-auth.session-token=<token>
```

## Endpoints

### Authentication

#### POST `/api/auth/callback/credentials`

Authenticate a user with email and password.

**Request:**
```json
{
  "csrfToken": "string",
  "email": "user@example.com",
  "password": "password",
  "callbackUrl": "/en",
  "redirect": "false"
}
```

**Response:** `302 Redirect` to `callbackUrl` on success, `401` on failure.

---

#### POST `/api/register`

Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

**Status Codes:**
- `201` — User created
- `400` — Validation error
- `409` — Email already exists

---

#### GET `/api/auth/csrf`

Get CSRF token for authentication.

**Response:**
```json
{
  "csrfToken": "string"
}
```

---

### Ads

#### GET `/api/ads`

Get ads for a placement and city.

**Query Parameters:**
- `placement` — Ad placement location
- `city` — City for targeting

**Response:**
```json
[
  {
    "_id": "string",
    "title": "Ad Title",
    "imageUrl": "https://...",
    "linkUrl": "https://...",
    "placement": "sidebar",
    "city": "Kigali"
  }
]
```

---

#### POST `/api/ads/impression`

Record an ad impression.

**Request:**
```json
{
  "adId": "string"
}
```

**Response:** `200 OK`

---

#### POST `/api/ads/click`

Record an ad click.

**Request:**
```json
{
  "adId": "string"
}
```

**Response:** `200 OK`

---

### Search

#### GET `/api/search`

Search processes, guides, and alerts.

**Query Parameters:**
- `q` — Search query
- `lang` — Language code (`en`, `fr`, `rw`)

**Response:**
```json
{
  "results": [
    {
      "type": "process",
      "title": "Business Registration",
      "description": "...",
      "category": "business",
      "language": "en",
      "url": "/en/processes/business/registration"
    }
  ],
  "query": "business",
  "language": "en",
  "total": 1
}
```

---

### Contributions

#### POST `/api/contributions`

Submit a community contribution for a guide.

**Request:**
```json
{
  "guideId": "passport-application",
  "text": "I recommend doing this early in the morning...",
  "city": "Kigali"
}
```

**Response:**
```json
{
  "id": "string",
  "status": "pending"
}
```

---

### Leads

#### POST `/api/leads`

Submit a lead for a business.

**Request:**
```json
{
  "businessId": "string",
  "name": "string",
  "phone": "string",
  "message": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "status": "submitted"
}
```

---

### Admin - Pending Updates

#### GET `/api/admin/pending-updates`

Get pending scraper updates (editor only).

**Response:**
```json
[
  {
    "id": "string",
    "sourceType": "scraper",
    "documentId": "string",
    "update": {},
    "diffSummary": "string",
    "confidenceScore": 0.95,
    "status": "pending",
    "detectedAt": "2024-01-01T00:00:00Z"
  }
]
```

---

#### PATCH `/api/admin/pending-updates/approve`

Approve a pending update.

**Request:**
```json
{
  "id": "string"
}
```

**Response:**
```json
{
  "success": true
}
```

---

#### PATCH `/api/admin/pending-updates/reject`

Reject a pending update.

**Request:**
```json
{
  "id": "string"
}
```

**Response:**
```json
{
  "success": true
}
```

---

### Admin - Users

#### GET `/api/admin/users`

Get all users (editor only).

**Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "user",
    "banned": false,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

---

#### PATCH `/api/admin/users/[id]`

Update a user (editor only).

**Request:**
```json
{
  "role": "editor",
  "banned": false
}
```

**Response:**
```json
{
  "success": true
}
```

---

### Admin - Ads

#### GET `/api/admin/ads`

Get all ads (editor only).

**Response:**
```json
[
  {
    "_id": "string",
    "title": "string",
    "placement": "string",
    "city": "string",
    "linkUrl": "string",
    "imageUrl": "string"
  }
]
```

---

#### POST `/api/admin/ads`

Create a new ad (editor only).

**Request:**
```json
{
  "title": "string",
  "placement": "sidebar",
  "city": "Kigali",
  "linkUrl": "https://...",
  "imageUrl": "https://..."
}
```

**Response:**
```json
{
  "id": "string"
}
```

---

#### PATCH `/api/admin/ads/[id]`

Update an ad (editor only).

**Request:** Same fields as POST.

**Response:**
```json
{
  "success": true
}
```

---

#### DELETE `/api/admin/ads/[id]`

Delete an ad (editor only).

**Response:**
```json
{
  "success": true
}
```

---

### Analytics

#### GET `/api/analytics`

Get analytics summary (editor only).

**Query Parameters:**
- `days` (optional) — Number of days to look back (default: 7)

**Response:**
```json
{
  "pageViews": 150,
  "adClicks": 45,
  "payments": 12,
  "contributions": 8,
  "leads": 23,
  "days": 7
}
```

---

#### POST `/api/analytics/track`

Track an analytics event (public).

**Request:**
```json
{
  "type": "page_view",
  "metadata": {
    "path": "/en/processes/immigration/passport",
    "lang": "en",
    "city": "Kigali",
    "sessionId": "uuid"
  }
}
```

**Supported event types:**
- `page_view` — Page navigation
- `ad_click` — Ad click
- `payment_initiated` — Payment started
- `payment_success` — Payment completed
- `contribution_submitted` — Community tip submitted

**Response:** `200 OK`

---

### Payments

#### POST `/api/momo/collect`

Initiate a MoMo payment.

**Request:**
```json
{
  "planId": "basic",
  "amount": 2000,
  "phoneNumber": "250788000000"
}
```

**Response:**
```json
{
  "transactionId": "string",
  "status": "PENDING"
}
```

---

#### GET `/api/momo/status`

Check payment status.

**Query Parameters:**
- `transactionId` — The transaction ID

**Response:**
```json
{
  "status": "SUCCESSFUL",
  "transactionId": "string",
  "amount": 2000
}
```

---

### Notifications

#### GET `/api/notifications`

Get notifications for the logged-in user.

**Response:**
```json
[
  {
    "id": "string",
    "type": "scraper_update",
    "title": "New Pending Update",
    "body": "IremboGov has a new update",
    "read": false,
    "metadata": {},
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

---

#### POST `/api/notifications`

Create a notification (system use).

**Request:**
```json
{
  "userId": "string",
  "type": "system",
  "title": "string",
  "body": "string",
  "metadata": {}
}
```

**Response:**
```json
{
  "id": "string"
}
```

---

#### PATCH `/api/notifications/[id]`

Mark a notification as read.

**Response:**
```json
{
  "success": true
}
```

---

### Webhooks

#### POST `/api/webhooks/momo`

MTN MoMo payment webhook.

**Headers:**
- `X-MoMo-Signature`: MoMo signature

**Response:** `200 OK`

---

#### POST `/api/webhooks/cms-revalidate`

Sanity CMS revalidation webhook.

**Headers:**
- `X-Sanity-Signature`: Sanity signature

**Request:**
```json
{
  "_type": "process",
  "_id": "string"
}
```

**Response:** `200 OK`

---

## Error Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `301` | Moved permanently |
| `400` | Bad request |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not found |
| `409` | Conflict |
| `429` | Too many requests |
| `500` | Internal server error |

## Rate Limiting

Currently no rate limiting is implemented. This may be added in future versions.

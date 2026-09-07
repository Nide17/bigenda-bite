# Security Hardening Pass — 2026-09-06

## Authentication & Authorization

### Session Fix
- **File:** `src/app/api/auth/[...nextauth]/options.ts`
- **Change:** Changed `session.strategy` from `'database'` to `'jwt'`
- **Reason:** Database strategy was causing empty sessions because credentials provider stores JWT directly in cookie, not in MongoDB sessions collection

### Rate Limiting
- **New file:** `src/lib/rate-limit.ts`
- **Implemented:** In-memory rate limiter with IP-based keys and automatic cleanup
- **Protected endpoints:**
  - `POST /api/register` — 3 requests/hour per IP
  - `POST /api/auth/forgot-password` — 3 requests/hour per IP
  - `POST /api/auth/reset-password` — 5 requests/hour per IP
  - `POST /api/auth/verify-email/resend` — 3 requests/hour per IP
  - `GET /api/search` — 30 requests/minute per IP
  - `POST /api/leads` — 5 requests/hour per IP
  - `POST /api/submissions` — 10 requests/hour per IP
  - `POST /api/momo/collect` — 5 requests/hour per IP
  - `GET /api/momo/status` — 10 requests/minute per IP

### Password Policy
- **Enforced:** Minimum 8 characters on registration, password change, and reset endpoints
- **Files:** `src/app/api/register/route.ts`, `src/app/api/account/password/route.ts`, `src/app/api/auth/reset-password/route.ts`

### Email Verification Enumeration
- **Fixed:** `src/app/api/auth/verify-email/resend/route.ts` now always returns generic message "If an account exists, a verification email has been sent." regardless of account state
- **Prevents:** Attackers from enumerating valid emails and identifying verified accounts

## API Security

### Request Validation
- **All API routes** now validate:
  - HTTP method (added OPTIONS/GET handlers where missing)
  - Request body JSON parsing with error handling
  - Required fields presence
  - URL scheme validation for user-provided links (`http:`/`https:` only)
  - Query parameter types and ranges

### Method Enforcement
- Added explicit `OPTIONS()` handlers to all state-changing API routes for CORS preflight
- Added `GET()` handlers returning 405 to routes that only accept POST/PATCH/DELETE

### Security Headers
- **New file:** `src/middleware.ts`
- **Headers added:**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (production only)

### Error Sanitization
- **New file:** `src/lib/security.ts`
- **Function:** `sanitizedErrorResponse()` strips sensitive keywords (MONGODB_URI, password, secret, token) from error messages
- **Applied:** All API routes return generic error messages to clients

## Payment Security

### Webhook Hardening
- **File:** `src/app/api/webhooks/momo/route.ts`
- **Added:**
  - Payload size limit (1MB)
  - Subscription key validation via `x-subscription-key` header
  - Signature header check (`x-momo-signature`)
  - Transaction existence verification before update
  - Webhook verification metadata storage (`webhookVerified`, `webhookReceivedAt`)

### Payment Initiation
- **File:** `src/app/api/momo/collect/route.ts`
- **Added:** Rate limiting (5 requests/hour per IP)
- **Validates:** Amount > 0, required fields present

### Status Polling
- **File:** `src/app/api/momo/status/route.ts`
- **Added:** Rate limiting (10 requests/minute per IP)
- **Requires:** Authentication via `requireAuth()`

## Secrets Management

### Production Configuration
- **New file:** `src/lib/config.ts`
- **Function:** `validateProductionConfig()` checks for required environment variables on app startup
- **Behavior:** Throws error in production if required vars missing; logs warning in development
- **Required vars:** MONGODB_URI, NEXTAUTH_SECRET, NEXTAUTH_URL, NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN, NEXT_PUBLIC_BASE_URL

### Debug Endpoint Protection
- **File:** `src/app/api/auth/debug/route.ts`
- **Changes:**
  - Gated behind `requireSuperadmin()` authentication
  - Returns 404 in production (`NODE_ENV === 'production'`)
  - No longer exposes raw secret values, only presence indicators

### Environment Example
- **File:** `.env.example`
- **Fixed:** Replaced real-looking Gmail credentials with placeholders (`change_me`)

## Database Security

### Connection Security
- **File:** `src/lib/db/mongodb.ts`
- **Added:** Connection pool configuration
  - `maxPoolSize: 20`
  - `minPoolSize: 5`
  - `maxIdleTimeMS: 30000`
- **Removed:** Per-request `createIndex` calls (moved to one-time script)
- **New script:** `scripts/create-indexes.ts` for one-time index setup

### Query Safety
- All MongoDB queries use parameterized inputs (no string concatenation)
- ObjectId validation before queries
- No raw user input in query construction

## Authorization

### Independent Verification
- All admin endpoints verify authorization via `requireEditor()`, `requireAdmin()`, or `requireSuperadmin()`
- No reliance on UI visibility for security
- Role hierarchy enforced: reader → editor → admin → superadmin

### Endpoints Protected
- `GET/PATCH /api/admin/users` — requires admin
- `GET/POST/PATCH/DELETE /api/admin/ads` — requires editor
- `GET/POST /api/admin/submissions` — requires editor
- `POST /api/admin/pending-updates/approve` — requires editor
- `POST /api/admin/pending-updates/reject` — requires editor
- `GET/PATCH /api/account` — requires auth
- `PATCH /api/account/password` — requires auth
- `GET /api/momo/status` — requires auth

## CORS & Preflight

### OPTIONS Handlers
- Added `OPTIONS()` returning 204 to all API routes
- Enables proper CORS preflight handling
- No custom CORS headers configured (relies on Next.js defaults)

## Missing Security Items (Deferred)

1. **CSRF Protection** — Not implemented for custom API routes. NextAuth handles CSRF for auth endpoints, but state-changing endpoints (account update, password change, admin actions) lack double-submit cookie validation. Recommended: add `csrf-csrf` library or manual Origin/Referer validation.

2. **Webhook Signature Verification** — Basic subscription key check implemented, but full MoMo signature verification requires HMAC validation with shared secret. Recommended: implement HMAC-SHA256 verification when MoMo provides signature specification.

3. **Replay Protection** — Webhooks lack timestamp/nonce validation. Recommended: reject webhooks with timestamps older than 5 minutes and track used nonces.

4. **Idempotency Keys** — Payment initiation and submissions lack idempotency keys. Recommended: accept `Idempotency-Key` header and store processed keys to prevent duplicate operations.

5. **Content Security Policy** — Not configured. Recommended: add CSP header via middleware to prevent XSS.

6. **Rate Limiting Persistence** — Current implementation uses in-memory Map. In serverless/Vercel, this resets on each function instance. Recommended: use `@upstash/ratelimit` with Redis for distributed rate limiting.

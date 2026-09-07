# Security Hardening

## Authentication

- Sessions use JWT strategy
- Rate limiting on auth and sensitive endpoints
- Email enumeration prevented (generic responses)
- Minimum 8 character password policy

## API Security

- All routes validate HTTP method, JSON body, and required fields
- URL scheme validation for user-provided links (`http:`/`https:` only)
- OPTIONS handlers for CORS preflight
- GET handlers returning 405 on POST-only routes
- Security headers via middleware:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Strict-Transport-Security` (production)
- Error responses sanitized (secrets stripped)

## Payments

- Webhook payload size limit (1MB)
- Subscription key validation via `x-subscription-key` header
- Transaction existence verification before update
- Rate limiting on collect (5/hr) and status (10/min)

## Database

- Connection pool: max 20, min 5, idle 30s
- Parameterized queries only
- One-time index setup via `scripts/create-indexes.ts`

## Authorization

- All admin endpoints verify role via `requireEditor()`, `requireAdmin()`, or `requireSuperadmin()`
- Role hierarchy: reader → editor → admin → superadmin

## Secrets

- `validateProductionConfig()` checks required env vars on startup
- Debug endpoint gated behind `requireSuperadmin()`
- `.env.example` uses placeholders

## Deferred

1. CSRF protection for custom API routes
2. Full MoMo webhook HMAC signature verification
3. Webhook replay protection (timestamp/nonce)
4. Idempotency keys for payments and submissions
5. Content Security Policy header
6. Distributed rate limiting (current in-memory Map resets per serverless instance)

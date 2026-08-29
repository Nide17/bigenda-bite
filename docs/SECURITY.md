# Security Guide

This document covers security practices for Bigenda Bite.

## Environment Variables

- **Never commit `.env.local` to version control**
- Use different values for development and production
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Server-only variables should not have the `NEXT_PUBLIC_` prefix
- Rotate secrets regularly

## Public vs Private Variables

| Prefix | Visibility | Purpose |
|--------|-----------|---------|
| `NEXT_PUBLIC_*` | Public (browser) | Client-side accessible variables |
| `SANITY_API_TOKEN` | Private (server) | Sanity write operations |
| `MONGODB_URI` | Private (server) | Database connection |
| `MTN_MOMO_*` | Private (server) | Payment integration |
| `DISCORD_WEBHOOK_URL` | Private (server) | Notifications |
| `NEXTAUTH_SECRET` | Private (server) | Session encryption |

## Sanity API Token

- `SANITY_API_TOKEN` must have Editor/Write permissions for seeding and the studio tool proxy
- This token is server-only and must not be prefixed with `NEXT_PUBLIC_`
- If a token is ever exposed, rotate it immediately in [sanity.io/manage](https://sanity.io/manage)

## Authentication

- Sessions are stored in MongoDB `sessions` collection
- Session tokens are HTTP-only cookies
- CSRF protection is enabled on auth endpoints
- Passwords are hashed with bcrypt

## Database

- Use parameterized queries to prevent MongoDB injection
- The app connects to MongoDB Atlas; IP whitelist should be configured
- Database user should have minimum required permissions

## Input Validation

- All API routes validate input before processing
- Server components and API routes enforce authorization where required
- Client components never trust user input without server-side validation

## Error Handling

- Error boundaries catch client-side failures and show localized retry UIs
- Server errors are logged but do not expose stack traces or internal details to clients
- API routes return generic error messages without leaking implementation details

## Dependencies

- Keep dependencies up to date
- Review security advisories for `next`, `next-auth`, `mongodb`, `@sanity/client`, and `playwright`
- Use `npm audit` periodically

## Generating Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate a random API key
openssl rand -hex 24
```

## Reporting Security Issues

If you discover a security vulnerability, please report it privately rather than opening a public issue.

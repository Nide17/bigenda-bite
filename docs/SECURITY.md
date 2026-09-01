# Security

## Environment Variables

- Never commit `.env.local`
- Use different values for dev and production
- `NEXT_PUBLIC_*` vars are visible in the browser
- Server-only vars should not have the `NEXT_PUBLIC_` prefix
- Rotate secrets regularly

## Public vs Private

| Prefix | Visibility | Use |
|--------|-----------|-----|
| `NEXT_PUBLIC_*` | Browser | Client-side config |
| Everything else | Server only | Secrets, DB, APIs |

## Sanity API Token

- `SANITY_API_TOKEN` is server-only (no `NEXT_PUBLIC_` prefix)
- If exposed, rotate it immediately at [sanity.io/manage](https://sanity.io/manage)

## Auth

- Sessions stored in MongoDB
- Session tokens are HTTP-only cookies
- CSRF protection on auth endpoints
- Passwords hashed with bcrypt

## Database

- Parameterized queries prevent injection
- MongoDB Atlas IP whitelist
- Minimum permissions for DB user

## Input Validation

- All API routes validate before processing
- Server components enforce authorization
- Client input is never trusted without server validation

## Error Handling

- Error boundaries show localized retry UIs
- Server errors are logged but don't leak details to clients
- API routes return generic error messages

## Dependencies

- Keep packages updated
- Run `npm audit` periodically
- Watch for advisories on `next`, `next-auth`, `mongodb`, `@sanity/client`

## Generating Secrets

```bash
openssl rand -base64 32   # NEXTAUTH_SECRET
openssl rand -hex 24      # API keys
```

## Reporting

Found a vulnerability? Report it privately, not in a public issue.

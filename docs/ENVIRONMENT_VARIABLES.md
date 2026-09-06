# Environment Variables

For development setup, see [DEVELOPMENT.md](DEVELOPMENT.md).

## Setup

1. Copy `.env.example` to `.env.local`
2. Fill in the values
3. For Vercel, set them in Dashboard → Settings → Environment Variables

## Required

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_URL` | App base URL (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Session encryption key (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (e.g. `production`) |
| `SANITY_API_TOKEN` | Sanity write token |
| `NEXT_PUBLIC_BASE_URL` | App base URL for emails and links |

> **Production:** Set `NEXTAUTH_URL` explicitly in Vercel for custom domains.

## Optional

### Google OAuth

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret |

### Email (Gmail SMTP)

| Variable | Description |
|----------|-------------|
| `GMAIL_USER` | Gmail address |
| `GMAIL_PASSWORD` | App password (enable 2FA first) |

Used for password reset and lead notification emails.

### MTN MoMo Payments

| Variable | Description |
|----------|-------------|
| `MOMO_API_USER` | MoMo API user |
| `MOMO_API_KEY` | MoMo API key |
| `MOMO_SUBSCRIPTION_KEY` | MoMo subscription key |
| `MOMO_ENVIRONMENT` | `sandbox` or `production` |
| `MOMO_ACCESS_TOKEN` | MoMo access token |

### Discord

| Variable | Description |
|----------|-------------|
| `DISCORD_WEBHOOK_URL` | Webhook for editor notifications |
| `DISCORD_BOT_INVITE` | Bot invite link |

### Sanity Webhooks

| Variable | Description |
|----------|-------------|
| `SANITY_WEBHOOK_TOKEN` | Secret token for CMS revalidation webhook |

## Security

- Never commit `.env.local`
- `NEXT_PUBLIC_*` vars are exposed to the browser
- Keep server-only vars (`MONGODB_URI`, `SANITY_API_TOKEN`) private
- Rotate secrets regularly

See [SECURITY.md](SECURITY.md) for more.

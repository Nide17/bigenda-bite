# Environment Variables

This document lists all environment variables used in Bigenda Bite.

For a complete development setup guide, see [DEVELOPMENT.md](../DEVELOPMENT.md).

## Setup

1. Copy `.env.example` to `.env.local`
2. Fill in the required values
3. For Vercel deployment, set variables in Vercel Dashboard → Settings → Environment Variables

## Required Variables

### MongoDB

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/bigendabite` |

### NextAuth

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_URL` | Application base URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret key for session encryption | Generate with `openssl rand -base64 32` |

> **Production:** In Vercel, `NEXTAUTH_URL` is auto-detected from `VERCEL_URL`. You can override it by setting `NEXTAUTH_URL` explicitly to your custom domain (e.g. `https://bigendabite.com`).

### Sanity CMS

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | `abc123xyz` |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name | `production` |
| `SANITY_API_TOKEN` | Sanity API token (write) | `skZ...` |

### Application

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_BASE_URL` | Base URL of the application | `https://bigendabite.com` |

## Optional Variables

### Google OAuth

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `GOCSPX-...` |

> **Note:** Google OAuth is available as an alternative sign-in option alongside email/password.

### Email (Gmail SMTP)

| Variable | Description | Example |
|----------|-------------|---------|
| `GMAIL_USER` | Gmail address used to send emails | `you@gmail.com` |
| `GMAIL_PASSWORD` | Gmail app password (not your regular password) | `abcd efgh ijkl mnop` |

> **Setup:** Enable 2FA on your Google account, then generate an app password at https://myaccount.google.com/apppasswords.

### MTN MoMo Payments

| Variable | Description | Example |
|----------|-------------|---------|
| `MTN_MOMO_API_URL` | MoMo API base URL | `https://sandbox.momodeveloper.mtn.com` |
| `MTN_MOMO_API_KEY` | MoMo API key | `your_api_key` |
| `MTN_MOMO_API_SECRET` | MoMo API secret | `your_api_secret` |
| `MTN_MOMO_SUBSCRIPTION_KEY` | MoMo subscription key | `your_subscription_key` |
| `MTN_MOMO_CALLBACK_URL` | Webhook callback URL | `https://yourdomain.com/api/webhooks/momo` |
| `MTN_MOMO_PAYEE_CODE` | Payee code for collections | `your_payee_code` |

### Discord Notifications

| Variable | Description | Example |
|----------|-------------|---------|
| `DISCORD_WEBHOOK_URL` | Discord webhook URL for notifications | `https://discord.com/api/webhooks/...` |

## Security Notes

- **Never commit `.env.local` to version control**
- Use different values for development and production
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Server-only variables (`SANITY_API_TOKEN`, `MONGODB_URI`) should not have the `NEXT_PUBLIC_` prefix
- Rotate secrets regularly
- Use strong, randomly generated values for `NEXTAUTH_SECRET`

## Generating Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate a random API key
openssl rand -hex 24
```

## Variable Categories

| Prefix | Visibility | Purpose |
|--------|-----------|---------|
| `NEXT_PUBLIC_*` | Public (browser) | Client-side accessible variables |
| `SANITY_API_TOKEN` | Private (server) | Sanity write operations |
| `MONGODB_URI` | Private (server) | Database connection |
| `MTN_MOMO_*` | Private (server) | Payment integration |
| `DISCORD_WEBHOOK_URL` | Private (server) | Notifications |

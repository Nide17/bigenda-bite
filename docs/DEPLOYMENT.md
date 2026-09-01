# Deployment Guide

## Prerequisites

- Vercel account
- MongoDB Atlas account
- Sanity account
- MTN MoMo developer account (for payments)

## 1. MongoDB Atlas

1. Create a cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user with read/write access
3. Whitelist your IP (or `0.0.0.0/0` for Vercel)
4. Copy the connection string

## 2. Sanity

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage)
2. Note your `projectId` and `dataset`
3. Create an API token with Editor permissions
4. See [Content Editor Guide](CONTENT_EDITOR_GUIDE.md) for details

## 3. MTN MoMo

1. Sign up at [momodeveloper.mtn.com](https://momodeveloper.mtn.com/)
2. Create an API product
3. Get your API key, subscription key, and callback URL

## 4. Discord (optional)

1. Create a webhook in your channel settings
2. Copy the webhook URL for `DISCORD_WEBHOOK_URL`

## 5. Vercel

### Deploy via Git

1. Push to GitHub
2. Import the repo in Vercel
3. Set environment variables
4. Deploy

### Deploy via CLI

```bash
npm i -g vercel
vercel
```

## Environment Variables

Set these in Vercel → Settings → Environment Variables:

```env
# Required
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bigendabite
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_secret
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Optional — Payments
MTN_MOMO_API_URL=https://sandbox.momodeveloper.mtn.com
MTN_MOMO_API_KEY=your_key
MTN_MOMO_API_SECRET=your_secret
MTN_MOMO_SUBSCRIPTION_KEY=your_key
MTN_MOMO_CALLBACK_URL=https://yourdomain.com/api/webhooks/momo
MTN_MOMO_PAYEE_CODE=your_code

# Optional — Notifications
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Optional — Email (for password reset, lead notifications)
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=your_app_password
```

> **Note:** `NEXTAUTH_URL` must be set explicitly in Vercel for production. Google OAuth redirect URIs must also be updated.

## Post-Deployment

- [ ] Homepage loads
- [ ] Registration and login work
- [ ] Sanity content displays
- [ ] City selector works
- [ ] Ads load
- [ ] Payment flow works (sandbox)
- [ ] Admin dashboard accessible
- [ ] 404/error pages work
- [ ] Mobile responsive

## Custom Domain

1. Add domain in Vercel → Settings → Domains
2. Update DNS records as instructed
3. Wait for SSL provisioning

## Troubleshooting

- **Build fails:** Check Vercel logs, ensure all env vars are set
- **DB connection issues:** Verify connection string and IP whitelist
- **Sanity not showing:** Check projectId, dataset, and publish status
- **Payment errors:** Verify MoMo credentials and callback URL

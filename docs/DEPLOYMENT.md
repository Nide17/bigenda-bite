# Deployment

## Prerequisites

- Vercel account
- MongoDB Atlas cluster
- Sanity project
- MTN MoMo developer account (optional, for payments)

## Services

### MongoDB Atlas

1. Create cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create DB user with read/write access
3. Whitelist IPs (`0.0.0.0/0` for Vercel)
4. Copy connection string

### Sanity

1. Create project at [sanity.io/manage](https://www.sanity.io/manage)
2. Note `projectId` and `dataset`
3. Create API token with Editor permissions

### MTN MoMo (optional)

1. Sign up at [momodeveloper.mtn.com](https://momodeveloper.mtn.com/)
2. Create API product
3. Get API key, subscription key, callback URL

### Discord (optional)

1. Create webhook in channel settings
2. Copy webhook URL

### Google OAuth (optional)

1. Create OAuth 2.0 credentials in Google Cloud Console
2. Add redirect URI: `https://yourdomain.com/api/auth/callback/google`

## Vercel

### Deploy via Git

1. Push to GitHub
2. Import repo in Vercel
3. Set environment variables
4. Deploy

### Deploy via CLI

```bash
npm i -g vercel
vercel
```

## Environment Variables

Set in Vercel → Settings → Environment Variables:

```env
# Required
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bigendabite
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_secret
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Optional — Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Optional — Payments
MOMO_API_USER=your_momo_api_user
MOMO_API_KEY=your_momo_api_key
MOMO_SUBSCRIPTION_KEY=your_momo_subscription_key
MOMO_ENVIRONMENT=sandbox
MOMO_ACCESS_TOKEN=your_momo_access_token

# Optional — Notifications
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
DISCORD_BOT_INVITE=https://discord.gg/...

# Optional — Email
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=your_app_password
```

> `NEXTAUTH_URL` must match your production domain exactly.

## Post-Deployment Checklist

- [ ] Homepage loads
- [ ] Registration and login work
- [ ] Email verification works
- [ ] Sanity content displays
- [ ] City selector works
- [ ] Ads load
- [ ] Payment flow works (sandbox)
- [ ] Admin dashboard accessible
- [ ] Notifications bell works
- [ ] 404/error pages work
- [ ] Mobile responsive

## Custom Domain

1. Add domain in Vercel → Settings → Domains
2. Update DNS records
3. Wait for SSL provisioning

## Troubleshooting

- **Build fails:** Check Vercel logs, ensure all env vars are set
- **DB connection issues:** Verify connection string and IP whitelist
- **Sanity not showing:** Check projectId, dataset, and publish status
- **Payment errors:** Verify MoMo credentials and callback URL
- **Auth errors:** Ensure `NEXTAUTH_SECRET` is set and `NEXTAUTH_URL` matches domain

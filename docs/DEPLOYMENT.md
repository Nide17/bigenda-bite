# Deployment Guide

This guide covers deploying Bigenda Bite to production.

## Prerequisites

- Vercel account
- MongoDB Atlas account
- Sanity account
- MTN MoMo developer account
- Domain name (optional)

## 1. MongoDB Atlas Setup

1. Create a new cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user with read/write permissions
3. Whitelist your IP (or use 0.0.0.0/0 for Vercel)
4. Get the connection string: `mongodb+srv://<user>:<password>@<cluster>/<database>`

## 2. Sanity Setup

1. Create a new Sanity project at [sanity.io/manage](https://www.sanity.io/manage)
2. Note your `projectId` and `dataset` name
3. Create an API token with Editor/Write permissions
4. Deploy Sanity Studio: `npx sanity deploy`
5. See [docs/SANITY_SETUP.md](SANITY_SETUP.md) for detailed instructions

## 3. MTN MoMo Setup

1. Create an account at [MTN MoMo Developer Portal](https://momodeveloper.mtn.com/)
2. Create an API product
3. Get your API key, subscription key, and callback URL
4. Set environment to sandbox or production

## 4. Discord Webhook Setup

1. Create a Discord server or use an existing one
2. Create a webhook in your channel settings
3. Copy the webhook URL
4. Use it as `DISCORD_WEBHOOK_URL`

## 5. Vercel Deployment

### Option A: Deploy via Git

1. Push your code to GitHub/GitLab
2. Import the repository in Vercel
3. Configure environment variables
4. Deploy

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Pull environment variables
vercel pull
```

## 6. Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

### Required

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bigendabite

# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_secret_key_here

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_token

# App
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### Optional (for payments)

```env
# MTN MoMo
MTN_MOMO_API_URL=https://sandbox.momodeveloper.mtn.com
MTN_MOMO_API_KEY=your_api_key
MTN_MOMO_API_SECRET=your_api_secret
MTN_MOMO_SUBSCRIPTION_KEY=your_subscription_key
MTN_MOMO_CALLBACK_URL=https://yourdomain.com/api/webhooks/momo
MTN_MOMO_PAYEE_CODE=your_payee_code
```

### Optional (for notifications)

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

## 7. Post-Deployment Checklist

- [ ] Verify the homepage loads correctly
- [ ] Test user registration and login
- [ ] Verify Sanity content is displaying
- [ ] Test city selector functionality
- [ ] Verify ads are loading
- [ ] Test MoMo payment flow (sandbox)
- [ ] Verify Discord notifications for scrapers
- [ ] Check admin dashboard access
- [ ] Verify 404 and error pages
- [ ] Test on mobile devices
- [ ] Set up custom domain in Vercel
- [ ] Configure SSL certificate
- [ ] Set up Vercel Analytics
- [ ] Configure error monitoring (Sentry, etc.)

## 8. Custom Domain

1. Purchase a domain from a registrar
2. In Vercel Dashboard → Settings → Domains
3. Add your domain (e.g., `bigendabite.com`)
4. Update DNS records as instructed by Vercel
5. Wait for SSL certificate provisioning

## 9. CI/CD

Vercel automatically deploys on every push to the main branch. You can configure:

- **Preview Deployments**: Every PR gets a preview URL
- **Production Deployments**: Only merges to main deploy to production
- **Environment Variables**: Different values per environment

## 10. Monitoring

- **Vercel Analytics**: Built-in in Vercel dashboard
- **Vercel Logs**: Real-time function logs
- **MongoDB Atlas**: Database monitoring and alerts
- **Sanity**: Content change history and logs
- **Discord**: Error notifications via webhooks

## 11. CI/CD Integration

After deployment, CI/CD is handled automatically via GitHub Actions. See [docs/CI_CD.md](CI_CD.md) for details on:
- GitHub Actions workflow configuration
- Required secrets
- Local CI testing
- Deployment flow

## Troubleshooting

### Build Failures

- Check Vercel build logs for errors
- Ensure all environment variables are set
- Verify `npm run build` works locally

### Database Connection Issues

- Verify MongoDB Atlas connection string
- Check IP whitelist in Atlas
- Ensure database user has correct permissions

### Sanity Content Not Showing

- Verify `projectId` and `dataset` are correct
- Check that content is published (`status: "published"`)
- Verify API token has read permissions

### Payment Issues

- Verify MTN MoMo credentials
- Check callback URL is accessible
- Ensure sandbox/production environment is consistent

### CI/CD Issues

- Verify GitHub secrets are set correctly
- Check GitHub Actions logs for errors
- Ensure Node.js version matches local development

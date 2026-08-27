# Sanity Setup Guide

This guide covers setting up Sanity CMS for Bigenda Bite.

## Prerequisites

- Node.js 18+
- npm or yarn
- Sanity account ([sanity.io](https://www.sanity.io/))

## Step 1: Create a Sanity Project

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Click "Create new project"
3. Enter project name: `bigenda-bite`
4. Select dataset: `production`
5. Copy your `projectId`

## Step 2: Install Sanity CLI

```bash
npm install -g @sanity/cli
```

## Step 3: Initialize Sanity

```bash
sanity init
```

Follow the prompts:
- Create new project
- Select your project
- Choose dataset: `production`
- Choose output directory: `./sanity`

## Step 4: Configure Schemas

The schemas are already in `sanity/schemas/`:
- `process.ts` — Official government processes
- `guide.ts` — How-to guides
- `alert.ts` — Alerts and announcements

## Step 5: Create API Token

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to "API" → "Tokens"
4. Create a new token with "Editor/Write" permissions
5. Copy the token

## Step 6: Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_TOKEN=your_token
SANITY_API_TOKEN=your_token
```

## Step 7: Run Sanity Studio Locally

```bash
cd sanity
sanity start
```

Open [http://localhost:3333](http://localhost:3333).

## Step 8: Deploy Sanity Studio

```bash
sanity deploy
```

Follow the prompts to deploy to `https://bigendabite.sanity.studio`.

## Step 9: Seed Content

Use the seed script to populate initial content:

```bash
node scripts/seed-sanity.js
```

Or manually create content in Sanity Studio.

## Step 10: Configure Webhooks (Optional)

Set up webhooks for automatic revalidation when content changes:

1. In Sanity Studio, go to "API" → "Webhooks"
2. Add webhook URL: `https://yourdomain.com/api/webhooks/cms-revalidate`
3. Select triggers: "Create", "Update", "Delete"
4. Copy the webhook token

Add to `.env.local`:
```env
SANITY_WEBHOOK_TOKEN=your_webhook_token
```

## Content Model

### Process

```typescript
{
  _type: 'process',
  category: 'immigration',
  slug: { current: 'passport-application' },
  sourceType: 'official_verified',
  translations: {
    en: {
      title: 'Passport Application',
      summary: 'How to apply for a Rwandan passport',
      steps: [
        {
          order: 1,
          text: { en: 'Gather required documents' },
          estimatedTime: '1 day'
        }
      ],
      fees: [
        {
          label: 'Application fee',
          amountRWF: 50000,
          conditions: 'Standard processing'
        }
      ]
    }
  },
  requiredDocuments: ['National ID', 'Birth certificate'],
  officialPortal: 'https://irembo.gov.rw/',
  lastVerifiedDate: '2024-01-01'
}
```

### Guide

```typescript
{
  _type: 'guide',
  category: 'emergency',
  slug: { current: 'emergency-numbers' },
  translations: {
    en: {
      title: 'Emergency Numbers in Rwanda',
      summary: 'Important contact numbers for emergencies',
      steps: [...],
      typicalCosts: [...],
      commonPitfalls: [...]
    }
  },
  lastReviewedDate: '2024-01-01'
}
```

### Alert

```typescript
{
  _type: 'alert',
  severity: 'high',
  translations: {
    en: {
      title: 'Public Holiday Announcement',
      summary: 'Offices will be closed on...'
    }
  },
  startDate: '2024-01-01',
  endDate: '2024-01-02'
}
```

## GROQ Queries

The app uses GROQ (Graph-Relational Object Queries) to fetch content:

```groq
*[_type == "process" && status == "published" && category == $category] | order(_createdAt desc)
```

## Troubleshooting

### Content not showing

- Verify `status` is set to `"published"`
- Check `projectId` and `dataset` in env vars
- Verify API token has read permissions

### Images not loading

- Verify the image URL is correct and accessible
- Check that `NEXT_PUBLIC_SANITY_PROJECT_ID` is set correctly for CDN URLs

### CORS errors

- Add your domain to Sanity CORS origins in project settings

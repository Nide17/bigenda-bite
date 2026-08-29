# Scraper Guide

This guide covers the Bigenda Bite scraper worker, which automatically monitors sources for content updates.

## Architecture

The scraper runs as a standalone Node.js process, separate from the Next.js application.

```
scripts/worker.ts
    ↓
Playwright browser
    ↓
Scrape sources
    ↓
Compute diff vs Sanity
    ↓
Insert into MongoDB pendingUpdates
    ↓
Discord webhook → editors
    ↓
Editor approves in /admin
    ↓
Sanity document created/updated
```

## Running the Worker

```bash
npm run scrape
```

Or directly:

```bash
npx tsx scripts/worker.ts
```

## Configuration

The worker reads source URLs and scraping logic from `scripts/worker.ts` and related modules.

Currently implemented sources:

- Irembo government services
- RRA tax information
- RDB business registration

## Approval Workflow

1. Worker scrapes configured sources
2. Computes a diff against existing Sanity documents
3. If changes are detected and confidence is above threshold:
   - Inserts a `pendingUpdate` into MongoDB
   - Sends a Discord webhook notification to editors
4. Editor reviews the update in `/admin/pending-updates`
5. Editor approves or rejects
6. On approve:
   - Creates or updates the Sanity document
   - Marks the pending update as processed
7. On reject:
   - Marks the pending update as rejected

## Data Quality Guardrails

The worker applies basic filters before creating pending updates:

- Skips titles shorter than 3 characters
- Skips suspicious titles matching patterns like `test`, `placeholder`, `hhh`, `guid 1`, `undefined`
- Skips documents with no detected changes
- Skips updates below the confidence threshold

## Monitoring

- Check Discord channel for new pending update notifications
- Review `/admin/pending-updates` regularly
- Monitor MongoDB `pendingUpdates` collection for stale items

## Troubleshooting

### Worker crashes on start

- Ensure all required environment variables are set
- Check that MongoDB and Sanity are accessible
- Verify Playwright browsers are installed: `npx playwright install chromium`

### No pending updates appearing

- Verify source URLs are reachable
- Check worker logs for scraping errors
- Confirm Discord webhook URL is configured
- Ensure the worker process is running

### Duplicate content

- The worker computes diffs to avoid duplicates
- If duplicates appear, check the confidence threshold and diff logic
- Use the cleanup script to remove bad data: `node scripts/cleanup-sanity.js`

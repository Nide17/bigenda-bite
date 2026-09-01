# Scraper Guide

The scraper worker monitors sources for content updates.

## How It Works

```
scripts/worker.ts
    ↓
Playwright browser
    ↓
Scrape sources (Irembo, RRA, RDB)
    ↓
Diff against Sanity
    ↓
Insert into MongoDB pendingUpdates
    ↓
Discord → editors
    ↓
Editor approves in /admin
    ↓
Sanity document created/updated
```

## Running

```bash
npm run scrape
# or
npx tsx scripts/worker.ts
```

## Config

Source URLs and scraping logic live in `scripts/worker.ts`.

Currently tracked:

- Irembo government services
- RRA tax info
- RDB business registration

## Approval Workflow

1. Worker scrapes sources
2. Computes diff against existing Sanity docs
3. If changes detected and confidence is high:
   - Inserts `pendingUpdate` into MongoDB
   - Sends Discord notification
4. Editor reviews at `/admin/pending-updates`
5. Approve creates/updates Sanity doc
6. Reject discards the update

## Quality Filters

The worker skips:

- Titles shorter than 3 characters
- Suspicious titles (test, placeholder, hhh, undefined)
- Documents with no detected changes
- Updates below confidence threshold

## Monitoring

- Discord channel for new pending updates
- Check `/admin/pending-updates` regularly
- Watch MongoDB `pendingUpdates` for stale items

## Troubleshooting

- **Worker crashes:** Check env vars, MongoDB/Sanity access, Playwright browsers
- **No updates appearing:** Verify source URLs, check worker logs, confirm Discord webhook
- **Duplicates:** Worker uses diffs to avoid them; check confidence threshold if they appear

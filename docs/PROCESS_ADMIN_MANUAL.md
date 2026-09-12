# Official Process Admin Manual

This manual covers how admins create **Official Processes** in two ways:

1. **Manually** — via Sanity Studio (recommended for one-off or complex processes)
2. **Via the scraper** — the automated Playwright worker that scrapes government sites and routes results through an approval flow

---

## Part A — Manual Process Creation

### Prerequisites

- Admin or superadmin role
- Sanity Studio running locally (`cd sanity && sanity start`) or open at [manage.sanity.io](https://manage.sanity.io)
- English title and summary prepared (mandatory); French and Kinyarwanda translations recommended
- The official government institution name (e.g. `RDB`, `RRA`, `Irembo`)

### Step 1 — Open Sanity Studio

```bash
cd sanity
sanity start
```

### Step 2 — Create a New Document

1. Click **Create** → **New document**
2. Select the **Official Process** document type
3. A new draft opens with `status` pre-set to `draft`

### Step 3 — Fill Required Fields

#### Slug
Auto-generated from the English title. Override only if ambiguous.

#### Official Source
The name of the government institution, e.g. `RDB`, `RRA`, `Irembo`. **Required.**

#### Category
Choose one:
- `business`, `tax`, `identity`, `transport`, `immigration`, `health`

#### City (optional)
Leave empty for nationwide processes.

#### Translations
Each language has a `localizedTitle` object with `title` and `summary`:

| Language | Required? |
|----------|-----------|
| English (`en`) | **Yes** |
| French (`fr`) | No (recommended) |
| Kinyarwanda (`rw`) | No (recommended) |

#### Summary
Standalone `text` field (max 300 chars) for search results and cards.

#### Eligibility
**Required.** A list of strings describing who can apply, e.g.:
- `All Rwandan citizens`
- `Foreigners with a valid passport`
- `Registered businesses`

#### Requirements
A list of strings describing documents or conditions needed, e.g.:
- `National ID`
- `Proof of address`

#### Steps
**Required** (minimum 1). Each step has:
- `order` — display order (minimum 1)
- `text` — instruction with `en`/`fr`/`rw` sub-fields

### Step 4 — Fill Optional Fields

#### Fees
Each fee has:
- `amount` — numeric amount in RWF
- `description` — e.g. `Registration Fee`
- `isRecurring` — boolean

#### Processing Time
A string, e.g. `5-7 business days`.

#### Where To Apply
An object with:
- `description` — e.g. `Irembo portal or RDB office`
- `url` — application URL (if online)

#### Contact Info
An object with:
- `email`
- `phone`
- `address`

#### Online Application URL
A direct URL field for the application form.

#### Next Review Date
Set **3 months ahead** of today.

### Step 5 — Set Status and Publish

| Status | Meaning | Visible? |
|--------|---------|----------|
| `draft` | Work in progress | No |
| `needs_review` | Flagged for rework | No |
| `published` | Live and verified | **Yes** |
| `expired` | No longer accurate | No |

Set `status` to **published** and save. Content goes live immediately.

### Step 6 — Verify

1. Open the live process in `/en`, `/fr`, `/rw`
2. Confirm the slug resolves
3. Check the fee table and steps render correctly
4. Set `lastVerifiedDate` to today

---

## Part B — Scraper Workflow (Manual + Scrapped)

The scraper is a standalone Playwright worker that visits government sites, diffs content against existing Sanity documents, and stores pending updates in MongoDB for admin approval.

### Architecture

```
Government Site → Scraper Worker → MongoDB (pendingUpdates) → Discord Notification → Admin Review → Sanity Document
```

### Step 1 — Run the Scraper

```bash
npm run scrape
```

The worker:
1. Loads configured sources (RDB, RRA, Irembo, etc.)
2. Visits each page with Playwright
3. Extracts structured content
4. Diffs against existing Sanity documents by slug
5. Stores new/changed content in MongoDB `pendingUpdates` collection

### Step 2 — Admin Review

1. Open `/admin` with an editor or admin account
2. Go to the **Pending Updates** section
3. Each pending update shows:
   - Source institution
   - Extracted title and summary
   - Diff against the existing document (if any)
   - Suggested category and fields

### Step 3 — Approve or Reject

For each pending update:

- **Approve** — the worker creates or updates the corresponding Sanity document with the scraped content. The process goes live immediately.
- **Reject** — the update is discarded. Optionally add a note explaining why.

### Step 4 — Post-Approval Verification

After approval, an admin should:
1. Open the newly created/updated process in Sanity Studio
2. Review all fields for accuracy
3. Fill in any missing fields the scraper couldn't extract (fees, eligibility, contact info)
4. Set `lastVerifiedDate` and `nextReviewDate`
5. Confirm the translations are complete

### Step 5 — Monitor

- Editors receive **Discord notifications** whenever the scraper finds updates
- The `outdatedReportsCount` on processes auto-increments when users report issues
- Review processes flagged as `needs_review` or with high outdated report counts

### Scraper Configuration

Scraper sources are defined in `src/lib/scrapers/`:

| File | Source |
|------|--------|
| `rdb.ts` | Rwanda Development Board (business registration) |
| `rra.ts` | Rwanda Revenue Authority (tax, TIN) |
| `irembo.ts` | Irembo (passport, visa, birth/death) |

Each scraper exports a function that takes raw HTML/text and returns structured content with a detected category.

### Troubleshooting

| Problem | Fix |
|---------|-----|
| Scraper not finding updates | Check source is reachable; review scraper logs |
| Wrong category detected | Edit the scraper's category detection logic |
| Approved process missing fields | Manually edit the Sanity document to fill gaps |
| Duplicate pending updates | The diff logic should prevent these; check slug matching |
| Discord notifications not arriving | Verify `DISCORD_WEBHOOK_URL` is set |

### Guidelines

- Scraper output is a **starting point**, not final content
- Always review approved content in Sanity Studio before it goes live
- Official source must be accurate — verify against the institution's website
- Set `nextReviewDate` 3 months ahead for every published process
# How-To Guide Editor Manual

This manual walks content editors through creating a **How-To Guide** in Sanity Studio.

## Prerequisites

- Editor or admin role
- Sanity Studio running locally (`cd sanity && sanity start`) or open at [manage.sanity.io](https://manage.sanity.io)
- English title and summary prepared (mandatory); French and Kinyarwanda translations recommended

## Step 1 — Open Sanity Studio

```bash
cd sanity
sanity start
```

Open the displayed URL (default `http://localhost:3333`). Sign in with your Sanity account.

## Step 2 — Create a New Document

1. Click **Create** (top-left) → **New document**
2. Select the **How-To Guide** document type
3. A new draft opens with `status` pre-set to `draft`

## Step 3 — Fill Required Fields

### Slug
- Leave the auto-generated slug (it is sourced from the English title)
- Only override if the auto-slug is ambiguous

### Category
Choose one from the dropdown:
- `housing`, `health`, `finance`, `transport`, `business`, `lifestyle`

### City (optional)
Leave empty for nationwide guides. Enter a city (e.g. `Kigali`) for location-specific content.

### Translations

Each language has a `localizedTitle` object with `title` and `summary`:

| Language | Required? | Notes |
|----------|-----------|-------|
| English (`en`) | **Yes** | Source of truth for slug generation |
| French (`fr`) | No | Recommended for Francophone users |
| Kinyarwanda (`rw`) | No | Recommended for local users |

Fill in each language's **title** (short, action-oriented) and **summary** (1–2 sentences, max 300 chars).

### Summary
A standalone `text` field (max 300 chars) shown in search results and cards. This is the English summary by default; localized summaries come from each language's `summary`.

### Steps
Click **Add step** to create ordered instructions. Each step has:
- `order` — display order (minimum 1)
- `text` — the instruction, with `en`/`fr`/`rw` sub-fields

A guide must have **at least 1 step**.

### Research Sources
Add at least one source used to create this guide, e.g.:
- `editorial`
- `community`
- `official_rra`
- `official_rdb`

## Step 4 — Fill the Task Blueprint (Optional but Recommended)

The Task Blueprint is a collapsible object that powers the quick-reference card users see on the guide page.

### Estimated Time
- `online` — e.g. `15 minutes`
- `inPerson` — e.g. `1-2 hours`

### Cost Breakdown
Add itemized costs. Each item has:
- `item` — description (e.g. `Irembo Fee`)
- `amountRWF` — numeric amount only (no currency symbol)

### Document Checklist
List documents needed. Each has:
- `documentName` — e.g. `National ID`
- `isRequired` — default `true`
- `fallbackOption` — e.g. `If no utility bill, a cell leader letter works`

### Physical Location
- `description` — e.g. `RDB Building, Kimihurura, 3rd Floor`
- `mapsLink` — a Google Maps URL

### Cultural Context (optional)
Tips for cultural context, e.g. `Greet with Muraho before asking questions.`

### Copy-Paste Scripts (optional)
Pre-written messages for common scenarios. Each script has:
- `language` — `en` or `rw`
- `scenario` — e.g. `Requesting birth certificate`
- `text` — the full message

### Introvert Tip (optional)
A short tip, e.g. `Go before 10 AM to avoid queues. English is widely understood.`

## Step 5 — Fill Optional Fields

### Typical Costs
Alternative to the Task Blueprint cost breakdown. Each item has:
- `label` — e.g. `Application Fee`
- `rangeRWF` — array of two numbers `[min, max]`

### Common Pitfalls
A list of plain-text warnings, e.g. `Office closes at 3 PM on Fridays.`

### Tags
Free-form array of tags for filtering, e.g. `[" SIM", "internet"]`.

## Step 6 — Set Dates and Status

| Field | Purpose |
|-------|---------|
| `lastReviewedDate` | When you last reviewed the guide |
| `lastVerifiedDate` | When the community or an editor verified it |
| `nextReviewDate` | Set **3 months ahead** of today |
| `outdatedReportsCount` | Auto-incremented by user reports (leave at 0) |

### Status Values

| Status | Meaning | Visible? |
|--------|---------|----------|
| `draft` | Work in progress | No |
| `needs_review` | Flagged for rework | No |
| `published` | Live and verified | **Yes** |
| `expired` | No longer accurate | No |

## Step 7 — Publish

1. Review all fields
2. Set `status` to **published**
3. Save

Content goes live immediately. The guide appears on `/{lang}/guides` and in search results.

## Step 8 — Verify After Publishing

1. Open the live guide in three languages (`/en`, `/fr`, `/rw`)
2. Confirm the slug resolves correctly
3. Check the Task Blueprint renders on the page
4. Set `lastVerifiedDate` to today if everything is correct

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Guide not showing | Confirm `status` is `published`, English title exists, slug is set |
| Slug 404 | Regenerate slug from English title |
| Translations missing | Add `fr`/`rw` `localizedTitle` objects with title + summary |
| Images not loading | Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` in deployment |
| Outdated reports piling up | Review the guide, update content, set `nextReviewDate` |

## Guidelines Recap

- English is mandatory; French and Kinyarwanda recommended
- Titles: clear and action-oriented
- Summaries: 1–2 sentences, max 300 chars
- Steps: ordered and actionable
- Always set `nextReviewDate` 3 months ahead
# Sanity Schema Migration

## Changes

### Process

| Field | Type | Change |
|-------|------|--------|
| `officialSource` | `string` | Added, required |
| `summary` | `text` | Added, required |
| `eligibility` | `array[string]` | Added, required |
| `requirements` | `array[string]` | Added |
| `processingTime` | `string` | Added |
| `whereToApply` | `object` | Added |
| `onlineApplicationUrl` | `url` | Added |
| `contactInfo` | `object` | Added |
| `nextReviewDate` | `datetime` | Added |
| `status` | `string` | Expanded: `draft`, `published`, `needs_review`, `expired` |
| `category` | `string` | Added `health` option |
| `lastVerifiedDate` | `datetime` | Made required |

### Guide

| Field | Type | Change |
|-------|------|--------|
| `summary` | `text` | Added, required |
| `nextReviewDate` | `datetime` | Added |
| `status` | `string` | Expanded: `draft`, `published`, `needs_review`, `expired` |
| `aiDraftStatus` | `string` | Removed |
| `researchSources` | `array[string]` | Made required |

### Alert

| Field | Type | Change |
|-------|------|--------|
| `sourceName` | `string` | Added |
| `sourceUrl` | `url` | Added |
| `translations` | `object` | Restructured to `localizedTitle` |
| `status` | `string` | Expanded: `draft`, `published`, `expired` |

## Breaking Changes

### Alert translations

**Before:**
```json
{ "translations": { "en": "Alert text" } }
```

**After:**
```json
{ "translations": { "en": { "title": "Alert title", "summary": "Alert text" } } }
```

### `aiDraftStatus` removed

Use `status` instead: `draft`, `needs_review`, `published`, `expired`.

## Migration

### 1. Deploy schemas

```bash
cd sanity
npx sanity schema extract
npx sanity schema validate
```

### 2. Migrate alert translations

Run in Sanity Vision:

```groq
*[_type == "alert" && !("title" in translations.en)] {
  _id,
  translations
} | map(
  {
    ...,
    "translations": {
      "en": { "title": translations.en, "summary": translations.en },
      "fr": { "title": translations.fr, "summary": translations.fr },
      "rw": { "title": translations.rw, "summary": translations.rw }
    }
  }
)
```

### 3. Backfill required fields

Use Sanity UI or GROQ patches to fill missing required fields.

### 4. Re-seed dev data

```bash
node scripts/seed-sanity.js
```

### 5. Verify

```bash
npm run typecheck
npm run build
npm run test:e2e
```

## Editor Workflow

| Status | Meaning | Visible? |
|--------|---------|----------|
| `draft` | Work in progress | No |
| `needs_review` | Flagged for rework | No |
| `published` | Live and verified | Yes |
| `expired` | No longer accurate | No |

Editors should:
1. Set `lastVerifiedDate` when confirming accuracy
2. Set `nextReviewDate` 3 months ahead
3. Use `needs_review` for content needing updates
4. Use `expired` for time-sensitive content that is no longer valid

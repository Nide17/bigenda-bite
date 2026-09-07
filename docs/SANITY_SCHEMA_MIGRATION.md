# Sanity Schema Migration

## Overview

This document describes the schema changes made to improve content trustworthiness and editorial workflow for processes, guides, and alerts.

## Changes Summary

### Process (`process`)

| Field | Type | Change | Reason |
|-------|------|--------|--------|
| `officialSource` | `string` | **Added**, required | Identifies the government institution (RDB, RRA, Irembo, etc.) |
| `summary` | `text` | **Added**, required | Brief description for search results and cards |
| `eligibility` | `array[string]` | **Added**, required | Who can apply for this process |
| `requirements` | `array[string]` | **Added** | Prerequisites before applying |
| `processingTime` | `string` | **Added** | Typical completion time |
| `whereToApply` | `object` | **Added** | Physical/online location with maps link |
| `onlineApplicationUrl` | `url` | **Added** | Direct link to online form |
| `contactInfo` | `object` | **Added** | Phone, email, website for the issuing institution |
| `nextReviewDate` | `datetime` | **Added** | Scheduled re-verification date |
| `status` | `string` | **Expanded** | Now: `draft`, `published`, `needs_review`, `expired` |
| `category` | `string` | **Expanded** | Added `health` option |
| `lastVerifiedDate` | `datetime` | **Made required** | Ensures all published content has a verification date |

### Guide (`guide`)

| Field | Type | Change | Reason |
|-------|------|--------|--------|
| `summary` | `text` | **Added**, required | Brief description for search results and cards |
| `nextReviewDate` | `datetime` | **Added** | Scheduled re-verification date |
| `status` | `string` | **Expanded** | Now: `draft`, `published`, `needs_review`, `expired` |
| `aiDraftStatus` | `string` | **Removed** | Internal workflow field; replaced by standard `status` |
| `researchSources` | `array[string]` | **Made required** | Ensures editorial transparency |
| `lastReviewedDate` | `datetime` | **Clarified** | Description updated for editor reviews |

### Alert (`alert`)

| Field | Type | Change | Reason |
|-------|------|--------|--------|
| `sourceName` | `string` | **Added** | Institution issuing the alert |
| `sourceUrl` | `url` | **Added** | Link to official announcement |
| `translations` | `object` | **Restructured** | Now uses `localizedTitle` (title + summary) instead of plain text |
| `status` | `string` | **Expanded** | Now: `draft`, `published`, `expired` |

## Breaking Changes

### Alert translations changed from string to object

**Before:**
```json
{
  "translations": {
    "en": "RDB business registration fee updated from free to 5,000 RWF."
  }
}
```

**After:**
```json
{
  "translations": {
    "en": {
      "title": "RDB business registration fee updated",
      "summary": "RDB business registration fee updated from free to 5,000 RWF."
    }
  }
}
```

### `aiDraftStatus` removed from guides

Use the standard `status` field instead:
- `draft` = not ready
- `needs_review` = editor flagged for rework
- `published` = live
- `expired` = no longer accurate

## Migration Steps

### 1. Update Sanity Studio schemas

Deploy the updated schemas in `sanity/schemas/` to your Sanity Studio.

```bash
cd sanity
npx sanity schema extract
npx sanity schema validate
```

### 2. Migrate existing content

Run the following GROQ migrations in the Sanity Studio Vision tool or via a script:

#### Alert translations migration

```groq
// Migrate alert translations from string to localizedTitle
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

#### Remove `aiDraftStatus` from guides

```groq
// Remove aiDraftStatus field (no data loss; migrate to status if needed)
*[_type == "guide"] {
  _id,
  aiDraftStatus
}
```

Review the output and manually update `status` if any guides relied on `aiDraftStatus` for workflow state.

### 3. Backfill new required fields

For existing documents missing new required fields, use the Sanity Studio UI or a patch:

```groq
// Example: set default nextReviewDate to 3 months from now
*[_type == "process" && !defined(nextReviewDate)] {
  _id,
  _createdAt
} | map(
  patch(*[_id == ^._id]{nextReviewDate: dateAdd(_createdAt, 3, "month")})
)
```

### 4. Re-seed development data

```bash
node scripts/seed-sanity.js
```

### 5. Verify frontend

```bash
npm run typecheck
npm run build
npm run test:e2e
```

## Editor Workflow

### Status values

| Status | Meaning | Visible to users? |
|--------|---------|-------------------|
| `draft` | Work in progress | No |
| `needs_review` | Flagged for rework by editor | No |
| `published` | Live and verified | Yes |
| `expired` | No longer accurate | No |

### Review cadence

Editors should:
1. Set `lastVerifiedDate` when confirming content accuracy
2. Set `nextReviewDate` 3 months ahead
3. Use `needs_review` for content that requires updates before re-publishing
4. Use `expired` for time-sensitive content that is no longer valid

## Files Changed

- `sanity/schemas/process.ts` - Expanded process schema
- `sanity/schemas/guide.ts` - Expanded guide schema, removed `aiDraftStatus`
- `sanity/schemas/alert.ts` - Restructured alert translations, added source fields
- `sanity/schemas/index.ts` - No changes needed
- `src/types/index.ts` - Updated TypeScript interfaces
- `src/lib/cms/sanity.ts` - Updated GROQ projections
- `src/components/AlertsSection.tsx` - Updated for new alert translation structure
- `src/app/api/search/route.ts` - Updated alert title extraction
- `src/app/sitemap.ts` - Updated alert slug generation
- `scripts/seed-sanity.js` - Updated seed data to match new schemas

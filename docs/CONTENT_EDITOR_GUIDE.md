# Content Editor Guide

## Studio

```bash
cd sanity
sanity start
```

Open [http://localhost:3333](http://localhost:3333).

## Content Model

Single-document translations. Each document contains all languages.

| Type | Description |
|------|-------------|
| `process` | Official government process |
| `guide` | How-to guide |
| `alert` | Time-sensitive announcement |

## Required Fields

### Process
- `slug` — Auto-generated from English title
- `translations.en.title` — Required
- `translations.en.summary` — Required
- `steps` — Minimum 1 step
- `step.order` — Minimum 1
- `step.text.en` — Required
- `officialSource` — Institution name
- `lastVerifiedDate` — Verification date

### Guide
- Same as process
- `researchSources` — Required
- `summary` — Required

### Alert
- `translations.en.title` — Required
- `translations.en.summary` — Required
- `type` — `fee_change`, `office_closure`, `new_requirement`, `transport_disruption`
- `severity` — `info`, `warning`, `critical`

## Publishing

1. Create/edit in Sanity Studio
2. Fill required fields
3. Set `status` to `published`
4. Save

Content goes live immediately.

## Status Values

| Status | Meaning |
|--------|---------|
| `draft` | Work in progress |
| `needs_review` | Flagged for rework |
| `published` | Live |
| `expired` | No longer accurate |

## Guidelines

- English is mandatory; French and Kinyarwanda optional
- Titles: clear and action-oriented
- Summaries: 1-2 sentences
- Steps: ordered and actionable
- Set `lastVerifiedDate` and `nextReviewDate` (3 months ahead)

## Troubleshooting

- **Not showing:** Check `status` is `published`, slug exists, English title present
- **Images not loading:** Verify URLs and `NEXT_PUBLIC_SANITY_PROJECT_ID`

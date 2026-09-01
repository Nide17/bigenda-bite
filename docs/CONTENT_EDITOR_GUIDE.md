# Content Editor Guide

For editors working with Sanity CMS.

## Accessing Studio

```bash
cd sanity
sanity start
```

Open [http://localhost:3333](http://localhost:3333).

## Content Model

Bigenda Bite uses a single-document translation model. Each document contains all language translations.

### Document Types

| Type | Description |
|------|-------------|
| `process` | Official government process |
| `guide` | How-to guide |
| `alert` | Time-sensitive announcement |

### Structure

Every document needs:

- `slug.current` — URL slug
- `status` — `draft` or `published`
- `translations` — Localized content

## Required Fields

### Process

- `slug` — Auto-generated from English title
- `translations.en.title` — Required
- `translations.en.summary` — Required
- `steps` — Minimum 1 step
- `step.order` — Minimum 1
- `step.text.en` — Required

### Guide

Same as process.

### Alert

- `translations.en` — Required
- `type` — One of: `fee_change`, `office_closure`, `new_requirement`, `transport_disruption`
- `severity` — One of: `info`, `warning`, `critical`
- `expiresAt` — When the alert expires

## Publishing

1. Create or edit in Sanity Studio
2. Fill required fields
3. Set `status` to `published`
4. Save

Content goes live immediately.

## Guidelines

- English is mandatory
- French and Kinyarwanda are optional but encouraged
- Titles should be clear and action-oriented
- Summaries: 1-2 sentences max
- Steps should be ordered and actionable
- No placeholder or test content

## Validation

Sanity enforces these rules. You can't publish with missing slugs, empty titles, or empty steps.

## Troubleshooting

- **Not showing on site:** Check `status` is `published`, `slug.current` is set, `translations.en.title` exists
- **Images not loading:** Verify URLs and `NEXT_PUBLIC_SANITY_PROJECT_ID`

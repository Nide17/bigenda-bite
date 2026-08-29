# Content Editor Guide

This guide is for editors and content managers working with Bigenda Bite's Sanity CMS.

## Accessing Sanity Studio

```bash
cd sanity
sanity start
```

Open [http://localhost:3333](http://localhost:3333).

Or use the deployed studio if configured.

## Content Model

Bigenda Bite uses a single-document translation model (Model A). Each document contains translations for all supported languages.

### Document Structure

Every published content item should have:

- `_id` — Sanity document ID
- `slug.current` — Canonical URL slug
- `status` — `draft` or `published`
- `translations` — localized content object

### Supported Document Types

| Type | Description |
|------|-------------|
| `process` | Official government process |
| `guide` | How-to guide |
| `alert` | Time-sensitive announcement |

## Required Fields

### Process

- `slug` — Required. Auto-generated from English title.
- `translations` — Required.
- `translations.en` — Required. English is the base language.
- `translations.en.title` — Required.
- `translations.en.summary` — Required.
- `steps` — Required. Minimum 1 step.
- `step.order` — Required. Minimum value 1.
- `step.text.en` — Required. English step text.

### Guide

- `slug` — Required.
- `translations` — Required.
- `translations.en` — Required.
- `translations.en.title` — Required.
- `translations.en.summary` — Required.
- `steps` — Required. Minimum 1 step.
- `step.order` — Required.
- `step.text.en` — Required.

### Alert

- `translations` — Required.
- `translations.en` — Required.
- `type` — Required. One of: `fee_change`, `office_closure`, `new_requirement`, `transport_disruption`
- `severity` — Required. One of: `info`, `warning`, `critical`
- `expiresAt` — Required. Date/time when the alert expires.

## Publishing Content

1. Create or edit a document in Sanity Studio
2. Fill in all required fields
3. Set `status` to `published`
4. Save the document

Published content is immediately available on the site.

## Content Guidelines

- English is mandatory for all content types
- French and Kinyarwanda are optional but encouraged
- Titles should be clear and action-oriented
- Summaries should be concise (1-2 sentences)
- Steps should be ordered and actionable
- Avoid placeholder or test content

## Validation

Sanity Studio enforces validation rules defined in `sanity/schemas/`. You cannot publish documents with:

- Missing slugs
- Missing English translations
- Empty titles or summaries
- Empty step arrays
- Missing step text

## Troubleshooting

### Content not showing on the site

- Verify `status` is set to `published`
- Check that `slug.current` is set
- Ensure `translations.en.title` is populated

### Images not loading

- Verify image URLs are correct and accessible
- Check that `NEXT_PUBLIC_SANITY_PROJECT_ID` is configured for CDN URLs

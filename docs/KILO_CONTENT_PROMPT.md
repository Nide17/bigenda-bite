# Kilo Agent Prompt — Bigenda Bite Content Generation

## Context

Bigenda Bite helps Rwandans and visitors get things done quickly. The app needs trustworthy, actionable content about government processes, everyday services, and local businesses in Kigali and Rwanda.

The user base includes:
- Rwandans navigating daily life
- Introverts who prefer clear, step-by-step instructions
- Foreigners/expats unfamiliar with local systems
- People with limited information access who need reliable guidance

## Product Principle

"Help the user complete a task in Rwanda as quickly as possible."

## Content Model

The app uses Sanity CMS with three document types:
- `process` — Official government processes (e.g., registering a business, getting a National ID)
- `guide` — Everyday how-to guides (e.g., buying a SIM card, finding an apartment)
- `alert` — Time-sensitive announcements (e.g., fee changes, office closures)

### Process Schema Requirements
- `officialSource` — Government institution name (required)
- `category` — business, tax, identity, transport, immigration, health (required)
- `translations.en.title` — Clear action-oriented title (required)
- `translations.en.summary` — 1-2 sentence description (required)
- `summary` — Brief description for search results (required, max 300 chars)
- `eligibility` — Who can apply (required, array of strings)
- `requirements` — Prerequisites (array of strings)
- `steps` — Minimum 1 step (required), each with `order`, `text.en`, `estimatedTime`
- `processingTime` — Typical completion time (e.g., "2-3 business days")
- `fees` — Itemized costs with `label`, `amountRWF`, `conditions`
- `requiredDocuments` — Array of document names
- `whereToApply` — Physical/online location with `description` and optional `mapsLink`
- `onlineApplicationUrl` — Direct link if available
- `contactInfo` — Phone, email, website
- `officialPortal` — Main official website
- `sourceUrl` — Additional authoritative sources
- `lastVerifiedDate` — When verified (required)
- `nextReviewDate` — When to review again
- `status` — `draft`, `published`, `needs_review`, `expired` (required)
- `tags` — Search keywords
- `city` — Leave empty for nationwide
- `taskBlueprint` — Quick-reference metadata for users

### Guide Schema Requirements
- Same core fields as process
- `researchSources` — How the guide was created (required, e.g., "editorial", "community", "official_rra")
- `typicalCosts` — Cost ranges with `label` and `rangeRWF` (array of numbers)
- `commonPitfalls` — Array of common mistakes to avoid
- No `aiDraftStatus` — use `status` instead

### Alert Schema Requirements
- `type` — fee_change, office_closure, new_requirement, transport_disruption
- `severity` — info, warning, critical
- `sourceName` — Institution issuing the alert
- `sourceUrl` — Link to official announcement
- `translations.en.title` — Required
- `translations.en.summary` — Required
- `expiresAt` — When the alert expires
- `status` — draft, published, expired

## Content Categories Needed

### Processes (Government/Official)
Focus on the most common tasks people need to do:
- Business registration, tax registration, permits
- National ID, passport, visa applications
- Birth/marriage certificates
- Health insurance enrollment
- Property registration, land transfer
- Driving license
- Immigration and work permits
- Court and legal services
- Education enrollment
- Social security/pension

### Guides (Everyday How-Tos)
Focus on practical, actionable guidance:
- Getting around Kigali (buses, moto, taxis, tap cards)
- Buying a SIM card and internet
- Opening a bank account
- Renting an apartment
- Finding a clinic/hospital
- Emergency numbers and safety
- Using MoMo payments
- Shopping for groceries, food, clothes
- Using Irembo
- Getting a driving permit
- Basic Kinyarwanda phrases
- Dating/meeting people (social guides)
- Cafe and restaurant culture
- Nightlife and entertainment
- Weekend getaways from Kigali
- Moving to Kigali/relocation

## Task Instructions

### Phase 1: Scrape Existing Sources
1. Visit official Rwandan government websites:
   - https://irembo.gov.rw/
   - https://www.rra.gov.rw/
   - https://rdb.rw/
   - https://www.migration.gov.rw/
   - https://www.mutuelle.gov.rw/
   - https://www.rwanda.gov.rw/
   - https://www.reb.rw/
   - https://www.rssb.gov.rw/

2. Extract structured information:
   - Process names and descriptions
   - Eligibility requirements
   - Required documents
   - Fees (in RWF)
   - Processing times
   - Contact information
   - Online application links
   - Physical locations

3. For guides:
   - Search existing travel/living-in-Rwanda resources
   - Community forums and expat groups
   - Local business directories
   - Government informational pages

### Phase 2: Enrich and Validate
1. Cross-reference information across multiple sources
2. Verify fees are current
3. Confirm contact details are accurate
4. Check if online applications are available
5. Add practical tips from local knowledge

### Phase 3: Generate 20+ Entries
Create at least 20 complete entries ready for the database. Mix of:
- 8-10 government processes
- 8-10 everyday guides
- 2-4 alerts (time-sensitive or recent changes)

Each entry must:
- Have all required fields filled
- Include English translations (FR and RW optional but nice)
- Have realistic, verified data
- Include proper source attribution
- Be formatted for direct import into Sanity

### Phase 4: List 100+ Next Entries
Create a prioritized list of 100+ additional content ideas, organized by:
- High priority (most requested, high impact)
- Medium priority (useful but not urgent)
- Low priority (nice to have)

For each idea, note:
- Type (process/guide/alert)
- Category
- Brief description
- Why it's needed
- Primary source to check

## Output Format

### For Each Entry
```json
{
  "_type": "process" | "guide" | "alert",
  "sourceType": "official_verified" | "editorial",
  "officialSource": "...",
  "category": "...",
  "status": "published",
  "lastVerifiedDate": "YYYY-MM-DD",
  "nextReviewDate": "YYYY-MM-DD",
  "translations": {
    "en": {
      "title": "...",
      "summary": "..."
    },
    "fr": {
      "title": "...",
      "summary": "..."
    },
    "rw": {
      "title": "...",
      "summary": "..."
    }
  },
  ...
}
```

### For Next 100+ Ideas
Use a simple markdown list:
```
## High Priority
1. **[type]** [title] — [description]
2. ...

## Medium Priority
...

## Low Priority
...
```

## Quality Standards

1. **Accuracy** — All fees, requirements, and processes must be current and verified
2. **Actionability** — Every guide must give users clear next steps
3. **Inclusivity** — Consider introverts, foreigners, and first-time users
4. **Local context** — Include Kigali-specific details (neighborhoods, common pitfalls, cultural tips)
5. **Trustworthiness** — Cite official sources; never guess at procedures
6. **Practicality** — Include estimated times, costs, and what to bring

## What NOT to Do

- Don't invent procedures or fees
- Don't include outdated information
- Don't create content for services that don't exist
- Don't use placeholder text
- Don't include personally identifiable information
- Don't scrape copyrighted material without attribution

## Success Criteria

- 20+ complete, valid entries ready for database import
- 100+ prioritized ideas for future content
- All entries pass Sanity schema validation
- Content covers diverse user needs (government, everyday, emergency)
- Sources are cited and trustworthy
- Language is clear, simple, and actionable

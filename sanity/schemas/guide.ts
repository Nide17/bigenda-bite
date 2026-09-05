import { defineType, defineField } from 'sanity'

export const guideType = defineType({
  name: 'guide',
  type: 'document',
  title: 'How-To Guide',
  fields: [
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'translations.en.title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sourceType',
      type: 'string',
      title: 'Source Type',
      options: { list: ['editorial'], layout: 'radio' },
      initialValue: 'editorial',
      readOnly: true,
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          { title: 'Housing', value: 'housing' },
          { title: 'Health', value: 'health' },
          { title: 'Finance', value: 'finance' },
          { title: 'Transport', value: 'transport' },
          { title: 'Business', value: 'business' },
          { title: 'Lifestyle', value: 'lifestyle' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'city',
      type: 'string',
      title: 'City (optional)',
      description: 'Leave empty for nationwide content',
    }),
    defineField({
      name: 'translations',
      type: 'object',
      title: 'Translations',
      validation: (Rule) => Rule.required(),
      fields: [
        { name: 'en', type: 'localizedTitle', title: 'English', validation: (Rule) => Rule.required() },
        { name: 'fr', type: 'localizedTitle', title: 'French' },
        { name: 'rw', type: 'localizedTitle', title: 'Kinyarwanda' },
      ],
    }),
    defineField({
      name: 'steps',
      type: 'array',
      title: 'Steps',
      of: [{ type: 'step' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'typicalCosts',
      type: 'array',
      title: 'Typical Costs',
      of: [{ type: 'cost' }],
    }),
    defineField({
      name: 'commonPitfalls',
      type: 'array',
      title: 'Common Pitfalls',
      of: [{ type: 'text' }],
    }),
    defineField({
      name: 'aiDraftStatus',
      type: 'string',
      title: 'AI Draft Status',
      options: { list: ['ai_draft', 'editor_reviewed', 'published'], layout: 'radio' },
      initialValue: 'editor_reviewed',
    }),
    defineField({
      name: 'researchSources',
      type: 'array',
      title: 'Research Sources',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'lastReviewedDate',
      type: 'datetime',
      title: 'Last Reviewed Date',
    }),
    defineField({
      name: 'status',
      type: 'string',
      title: 'Status',
      options: { list: ['draft', 'published'], layout: 'radio' },
      initialValue: 'draft',
    }),
    defineField({
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'taskBlueprint',
      type: 'object',
      title: 'Task Blueprint',
      description: 'Quick-reference metadata for users completing this task',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'estimatedTime',
          type: 'object',
          title: 'Estimated Time',
          description: 'Time estimates for online and in-person completion',
          fields: [
            { name: 'online', type: 'string', title: 'Online', description: 'e.g. "15 minutes"' },
            { name: 'inPerson', type: 'string', title: 'In Person', description: 'e.g. "1-2 hours"' },
          ],
        }),
        defineField({
          name: 'costBreakdown',
          type: 'array',
          title: 'Cost Breakdown',
          description: 'Itemized costs for this task',
          of: [
            {
              type: 'object',
              title: 'Cost Item',
              fields: [
                { name: 'item', type: 'string', title: 'Item', description: 'e.g. "Irembo Fee"' },
                { name: 'amountRWF', type: 'number', title: 'Amount (RWF)', description: 'Numeric amount only' },
              ],
            },
          ],
        }),
        defineField({
          name: 'documentChecklist',
          type: 'array',
          title: 'Document Checklist',
          description: 'Documents needed with fallback options',
          of: [
            {
              type: 'object',
              title: 'Document',
              fields: [
                { name: 'documentName', type: 'string', title: 'Document Name', validation: (Rule) => Rule.required() },
                { name: 'isRequired', type: 'boolean', title: 'Required', initialValue: true },
                { name: 'fallbackOption', type: 'string', title: 'Fallback Option', description: 'e.g. "If no utility bill, a cell leader letter works"' },
              ],
            },
          ],
        }),
        defineField({
          name: 'physicalLocation',
          type: 'object',
          title: 'Physical Location',
          description: 'Where to go in person',
          fields: [
            { name: 'description', type: 'string', title: 'Description', description: 'e.g. "RDB Building, Kimihurura, 3rd Floor"' },
            { name: 'mapsLink', type: 'url', title: 'Maps Link' },
          ],
        }),
        defineField({
          name: 'culturalContext',
          type: 'text',
          title: 'Cultural Context',
          description: 'Optional tips for cultural context (e.g. "Greet with Muraho before asking questions")',
        }),
        defineField({
          name: 'copyPasteScripts',
          type: 'array',
          title: 'Copy-Paste Scripts',
          description: 'Pre-written messages for common scenarios',
          of: [
            {
              type: 'object',
              title: 'Script',
              fields: [
                {
                  name: 'language',
                  type: 'string',
                  title: 'Language',
                  options: { list: [{ title: 'English', value: 'en' }, { title: 'Kinyarwanda', value: 'rw' }], layout: 'radio' },
                  validation: (Rule) => Rule.required(),
                },
                { name: 'scenario', type: 'string', title: 'Scenario', description: 'e.g. "Requesting birth certificate"', validation: (Rule) => Rule.required() },
                { name: 'text', type: 'text', title: 'Script Text', validation: (Rule) => Rule.required() },
              ],
            },
          ],
        }),
        defineField({
          name: 'introvertTip',
          type: 'text',
          title: 'Introvert Tip',
          description: 'e.g. "Go before 10 AM to avoid queues. English is widely understood."',
        }),
      ],
    }),
  ],
})

export const costType = defineType({
  name: 'cost',
  type: 'object',
  fields: [
    { name: 'label', type: 'string', title: 'Label' },
    { name: 'rangeRWF', type: 'array', title: 'Range (RWF)', of: [{ type: 'number' }] },
  ],
})

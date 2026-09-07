import { defineType, defineField } from 'sanity'

export const processType = defineType({
  name: 'process',
  type: 'document',
  title: 'Official Process',
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
      options: { list: ['official_verified'], layout: 'radio' },
      initialValue: 'official_verified',
      readOnly: true,
    }),
    defineField({
      name: 'officialSource',
      type: 'string',
      title: 'Official Source',
      description: 'Name of the government institution or official body (e.g. "RDB", "RRA", "Irembo")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          { title: 'Business', value: 'business' },
          { title: 'Tax', value: 'tax' },
          { title: 'Identity', value: 'identity' },
          { title: 'Transport', value: 'transport' },
          { title: 'Immigration', value: 'immigration' },
          { title: 'Health', value: 'health' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
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
      name: 'summary',
      type: 'text',
      title: 'Summary',
      description: 'Brief description shown in search results and cards',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'eligibility',
      type: 'array',
      title: 'Eligibility',
      description: 'Who can apply for this process',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'requirements',
      type: 'array',
      title: 'Requirements',
      description: 'Prerequisites or conditions that must be met before applying',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'steps',
      type: 'array',
      title: 'Steps',
      of: [{ type: 'step' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'processingTime',
      type: 'string',
      title: 'Processing Time',
      description: 'Typical time to complete (e.g. "3-5 business days", "Same day")',
    }),
    defineField({
      name: 'fees',
      type: 'array',
      title: 'Fees',
      of: [{ type: 'fee' }],
    }),
    defineField({
      name: 'requiredDocuments',
      type: 'array',
      title: 'Required Documents',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'whereToApply',
      type: 'object',
      title: 'Where to Apply',
      description: 'Physical location and online options',
      fields: [
        { name: 'description', type: 'string', title: 'Description', description: 'e.g. "RDB Building, Kimihurura, 3rd Floor" or "Online via Irembo"' },
        { name: 'mapsLink', type: 'url', title: 'Maps Link' },
      ],
    }),
    defineField({
      name: 'onlineApplicationUrl',
      type: 'url',
      title: 'Online Application URL',
      description: 'Direct link to the online application form if available',
    }),
    defineField({
      name: 'contactInfo',
      type: 'object',
      title: 'Contact Information',
      description: 'Contact details for the issuing institution',
      fields: [
        { name: 'phone', type: 'string', title: 'Phone', description: 'e.g. "+250 788 000 000"' },
        { name: 'email', type: 'string', title: 'Email' },
        { name: 'website', type: 'url', title: 'Website' },
      ],
    }),
    defineField({
      name: 'officialPortal',
      type: 'url',
      title: 'Official Portal URL',
      description: 'Main official website for this process',
    }),
    defineField({
      name: 'sourceUrl',
      type: 'array',
      title: 'Source URLs',
      description: 'Additional authoritative sources',
      of: [{ type: 'url' }],
    }),
    defineField({
      name: 'lastVerifiedDate',
      type: 'datetime',
      title: 'Last Verified Date',
      description: 'When this content was last confirmed accurate',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nextReviewDate',
      type: 'datetime',
      title: 'Next Review Date',
      description: 'When this content should be reviewed again for accuracy',
    }),
    defineField({
      name: 'confidenceScore',
      type: 'number',
      title: 'Confidence Score',
      description: 'Editor confidence in accuracy (0-1)',
    }),
    defineField({
      name: 'status',
      type: 'string',
      title: 'Status',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Needs Review', value: 'needs_review' },
          { title: 'Expired', value: 'expired' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
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
    defineField({
      name: 'beforeYouGo',
      type: 'array',
      title: 'Before You Go',
      description: 'Essential tips shown on the process page (e.g. "Bring exact change", "Arrive before 11 AM")',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'foreignerNotes',
      type: 'array',
      title: 'Foreigner Notes',
      description: 'Tips specific to non-Rwandan users (e.g. "Mutuelle de Sante is Rwanda\'s public health insurance")',
      of: [{ type: 'string' }],
    }),
  ],
  validation: (Rule) => Rule.required(),
})

export const stepType = defineType({
  name: 'step',
  type: 'object',
  fields: [
    {
      name: 'order',
      type: 'number',
      title: 'Order',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'text',
      type: 'object',
      title: 'Text',
      validation: (Rule) => Rule.required(),
      fields: [
        { name: 'en', type: 'text', title: 'English', validation: (Rule) => Rule.required() },
        { name: 'fr', type: 'text', title: 'French' },
        { name: 'rw', type: 'text', title: 'Kinyarwanda' },
      ],
    },
    { name: 'estimatedTime', type: 'string', title: 'Estimated Time' },
  ],
  validation: (Rule) => Rule.required(),
})

export const feeType = defineType({
  name: 'fee',
  type: 'object',
  fields: [
    { name: 'label', type: 'string', title: 'Label' },
    { name: 'amountRWF', type: 'number', title: 'Amount (RWF)', initialValue: 0 },
    { name: 'conditions', type: 'text', title: 'Conditions' },
  ],
})

export const localizedTitleType = defineType({
  name: 'localizedTitle',
  type: 'object',
  fields: [
    { name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required() },
    { name: 'summary', type: 'text', title: 'Summary', validation: (Rule) => Rule.required() },
  ],
  validation: (Rule) => Rule.required(),
})

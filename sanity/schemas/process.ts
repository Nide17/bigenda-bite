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
      name: 'officialPortal',
      type: 'url',
      title: 'Official Portal URL',
    }),
    defineField({
      name: 'sourceUrl',
      type: 'array',
      title: 'Source URLs',
      of: [{ type: 'url' }],
    }),
    defineField({
      name: 'lastVerifiedDate',
      type: 'datetime',
      title: 'Last Verified Date',
    }),
    defineField({
      name: 'confidenceScore',
      type: 'number',
      title: 'Confidence Score',
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
          type: 'string',
          title: 'Estimated Time',
          description: 'e.g. "30 minutes", "1-2 days"',
        }),
        defineField({
          name: 'estimatedCost',
          type: 'string',
          title: 'Estimated Cost',
          description: 'e.g. "1,000 RWF", "Free"',
        }),
        defineField({
          name: 'requiredDocuments',
          type: 'array',
          title: 'Required Documents',
          of: [{ type: 'string' }],
        }),
        defineField({
          name: 'locationHint',
          type: 'string',
          title: 'Location Hint',
          description: 'e.g. "Any MTN store, or via Irembo"',
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
      description: 'Tips specific to non-Rwandan users (e.g. "Mutuelle de Santé is Rwanda\'s public health insurance")',
      of: [{ type: 'string' }],
    }),
  ],
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

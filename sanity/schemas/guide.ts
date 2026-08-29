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

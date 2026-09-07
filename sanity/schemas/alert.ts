import { defineType, defineField } from 'sanity'

export const alertType = defineType({
  name: 'alert',
  type: 'document',
  title: 'Alert',
  fields: [
    defineField({
      name: 'type',
      type: 'string',
      title: 'Type',
      options: {
        list: [
          { title: 'Fee Change', value: 'fee_change' },
          { title: 'Office Closure', value: 'office_closure' },
          { title: 'New Requirement', value: 'new_requirement' },
          { title: 'Transport Disruption', value: 'transport_disruption' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'severity',
      type: 'string',
      title: 'Severity',
      options: { list: ['info', 'warning', 'critical'], layout: 'radio' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sourceName',
      type: 'string',
      title: 'Source Name',
      description: 'Name of the institution or organization issuing this alert (e.g. "RDB", "RRA")',
    }),
    defineField({
      name: 'sourceUrl',
      type: 'url',
      title: 'Source URL',
      description: 'Link to the official announcement',
    }),
    defineField({
      name: 'city',
      type: 'string',
      title: 'City (optional)',
      description: 'Leave empty for nationwide alerts',
    }),
    defineField({
      name: 'relatedProcessId',
      type: 'string',
      title: 'Related Process ID',
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
      name: 'expiresAt',
      type: 'datetime',
      title: 'Expires At',
      description: 'When this alert is no longer relevant',
    }),
    defineField({
      name: 'status',
      type: 'string',
      title: 'Status',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Expired', value: 'expired' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
  ],
  validation: (Rule) => Rule.required(),
})

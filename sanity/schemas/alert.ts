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
    }),
    defineField({
      name: 'severity',
      type: 'string',
      title: 'Severity',
      options: { list: ['info', 'warning', 'critical'], layout: 'radio' },
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
      fields: [
        { name: 'en', type: 'text', title: 'English' },
        { name: 'fr', type: 'text', title: 'French' },
        { name: 'rw', type: 'text', title: 'Kinyarwanda' },
      ],
    }),
    defineField({
      name: 'expiresAt',
      type: 'datetime',
      title: 'Expires At',
    }),
    defineField({
      name: 'status',
      type: 'string',
      title: 'Status',
      options: { list: ['draft', 'published'], layout: 'radio' },
      initialValue: 'draft',
    }),
  ],
})

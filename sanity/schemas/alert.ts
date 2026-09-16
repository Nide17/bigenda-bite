import { defineType, defineField } from 'sanity'

export const alertType = defineType({
  name: 'alert',
  type: 'document',
  title: 'Alert',
  preview: {
    select: {
      title: 'translations.en.title',
      type: 'type',
      severity: 'severity',
      status: 'status',
      sourceName: 'sourceName',
    },
    prepare: ({ title, type, severity, status, sourceName }) => ({
      title: title || type || 'Untitled Alert',
      subtitle: `${status} · ${severity} · ${sourceName || 'No source'}`,
    }),
  },
  fields: [
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'translations.en.title', maxLength: 96 },
      validation: (Rule) => [
        Rule.required(),
        Rule.custom(async (slug, context) => {
          const ctx = context as {
            document?: { _type?: string; _id?: string; status?: string }
            getClient?: (options: { apiVersion: string }) => { fetch: (q: string, p: Record<string, unknown>) => Promise<unknown> }
          }
          if (ctx.document?.status === 'draft') return true
          const client = ctx.getClient?.({ apiVersion: '2024-01-01' })
          if (!client || !slug) return true
          const existing = await client.fetch(
            `*[_type == $type && slug.current == $slug && _id != $id][0]`,
            { type: ctx.document?._type, slug, id: ctx.document?._id || '' },
          )
          return existing ? 'A document with this slug already exists' : true
        }),
      ],
    }),
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
    defineField({
      name: 'deletedAt',
      type: 'datetime',
      title: 'Deleted At',
      description: 'Soft-delete timestamp. When set, the document is hidden from queries but retained for recovery.',
      hidden: true,
    }),
  ],
  validation: (Rule) => Rule.required(),
})

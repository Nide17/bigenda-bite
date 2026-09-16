import { defineConfig } from 'sanity'
import { schemaTypes } from './sanity/schemas/index'
import { structureTool } from 'sanity/structure'
import { FileText, BookOpen, Bell } from 'lucide-react'
import { DocumentOverview } from './sanity/components/DocumentOverview'

export default defineConfig({
  name: 'bigenda-bite',
  title: 'Bigenda Bite CMS',
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '55et5l4p',
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  basePath: '/studio',
  plugins: [
    structureTool({
      title: 'Content',
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.documentTypeListItem('process')
              .title('Official Processes')
              .icon(FileText),
            S.documentTypeListItem('guide')
              .title('How-To Guides')
              .icon(BookOpen),
            S.documentTypeListItem('alert')
              .title('Alerts')
              .icon(Bell),
          ]),
      defaultDocumentNode: (S) =>
        S.document().views([
          S.view.form(),
          S.view.component(DocumentOverview).title('Overview'),
        ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
})
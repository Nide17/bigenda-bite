import { defineConfig } from 'sanity'
import { schemaTypes } from './sanity/schemas/index'
import { structureTool } from 'sanity/structure'
import { FileText, BookOpen, Bell } from 'lucide-react'
import { DocumentOverview } from './sanity/components/DocumentOverview'

const PROCESS_FILTER = '!defined(deletedAt)'
const GUIDE_FILTER = '!defined(deletedAt)'
const ALERT_FILTER = '!defined(deletedAt)'

const defaultOrdering = [{ field: '_createdAt', direction: 'desc' as const }]

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
            S.documentListItem({ id: 'processes', schemaType: 'process' })
              .title('Official Processes')
              .icon(FileText)
              .child(
                S.list()
                  .title('Official Processes')
                  .items([
                    S.documentListItem({ id: 'all-processes', schemaType: 'process' })
                      .title('All')
                      .child(S.documentTypeList('process').filter(PROCESS_FILTER).defaultOrdering(defaultOrdering)),
                    S.documentListItem({ id: 'published-processes', schemaType: 'process' })
                      .title('Published')
                      .child(
                        S.documentTypeList('process')
                          .filter(`status == "published" && ${PROCESS_FILTER}`)
                          .defaultOrdering(defaultOrdering),
                      ),
                    S.documentListItem({ id: 'draft-processes', schemaType: 'process' })
                      .title('Draft')
                      .child(
                        S.documentTypeList('process')
                          .filter(`status == "draft" && ${PROCESS_FILTER}`)
                          .defaultOrdering(defaultOrdering),
                      ),
                    S.documentListItem({ id: 'review-processes', schemaType: 'process' })
                      .title('Needs Review')
                      .child(
                        S.documentTypeList('process')
                          .filter(`status == "needs_review" && ${PROCESS_FILTER}`)
                          .defaultOrdering(defaultOrdering),
                      ),
                  ]),
              ),
            S.documentListItem({ id: 'guides', schemaType: 'guide' })
              .title('How-To Guides')
              .icon(BookOpen)
              .child(
                S.list()
                  .title('How-To Guides')
                  .items([
                    S.documentListItem({ id: 'all-guides', schemaType: 'guide' })
                      .title('All')
                      .child(S.documentTypeList('guide').filter(GUIDE_FILTER).defaultOrdering(defaultOrdering)),
                    S.documentListItem({ id: 'published-guides', schemaType: 'guide' })
                      .title('Published')
                      .child(
                        S.documentTypeList('guide')
                          .filter(`status == "published" && ${GUIDE_FILTER}`)
                          .defaultOrdering(defaultOrdering),
                      ),
                    S.documentListItem({ id: 'draft-guides', schemaType: 'guide' })
                      .title('Draft')
                      .child(
                        S.documentTypeList('guide')
                          .filter(`status == "draft" && ${GUIDE_FILTER}`)
                          .defaultOrdering(defaultOrdering),
                      ),
                    S.documentListItem({ id: 'review-guides', schemaType: 'guide' })
                      .title('Needs Review')
                      .child(
                        S.documentTypeList('guide')
                          .filter(`status == "needs_review" && ${GUIDE_FILTER}`)
                          .defaultOrdering(defaultOrdering),
                      ),
                  ]),
              ),
            S.documentListItem({ id: 'alerts', schemaType: 'alert' })
              .title('Alerts')
              .icon(Bell)
              .child(
                S.list()
                  .title('Alerts')
                  .items([
                    S.documentListItem({ id: 'all-alerts', schemaType: 'alert' })
                      .title('All')
                      .child(S.documentTypeList('alert').filter(ALERT_FILTER).defaultOrdering(defaultOrdering)),
                    S.documentListItem({ id: 'published-alerts', schemaType: 'alert' })
                      .title('Published')
                      .child(
                        S.documentTypeList('alert')
                          .filter(`status == "published" && ${ALERT_FILTER}`)
                          .defaultOrdering(defaultOrdering),
                      ),
                    S.documentListItem({ id: 'draft-alerts', schemaType: 'alert' })
                      .title('Draft')
                      .child(
                        S.documentTypeList('alert')
                          .filter(`status == "draft" && ${ALERT_FILTER}`)
                          .defaultOrdering(defaultOrdering),
                      ),
                  ]),
              ),
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
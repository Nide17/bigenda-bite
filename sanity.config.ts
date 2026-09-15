import { defineConfig } from 'sanity'
import { schemaTypes } from './sanity/schemas/index'

export default defineConfig({
  name: 'bigenda-bite',
  title: 'Bigenda Bite CMS',
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '55et5l4p',
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  basePath: '/studio',
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  schema: {
    types: schemaTypes,
  },
})
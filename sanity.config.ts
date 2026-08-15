import { defineConfig } from 'sanity'
import { schemaTypes } from './sanity/schemas/index'
import StudioListTool from '@/components/StudioListTool'
import { DocumentsIcon } from '@sanity/icons'
import { route } from 'sanity/router'

export default defineConfig({
  name: 'bigenda-bite',
  title: 'Bigenda Bite CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fallback',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  basePath: '/studio',
  tools: (prev) => [{
    name: 'content',
    title: 'Content',
    icon: DocumentsIcon,
    component: StudioListTool,
    router: route.create('/', [route.create('/')]),
  }, ...prev],
  schema: {
    types: schemaTypes,
  },
})

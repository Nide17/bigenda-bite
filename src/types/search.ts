export type SearchResultType = 'process' | 'guide' | 'business' | 'alert'

export interface SearchResult {
  type: SearchResultType
  title: string
  description: string
  category?: string
  language: string
  url: string
  score?: number
  metadata?: Record<string, unknown>
}

export interface SearchResponse {
  results: SearchResult[]
  query: string
  language: string
  total: number
}

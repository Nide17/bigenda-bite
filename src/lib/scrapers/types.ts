export interface ScrapedProcess {
  _type: 'process'
  sourceType: string
  category: string
  status: string
  tags: string[]
  translations: {
    en: { title: string; summary: string }
    fr: { title: string; summary: string }
    rw: { title: string; summary: string }
  }
  steps: { order: number; text: { en: string; fr: string; rw: string }; estimatedTime: string }[]
  fees: { label: string; amountRWF: number; conditions: string }[]
  officialPortal: string
  sourceUrl: string[]
  lastVerifiedDate: string
  confidenceScore: number
}

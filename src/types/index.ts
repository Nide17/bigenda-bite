export interface Translation {
  title?: string
  summary?: string
}

export interface LocalizedTranslation {
  [lang: string]: Translation | undefined
  en?: Translation
  fr?: Translation
  rw?: Translation
}

export interface AlertTranslation {
  [lang: string]: string | undefined
  en?: string
  fr?: string
  rw?: string
}

export interface ProcessStep {
  order?: number
  text?: {
    [lang: string]: string | undefined
    en?: string
    fr?: string
    rw?: string
  }
  estimatedTime?: string
}

export interface Fee {
  label?: string
  amountRWF?: number
  conditions?: string
}

export interface TaskBlueprint {
  estimatedTime?: string
  estimatedCost?: string
  requiredDocuments?: string[]
  locationHint?: string
  introvertTip?: string
}

export interface Process {
  _id: string
  _type?: string
  _createdAt?: string
  _updatedAt?: string
  slug?: {
    current?: string
  }
  sourceType?: string
  category?: string
  city?: string
  translations?: LocalizedTranslation
  steps?: ProcessStep[]
  fees?: Fee[]
  requiredDocuments?: string[]
  taskBlueprint?: TaskBlueprint
  officialPortal?: string
  sourceUrl?: string[]
  lastVerifiedDate?: string
  confidenceScore?: number
  status?: string
  tags?: string[]
}

export interface Guide {
  _id: string
  _type?: string
  _createdAt?: string
  _updatedAt?: string
  slug?: {
    current?: string
  }
  sourceType?: string
  category?: string
  city?: string
  translations?: LocalizedTranslation
  steps?: ProcessStep[]
  typicalCosts?: {
    label?: string
    rangeRWF?: number[]
  }[]
  commonPitfalls?: string[]
  aiDraftStatus?: string
  researchSources?: string[]
  lastReviewedDate?: string
  status?: string
  tags?: string[]
  taskBlueprint?: TaskBlueprint
}

export interface Alert {
  _id: string
  _type?: string
  _createdAt?: string
  _updatedAt?: string
  type?: string
  severity?: string
  city?: string
  relatedProcessId?: string
  translations?: AlertTranslation
  expiresAt?: string
  status?: string
}

export interface Business {
  _id: { toString(): string }
  name: string
  category: string
  city?: string
  slug?: string
  description?: string
  email?: string
  contact?: {
    phone?: string
    email?: string
  }
  leadsEnabled?: boolean
  englishSpeaking?: boolean
  acceptsMomo?: boolean
  bigendaVerified?: boolean
}

export interface CommunityContribution {
  _id: string
  text: string
  city?: string
  guideId?: string
  submittedAt?: string
  status?: string
  authorId?: string
  photoUrl?: string | null
  upvotes?: number
  flags?: number
  promoted?: boolean
}

export interface PendingUpdate {
  _id: string
  collection?: string
  documentId?: string
  status?: string
  confidenceScore?: number
  diffSummary?: string
  detectedAt?: string
  approvedAt?: string | null
  rejectedAt?: string | null
  update?: Record<string, unknown>
  currentSanityDoc?: Process | Guide | null
}

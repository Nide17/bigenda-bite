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

export interface EstimatedTime {
  online?: string
  inPerson?: string
}

export interface CostBreakdownItem {
  item?: string
  amountRWF?: number
}

export interface DocumentChecklistItem {
  documentName?: string
  isRequired?: boolean
  fallbackOption?: string
}

export interface PhysicalLocation {
  description?: string
  mapsLink?: string
}

export interface CopyPasteScript {
  language?: 'en' | 'rw'
  scenario?: string
  text?: string
}

export interface TaskBlueprint {
  estimatedTime?: EstimatedTime
  costBreakdown?: CostBreakdownItem[]
  documentChecklist?: DocumentChecklistItem[]
  physicalLocation?: PhysicalLocation
  culturalContext?: string
  copyPasteScripts?: CopyPasteScript[]
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
  beforeYouGo?: string[]
  foreignerNotes?: string[]
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

export type SubmissionType = 'comment' | 'edit_suggestion' | 'additional_info' | 'review'
export type ContentType = 'process' | 'guide' | 'business'
export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'published'

export interface UserSubmission {
  _id: string
  type: SubmissionType
  contentType: ContentType
  contentId: string
  contentSlug?: string
  userId: string
  userDisplayName: string
  userEmail: string
  text: string
  suggestedFields?: Record<string, unknown>
  rating?: number
  status: SubmissionStatus
  reviewedBy?: string
  reviewedAt?: string
  reviewNote?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

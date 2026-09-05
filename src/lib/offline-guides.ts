export interface SavedGuide {
  id: string
  title: string
  category?: string
  savedAt: string
  data: {
    title: string
    estimatedTime?: { online?: string; inPerson?: string }
    costBreakdown?: { item?: string; amountRWF?: number }[]
    documentChecklist?: { documentName?: string; isRequired?: boolean; fallbackOption?: string }[]
    physicalLocation?: { description?: string; mapsLink?: string }
    culturalContext?: string
    copyPasteScripts?: { language?: string; scenario?: string; text?: string }[]
    introvertTip?: string
  }
}

const STORAGE_KEY = 'bigenda-bite-offline-guides'

export function getSavedGuides(): SavedGuide[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveGuide(guide: SavedGuide): void {
  const existing = getSavedGuides()
  const filtered = existing.filter((g) => g.id !== guide.id)
  filtered.push(guide)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function removeGuide(id: string): void {
  const existing = getSavedGuides()
  const filtered = existing.filter((g) => g.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function isGuideSaved(id: string): boolean {
  return getSavedGuides().some((g) => g.id === id)
}

'use client'

import { useState, useCallback } from 'react'
import TaskBlueprint from '@/components/TaskBlueprint'
import { saveGuide, removeGuide, isGuideSaved, type SavedGuide } from '@/lib/offline-guides'
import type { TaskBlueprint as TaskBlueprintType } from '@/types'

interface GuideTaskBlueprintClientProps {
  data?: TaskBlueprintType
  guideId: string
  guideTitle: string
  guideCategory?: string
}

export default function GuideTaskBlueprintClient({
  data,
  guideId,
  guideTitle,
  guideCategory,
}: GuideTaskBlueprintClientProps) {
  const [isSaved, setIsSaved] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return isGuideSaved(guideId)
  })
  const [saving, setSaving] = useState(false)

  const handleSaveOffline = useCallback(() => {
    if (!data) return
    setSaving(true)
    try {
      const saveData: SavedGuide = {
        id: guideId,
        title: guideTitle,
        category: guideCategory,
        savedAt: new Date().toISOString(),
        data: data as SavedGuide['data'],
      }
      saveGuide(saveData)
      setIsSaved(true)
    } catch (error) {
      console.error('Failed to save guide offline:', error)
    } finally {
      setSaving(false)
    }
  }, [data, guideId, guideTitle, guideCategory])

  const handleRemoveOffline = useCallback(() => {
    setSaving(true)
    try {
      removeGuide(guideId)
      setIsSaved(false)
    } catch (error) {
      console.error('Failed to remove saved guide:', error)
    } finally {
      setSaving(false)
    }
  }, [guideId])

  return (
    <TaskBlueprint
      data={data}
      onSaveOffline={isSaved ? handleRemoveOffline : handleSaveOffline}
      isSavingOffline={saving}
      isSavedOffline={isSaved}
    />
  )
}

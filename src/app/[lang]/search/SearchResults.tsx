'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Link from 'next/link'
import type { SearchResult, SearchResultType } from '@/types/search'

const TYPE_LABELS: Record<SearchResultType, string> = {
  process: 'Official Processes',
  guide: 'How-To Guides',
  business: 'Business Directory',
  alert: 'Alerts',
}

const TYPE_ICONS: Record<SearchResultType, string> = {
  process: '🏛️',
  guide: '📖',
  business: '🏢',
  alert: '🔔',
}

const TYPE_COLORS: Record<SearchResultType, string> = {
  process: 'bg-blue-50 text-blue-700 border-blue-200',
  guide: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  business: 'bg-amber-50 text-amber-700 border-amber-200',
  alert: 'bg-red-50 text-red-700 border-red-200',
}

interface SearchResultsProps {
  query: string
  typeFilter: string
  lang: string
}

export default function SearchResults({ query, typeFilter, lang }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const abortControllerRef = useRef<AbortController | null>(null)
  const initialized = useRef(false)

  const activeTypes = useMemo(() => {
    if (!typeFilter) return [] as SearchResultType[]
    return typeFilter.split(',').filter((t): t is SearchResultType =>
      ['process', 'guide', 'business', 'alert'].includes(t)
    )
  }, [typeFilter])

  const toggleType = useCallback((type: SearchResultType) => {
    const current = activeTypes.includes(type)
      ? activeTypes.filter(t => t !== type)
      : [...activeTypes, type]

    const params = new URLSearchParams(window.location.search)
    if (current.length > 0) {
      params.set('type', current.join(','))
    } else {
      params.delete('type')
    }
    window.location.search = params.toString()
  }, [activeTypes])

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      if (initialized.current) {
        setResults([])
        setTotal(0)
      }
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    initialized.current = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    const params = new URLSearchParams({ q: query.trim(), lang })
    if (typeFilter) params.set('type', typeFilter)

    fetch(`/api/search?${params}`, { signal: controller.signal })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setResults(data.results || [])
        setTotal(data.total || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [query, typeFilter, lang])

  const emptyState = { process: [], guide: [], business: [], alert: [] } as Record<SearchResultType, SearchResult[]>
  const grouped = results.reduce<Record<SearchResultType, SearchResult[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = []
    acc[r.type].push(r)
    return acc
  }, emptyState)

  if (!query || query.trim().length < 2) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center">
          <div className="text-4xl mb-3 opacity-40">🔍</div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Start typing to search</h3>
          <p className="text-neutral-600 max-w-md mx-auto">
            Search across processes, guides, businesses, and alerts.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-neutral-600">
          {loading ? 'Searching...' : `${total} result${total !== 1 ? 's' : ''} for "${query}"`}
        </p>
        <div className="flex items-center gap-2">
          {(Object.keys(TYPE_LABELS) as SearchResultType[]).map(type => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                activeTypes.length === 0 || activeTypes.includes(type)
                  ? TYPE_COLORS[type]
                  : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-neutral-200 rounded-xl p-5 animate-pulse">
              <div className="h-5 bg-neutral-200 rounded w-1/3 mb-3" />
              <div className="h-4 bg-neutral-200 rounded w-full mb-2" />
              <div className="h-4 bg-neutral-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {!loading && total === 0 && (
        <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center">
          <div className="text-4xl mb-3 opacity-40">🤷</div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No results found</h3>
          <p className="text-neutral-600 max-w-md mx-auto">
            We couldn&apos;t find anything matching &quot;{query}&quot;. Try different keywords or remove filters.
          </p>
        </div>
      )}

      {!loading && total > 0 && (
        <div className="space-y-6">
          {(Object.keys(grouped) as SearchResultType[]).map(type => {
            const typeResults = grouped[type]
            if (typeResults.length === 0) return null
            if (activeTypes.length > 0 && !activeTypes.includes(type)) return null

            return (
              <div key={type} className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200 flex items-center gap-2">
                  <span>{TYPE_ICONS[type]}</span>
                  <h3 className="text-sm font-semibold text-neutral-700">{TYPE_LABELS[type]}</h3>
                  <span className="text-xs text-neutral-500">({typeResults.length})</span>
                </div>
                <ul className="divide-y divide-neutral-100">
                  {typeResults.map((result, index) => (
                    <li key={`${result.type}-${result.url}-${index}`}>
                      <Link
                        href={result.url}
                        className="group block p-4 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-neutral-900 group-hover:text-primary transition-colors">
                                {result.title}
                              </h4>
                              {result.score && result.score >= 5 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                  ★ Relevant
                                </span>
                              )}
                            </div>
                            {result.description && (
                              <p className="text-sm text-neutral-600 line-clamp-2">
                                {result.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              {result.category && (
                                <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-700 text-xs font-medium rounded">
                                  {result.category}
                                </span>
                              )}
                              {(() => {
                                const sourceType = result.metadata?.sourceType
                                return sourceType ? (
                                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                                    {String(sourceType) as string}
                                  </span>
                                ) : null
                              })()}
                            </div>
                          </div>
                          <svg className="w-4 h-4 text-neutral-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

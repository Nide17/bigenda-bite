'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import type { SearchResult, SearchResultType } from '@/types/search'

const DEBOUNCE_MS = 300

const typeLabels: Record<SearchResultType, string> = {
  process: 'Official Processes',
  guide: 'How-To Guides',
  business: 'Business Directory',
  alert: 'Alerts',
}

interface SearchProps {
  lang: string
  placeholder?: string
  className?: string
  initialQuery?: string
  onSearch?: (query: string) => void
  placeholders?: string[]
  scenarios?: { label: string; query: string }[]
}

export default function Search({ lang, className = '', initialQuery = '', onSearch, placeholders, scenarios }: SearchProps) {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0)
  const abortControllerRef = useRef<AbortController | null>(null)
  const initialQueryRef = useRef('')
  const placeholderIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const conversationalPlaceholders = placeholders || [
    'How do I get a SIM card?',
    'Where to buy a fridge in Kigali?',
    'Quiet cafes to work from in Kiyovu',
    'How to use Tap&Go buses',
  ]

  const quickScenarios = scenarios || [
    { label: 'New to Rwanda', query: 'new to Rwanda' },
    { label: 'I need a clinic', query: 'clinic near me' },
    { label: 'Starting a business', query: 'register business' },
    { label: 'Shopping & errands', query: 'shopping markets' },
  ]

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([])
      setHasSearched(false)
      if (onSearch) onSearch(searchQuery)
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)
    setHasSearched(true)

    try {
      const params = new URLSearchParams({
        q: searchQuery.trim(),
        lang,
      })

      const response = await fetch(`/api/search?${params}`, {
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setResults(data.results || [])
      if (onSearch) onSearch(searchQuery.trim())
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Search error:', error)
        setResults([])
      }
    } finally {
      setLoading(false)
    }
  }, [lang, onSearch])

  useEffect(() => {
    if (initialQuery && initialQuery !== initialQueryRef.current) {
      initialQueryRef.current = initialQuery
      setQuery(initialQuery)
      performSearch(initialQuery)
    }
  }, [initialQuery, performSearch])

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [query, performSearch])

  useEffect(() => {
    placeholderIntervalRef.current = setInterval(() => {
      setCurrentPlaceholderIndex((prev) => (prev + 1) % conversationalPlaceholders.length)
    }, 3000)

    return () => {
      if (placeholderIntervalRef.current) {
        clearInterval(placeholderIntervalRef.current)
      }
    }
  }, [conversationalPlaceholders.length])

  useEffect(() => {
    if (query) {
      if (placeholderIntervalRef.current) {
        clearInterval(placeholderIntervalRef.current)
        placeholderIntervalRef.current = null
      }
    } else {
      placeholderIntervalRef.current = setInterval(() => {
        setCurrentPlaceholderIndex((prev) => (prev + 1) % conversationalPlaceholders.length)
      }, 3000)
    }

    return () => {
      if (placeholderIntervalRef.current) {
        clearInterval(placeholderIntervalRef.current)
      }
    }
  }, [query, conversationalPlaceholders.length])

  const handleScenarioClick = (scenarioQuery: string) => {
    setQuery(scenarioQuery)
    performSearch(scenarioQuery)
  }

  const groupedResults = results.reduce<Record<SearchResultType, SearchResult[]>>((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type].push(result)
    return acc
  }, {
    process: [],
    guide: [],
    business: [],
    alert: [],
  })

  const totalResults = results.length
  const displayPlaceholder = conversationalPlaceholders[currentPlaceholderIndex]

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={displayPlaceholder}
          className={`
            w-full
            pl-12 pr-4 py-4
            bg-white border border-neutral-300 rounded-xl
            text-base text-neutral-900 placeholder-neutral-500
            shadow-sm
            hover:border-neutral-400 hover:bg-neutral-50
            focus:outline-none focus:ring-2 focus:ring-[#1e1b4b]/20 focus:border-[#1e1b4b]
            transition-all duration-150
          `}
          aria-label="Search"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {!query && !loading && !hasSearched && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-neutral-500 mb-1">Try:</span>
          {quickScenarios.map((scenario) => (
            <button
              key={scenario.query}
              type="button"
              onClick={() => handleScenarioClick(scenario.query)}
              className="px-4 py-2 rounded-full border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1e1b4b]/20"
            >
              {scenario.label}
            </button>
          ))}
        </div>
      )}

      {hasSearched && !loading && totalResults === 0 && (
        <div className="mt-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center">
            <div className="text-4xl mb-3 opacity-40">🔍</div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No results found</h3>
            <p className="text-neutral-600 max-w-md mx-auto">
              We couldn&apos;t find anything matching &quot;{query}&quot;. Try different keywords or browse the categories below.
            </p>
          </div>
        </div>
      )}

      {totalResults > 0 && (
        <div className="mt-6 space-y-6">
          <p className="text-sm text-neutral-600">
            {totalResults} result{totalResults !== 1 ? 's' : ''} for &quot;{query}&quot;
          </p>

          {(Object.keys(groupedResults) as SearchResultType[]).map((type) => {
            const typeResults = groupedResults[type]
            if (typeResults.length === 0) return null

            return (
              <div key={type} className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-700">{typeLabels[type]}</h3>
                </div>
                <ul className="divide-y divide-neutral-100">
                  {typeResults.map((result, index) => (
                    <li key={`${result.type}-${index}`}>
                      <Link
                        href={result.url}
                        className="group block p-4 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-neutral-900 group-hover:text-primary transition-colors mb-1">
                              {result.title}
                            </h4>
                            {result.description && (
                              <p className="text-sm text-neutral-600 line-clamp-2">
                                {result.description}
                              </p>
                            )}
                            {result.category && (
                              <span className="inline-block mt-2 px-2 py-0.5 bg-neutral-100 text-neutral-700 text-xs font-medium rounded">
                                {result.category}
                              </span>
                            )}
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

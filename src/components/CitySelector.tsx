'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function CitySelector({ cityName, lang }: { cityName: string; lang: string }) {
  const pathname = usePathname()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const city = params.get('city') || cityName || 'Kigali'
    document.cookie = `bigenda-city=${encodeURIComponent(city)}; path=/; max-age=${30 * 24 * 60 * 60}`
  }, [cityName])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    document.cookie = `bigenda-city=${encodeURIComponent(value)}; path=/; max-age=${30 * 24 * 60 * 60}`
    const url = new URL(window.location.href)
    url.searchParams.set('city', value)
    window.location.href = url.toString()
  }

  return (
    <div className="relative">
      <select
        name="city"
        defaultValue={cityName || 'Kigali'}
        onChange={handleChange}
        className={`
          appearance-none
          pl-10 pr-10 py-2.5
          bg-white border border-neutral-300 rounded-lg
          text-sm font-medium text-neutral-900
          shadow-sm
          hover:border-[#1e1b4b] hover:bg-neutral-50
          focus:outline-none focus:ring-2 focus:ring-[#1e1b4b]/20 focus:border-[#1e1b4b]
          transition-all duration-150
          cursor-pointer
        `}
      >
        <option value="Kigali">Kigali</option>
        <option value="Musanze">Musanze</option>
        <option value="Rubavu">Rubavu</option>
        <option value="Huye">Huye</option>
        <option value="Mombasa">Mombasa</option>
      </select>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}

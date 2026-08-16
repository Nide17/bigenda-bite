'use client'

export default function CitySelector({ cityName, lang }: { cityName: string; lang: string }) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    document.cookie = `bigenda-city=${value}; path=/; max-age=${30 * 24 * 60 * 60}`
    window.location.href = `/${lang}?city=${value}`
  }

  return (
    <select
      name="city"
      defaultValue={cityName || 'Kigali'}
      className="border rounded p-2"
      onChange={handleChange}
    >
      <option value="Kigali">Kigali</option>
      <option value="Musanze">Musanze</option>
      <option value="Rubavu">Rubavu</option>
      <option value="Huye">Huye</option>
      <option value="Mombasa">Mombasa</option>
    </select>
  )
}

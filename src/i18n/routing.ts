export const locales = ['en', 'fr', 'rw'] as const
export const defaultLocale = 'en'

export function isValidLocale(locale: string): locale is typeof locales[number] {
  return locales.includes(locale as typeof locales[number])
}

export const routing = {
  locales,
  defaultLocale,
}

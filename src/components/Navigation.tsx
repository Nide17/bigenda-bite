import Link from 'next/link'

export function Navigation({ lang, messages }: { lang: string; messages: any }) {
  const t = (key: string) => {
    const keys = key.split('.')
    let value: any = messages.common
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  return (
    <nav className="border-b p-4">
      <ul className="flex gap-6">
        <li><Link href={`/${lang}`} className="hover:underline">{t('welcome')}</Link></li>
        <li><Link href={`/${lang}/processes`} className="hover:underline">{t('processes')}</Link></li>
        <li><Link href={`/${lang}/guides`} className="hover:underline">{t('guides')}</Link></li>
        <li><Link href={`/${lang}/directory`} className="hover:underline">{t('directory')}</Link></li>
        <li><Link href={`/${lang}/alerts`} className="hover:underline">{t('alerts')}</Link></li>
        <li><Link href={`/${lang}/membership`} className="hover:underline">{t('membership')}</Link></li>
      </ul>
    </nav>
  )
}

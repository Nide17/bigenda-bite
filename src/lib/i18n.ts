import messagesEn from '@/i18n/messages/en.json'
import messagesFr from '@/i18n/messages/fr.json'
import messagesRw from '@/i18n/messages/rw.json'

export const messagesMap: Record<string, Record<string, string>> = {
  en: messagesEn,
  fr: messagesFr,
  rw: messagesRw,
}

export function getMessages(lang: string): (key: string, params?: Record<string, string>) => string {
  const messages = messagesMap[lang] || messagesMap.en
  return (key: string, params?: Record<string, string>) => {
    let str = messages[key] || key
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, v)
      })
    }
    return str
  }
}

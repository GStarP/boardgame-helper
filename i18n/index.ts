import { resources as zhr } from './zh'
import { resources as enr } from './en'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export type i18nLng = 'zh' | 'en'

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    zh: {
      translation: zhr,
    },
    en: {
      translation: enr,
    },
  },
  lng: 'zh',
  interpolation: {
    escapeValue: false,
  },
})

export function changeLanguage(): i18nLng {
  const nextLng: i18nLng = i18n.language === 'zh' ? 'en' : 'zh'
  i18n.changeLanguage(nextLng)
  return nextLng
}

export default i18n

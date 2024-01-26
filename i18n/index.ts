import AsyncStorage from '@react-native-async-storage/async-storage'
import i18n from 'i18next'
import { atom, getDefaultStore } from 'jotai'
import { useState } from 'react'
import { initReactI18next } from 'react-i18next'

import { resources as enr } from './en'
import { resources as zhr } from './zh'

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

export const j_lng = atom<i18nLng>('zh')
const LNG_KEY = 'lng'

export function changeLanguage(lng?: i18nLng): i18nLng {
  const nextLng: i18nLng = lng ? lng : i18n.language === 'zh' ? 'en' : 'zh'
  i18n.changeLanguage(nextLng)
  getDefaultStore().set(j_lng, nextLng)
  saveLng()
  return nextLng
}

export async function saveLng() {
  await AsyncStorage.setItem(LNG_KEY, getDefaultStore().get(j_lng))
}
export function useLng(): [boolean] {
  const [loaded, setLoaded] = useState(false)

  AsyncStorage.getItem(LNG_KEY)
    .then((lng) => {
      if (lng && (lng === 'zh' || lng === 'en')) {
        changeLanguage(lng)
      }
    })
    .finally(() => {
      setLoaded(true)
    })

  return [loaded]
}

export default i18n

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationEN from './locales/en.json'
import translationRU from './locales/ru.json'
import translationDE from './locales/de.json'
import translationUK from './locales/uk.json'

const resources = {
  en: {
    translation: translationEN,
  },
  ru: {
    translation: translationRU,
  },
  de: {
    translation: translationDE,
  },
  uk: {
    translation: translationUK,
  },
}

// Detect language from localStorage or browser
const getInitialLanguage = (): string => {
  const savedLanguage = localStorage.getItem('i18nextLng')
  if (savedLanguage && ['en', 'ru', 'de', 'uk'].includes(savedLanguage)) {
    return savedLanguage
  }

  // Try to detect from browser
  const browserLang = navigator.language.split('-')[0]
  if (['en', 'ru', 'de', 'uk'].includes(browserLang)) {
    return browserLang
  }

  // Default to English
  return 'en'
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false, // Avoid suspense requirement
  },
})

export default i18n

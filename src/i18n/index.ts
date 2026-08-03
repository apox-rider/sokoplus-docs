import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enCommon from './locales/en/common.json'
import enNav from './locales/en/nav.json'
import enLanding from './locales/en/landing.json'
import enHelp from './locales/en/help.json'
import enDevelopers from './locales/en/developers.json'
import enFooter from './locales/en/footer.json'
import enAuth from './locales/en/auth.json'
import swCommon from './locales/sw/common.json'
import swNav from './locales/sw/nav.json'
import swLanding from './locales/sw/landing.json'
import swHelp from './locales/sw/help.json'
import swDevelopers from './locales/sw/developers.json'
import swFooter from './locales/sw/footer.json'
import swAuth from './locales/sw/auth.json'

export const SUPPORTED_LANGS = ['en', 'sw'] as const
export type Lang = (typeof SUPPORTED_LANGS)[number]
export const DEFAULT_LANG: Lang = 'en'

export function isLang(value: string | undefined): value is Lang {
  return SUPPORTED_LANGS.includes(value as Lang)
}

const resources = {
  en: {
    common: enCommon,
    nav: enNav,
    landing: enLanding,
    help: enHelp,
    developers: enDevelopers,
    footer: enFooter,
    auth: enAuth,
  },
  sw: {
    common: swCommon,
    nav: swNav,
    landing: swLanding,
    help: swHelp,
    developers: swDevelopers,
    footer: swFooter,
    auth: swAuth,
  },
}

export function initI18n(lang: Lang) {
  if (!i18n.isInitialized) {
    void i18n.use(initReactI18next).init({
      resources,
      lng: lang,
      fallbackLng: DEFAULT_LANG,
      defaultNS: 'common',
      ns: ['common', 'nav', 'landing', 'help', 'developers', 'footer', 'auth'],
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    })
  }
  void i18n.changeLanguage(lang)
  return i18n
}

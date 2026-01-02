import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

import { languageArray } from './languages';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    // Only preload essential namespaces for unauthenticated users
    // Other namespaces will be loaded on-demand via HTTP backend
    ns: ['common', 'errors'],
    defaultNS: 'common',
    fallbackLng: 'en',
    supportedLngs: languageArray,
    detection: {
      order: ['cookie', 'htmlTag', 'localStorage', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // Lazy load namespaces that aren't preloaded
    partialBundledLanguages: true,
    // debug: true,
  });

export default i18n;

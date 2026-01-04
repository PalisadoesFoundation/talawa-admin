import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ChainedBackend from 'i18next-chained-backend';
import HttpApi from 'i18next-http-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';

import { languageArray } from './languages';
import loginEn from '../locales/login.en.json';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(ChainedBackend)
  .init({
    ns: ['auth', 'translation', 'errors', 'common'],
    defaultNS: 'auth',
    fallbackLng: 'en',
    supportedLngs: languageArray,
    partialBundledLanguages: true,
    resources: {
      en: {
        auth: loginEn,
      },
    },
    detection: {
      order: ['cookie', 'htmlTag', 'localStorage', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    backend: {
      backends: [LocalStorageBackend, HttpApi],
      backendOptions: [
        {
          expirationTime: 7 * 24 * 60 * 60 * 1000,
        },
        {
          loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
      ],
    },
    react: {
      useSuspense: true,
    },
    // debug: true,
  });

export default i18n;

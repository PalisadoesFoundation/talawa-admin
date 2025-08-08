import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

import { languageArray } from './languages';
import translationEnglish from '../../public/locales/en/translation.json';
import translationCommonEnglish from '../../public/locales/en/common.json';
import translationErrorEnglish from '../../public/locales/en/errors.json';

i18n
  .use(LanguageDetector)
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    ns: ['translation', 'errors', 'common'],
    defaultNS: 'translation',
    fallbackLng: 'en',
    supportedLngs: languageArray,
    detection: {
      order: ['cookie', 'htmlTag', 'localStorage', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    resources: {
      en: {
        translation: translationEnglish,
        common: translationCommonEnglish,
        errors: translationErrorEnglish,
      },
    },
    react: { useSuspense: false },
  });

export default i18n;

import React from 'react';
import { useTranslation } from 'react-i18next';

export function MixedFixture() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Translated */}
      <h1>{t('common.title')}</h1>

      {/* Hardcoded */}
      <p>This text is hardcoded</p>

      {/* Translated */}
      <button>{t('common.submit')}</button>

      {/* Hardcoded */}
      <input placeholder="Type here" />
    </div>
  );
}

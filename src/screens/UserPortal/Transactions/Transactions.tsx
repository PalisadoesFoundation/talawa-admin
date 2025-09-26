/**
 * Transactions Component
 *
 * This component allows users to view their transaction history for an organization.
 * It includes features such as transaction filtering, pagination, and detailed transaction information.
 *
 * @component
 * @returns {JSX.Element} The Transactions component.
 *
 * @remarks
 * - Uses `react-bootstrap` for UI components and `react-router-dom` for routing.
 * - Includes localization support using `react-i18next`.
 *
 * @example
 * ```tsx
 * <Transactions />
 * ```
 */

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import { useLocalStorage } from 'utils/useLocalstorage';
import { PluginInjector } from 'plugin';

export default function Transactions(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'transactions' });

  useEffect(() => {
    document.title = t('title');
  }, [t]);

  return (
    <>
      <div className={`d-flex flex-row mt-4`}>
        <div className={`${styles.mainContainer50} me-4`}>
          <PluginInjector injectorType="G1" />
        </div>
      </div>
    </>
  );
}

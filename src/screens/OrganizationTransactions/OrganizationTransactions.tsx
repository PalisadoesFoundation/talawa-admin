/**
 * OrganizationTransactions Component
 *
 * This component allows admins to view and manage transaction history for an organization.
 * It includes features such as transaction filtering, sorting, and detailed transaction information.
 *
 * @component
 * @returns {JSX.Element} The OrganizationTransactions component.
 *
 *
 * @example
 * ```tsx
 * <OrganizationTransactions />
 * ```
 *
 */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import { PluginInjector } from 'plugin';

export default function OrganizationTransactions(): JSX.Element {
  const { t } = useTranslation('translation');
  useEffect(() => {
    document.title = t('transactions.title');
  }, [t]);

  return (
    <>
      <div className={`d-flex flex-row mt-4`}>
        <div className={`${styles.mainContainer50} me-4`}>
          <PluginInjector injectorType="G2" />
        </div>
      </div>
    </>
  );
}

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

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import styles from 'style/app-fixed.module.css';
import useLocalStorage from 'utils/useLocalstorage';
import { PluginInjector } from 'plugin';

export default function Transactions(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'transactions' });

  document.title = t('title');

  const { getItem } = useLocalStorage();
  const userId = getItem('userId');
  const { orgId: organizationId } = useParams();
  const [organizationDetails, setOrganizationDetails] = useState<{
    name: string;
  }>({ name: '' });

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

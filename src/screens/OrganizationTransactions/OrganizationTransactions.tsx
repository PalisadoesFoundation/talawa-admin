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
import { useParams } from 'react-router';
import styles from 'style/app-fixed.module.css';
import { PluginInjector } from 'plugin';
import { BreadcrumbsComponent } from 'shared-components/BreadcrumbsComponent';
import type { IBreadcrumbItem } from 'types/shared-components/BreadcrumbsComponent/interface';

export default function OrganizationTransactions(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'transactions' });
  const { orgId } = useParams();

  // Breadcrumb items for organization -> transactions navigation
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      translationKey: 'organization',
      to: `/orgdash/${orgId}`,
    },
    {
      translationKey: 'Transactions',
      isCurrent: true,
    },
  ];

  useEffect(() => {
    document.title = t('title');
  }, [t]);

  return (
    <>
      <BreadcrumbsComponent items={breadcrumbItems} />
      <div className={`d-flex flex-row mt-4`}>
        <div className={`${styles.mainContainer50} me-4`}>
          <PluginInjector injectorType="G2" />
        </div>
      </div>
    </>
  );
}

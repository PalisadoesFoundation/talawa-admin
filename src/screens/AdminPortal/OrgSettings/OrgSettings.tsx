/**
 * OrgSettings Component
 *
 * This component renders the organization settings page, allowing users to
 * navigate between different settings tabs such as General Settings,
 * Action Item Categories, and Agenda Item Categories. It dynamically updates
 * the content based on the selected tab and ensures the organization ID is
 * present in the URL parameters.
 *
 * @returns The rendered organization settings page.
 *
 * @remarks
 * - The component uses `useTranslation` from `react-i18next` for internationalization.
 * - The `useParams` hook from `react-router-dom` is used to extract the `orgId` from the URL.
 * - If `orgId` is not present, the user is redirected to the home page (`/`).
 * - The document title is dynamically updated based on the translation key `orgSettings.title`.
 *
 * @example
 * ```tsx
 * <OrgSettings />
 * ```
 *
 * @see {@link GeneralSettings} for the General Settings tab content.
 * @see {@link OrgActionItemCategories} for the Action Item Categories tab content.
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './OrgSettings.module.css';
import OrgActionItemCategories from 'components/AdminPortal/OrgSettings/ActionItemCategories/OrgActionItemCategories';
import { Navigate, useParams } from 'react-router';
import GeneralSettings from 'components/AdminPortal/OrgSettings/General/GeneralSettings';
import Button from 'shared-components/Button';

type SettingType = 'general' | 'actionItemCategories';

const settingtabs: SettingType[] = ['general', 'actionItemCategories'];

function OrgSettings(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'orgSettings' });

  const [tab, setTab] = useState<SettingType>('general');

  document.title = t('title');

  const { orgId } = useParams();

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">{t('title')}</h1>
          <p className="page-subtitle">
            {t('manageOrgPreferences')}
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary">{t('saveChanges')}</button>
        </div>
      </div>

      <div className="tabs" role="tablist">
        {settingtabs.map((setting, index) => (
          <button
            key={index}
            className={`tab ${tab === setting ? 'active' : ''}`}
            role="tab"
            aria-selected={tab === setting}
            onClick={() => setTab(setting)}
            data-testid={`${setting}Settings`}
          >
            {t(setting)}
          </button>
        ))}
      </div>

      <div className="tw-card" style={{ padding: '24px', marginBottom: '24px' }}>
        {(() => {
          switch (tab) {
            case 'general':
              return (
                <div data-testid="generalTab">
                  <GeneralSettings orgId={orgId} />
                </div>
              );
            case 'actionItemCategories':
              return (
                <div data-testid="actionItemCategoriesTab">
                  <OrgActionItemCategories orgId={orgId} />
                </div>
              );
          }
        })()}
      </div>

      <div className="danger-zone">
        <div className="danger-zone-title">{t('dangerZone')}</div>
        <div className="danger-zone-desc">{t('dangerZoneDesc')}</div>
        <button className="btn btn-danger">{t('deleteOrg')}</button>
      </div>
    </>
  );
}

export default OrgSettings;

/**
 * OrgSettings — Organization settings page with tabbed navigation.
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import OrgActionItemCategories from 'components/AdminPortal/OrgSettings/ActionItemCategories/OrgActionItemCategories';
import { Navigate, useParams } from 'react-router';
import GeneralSettings from 'components/AdminPortal/OrgSettings/General/GeneralSettings';

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
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">{t('title')}</h1>
          <p className="page-subtitle">{t('manageOrgPreferences')}</p>
        </div>
      </div>

      <div className="tabs" role="tablist">
        {settingtabs.map((setting) => (
          <button
            key={setting}
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

      <div style={{ marginTop: 4 }}>
        {tab === 'general' && (
          <div data-testid="generalTab">
            <GeneralSettings orgId={orgId} />
          </div>
        )}
        {tab === 'actionItemCategories' && (
          <div data-testid="actionItemCategoriesTab">
            <OrgActionItemCategories orgId={orgId} />
          </div>
        )}
      </div>
    </div>
  );
}

export default OrgSettings;

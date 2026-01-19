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
 * @see {@link OrganizationAgendaCategory} for the Agenda Item Categories tab content.
 */
import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styles from './OrgSettings.module.css';
import OrgActionItemCategories from 'components/AdminPortal/OrgSettings/ActionItemCategories/OrgActionItemCategories';
import OrganizationAgendaCategory from 'components/AdminPortal/OrgSettings/AgendaItemCategories/OrganizationAgendaCategory';
import { Navigate, useParams } from 'react-router';
import GeneralSettings from 'components/AdminPortal/OrgSettings/General/GeneralSettings';
import Button from 'shared-components/Button';

type SettingType = 'general' | 'actionItemCategories' | 'agendaItemCategories';

const settingtabs: SettingType[] = [
  'general',
  'actionItemCategories',
  'agendaItemCategories',
];

function OrgSettings(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'orgSettings' });

  const [tab, setTab] = useState<SettingType>('general');

  document.title = t('title');

  const { orgId } = useParams();

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <div className="d-flex flex-column">
      <Row className="mx-1 mt-3">
        <Col>
          <div className={styles.settingsTabs}>
            {settingtabs.map((setting, index) => (
              <Button
                key={index}
                className={`${styles.headerBtn} ${tab === setting ? styles.activeTabBtn : ''}`}
                onClick={() => setTab(setting)}
                data-testid={`${setting}Settings`}
              >
                {t(setting)}
              </Button>
            ))}
          </div>
        </Col>
      </Row>

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
          case 'agendaItemCategories':
            return (
              <div data-testid="agendaItemCategoriesTab">
                <OrganizationAgendaCategory orgId={orgId} />
              </div>
            );
        }
      })()}
    </div>
  );
}

export default OrgSettings;

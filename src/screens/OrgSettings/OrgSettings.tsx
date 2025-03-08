import React, { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styles from '../../style/app-fixed.module.css';
import OrgActionItemCategories from 'components/OrgSettings/ActionItemCategories/OrgActionItemCategories';
import OrganizationAgendaCategory from 'components/OrgSettings/AgendaItemCategories/OrganizationAgendaCategory';
import { Navigate, useParams } from 'react-router-dom';
import GeneralSettings from 'components/OrgSettings/General/GeneralSettings';

type SettingType = 'general' | 'actionItemCategories' | 'agendaItemCategories';

const settingtabs: SettingType[] = [
  'general',
  'actionItemCategories',
  'agendaItemCategories',
];

/**
 * The `orgSettings` component provides a user interface for managing various settings related to an organization.
 * It includes options for updating organization details, deleting the organization, changing language preferences,
 * and managing custom fields and action item categories.
 *
 * The component renders different settings sections based on the user's selection from the tabs or dropdown menu.
 *
 * @returns The rendered component displaying the organization settings.
 */

function OrgSettings(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgSettings',
  });

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

import React, { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styles from 'style/app.module.css';
import OrgActionItemCategories from 'components/OrgSettings/ActionItemCategories/OrgActionItemCategories';
import OrganizationAgendaCategory from 'components/OrgSettings/AgendaItemCategories/OrganizationAgendaCategory';
import { Navigate, useParams } from 'react-router-dom';
import GeneralSettings from 'components/OrgSettings/General/GeneralSettings';

// Type representing the different settings categories available
type SettingType = 'general' | 'actionItemCategories' | 'agendaItemCategories';

// List of available settings categories
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
  // Translation hook for internationalization
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgSettings',
  });

  const [tab, setTab] = useState<SettingType>('general');

  // Set the document title using the translated title for this page
  document.title = t('title');

  // Get the organization ID from the URL parameters
  const { orgId } = useParams();

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <div className="d-flex flex-column">
      <Row className="mx-3 mt-3">
        <Col>
          <div className={styles.settingsTabs}>
            {/* Render buttons for each settings category */}
            {settingtabs.map((setting, index) => (
              <Button
                key={index}
                className={`me-3 border rounded-3 ${styles.headerBtn}`}
                variant={tab === setting ? `success` : `none`}
                onClick={() => setTab(setting)}
                data-testid={`${setting}Settings`}
              >
                {t(setting)}
              </Button>
            ))}
          </div>
        </Col>

        <Row className="mt-3">
          <hr />
        </Row>
      </Row>

      {/* Render content based on the selected settings category */}
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

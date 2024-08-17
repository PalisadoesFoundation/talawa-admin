import React, { useState } from 'react';
import { Button, Dropdown, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import styles from './OrgSettings.module.css';
import OrgActionItemCategories from 'components/OrgSettings/OrgActionItemCategories/OrgActionItemCategories';
import { Navigate, useParams } from 'react-router-dom';
import GeneralSettings from 'components/OrgSettings/General/GeneralSettings';

// Type representing the different settings categories available
type SettingType = 'general' | 'actionItemCategories';

/**
 * The `orgSettings` component provides a user interface for managing various settings related to an organization.
 * It includes options for updating organization details, deleting the organization, changing language preferences,
 * and managing custom fields and action item categories.
 *
 * The component renders different settings sections based on the user's selection from the tabs or dropdown menu.
 *
 * @returns The rendered component displaying the organization settings.
 */
function orgSettings(): JSX.Element {
  // Translation hook for internationalization
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgSettings',
  });

  // List of available settings categories
  const orgSettings: SettingType[] = ['general', 'actionItemCategories'];

  // State to manage the currently selected settings category
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
            {orgSettings.map((setting, index) => (
              <Button
                key={index}
                className="me-3 border rounded-3"
                variant={tab === setting ? `success` : `none`}
                onClick={() => setTab(setting)}
                data-testid={`${setting}Settings`}
              >
                {t(setting)}
              </Button>
            ))}
          </div>

          {/* Dropdown menu for selecting settings category */}
          <Dropdown
            className={styles.settingsDropdown}
            data-testid="settingsDropdownContainer"
            drop="down"
          >
            <Dropdown.Toggle
              variant="success"
              id="dropdown-basic"
              data-testid="settingsDropdownToggle"
            >
              <span className="me-1">{t(tab)}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {/* Render dropdown items for each settings category */}
              {orgSettings.map((setting, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={
                    /* istanbul ignore next */
                    () => setTab(setting)
                  }
                  className={tab === setting ? 'text-secondary' : ''}
                >
                  {t(setting)}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Row className="mt-3">
          <hr />
        </Row>
      </Row>

      {/* Render content based on the selected settings category */}
      {(() => {
        switch (tab) {
          case 'general':
            return <GeneralSettings orgId={orgId} />;
          case 'actionItemCategories':
            return (
              <Row
                className={`${styles.actionItemStyles} mt-3 mb-3 mx-4 position-relative shadow-sm rounded-4`}
              >
                <div className={`${styles.cardHeader} border rounded-top-4`}>
                  <div className={`${styles.cardTitle} pt-1 pb-2`}>
                    {t('actionItemCategories')}
                  </div>
                </div>
                <div className="bg-light-subtle border border-top-0 rounded-bottom-4">
                  {/* Render action item categories component */}
                  <OrgActionItemCategories />
                </div>
              </Row>
            );
        }
      })()}
    </div>
  );
}

export default orgSettings;

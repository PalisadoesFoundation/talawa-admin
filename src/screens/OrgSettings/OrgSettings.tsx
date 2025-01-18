import React, { useState } from 'react';
import { Button, Dropdown, Row, Col } from 'react-bootstrap';
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
  const [animationClass, setAnimationClass] = useState<string>('fade-in'); // Default to 'fade-in'

  // Set the document title using the translated title for this page
  document.title = t('title');

  // Get the organization ID from the URL parameters
  const { orgId } = useParams();

  if (!orgId) {
    return <Navigate to={'/'} replace />;
  }

  const handleTabSwitch = (newTab: SettingType): void => {
    // Trigger the exit animation first
    setAnimationClass('fade-out');
    setTimeout(() => {
      setTab(newTab);
      setAnimationClass('fade-in');
    }, 300);
  };

  const settingsTabsBg = getComputedStyle(
    document.documentElement,
  ).getPropertyValue('--setting-tabs-bg');

  return (
    <div className="d-flex flex-column">
      <Row className="mx-3 mt-3">
        <Col
          className="pt-2 pb-3"
          style={{ backgroundColor: 'white', borderRadius: '15px' }}
        >
          <div
            className={`pt-3 ${styles.settingsTabs}`}
            style={{ borderTop: `1px solid ${settingsTabsBg.trim()}` }}
          >
            {/* Render buttons for each settings category */}
            {settingtabs.map((setting, index) => (
              <Button
                key={index}
                className={`me-3 border rounded-3 ${styles.orgSettingHeaderBtn} ${
                  tab === setting ? styles.activeTab : ''
                }`}
                variant={tab === setting ? `success` : `none`}
                // onClick={() => setTab(setting)}
                onClick={() => handleTabSwitch(setting)}
                data-testid={`${setting}Settings`}
                autoFocus={index === 0}
              >
                {t(setting)}
              </Button>
            ))}
          </div>

          {/* Dropdown menu for selecting settings category */}
        </Col>
        <Dropdown
          className={`mt-0 ${styles.settingsDropdown}`}
          data-testid="settingsDropdownContainer"
          drop="down"
          style={{ display: 'none' }} // Hide the dropdown initially to prevent flickering
        >
          <Dropdown.Toggle
            variant="success"
            id="dropdown-basic"
            data-testid="settingsDropdownToggle"
          >
            <span className="me-0">{t(tab)}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {settingtabs.map((setting, index) => (
              <Dropdown.Item
                key={index}
                role="menuitem"
                onClick={() => handleTabSwitch(setting)}
                className={tab === setting ? 'text-secondary' : ''}
              >
                {t(setting)}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Row>

      {/* Render content based on the selected settings category */}
      <div className={`mt-3 ${styles.pageContentWrapper} ${animationClass}`}>
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
    </div>
  );
}

export default OrgSettings;

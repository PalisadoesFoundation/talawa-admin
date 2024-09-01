import React, { useState } from 'react';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';
import DeleteOrg from 'components/DeleteOrg/DeleteOrg';
import OrgUpdate from 'components/OrgUpdate/OrgUpdate';
import { Button, Card, Dropdown, Form } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import styles from './OrgSettings.module.css';
import OrgProfileFieldSettings from 'components/OrgProfileFieldSettings/OrgProfileFieldSettings';
import OrgActionItemCategories from 'components/OrgActionItemCategories/OrgActionItemCategories';
import { useParams } from 'react-router-dom';

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
  const [orgSetting, setOrgSetting] = useState<SettingType>('general');

  // Set the document title using the translated title for this page
  document.title = t('title');

  // Get the organization ID from the URL parameters
  const { orgId } = useParams();

  return (
    <>
      <div
        className={`${styles.settingsContainer} mt-4 bg-white rounded-4 mb-3`}
      >
        <Row className="mx-3 mt-4">
          <Col>
            <div className={styles.settingsTabs}>
              {/* Render buttons for each settings category */}
              {orgSettings.map((setting, index) => (
                <Button
                  key={index}
                  className="me-3 border rounded-3"
                  variant={orgSetting === setting ? `success` : `none`}
                  onClick={() => setOrgSetting(setting)}
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
                <span className="me-1">{t(orgSetting)}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {/* Render dropdown items for each settings category */}
                {orgSettings.map((setting, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={
                      /* istanbul ignore next */
                      () => setOrgSetting(setting)
                    }
                    className={orgSetting === setting ? 'text-secondary' : ''}
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
        {orgSetting === 'general' && (
          <Row className={`${styles.settingsBody} mt-3`}>
            <Col lg={7}>
              <Card className="rounded-4 mb-4 mx-auto shadow-sm border border-light-subtle">
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>
                    {t('updateOrganization')}
                  </div>
                </div>
                <Card.Body className={styles.cardBody}>
                  {/* Render organization update component if orgId is available */}
                  {orgId && <OrgUpdate orgId={orgId} />}
                </Card.Body>
              </Card>
            </Col>
            <Col lg={5}>
              <DeleteOrg />
              <Card className="rounded-4 mb-4 mx-auto shadow-sm border border-light-subtle">
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>{t('otherSettings')}</div>
                </div>
                <Card.Body className={styles.cardBody}>
                  <div className={styles.textBox}>
                    <Form.Label className={'text-secondary fw-bold'}>
                      {t('changeLanguage')}
                    </Form.Label>
                    {/* Render language change dropdown component */}
                    <ChangeLanguageDropDown />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={7}>
              <Card className="rounded-4 mb-4 mx-auto shadow-sm border border-light-subtle">
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>
                    {t('manageCustomFields')}
                  </div>
                </div>
                <Card.Body className={styles.cardBody}>
                  {/* Render organization profile field settings component if orgId is available */}
                  {orgId && <OrgProfileFieldSettings />}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {orgSetting === 'actionItemCategories' && (
          <Row
            className={`${styles.actionItemStyles} mt-3 mb-3 mx-4 position-relative shadow-sm rounded-4`}
          >
            <div className={`${styles.cardHeader} border rounded-top-4`}>
              <div className={`${styles.cardTitle} pt-1 pb-2`}>
                {t('actionItemCategories')}
              </div>
            </div>
            <div className="bg-light-subtle border border-top-0 rounded-bottom-4">
              {/* Render action item categories component if orgId is available */}
              {orgId && <OrgActionItemCategories />}
            </div>
          </Row>
        )}
      </div>
    </>
  );
}

export default orgSettings;

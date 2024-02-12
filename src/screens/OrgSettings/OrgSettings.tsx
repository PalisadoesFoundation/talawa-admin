import React, { useState } from 'react';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';
import DeleteOrg from 'components/DeleteOrg/DeleteOrg';
import OrgUpdate from 'components/OrgUpdate/OrgUpdate';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import { Button, Card, Dropdown, Form } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import styles from './OrgSettings.module.css';
import OrgProfileFieldSettings from 'components/OrgProfileFieldSettings/OrgProfileFieldSettings';
import OrgActionItemCategories from 'components/OrgActionItemCategories/OrgActionItemCategories';

type SettingType = 'general' | 'actionItemCategories';

function orgSettings(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgSettings',
  });

  const orgSettings: SettingType[] = ['general', 'actionItemCategories'];

  const [orgSetting, setOrgSetting] = useState<SettingType>('general');

  document.title = t('title');
  const orgId = window.location.href.split('=')[1];

  return (
    <>
      <OrganizationScreen screenName="Settings" title={t('pageName')}>
        <div
          className={`${styles.settingsContainer} mt-4 bg-white rounded-4 mb-3`}
        >
          <Row className="mx-3 mt-4">
            <Col>
              <div className={styles.settingsTabs}>
                {orgSettings.map((setting, index) => (
                  <Button
                    key={index}
                    className="me-3 border rounded-3"
                    variant={
                      orgSetting === setting ? `success` : `outline-secondary`
                    }
                    onClick={() => setOrgSetting(setting)}
                    data-testid={`${setting}Settings`}
                  >
                    {t(setting)}
                  </Button>
                ))}
              </div>

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
                {orgId && <OrgActionItemCategories />}
              </div>
            </Row>
          )}
        </div>
      </OrganizationScreen>
    </>
  );
}

export default orgSettings;

import React, { useState } from 'react';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';
import DeleteOrg from 'components/DeleteOrg/DeleteOrg';
import OrgUpdate from 'components/OrgUpdate/OrgUpdate';
import OrganizationScreen from 'components/OrganizationScreen/OrganizationScreen';
import { Button, Card, Form } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import styles from './OrgSettings.module.css';
import OrgProfileFieldSettings from 'components/OrgProfileFieldSettings/OrgProfileFieldSettings';
import OrgActionItemCategories from 'components/OrgActionItemCategories/OrgActionItemCategories';

type SettingType = 'General' | 'ActionItemCategories';

function orgSettings(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgSettings',
  });

  const [setting, setSetting] = useState<SettingType>('General');

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
              <Button
                className="me-3 border rounded-3"
                variant={
                  setting === 'General' ? `success` : `outline-secondary`
                }
                onClick={() => setSetting('General')}
              >
                {t('generalSettings')}
              </Button>
              <Button
                className="border rounded-3"
                variant={
                  setting === 'ActionItemCategories'
                    ? `success`
                    : `outline-secondary`
                }
                onClick={() => setSetting('ActionItemCategories')}
              >
                {t('actionItemCategorySettings')}
              </Button>
            </Col>

            <Row className="mt-3">
              <hr />
            </Row>
          </Row>

          {setting === 'General' && (
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

          {setting === 'ActionItemCategories' && (
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

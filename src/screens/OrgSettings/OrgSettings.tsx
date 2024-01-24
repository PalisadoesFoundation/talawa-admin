import React from 'react';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';
import DeleteOrg from 'components/DeleteOrg/DeleteOrg';
import OrgUpdate from 'components/OrgUpdate/OrgUpdate';
import { Card, Form } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import styles from './OrgSettings.module.css';
import OrgProfileFieldSettings from 'components/OrgProfileFieldSettings/OrgProfileFieldSettings';
import { useParams } from 'react-router-dom';

function orgSettings(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgSettings',
  });

  document.title = t('title');
  const { orgId } = useParams();

  return (
    <>
      <Row className={styles.settingsBody}>
        <Col lg={7}>
          <Card border="0" className="rounded-4 mb-4">
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>{t('updateOrganization')}</div>
            </div>
            <Card.Body className={styles.cardBody}>
              {orgId && <OrgUpdate orgId={orgId} />}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5}>
          <DeleteOrg />
          <Card border="0" className="rounded-4 mb-4">
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
          <Card border="0" className="rounded-4 mb-4">
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>{t('manageCustomFields')}</div>
            </div>
            <Card.Body className={styles.cardBody}>
              {orgId && <OrgProfileFieldSettings />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default orgSettings;

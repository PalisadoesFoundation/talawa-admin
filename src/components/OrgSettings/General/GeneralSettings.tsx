import React, { type FC } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import DeleteOrg from './DeleteOrg/DeleteOrg';
import OrgUpdate from './OrgUpdate/OrgUpdate';
import { useTranslation } from 'react-i18next';
import ChangeLanguageDropDown from 'components/ChangeLanguageDropdown/ChangeLanguageDropDown';

/**
 * Props for the `GeneralSettings` component.
 */
interface InterfaceGeneralSettingsProps {
  orgId: string;
}

/**
 * A component for displaying general settings for an organization.
 *
 * @param props - The properties passed to the component.
 * @returns The `GeneralSettings` component.
 */

const GeneralSettings: FC<InterfaceGeneralSettingsProps> = ({ orgId }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'orgSettings' });

  return (
    <Row className={`${styles.settingsBody} mt-3`}>
      <Col xxl={7} xl={12} className="mb-4">
        <Card
          className={`rounded-4 mb-4 shadow-sm border border-light-subtle ${styles.mainCard}`}
        >
          <Card.Header className={styles.deleteCardHeader}>
            <h5 className={`mb-0 fw-semibold ${styles.cardHeading} `}>
              {t('editOrganization')}
            </h5>
          </Card.Header>
          <Card.Body className={styles.cardBody}>
            <div className={styles.orgCardSettings}>
              <OrgUpdate orgId={orgId} />
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col xxl={5} xl={12} className="d-flex flex-column gap-4">
        <DeleteOrg />
        <Card className="rounded-4 shadow-sm border border-light-subtle ">
          <Card.Header className={styles.deleteCardHeader}>
            <div className={styles.cardTitle}>
              <h5 className={`mb-0 fw-semibold ${styles.cardHeading} `}>
                {t('otherSettings')}
              </h5>
            </div>
          </Card.Header>
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
    </Row>
  );
};

export default GeneralSettings;

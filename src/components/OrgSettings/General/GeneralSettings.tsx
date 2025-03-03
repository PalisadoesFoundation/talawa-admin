import React, { type FC } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import styles from '../../../style/app-fixed.module.css';
import DeleteOrg from './DeleteOrg/DeleteOrg';
import OrgUpdate from './OrgUpdate/OrgUpdate';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgSettings',
  });

  return (
    <Row className={`${styles.settingsBody} mt-3`}>
      <Col lg={7}>
        <Card className="rounded-4 mb-4 mx-auto shadow-sm border border-light-subtle">
          <Card.Header
            className={`py-3 `}
            style={{ backgroundColor: '#eaebef' }}
          >
            <h5 className="mb-0 fw-semibold">{t('Edit Organization')}</h5>
          </Card.Header>
          <Card.Body className={styles.cardBody}>
            <OrgUpdate orgId={orgId} />
          </Card.Body>
        </Card>
      </Col>
      <Col lg={5}>
        <DeleteOrg />
      </Col>
    </Row>
  );
};

export default GeneralSettings;

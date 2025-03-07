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
      <Col xxl={7} xl={12} className="mb-4">
        <Card
          className={`rounded-4 mb-4 shadow-sm border border-light-subtle `}
        >
          <Card.Header className={styles.deleteCardHeader}>
            <h5 className="mb-0 fw-semibold">{t('Edit Organization')}</h5>
          </Card.Header>
          <Card.Body className={styles.cardBody}>
            <OrgUpdate orgId={orgId} />
          </Card.Body>
        </Card>
      </Col>
      <Col xxl={5} xl={12}>
        <DeleteOrg />
      </Col>
    </Row>
  );
};

export default GeneralSettings;

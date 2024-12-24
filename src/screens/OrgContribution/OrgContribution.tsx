import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import ContriStats from 'components/ContriStats/ContriStats';
import OrgContriCards from 'components/OrgContriCards/OrgContriCards';
import { Form } from 'react-bootstrap';
import styles from '../../style/app.module.css';

/**
 * The `orgContribution` component displays the contributions to an organization.
 * It includes a sidebar for filtering contributions by organization name and transaction ID.
 * Additionally, it shows recent contribution statistics and a list of contribution cards.
 *
 */
function OrgContribution(): JSX.Element {
  // Hook to get translation functions and translation text
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgContribution',
  });

  // Set the document title based on the translated title for this page
  document.title = t('title');

  return (
    <>
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              {/* Input for filtering by organization name */}
              <h6 className={styles.searchtitle}>{t('filterByName')}</h6>
              <Form.Control
                type="name"
                id="orgname"
                placeholder={t('orgname')}
                autoComplete="off"
                required
              />

              {/* Input for filtering by transaction ID */}
              <h6 className={styles.searchtitle}>{t('filterByTransId')}</h6>
              <Form.Control
                type="transaction"
                id="searchtransaction"
                placeholder={t('searchtransaction')}
                autoComplete="off"
                required
              />

              {/* Section displaying recent contribution statistics */}
              <h6 className={styles.searchtitle}>{t('recentStats')}</h6>
              <ContriStats
                key="129"
                id="21"
                recentAmount="90"
                highestAmount="500"
                totalAmount="6000"
              />
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <p className={styles.logintitle}>{t('contribution')}</p>
            </Row>
            {/* Section displaying a list of contribution cards */}
            <OrgContriCards
              key="129"
              id="21"
              userName="John Doe"
              contriDate="20/7/2021"
              contriAmount="21"
              contriTransactionId="21WE98YU"
              userEmail="johndoexyz@gmail.com"
            />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default OrgContribution;

import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import styles from './OrgContribution.module.css';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import OrgContriCards from 'components/OrgContriCards/OrgContriCards';
import ContriStats from 'components/ContriStats/ContriStats';
import { RootState } from 'state/reducers';

function OrgContribution(): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'orgContribution',
  });

  document.title = t('title');

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  return (
    <>
      <AdminNavbar targets={targets} url_1={configUrl} />
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h6 className={styles.searchtitle}>{t('filterByName')}</h6>
              <input
                type="name"
                id="orgname"
                placeholder={t('orgname')}
                autoComplete="off"
                required
              />

              <h6 className={styles.searchtitle}>{t('filterByTransId')}</h6>
              <input
                type="transaction"
                id="searchtransaction"
                placeholder={t('searchtransaction')}
                autoComplete="off"
                required
              />

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

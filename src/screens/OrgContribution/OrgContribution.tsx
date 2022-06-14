import React from 'react';
import styles from './OrgContribution.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import OrgContriCards from 'components/OrgContriCards/OrgContriCards';
import ContriStats from 'components/ContriStats/ContriStats';
import { useSelector } from 'react-redux';
import { RootState } from 'state/reducers';
function OrgContribution(): JSX.Element {
  document.title = 'Talawa Contributions';

  const appRoutes = useSelector((state: RootState) => state.appRoutes);
  const { targets, configUrl } = appRoutes;

  return (
    <>
      <AdminNavbar targets={targets} url_1={configUrl} />
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h6 className={styles.searchtitle}>Filter by Name</h6>
              <input
                type="name"
                id="orgname"
                placeholder="Enter Name"
                autoComplete="off"
                required
              />

              <h6 className={styles.searchtitle}>Filter by Trans. ID</h6>
              <input
                type="transaction"
                id="searchtransaction"
                placeholder="Enter Transaction ID"
                autoComplete="off"
                required
              />

              <h6 className={styles.searchtitle}>Recent Stats</h6>
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
              <p className={styles.logintitle}>Contribution</p>
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

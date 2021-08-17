import React from 'react';
import styles from './OrgContribution.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import OrgContriCards from 'components/OrgContriCards/OrgContriCards';
import ContriStats from 'components/ContriStats/ContriStats';
function OrgContribution(): JSX.Element {
  const currentUrl = window.location.href.split('=')[1];
  const url = '/orgdash/id=' + currentUrl;
  const url_2 = '/orgpeople/id=' + currentUrl;
  const url_3 = '/orgevents/id=' + currentUrl;
  const url_4 = '/orgcontribution';
  const url_5 = '/orgpost/id=' + currentUrl;
  return (
    <>
      <AdminNavbar
        targets={[
          { name: 'Dashboard', url: url },
          { name: 'People', url: url_2 },
          { name: 'Events', url: url_3 },
          { name: 'Contributions', url: url_4 },
          { name: 'Posts', url: url_5 },
        ]}
      />
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

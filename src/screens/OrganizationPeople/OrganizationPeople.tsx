import React from 'react';
import styles from './OrganizationPeople.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import OrgPeopleListCard from 'components/OrgPeopleListCard/OrgPeopleListCard';

function OrganizationPeople(): JSX.Element {
  return (
    <>
      <AdminNavbar
        targets={[
          { name: 'Dashboard', url: '/orgdashboard' },
          { name: 'People', url: '/supermember' },
          { name: 'Organisation', url: '/superorg' },
          { name: 'LogOut', url: '/' },
        ]}
      />
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h6 className={styles.searchtitle}>Filter by Name</h6>
              <input
                type="name"
                id="searchname"
                placeholder="Enter Name"
                autoComplete="off"
                required
              />

              <h6 className={styles.searchtitle}>Filter by Location</h6>
              <input
                type="name"
                id="searchlocation"
                placeholder="Enter Location"
                autoComplete="off"
                required
              />
              <h6 className={styles.searchtitle}>Filter by Event</h6>
              <input
                type="name"
                id="searchevent"
                placeholder="Enter Event"
                autoComplete="off"
                required
              />
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <p className={styles.logintitle}>Members</p>
              <div className={styles.addbtnmain}>
                <button className={styles.addbtn}>Add Admin</button>
                <button className={styles.addbtn}>Add Member</button>
              </div>
            </Row>
            <OrgPeopleListCard
              key={123}
              memberImage=""
              joinDate="05/06/2020"
              memberName="Saumya Singh"
              memberLocation="Anand, Gujarat"
            />
            <OrgPeopleListCard
              key={124}
              memberImage=""
              joinDate="05/07/2021"
              memberName="Yasharth Dubey"
              memberLocation="Vadodara, Gujarat"
            />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default OrganizationPeople;

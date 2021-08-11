import React from 'react';
import styles from './OrganizationEvents.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useQuery } from '@apollo/client';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import EventListCard from 'components/EventListCard/EventListCard';

function OrganizationEvents(): JSX.Element {
  const currentUrl = window.location.href.split('=')[1];

  const url = '/orgdash/id=' + currentUrl;
  return (
    <>
      <AdminNavbar targets={[{ name: 'Dashboard', url: url }]} />
      <Row>
        <Col sm={3}>
          <div className={styles.sidebar}>
            <div className={styles.sidebarsticky}>
              <h6 className={styles.searchtitle}>Filter by Organization</h6>
              <input
                type="name"
                id="orgname"
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
            </div>
          </div>
        </Col>
        <Col sm={8}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <p className={styles.logintitle}>Members</p>
              <button className={styles.addbtn}>Add Event</button>
            </Row>
            <EventListCard
              key="123"
              id="7"
              eventLocation="India"
              eventName="Dogs Care"
              totalAdmin="10"
              totalMember="30"
              eventImage=""
              regDate="21/2/2021"
              regDays="2 days"
            />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default OrganizationEvents;

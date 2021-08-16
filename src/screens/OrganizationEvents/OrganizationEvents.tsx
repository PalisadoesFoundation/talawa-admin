import React from 'react';
import styles from './OrganizationEvents.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useQuery } from '@apollo/client';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import EventListCard from 'components/EventListCard/EventListCard';
import { ORGANIZATION_EVENT_LIST } from 'GraphQl/Queries/Queries';

function OrganizationEvents(): JSX.Element {
  const currentUrl = window.location.href.split('=')[1];

  const { data, loading } = useQuery(ORGANIZATION_EVENT_LIST, {
    variables: { id: currentUrl },
  });

  if (loading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  console.log(data);

  const url = '/orgdash/id=' + currentUrl;
  const url_2 = '/orgpeople/id=' + currentUrl;
  const url_3 = '/orgpost/id=' + currentUrl;
  const url_4 = '/orgcontribution/id=' + currentUrl;
  const url_5 = '/orglist';

  return (
    <>
      <AdminNavbar
        targets={[
          { name: 'Dashboard', url: url },
          { name: 'People', url: url_2 },
          { name: 'Post', url: url_3 },
          { name: 'Contribution', url: url_4 },
          { name: 'Home', url: url_5 },
        ]}
      />
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
              <p className={styles.logintitle}>Events</p>
              <button className={styles.addbtn}>Add Event</button>
            </Row>
            {data
              ? data.eventsByOrganization.map(
                  (datas: {
                    _id: string;
                    title: string;
                    description: string;
                    startDate: string;
                  }) => {
                    return (
                      <EventListCard
                        key={datas._id}
                        id={datas._id}
                        eventLocation="India"
                        eventName={datas.title}
                        totalAdmin="10"
                        totalMember="30"
                        eventImage=""
                        regDate={datas.startDate}
                        regDays="2 days"
                      />
                    );
                  }
                )
              : null}
          </div>
        </Col>
      </Row>
    </>
  );
}

export default OrganizationEvents;

import React from 'react';
import styles from './OrganizationPeople.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useQuery } from '@apollo/client';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import OrgPeopleListCard from 'components/OrgPeopleListCard/OrgPeopleListCard';

function OrganizationPeople(): JSX.Element {
  const currentUrl = window.location.href.split('=')[1];

  const { data, loading } = useQuery(MEMBERS_LIST, {
    variables: { id: currentUrl },
  });

  if (loading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  const url = '/orgdash/id=' + currentUrl;
  const url_2 = '/orgevents/id=' + currentUrl;
  return (
    <>
      <AdminNavbar
        targets={[
          { name: 'Dashboard', url: url },
          { name: 'Events', url: url_2 },
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
            {data
              ? data.organizations[0].members.map(
                  (datas: {
                    _id: string;
                    lastName: string;
                    firstName: string;
                    image: string;
                  }) => {
                    return (
                      <OrgPeopleListCard
                        key={datas._id}
                        memberImage={datas.image}
                        joinDate="05/07/2021"
                        memberName={datas.firstName + ' ' + datas.lastName}
                        memberLocation="Vadodara, Gujarat"
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

export default OrganizationPeople;

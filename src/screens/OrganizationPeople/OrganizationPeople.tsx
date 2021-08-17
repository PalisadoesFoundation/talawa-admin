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
              <div className={styles.radio_buttons}>
                <input
                  id="memberslist"
                  value="memberslist"
                  name="displaylist"
                  type="radio"
                  checked={true}
                  // onChange={onChangeValue}
                />
                <label>Members</label>
                <input
                  id="adminslist"
                  value="adminslist"
                  name="displaylist"
                  type="radio"
                  // onChange={onChangeValue}
                />
                <label>Admins</label>
              </div>
            </div>
          </div>
        </Col>
        <Col sm={9}>
          <div className={styles.mainpageright}>
            <Row className={styles.justifysp}>
              <p className={styles.logintitle}>Members</p>
              <div className={styles.addbtnmain}>
                <button className={styles.addbtn}>Add User</button>
                {/* <button className={styles.addbtn}>Add Member</button> */}
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

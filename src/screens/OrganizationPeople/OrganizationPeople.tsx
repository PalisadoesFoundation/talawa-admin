import React from 'react';
import styles from './OrganizationPeople.module.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import OrgPeopleListCard from 'components/OrgPeopleListCard/OrgPeopleListCard';
import OrgAdminListCard from 'components/OrgAdminListCard/OrgAdminListCard';
import UserListCard from 'components/UserListCard/UserListCard';
import { useQuery } from '@apollo/client';
import { ADMIN_LIST, MEMBERS_LIST, USER_LIST } from 'GraphQl/Queries/Queries';
function OrganizationPeople(): JSX.Element {
  const currentUrl = window.location.href.split('=')[1];
  let data, loading;

  const [t, setT] = React.useState(0);

  if (t == 0) {
    const { data: data_2, loading: loading_2 } = useQuery(MEMBERS_LIST, {
      variables: { id: currentUrl },
    });
    data = data_2;
    loading = loading_2;
  } else if (t == 1) {
    const { data: data_2, loading: loading_2 } = useQuery(ADMIN_LIST, {
      variables: { id: currentUrl },
    });
    data = data_2;
    loading = loading_2;
  } else if (t == 2) {
    const { data: data_2, loading: loading_2 } = useQuery(USER_LIST);
    data = data_2;
    loading = loading_2;
  }

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
  const url_4 = '/orgcontribution/id=' + currentUrl;
  const url_5 = '/orgpost/id=' + currentUrl;
  const url_6 = '/orgsetting/id=' + currentUrl;

  return (
    <>
      <div>
        <AdminNavbar
          targets={[
            { name: 'Dashboard', url: url },
            { name: 'People', url: url_2 },
            { name: 'Events', url: url_3 },
            { name: 'Contributions', url: url_4 },
            { name: 'Posts', url: url_5 },
          ]}
          url_1={url_6}
        />
      </div>
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
                  checked={t == 0 ? true : false}
                  onClick={() => {
                    setT(0);
                  }}
                />
                <label>Members</label>
                <input
                  id="adminslist"
                  value="adminslist"
                  name="displaylist"
                  type="radio"
                  checked={t == 1 ? true : false}
                  onClick={() => {
                    setT(1);
                  }}
                />
                <label>Admins</label>
                <input
                  id="adminslist"
                  value="adminslist"
                  name="displaylist"
                  type="radio"
                  checked={t == 2 ? true : false}
                  onClick={() => {
                    setT(2);
                  }}
                />
                <label>User</label>
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
              </div>
            </Row>
            {t == 0
              ? data
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
                          id={datas._id}
                          memberImage={datas.image}
                          joinDate="05/07/2021"
                          memberName={datas.firstName + ' ' + datas.lastName}
                          memberLocation="Vadodara, Gujarat"
                        />
                      );
                    }
                  )
                : null
              : t == 1
              ? data
                ? data.organizations[0].admins.map(
                    (datas: {
                      _id: string;
                      lastName: string;
                      firstName: string;
                      image: string;
                    }) => {
                      return (
                        <OrgAdminListCard
                          key={datas._id}
                          id={datas._id}
                          memberImage={datas.image}
                          joinDate="05/07/2021"
                          memberName={datas.firstName + ' ' + datas.lastName}
                          memberLocation="Vadodara, Gujarat"
                        />
                      );
                    }
                  )
                : null
              : t == 2
              ? data
                ? data.users.map(
                    (datas: {
                      _id: string;
                      lastName: string;
                      firstName: string;
                      image: string;
                    }) => {
                      return (
                        <UserListCard
                          key={datas._id}
                          id={datas._id}
                          memberImage={datas.image}
                          joinDate="05/07/2021"
                          memberName={datas.firstName + ' ' + datas.lastName}
                          memberLocation="Vadodara, Gujarat"
                        />
                      );
                    }
                  )
                : null
              : null}
          </div>
        </Col>
      </Row>
    </>
  );
}

export default OrganizationPeople;

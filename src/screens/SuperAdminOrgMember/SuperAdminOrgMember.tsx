import React from 'react';
import styles from './SuperAdminOrgMember.module.css';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import { useQuery } from '@apollo/client';
import UserCard from 'components/UserCard/UserCard';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';

function SuperAdminOrgMemberPage(): JSX.Element {
  const a = window.location.href.split('=')[1];

  const b = '/superorghome/id=' + a;

  const { data, loading } = useQuery(MEMBERS_LIST, {
    variables: { id: a },
  });

  if (loading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar
        targets={[
          { name: 'Home', url: '/superdash' },
          { name: 'People', url: '/supermember' },
          { name: 'Organisation', url: '/superorg' },
          { name: 'LogOut', url: '/' },
          { name: 'Back', url: b },
        ]}
      />
      <div className={styles.first_box}>
        <div className={styles.inside_box}>
          <h5>List of People</h5>
          <form>
            <input
              type="text"
              placeholder="Search"
              name="search"
              className={styles.deco}
            />
          </form>
        </div>
        <hr></hr>
        <div className={styles.list_box}>
          {data
            ? data.organizations[0].members.map(
                (datas: {
                  _id: string;
                  lastName: string;
                  firstName: string;
                  image: string;
                }) => {
                  return (
                    <UserCard
                      key={datas._id}
                      image={datas.image}
                      lastName={datas.lastName}
                      firstName={datas.firstName}
                    />
                  );
                }
              )
            : null}
        </div>
      </div>
    </>
  );
}

export default SuperAdminOrgMemberPage;

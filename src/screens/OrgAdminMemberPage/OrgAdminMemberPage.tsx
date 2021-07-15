import React from 'react';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import styles from './OrgAdminMemberPage.module.css';
import UserCard from 'components/UserCard/UserCard';
import { useQuery } from '@apollo/client';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';

function OrgAdminMemberPage(): JSX.Element {
  const a = window.location.href.split('=')[1];

  const b = '/orghome/id=' + a;

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
          { name: 'Home', url: '/orghome' },
          { name: 'Member', url: '/orgmember' },
          { name: 'LogOut', url: '/' },
          { name: 'Back', url: b },
        ]}
      />
      <div className={styles.first_box}>
        <div className={styles.inside_box}>
          <h5>List of members</h5>
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

export default OrgAdminMemberPage;

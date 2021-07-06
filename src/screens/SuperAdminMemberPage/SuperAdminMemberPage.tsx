import React from 'react';
import styles from './SuperAdminMemberPage.module.css';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import { gql, useQuery } from '@apollo/client';
import UserCard from 'components/UserCard/UserCard';

function SuperAdminMemberPage(): JSX.Element {
  const PEOPLE_LIST = gql`
    query {
      users {
        firstName
        lastName
        image
        _id
      }
    }
  `;

  const { data } = useQuery(PEOPLE_LIST);

  return (
    <>
      <AdminNavbar
        targets={[
          { name: 'Home', url: '/superdash' },
          { name: 'People', url: '/supermember' },
          { name: 'Organisation', url: '/superorg' },
          { name: 'LogOut', url: '/' },
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
            ? data.users.map(
                (datas: {
                  _id: any;
                  image: any;
                  firstName: any;
                  lastName: any;
                }) => {
                  return (
                    <UserCard
                      key={datas._id}
                      image={datas.image}
                      firstName={datas.firstName}
                      lastName={datas.lastName}
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

export default SuperAdminMemberPage;

import { useQuery } from '@apollo/client';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import OrganizationCardStart from 'components/OrganizationCardStart/OrganizationCardStart';
import { USER_ORGANIZATION_LIST } from 'GraphQl/Queries/Queries';
import React from 'react';
import styles from './SelectOrganization.module.css';

function SelectOrganizationPage(): JSX.Element {
  const currentUrl = window.location.href.split('=')[1];

  const { data, loading } = useQuery(USER_ORGANIZATION_LIST, {
    variables: { id: currentUrl },
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
      <AdminNavbar targets={[{ name: 'back', url: '/login' }]} />
      <div className={styles.first_box}>
        <div className={styles.inside_box}>
          <h5>List of Organizations</h5>
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
            ? data.user.adminFor.map(
                (datas: { _id: string; name: string; image: string }) => {
                  return (
                    <OrganizationCardStart
                      key={datas._id}
                      id={datas._id}
                      image={datas.image}
                      name={datas.name}
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

export default SelectOrganizationPage;

import React from 'react';
import styles from './SuperAdminOrgPage.module.css';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import { useQuery } from '@apollo/client';
import OrganizationCard from 'components/OrganizationCard/OrganizationCard';
import { ORGANIZATION_LIST } from 'GraphQl/Queries/Queries';
<<<<<<< Updated upstream

function SuperAdminOrgPage(): JSX.Element {
  const { data } = useQuery(ORGANIZATION_LIST);
=======
function SuperAdminOrgPage(): JSX.Element {
  const { data, loading } = useQuery(ORGANIZATION_LIST);

  if (loading) {
    return (
      <>
        <div className={styles.loader}></div>
      </>
    );
  }
>>>>>>> Stashed changes

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
          <h5>List of Organisation</h5>
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
            ? data.organizations.map(
                (datas: {
                  _id: string;
                  image: string;
                  name: string;
                  creator: { lastName: string; firstName: string };
                }) => {
                  return (
                    <OrganizationCard
                      key={datas._id}
                      id={datas._id}
                      image={datas.image}
                      name={datas.name}
                      lastName={datas.creator.lastName}
                      firstName={datas.creator.firstName}
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

export default SuperAdminOrgPage;

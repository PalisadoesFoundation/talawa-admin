import React from 'react';
import styles from './SuperAdminOrgPage.module.css';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import { gql, useQuery } from '@apollo/client';
import OrganizationCard from 'components/OrganizationCard/OrganizationCard';

function SuperAdminOrgPage(): JSX.Element {
  const ORGANIZATION_LIST = gql`
    query {
      organizations {
        image
        _id
        creator {
          firstName
          lastName
        }
        name
      }
    }
  `;

  const { data } = useQuery(ORGANIZATION_LIST);

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
        <div>
          {data
            ? data.organizations.map(
                (datas: {
                  _id: any;
                  image: string;
                  name: any;
                  creator: { lastName: any; firstName: any };
                }) => {
                  return (
                    <OrganizationCard
                      key={datas._id}
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

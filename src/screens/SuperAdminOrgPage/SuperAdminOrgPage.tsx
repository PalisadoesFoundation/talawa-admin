import React from 'react';
import styles from './SuperAdminOrgPage.module.css';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';

function SuperAdminOrgPage(): JSX.Element {
  return (
    <>
      <AdminNavbar
        targets={[
          { name: 'Home', url: '/' },
          { name: 'People', url: '/supermember' },
          { name: 'Organisation', url: '/superorg' },
          { name: 'LogOut', url: '/' },
        ]}
      />
      <div className={styles.first_box}>
        <div className={styles.inside_box}>
          <h5>List of Organization</h5>
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
      </div>
    </>
  );
}

export default SuperAdminOrgPage;

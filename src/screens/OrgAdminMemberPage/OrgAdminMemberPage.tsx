import React from 'react';
import AdminNavbar from 'components/AdminNavbar/AdminNavbar';
import styles from './OrgAdminMemberPage.module.css';

function OrgAdminMemberPage(): JSX.Element {
  return (
    <>
      <AdminNavbar
        targets={[
          { name: 'Home', url: '/orghome' },
          { name: 'Member', url: '/orgmember' },
          { name: 'LogOut', url: '/' },
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
      </div>
    </>
  );
}

export default OrgAdminMemberPage;

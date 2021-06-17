import React from 'react';
import styles from './SuperAdminMemberPage.module.css';
import SuperAdminNavbar from 'components/SuperAdminNavbar/SuperAdminNavbar';

function SuperAdminMemberPage(): JSX.Element {
  return (
    <>
      <SuperAdminNavbar />
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
      </div>
    </>
  );
}

export default SuperAdminMemberPage;

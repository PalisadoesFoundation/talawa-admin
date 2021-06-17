import React from 'react';
import styles from './SuperAdminOrgPage.module.css';
import SuperAdminNavbar from 'components/SuperAdminNavbar/SuperAdminNavbar';

function SuperAdminOrgPage(): JSX.Element {
  return (
    <>
      <SuperAdminNavbar />
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
        <div className={styles.scroll}></div>
      </div>
    </>
  );
}

export default SuperAdminOrgPage;

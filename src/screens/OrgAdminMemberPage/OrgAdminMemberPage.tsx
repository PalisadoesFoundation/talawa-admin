import React from 'react';
import OrgAdminNavbar from 'components/OrgAdminNavbar/OrgAdminNavbar';
import styles from './OrgAdminMemberPage.module.css';

function OrgAdminMemberPage(): JSX.Element {
  return (
    <>
      <OrgAdminNavbar />
      <div className={styles.first_box}>
        <div className={styles.inside_box}>
          <h5>List of member</h5>
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

import React from 'react';
import OrgAdminNavbar from 'components/OrgAdminNavbar/OrgAdminNavbar';
import styles from './OrgAdminMemberPage.module.css';

function OrgAdminProfilePage(): JSX.Element {
  return (
    <>
      <OrgAdminNavbar />
      <div className={styles.first_box}>
        <h5>List of members</h5>
        <form>
          <input
            type="text"
            placeholder="Search.."
            name="search"
            className={styles.deco}
          />
        </form>
        <hr></hr>
        <div className={styles.scroll}></div>
      </div>
    </>
  );
}

export default OrgAdminProfilePage;

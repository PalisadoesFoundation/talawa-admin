import React from 'react';
import OrgAdminNavbar from 'components/OrgAdminNavbar/OrgAdminNavbar';
import styles from './OrgAdminHomePage.module.css';
import web from 'assets/talawa-logo-lite-200x200.png';
function OrgAdminHomePage(): JSX.Element {
  return (
    <>
      <OrgAdminNavbar />
      <div className={styles.main}>
        <img src={web} />
        <h4>Organization for Dogs</h4>
        <h5>Location:Spain</h5>
        <h6>members: 40</h6>
        <hr></hr>
        <div className={styles.box}>
          <h5>Description</h5>
          <hr></hr>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industrys standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
        </div>
      </div>
    </>
  );
}

export default OrgAdminHomePage;

import React from 'react';
import OrgAdminNavbar from 'components/OrgAdminNavbar/OrgAdminNavbar';
import styles from './OrgAdminHomePage.module.css';
import web from 'assets/talawa-logo-lite-200x200.png';
import web1 from 'assets/174857.png';
import web2 from 'assets/Dribbble-icon-Logo-PNG-Image.png';

function OrgAdminHomePage(): JSX.Element {
  return (
    <>
      <OrgAdminNavbar />
      <div className={styles.main}>
        <img src={web} />
        <div className={styles.align}>
          <h4>Organization for Dogs</h4>
          <h5>Location:Spain</h5>
          <h6>members: 40</h6>
        </div>
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
        <div className={styles.second_box}>
          <h5>Mobile:</h5>
          <h6>8650611111</h6>
          <h5 className={styles.margin}>Email:</h5>
          <h6 className={styles.margin_third}>domian@domain.com</h6>
          <h5 className={styles.margin_second}>Interest:</h5>
          <div className={styles.tag}>Singer</div>
        </div>
        <div className={styles.third_box}>
          <h5>Links</h5>
          <hr></hr>
          <h6>https://www.linkedin.com/in/yasharth-dubey-0434b6155</h6>
          <h6 className={styles.margin_up}>https://dribbble.com/dark_020</h6>
          <img src={web1} />
          <img src={web2} className={styles.margin_up} />
        </div>
      </div>
    </>
  );
}

export default OrgAdminHomePage;

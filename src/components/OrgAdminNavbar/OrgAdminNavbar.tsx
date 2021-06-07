import React from 'react';
import styles from './OrgAdminNavbar.module.css';
import web from 'assets/talawa-logo-lite-200x200.png';

function OrgAdminNavbar(): JSX.Element {
  return (
    <>
      <div className={styles.header_block}>
        <a href="/orghome">
          <img src={web} className={styles.image} />
          <strong className={styles.heading}>TalawaAdmin</strong>
        </a>
      </div>
      <div className={styles.second_box}>
        <div>
          <ul>
            <li>
              <a href="/orghome" className="fas fa-home">
                <strong className={styles.text}>Home</strong>
              </a>
            </li>
            <li>
              <div>
                <a href="/orghome" className="fas fa-user">
                  <strong className={styles.text}>Member</strong>
                </a>
              </div>
            </li>
            <li>
              <a href="/orghome" className="fas fa-user-circle">
                <strong className={styles.text}>Profile</strong>
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.third_box}>
          <ul>
            <li>
              <a href="/orghome" className="fas fa-sign">
                <strong className={styles.text}>LogOut</strong>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default OrgAdminNavbar;

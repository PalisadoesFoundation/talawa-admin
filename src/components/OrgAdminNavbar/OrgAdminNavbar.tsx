import React from 'react';
import styles from './OrgAdminNavbar.module.css';
import Logo from 'assets/talawa-logo-lite-200x200.png';

function OrgAdminNavbar(): JSX.Element {
  return (
    <>
      <div className={styles.header_block}>
        <a href="/orghome">
          <img src={Logo} className={styles.image} />
          <strong className={styles.heading}>TalawaAdmin</strong>
        </a>
      </div>
      <div className={styles.second_box}>
        <div>
          <ul>
            <li>
              <a href="/orghome" className={styles.text}>
                Home
              </a>
            </li>
            <li>
              <div>
                <a href="/orgmember" className={styles.text}>
                  Member
                </a>
              </div>
            </li>
          </ul>
        </div>
        <div className={styles.third_box}>
          <a href="/orghome" className={styles.text}>
            LogOut
          </a>
        </div>
      </div>
    </>
  );
}

export default OrgAdminNavbar;

import React from 'react';
import styles from './SuperAdminNavbar.module.css';
import Logo from 'assets/talawa-logo-lite-200x200.png';

function SuperAdminNavbar(): JSX.Element {
  return (
    <>
      <div className={styles.header_block}>
        <img src={Logo} className={styles.logo} />
        <strong className={styles.heading}>TalawaAdmin</strong>
      </div>
      <div className={styles.left_block}>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/supermember">People</a>
        </li>
        <li>
          <a href="/superorg">Organization</a>
        </li>
        <li>
          <a href="/">LogOut</a>
        </li>
      </div>
    </>
  );
}

export default SuperAdminNavbar;

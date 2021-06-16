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
      <div>
        <div>
          <ul>
            <li>
              <a>Home</a>
            </li>
            <li>
              <div>
                <a href="/supermember">People</a>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <a href="/">LogOut</a>
        </div>
      </div>
    </>
  );
}

export default SuperAdminNavbar;

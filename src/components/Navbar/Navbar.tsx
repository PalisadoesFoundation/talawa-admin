import React from 'react';
import styles from './Navbar.module.css';
import web from 'assets/talawa-logo-lite-200x200.png';
function Navbar(): JSX.Element {
  return (
    <nav className={styles.nav}>
      <div className={styles.main}>
        <a className={styles.logo} href="/">
          <img src={web} />
          <strong>Talawa</strong>
          <strong>Admin</strong>
        </a>
      </div>
    </nav>
  );
}

export default Navbar;

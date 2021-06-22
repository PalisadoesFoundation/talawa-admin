import React from 'react';
import styles from './AdminNavbar.module.css';
import Logo from 'assets/talawa-logo-lite-200x200.png';

interface NavbarProps {
  targets: { url: string; name: string }[];
}

function AdminNavbar({ targets }: NavbarProps): JSX.Element {
  return (
    <>
      <div className={styles.header_block}>
        <img src={Logo} className={styles.logo} />
        <strong className={styles.heading}>TalawaAdmin</strong>
      </div>
      <div className={styles.left_block}>
        {targets.map(({ name, url }) => (
          <li key={name}>
            <a href={url}>{name}</a>
          </li>
        ))}
      </div>
    </>
  );
}

export default AdminNavbar;

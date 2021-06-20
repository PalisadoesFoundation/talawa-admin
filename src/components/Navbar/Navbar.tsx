import React from 'react';
import styles from './Navbar.module.css';
import Navbar from 'react-bootstrap/Navbar';
import Logo from 'assets/talawa-logo-lite-200x200.png';
function NavBar(): JSX.Element {
  return (
    <div>
      <Navbar bg="">
        <Navbar.Brand>
          <a className={styles.logo} href="/">
            <img src={Logo} />
            <strong>Talawa</strong>
            <strong>Admin</strong>
          </a>
        </Navbar.Brand>
      </Navbar>
    </div>
  );
}

export default NavBar;

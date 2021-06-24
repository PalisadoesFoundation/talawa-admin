import React from 'react';
import styles from './AdminNavbar.module.css';
import { Nav } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Logo from 'assets/talawa-logo-lite-200x200.png';
interface NavbarProps {
  targets: { url: string; name: string }[];
}

function AdminNavbar({ targets }: NavbarProps): JSX.Element {
  return (
    <>
      <Navbar className={styles.navbarbg}>
        <Navbar.Brand>
          <a className={styles.logo} href="/">
            <img src={Logo} />
            <strong>Talawa</strong>
            <strong>Admin</strong>
          </a>
        </Navbar.Brand>
        <Navbar.Collapse>
          <img
            src="https://via.placeholder.com/58"
            className={styles.roundedcircle}
          />
        </Navbar.Collapse>
      </Navbar>
      <Nav className={styles.sidebar} activeKey="/home">
        <div className={styles.sidebarsticky}>
          {targets.map(({ name, url }) => (
            <Nav.Item key={name} className={styles.navitem}>
              <Nav.Link href={url} className={styles.naviteminside}>
                {name}
              </Nav.Link>
            </Nav.Item>
          ))}
        </div>
      </Nav>
    </>
  );
}

export default AdminNavbar;

import React from 'react';
import styles from './AdminNavbar.module.css';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Logo from 'assets/talawa-logo-200x200.png';
import Row from 'react-bootstrap/Row';
import { Nav } from 'react-bootstrap';
interface NavbarProps {
  targets: { url: string; name: string }[];
}

function AdminNavbar({ targets }: NavbarProps): JSX.Element {
  return (
    <>
      <Navbar className={styles.navbarbg}>
        <Navbar.Brand>
          <Row className={styles.navallitem}>
            <a className={styles.logo}>
              <img src={Logo} />
              <strong>Talawa Portal</strong>
            </a>
            <div className={styles.navit}>
              {targets.map(({ name, url }) => (
                <Nav.Item key={name} className={styles.navitems}>
                  <Nav.Link href={url} className={styles.navlinks}>
                    {name}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </div>
          </Row>
        </Navbar.Brand>
        <Dropdown className={styles.dropdowns}>
          <Dropdown.Toggle variant="" id="dropdown-basic">
            <img
              src="https://via.placeholder.com/45x45"
              className={styles.roundedcircle}
            />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="">Delete Org</Dropdown.Item>
            <Dropdown.Item href="#/orgsettings">Settings</Dropdown.Item>
            <Dropdown.Item href="#">Log Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar>
    </>
  );
}

export default AdminNavbar;

import React from 'react';
import styles from './AdminNavbar.module.css';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Logo from 'assets/talawa-logo-200x200.png';
import Row from 'react-bootstrap/Row';
import { Nav } from 'react-bootstrap';
interface NavbarProps {
  targets: { url: string; name: string }[];
  url_1: string;
}

function AdminNavbar({ targets, url_1 }: NavbarProps): JSX.Element {
  return (
    <>
      <Navbar className={styles.navbarbg}>
        <Navbar.Brand>
          <Row className={styles.navallitem}>
            <a className={styles.logo} href="/orglist">
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
            <Dropdown.Item href="/notification">
              <i className="fa fa-bell"></i>
              Notify
            </Dropdown.Item>
            <Dropdown.Item href={url_1}>
              <i className="fa fa-cogs"></i>
              Settings
            </Dropdown.Item>
            <Dropdown.Item href="/">
              <i className="fa fa-arrow-right"></i>
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar>
    </>
  );
}

export default AdminNavbar;

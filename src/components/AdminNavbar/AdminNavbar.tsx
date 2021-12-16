import React from 'react';
import styles from './AdminNavbar.module.css';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Logo from 'assets/talawa-logo-200x200.png';
import Row from 'react-bootstrap/Row';
import { Nav } from 'react-bootstrap';
interface NavbarProps {
  targets: {
    url?: string;
    name: string;
    subTargets?: {
      url: string;
      name: string;
      icon?: string;
    }[];
  }[];
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
              {targets.map(({ name, url, subTargets }) => {
                return url ? (
                  <Nav.Item key={name} className={styles.navitems}>
                    <Nav.Link href={url} id={name} className={styles.navlinks}>
                      {name}
                    </Nav.Link>
                  </Nav.Item>
                ) : (
                  <Nav.Item key={name} className={styles.navitems}>
                    <Dropdown className={styles.dropdowns}>
                      <Dropdown.Toggle
                        variant=""
                        className={styles.dropdowntoggle}
                      >
                        <Nav.Link
                          href={url}
                          id={name}
                          className={styles.navlinks}
                        >
                          {name}
                        </Nav.Link>
                      </Dropdown.Toggle>
                      {subTargets && (
                        <Dropdown.Menu>
                          {subTargets.map((subTarget: any, index: number) => (
                            <Dropdown.Item
                              key={index}
                              href={subTarget.url}
                              className={styles.dropdownitem}
                            >
                              <i
                                className={`fa ${
                                  subTarget.icon ? subTarget.icon : 'fa-cubes'
                                }`}
                              ></i>
                              {subTarget.name}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      )}
                    </Dropdown>
                  </Nav.Item>
                );
              })}
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
            <Dropdown.Item
              onClick={() => {
                localStorage.clear();
                window.location.replace('/');
              }}
            >
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

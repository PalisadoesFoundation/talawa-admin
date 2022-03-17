import React from 'react';
import styles from './AdminNavbar.module.css';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Logo from 'assets/talawa-logo-200x200.png';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
      <Navbar className={styles.navbarbg} expand="xl" fixed="top">
        <Navbar.Brand>
          <Link className={styles.logo} to="/orglist">
            <img src={Logo} />
            <strong>Talawa Portal</strong>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto">
            {targets.map(({ name, url, subTargets }) => {
              return url ? (
                <Nav.Item key={name} className={styles.navitems}>
                  <Nav.Link
                    as={Link}
                    to={url}
                    id={name}
                    className={styles.navlinks}
                  >
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
                            as={Link}
                            to={subTarget.url}
                            className={styles.dropdownitem}
                          >
                            <i
                              className={`fa ${
                                subTarget.icon ? subTarget.icon : 'fa-cubes'
                              }`}
                              data-testid="dropdownIcon"
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
          </Nav>
          <Dropdown className={`ml-auto ${styles.dropdowns}`}>
            <Dropdown.Toggle variant="" id="dropdown-basic">
              <img
                src="https://via.placeholder.com/45x45"
                className={styles.roundedcircle}
                data-testid="logoutDropdown"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu className={styles.dropdownMenu}>
              <Dropdown.Item as={Link} to="/notification">
                <i className="fa fa-bell"></i>&ensp; Notify
              </Dropdown.Item>
              <Dropdown.Item as={Link} to={url_1}>
                <i className="fa fa-cogs"></i>&ensp; Settings
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  localStorage.clear();
                  window.location.replace('/');
                }}
              >
                <i className="fa fa-arrow-right"></i>
                &ensp;Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default AdminNavbar;

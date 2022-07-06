import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import styles from './ListNavbar.module.css';
import Logo from 'assets/talawa-logo-200x200.png';

const ListNavbar = () => {
  const isSuperAdmin = localStorage.getItem('UserType') !== 'SUPERADMIN';

  /* istanbul ignore next */
  const logout = () => {
    localStorage.clear();
    window.location.replace('/');
  };

  return (
    <Navbar className={styles.navbarbgOrglist} expand="xl">
      <Navbar.Brand>
        <Link className={styles.logo} to="/orglist">
          <img src={Logo} />
          <strong>Talawa Portal</strong>
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" />
      <Navbar.Collapse id="navbarScroll">
        <Nav className="me-auto">
          {!isSuperAdmin && (
            <>
              <Nav.Item className={styles.navitems}>
                <Nav.Link as={Link} to="/roles" className={styles.navlinks}>
                  Roles
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className={styles.navitems}>
                <Nav.Link as={Link} to="/requests" className={styles.navlinks}>
                  Requests
                </Nav.Link>
              </Nav.Item>
            </>
          )}
        </Nav>
        <button
          className={`ml-auto ${styles.logoutbtn}`}
          data-testid="logoutBtn"
          onClick={logout}
        >
          Logout
        </button>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default ListNavbar;

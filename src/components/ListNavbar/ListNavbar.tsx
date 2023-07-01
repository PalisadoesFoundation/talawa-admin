import React from 'react';
import { Dropdown, Nav, Navbar } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Link, NavLink } from 'react-router-dom';
import i18next from 'i18next';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

import styles from './ListNavbar.module.css';
import Logo from 'assets/images/talawa-logo-200x200.png';
import { languages } from 'utils/languages';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const ListNavbar = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'listNavbar' });

  const isSuperAdmin = localStorage.getItem('UserType') !== 'SUPERADMIN';

  const currentLanguageCode = Cookies.get('i18next') || 'en';

  const logout = (): void => {
    localStorage.clear();
    window.location.replace('/');
  };

  return (
    <Navbar className={styles.navbarbgOrglist} expand="xl">
      <Navbar.Brand className={styles.navbarBrand}>
        <Link className={styles.logo} to="/orglist">
          <img src={Logo} />
          <strong>{t('talawa_portal')}</strong>
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" />
      <Navbar.Collapse id="navbarScroll">
        <Nav className="me-auto">
          {!isSuperAdmin && (
            <>
              <Nav.Item className={styles.navitems}>
                <Nav.Link
                  as={NavLink}
                  to="/roles"
                  className={styles.navlinks}
                  activeClassName={styles.navlinks_active}
                >
                  {t('roles')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className={styles.navitems}>
                <Nav.Link
                  as={NavLink}
                  to="/requests"
                  className={styles.navlinks}
                  activeClassName={styles.navlinks_active}
                >
                  {t('requests')}
                </Nav.Link>
              </Nav.Item>
            </>
          )}
        </Nav>
        <Nav className="ml-auto">
          <Dropdown
            className={styles.languageBtn}
            data-toggle="dropdown"
            aria-expanded="false"
            title="Change Langauge"
          >
            <Dropdown.Toggle
              variant="success"
              id="dropdown-basic"
              data-testid="languageDropdownBtn"
            >
              <i className="fas fa-globe"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {languages.map((language, index: number) => (
                <Dropdown.Item
                  key={index}
                  className="dropdown-item"
                  onClick={async (): Promise<void> => {
                    await i18next.changeLanguage(language.code);
                  }}
                  disabled={currentLanguageCode === language.code}
                  data-testid={`changeLanguageBtn${index}`}
                >
                  <span
                    className={`fi fi-${language.country_code} me-2`}
                  ></span>
                  {language.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button
            className={styles.logoutbtn}
            data-testid="logoutBtn"
            onClick={logout}
          >
            {t('logout')}
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default ListNavbar;

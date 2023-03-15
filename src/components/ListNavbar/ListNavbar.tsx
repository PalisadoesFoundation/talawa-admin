import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import i18next from 'i18next';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

import styles from './ListNavbar.module.css';
import Logo from 'assets/talawa-logo-200x200.png';
import { languages } from 'utils/languages';

const ListNavbar = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'listNavbar' });

  const isSuperAdmin = localStorage.getItem('UserType') !== 'SUPERADMIN';

  const currentLanguageCode = Cookies.get('i18next') || 'en';

  const logout = () => {
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
          <div className="dropdown mr-4">
            <button
              className={`btn dropdown-toggle ${styles.languageBtn}`}
              type="button"
              data-toggle="dropdown"
              aria-expanded="false"
              title="Change Langauge"
            >
              <i className="fas fa-globe"></i>
            </button>
            <div className="dropdown-menu">
              {languages.map((language, index: number) => (
                <button
                  key={index}
                  className="dropdown-item"
                  onClick={() => i18next.changeLanguage(language.code)}
                  disabled={currentLanguageCode === language.code}
                  data-testid={`changeLanguageBtn${index}`}
                >
                  <span
                    className={`flag-icon flag-icon-${language.country_code} mr-2`}
                  ></span>
                  {language.name}
                </button>
              ))}
            </div>
          </div>
          <button
            className={styles.logoutbtn}
            data-testid="logoutBtn"
            onClick={logout}
          >
            {t('logout')}
          </button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default ListNavbar;

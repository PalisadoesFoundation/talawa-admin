import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { Nav } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import i18next from 'i18next';
import MenuIcon from '@mui/icons-material/Menu';
import styles from './AdminNavbar.module.css';
import AboutImg from 'assets/images/defaultImg.png';
import {
  ORGANIZATIONS_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import { languages } from 'utils/languages';

interface InterfaceNavbarProps {
  targets: {
    url?: string;
    name: string;
    subTargets?: {
      url: string;
      name: string;
      icon?: string;
    }[];
  }[];
  url1: string;
}

function adminNavbar({ targets, url1 }: InterfaceNavbarProps): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'adminNavbar' });
  const currentUrl = window.location.href.split('=')[1];

  const { data: orgData, error: orgError } = useQuery(ORGANIZATIONS_LIST, {
    variables: { id: currentUrl },
  });

  const { data: data2 } = useQuery(USER_ORGANIZATION_LIST, {
    variables: { id: localStorage.getItem('id') },
  });

  const isSuperAdmin = data2?.user.userType === 'SUPERADMIN';
  const currentLanguageCode = Cookies.get('i18next') || 'en';

  /* istanbul ignore next */
  if (orgError) {
    window.location.replace('/orglist');
  }

  let orgName;
  if (orgData) {
    orgName = orgData?.organizations[0].name;
  }

  return (
    <>
      <Navbar className={styles.navbarbg} expand="xl" fixed="top">
        <Navbar.Brand className={styles.navbarBrandLogo}>
          <div className={styles.logo}>
            {orgData?.organizations[0].image ? (
              <img
                src={orgData?.organizations[0].image}
                className={styles.roundedcircle}
                data-testid={'orgLogoPresent'}
              />
            ) : (
              <img
                src={AboutImg}
                className={styles.roundedcircle}
                data-testid={'orgLogoAbsent'}
              />
            )}
            <strong>{orgName}</strong>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto">
            {targets.map(({ name, url, subTargets }) => {
              return url ? (
                <Nav.Item key={name} className={styles.navitems}>
                  <Nav.Link
                    as={NavLink}
                    to={url}
                    id={name}
                    className={styles.navlinks}
                    activeClassName={styles.navlinks_active}
                  >
                    {t(name)}
                  </Nav.Link>
                </Nav.Item>
              ) : (
                <Nav.Item key={name} className={styles.navitems}>
                  <Dropdown className={styles.dropdowns}>
                    <Dropdown.Toggle
                      variant="light"
                      id={name}
                      className={`${styles.dropdowntoggle} ${styles.navlinks_dropdown}`}
                    >
                      {t(name)}
                    </Dropdown.Toggle>
                    {subTargets && (
                      <Dropdown.Menu className={styles.dropdowns}>
                        {subTargets.map((subTarget: any, index: number) => (
                          <Dropdown.Item
                            key={index}
                            as={Link}
                            to={subTarget.url}
                            className={styles.dropdownitem}
                          >
                            <i
                              className={`fa ${subTarget.icon}`}
                              data-testid="dropdownIcon"
                            ></i>
                            {t(subTarget.name)}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    )}
                  </Dropdown>
                </Nav.Item>
              );
            })}
          </Nav>
          <Link className={styles.allOrgBtn} to="/orglist">
            {isSuperAdmin ? t('allOrganizations') : t('yourOrganization')}
          </Link>
          <Nav
            className="ml-auto items-center"
            style={{ alignItems: 'center' }}
          >
            <Dropdown className={styles.dropdowns}>
              <Dropdown.Toggle
                variant="white"
                id="dropdown-basic"
                data-testid="logoutDropdown"
              >
                <MenuIcon />
              </Dropdown.Toggle>
              <Dropdown.Menu className={styles.dropdownMenu}>
                <Dropdown.Item as={Link} to={`/orgsetting/id=${url1}`}>
                  <i className="fa fa-cogs"></i>&ensp; {t('settings')}
                </Dropdown.Item>
                <Dropdown className={styles.languageDropdown}>
                  <Dropdown.Toggle
                    variant=""
                    id="dropdown-basic"
                    data-testid="languageDropdown"
                  >
                    <i className="fas fa-globe"></i>&ensp; {t('language')}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {languages.map((language, index: number) => (
                      <Dropdown.Item key={index}>
                        <Button
                          className="dropdown-item"
                          onClick={async (): Promise<void> => {
                            await i18next.changeLanguage(language.code);
                          }}
                          disabled={currentLanguageCode === language.code}
                          data-testid={`changeLanguageBtn${index}`}
                        >
                          <span
                            className={`fi fi-${language.country_code} mr-2`}
                          ></span>
                          {language.name}
                        </Button>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown.Item
                  onClick={(): void => {
                    localStorage.clear();
                    window.location.replace('/');
                  }}
                >
                  <i className="fa fa-arrow-right"></i>
                  &ensp;{t('logout')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default adminNavbar;

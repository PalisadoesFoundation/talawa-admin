import React from 'react';
import styles from './OrganizationNavbar.module.css';
import TalawaImage from 'assets/images/talawa-logo-600x600.png';
import { Container, Dropdown, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { languages } from 'utils/languages';
import i18next from 'i18next';
import cookies from 'js-cookie';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { ORGANIZATION_LIST } from 'GraphQl/Queries/Queries';
import type { DropDirection } from 'react-bootstrap/esm/DropdownContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useLocalStorage from 'utils/useLocalstorage';
interface InterfaceNavbarProps {
  currentPage: string | null;
}

/**
 * Displays the organization navbar with navigation options, user settings, and language selection.
 *
 * The navbar includes:
 * - Organization branding and name.
 * - Navigation links for various plugins based on user permissions.
 * - Language dropdown for changing the interface language.
 * - User dropdown for accessing settings and logging out.
 *
 * @param props - The properties for the navbar.
 * @param currentPage - The current page identifier for highlighting the active navigation link.
 *
 * @returns The organization navbar component.
 */
function organizationNavbar(props: InterfaceNavbarProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userNavbar',
  });
  const { t: tCommon } = useTranslation('common');

  const navigate = useNavigate();

  const [organizationDetails, setOrganizationDetails] = React.useState<{
    name: string;
  }>({ name: '' });

  const dropDirection: DropDirection = 'start';

  const { orgId: organizationId } = useParams();

  const { data } = useQuery(ORGANIZATION_LIST, {
    variables: { id: organizationId },
  });

  const [currentLanguageCode, setCurrentLanguageCode] = React.useState(
    cookies.get('i18next') || 'en',
  );

  const { getItem, setItem } = useLocalStorage();

  /**
   * Handles user logout by clearing local storage and redirecting to the home page.
   */
  const handleLogout = (): void => {
    localStorage.clear();
    window.location.replace('/');
  };

  const userName = getItem('name');

  React.useEffect(() => {
    if (data) {
      setOrganizationDetails({ name: data.organizations[0].name });
    }
  }, [data]);

  const homeLink = `/user/organization/${organizationId}`;

  return (
    <Navbar expand={'md'} variant="dark" className={`${styles.colorPrimary}`}>
      <Container fluid>
        <Navbar.Brand href="#">
          <img
            className={styles.talawaImage}
            src={TalawaImage}
            alt="Talawa Branding"
          />
          <b>{organizationDetails.name}</b>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md}`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-md`}
          aria-labelledby={`offcanvasNavbar-expand-md`}
          placement="end"
          className={styles.offcanvasContainer}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Talawa</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="me-auto flex-grow-1 pe-3 pt-1" variant="dark">
              <Nav.Link
                active={props.currentPage === 'home'}
                onClick={(): void => navigate(homeLink)}
              >
                {t('home')}
              </Nav.Link>
            </Nav>
            <Navbar.Collapse className="justify-content-end">
              <Dropdown data-testid="languageDropdown" drop={dropDirection}>
                <Dropdown.Toggle
                  variant="white"
                  id="dropdown-basic"
                  data-testid="languageDropdownToggle"
                  className={styles.colorWhite}
                >
                  <LanguageIcon
                    className={styles.colorWhite}
                    data-testid="languageIcon"
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {languages.map((language, index: number) => (
                    <Dropdown.Item
                      key={index}
                      onClick={async (): Promise<void> => {
                        setCurrentLanguageCode(language.code);
                        await i18next.changeLanguage(language.code);
                      }}
                      disabled={currentLanguageCode === language.code}
                      data-testid={`changeLanguageBtn${index}`}
                    >
                      <span
                        className={`fi fi-${language.country_code} mr-2`}
                      ></span>{' '}
                      {language.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown drop={dropDirection}>
                <Dropdown.Toggle
                  variant="white"
                  id="dropdown-basic"
                  data-testid="logoutDropdown"
                  className={styles.colorWhite}
                >
                  <PermIdentityIcon
                    className={styles.colorWhite}
                    data-testid="personIcon"
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.ItemText>
                    <b>{userName as string}</b>
                  </Dropdown.ItemText>
                  <Dropdown.Item>
                    <Link to="/user/settings" className={styles.link}>
                      {tCommon('settings')}
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={handleLogout}
                    data-testid={`logoutBtn`}
                  >
                    {tCommon('logout')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Navbar.Collapse>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default organizationNavbar;

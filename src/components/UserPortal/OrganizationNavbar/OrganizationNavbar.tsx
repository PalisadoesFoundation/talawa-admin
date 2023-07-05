import React from 'react';
import styles from './OrganizationNavbar.module.css';
import TalawaImage from 'assets/talawa-logo-200x200.png';
import { Container, Dropdown, Nav, Navbar } from 'react-bootstrap';
import { languages } from 'utils/languages';
import i18next from 'i18next';
import cookies from 'js-cookie';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { USER_ORGANIZATION_CONNECTION } from 'GraphQl/Queries/Queries';
import getOrganizationId from 'utils/getOrganizationId';

interface InterfaceNavbarProps {
  currentPage: string | null;
}

function organizationNavbar(props: InterfaceNavbarProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userNavbar',
  });
  const [organizationDetails, setOrganizationDetails]: any = React.useState({});

  const organizationId = getOrganizationId(window.location.href);

  const { data } = useQuery(USER_ORGANIZATION_CONNECTION, {
    variables: { id: organizationId },
  });

  const [currentLanguageCode, setCurrentLanguageCode] = React.useState(
    /* istanbul ignore next */
    cookies.get('i18next') || 'en'
  );

  /* istanbul ignore next */
  const handleLogout = (): void => {
    localStorage.clear();
    window.location.replace('/user');
  };

  const userName = localStorage.getItem('name');
  React.useEffect(() => {
    if (data) {
      setOrganizationDetails(data.organizationsConnection[0]);
    }
  }, [data]);

  return (
    <Navbar variant="dark" className={`${styles.colorPrimary}`}>
      <Container fluid>
        <Navbar.Brand href="#">
          <img
            className={styles.talawaImage}
            src={TalawaImage}
            alt="Talawa Branding"
          />
          <b>{organizationDetails.name}</b>
        </Navbar.Brand>

        <Nav className="me-auto" variant="dark">
          <Nav.Link active={props.currentPage === 'home'}>{t('home')}</Nav.Link>
          <Nav.Link active={props.currentPage === 'events'}>
            {t('events')}
          </Nav.Link>
          <Nav.Link active={props.currentPage === 'people'}>
            {t('people')}
          </Nav.Link>
          <Nav.Link active={props.currentPage === 'chat'}>{t('chat')}</Nav.Link>
          <Nav.Link active={props.currentPage === 'donate'}>
            {t('donate')}
          </Nav.Link>
        </Nav>

        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Dropdown data-testid="languageDropdown" drop="start">
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

          <Dropdown drop="start">
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
                <b>{userName}</b>
              </Dropdown.ItemText>
              <Dropdown.Item>{t('settings')}</Dropdown.Item>
              <Dropdown.Item>{t('myTasks')}</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout} data-testid={`logoutBtn`}>
                {t('logout')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default organizationNavbar;

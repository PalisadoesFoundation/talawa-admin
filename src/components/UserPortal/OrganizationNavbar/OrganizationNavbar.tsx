import React from 'react';
import styles from './OrganizationNavbar.module.css';
import TalawaImage from 'assets/images/talawa-logo-200x200.png';
import { Container, Dropdown, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { languages } from 'utils/languages';
import i18next from 'i18next';
import cookies from 'js-cookie';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { USER_ORGANIZATION_CONNECTION } from 'GraphQl/Queries/Queries';
import getOrganizationId from 'utils/getOrganizationId';
import type { DropDirection } from 'react-bootstrap/esm/DropdownContext';
import { useHistory } from 'react-router-dom';

interface InterfaceNavbarProps {
  currentPage: string | null;
}

function organizationNavbar(props: InterfaceNavbarProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userNavbar',
  });

  const history = useHistory();

  const [organizationDetails, setOrganizationDetails]: any = React.useState({});
  // const dropDirection: DropDirection = screen.width > 767 ? 'start' : 'down';
  const dropDirection: DropDirection = 'start';

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

  const homeLink = `/user/organization/id=${organizationId}`;
  const peopleLink = `/user/people/id=${organizationId}`;
  const eventsLink = `/user/events/id=${organizationId}`;
  const chatLink = `/user/chat/id=${organizationId}`;
  const donationLink = `/user/donation/id=${organizationId}`;

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
            <Nav className="me-auto flex-grow-1 pe-3" variant="dark">
              <Nav.Link
                active={props.currentPage === 'home'}
                onClick={(): void => history.push(homeLink)}
              >
                {t('home')}
              </Nav.Link>
              <Nav.Link
                active={props.currentPage === 'events'}
                onClick={(): void => history.push(eventsLink)}
              >
                {t('events')}
              </Nav.Link>
              <Nav.Link
                active={props.currentPage === 'people'}
                onClick={(): void => history.push(peopleLink)}
              >
                {t('people')}
              </Nav.Link>
              <Nav.Link
                active={props.currentPage === 'chat'}
                onClick={(): void => history.push(chatLink)}
              >
                {t('chat')}
              </Nav.Link>
              <Nav.Link
                active={props.currentPage === 'donate'}
                onClick={(): void => history.push(donationLink)}
              >
                {t('donate')}
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
                    <b>{userName}</b>
                  </Dropdown.ItemText>
                  <Dropdown.Item>{t('settings')}</Dropdown.Item>
                  <Dropdown.Item>{t('myTasks')}</Dropdown.Item>
                  <Dropdown.Item
                    onClick={handleLogout}
                    data-testid={`logoutBtn`}
                  >
                    {t('logout')}
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

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
import { useQuery, useSubscription } from '@apollo/client';
import { USER_ORGANIZATION_CONNECTION } from 'GraphQl/Queries/Queries';
<<<<<<< HEAD
import type { DropDirection } from 'react-bootstrap/esm/DropdownContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PLUGIN_SUBSCRIPTION } from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';
=======
import getOrganizationId from 'utils/getOrganizationId';
import type { DropDirection } from 'react-bootstrap/esm/DropdownContext';
import { Link, useHistory } from 'react-router-dom';
import { PLUGIN_SUBSCRIPTION } from 'GraphQl/Mutations/mutations';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
interface InterfaceNavbarProps {
  currentPage: string | null;
}

type Plugin = {
  pluginName: string;

  alias: string;
  link: string;
  translated: string;
  view: boolean;
};
function organizationNavbar(props: InterfaceNavbarProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userNavbar',
  });

<<<<<<< HEAD
  const navigate = useNavigate();
=======
  const history = useHistory();
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  const [organizationDetails, setOrganizationDetails]: any = React.useState({});
  // const dropDirection: DropDirection = screen.width > 767 ? 'start' : 'down';
  const dropDirection: DropDirection = 'start';

<<<<<<< HEAD
  const { orgId: organizationId } = useParams();
=======
  const organizationId = getOrganizationId(window.location.href);
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

  const { data } = useQuery(USER_ORGANIZATION_CONNECTION, {
    variables: { id: organizationId },
  });

  const [currentLanguageCode, setCurrentLanguageCode] = React.useState(
    /* istanbul ignore next */
<<<<<<< HEAD
    cookies.get('i18next') || 'en',
  );

  const { getItem, setItem } = useLocalStorage();

  /* istanbul ignore next */
  const handleLogout = (): void => {
    localStorage.clear();
    window.location.replace('/');
  };

  const userName = getItem('name');
=======
    cookies.get('i18next') || 'en'
  );

  /* istanbul ignore next */
  const handleLogout = (): void => {
    localStorage.clear();
    window.location.replace('/user');
  };

  const userName = localStorage.getItem('name');
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  React.useEffect(() => {
    if (data) {
      setOrganizationDetails(data.organizationsConnection[0]);
    }
  }, [data]);

<<<<<<< HEAD
  const homeLink = `/user/organization/${organizationId}`;
=======
  const homeLink = `/user/organization/id=${organizationId}`;
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  let plugins: Plugin[] = [
    {
      pluginName: 'People',
      alias: 'people',
<<<<<<< HEAD
      link: `/user/people/${organizationId}`,
=======
      link: `/user/people/id=${organizationId}`,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      translated: t('people'),
      view: true,
    },
    {
      pluginName: 'Events',
      alias: 'events',
<<<<<<< HEAD
      link: `/user/events/${organizationId}`,
=======
      link: `/user/events/id=${organizationId}`,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      translated: t('events'),
      view: true,
    },
    {
      pluginName: 'Donation',
      alias: 'donate',
<<<<<<< HEAD
      link: `/user/donate/${organizationId}`,
=======
      link: `/user/donate/id=${organizationId}`,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      translated: t('donate'),
      view: true,
    },
    // {
    //   pluginName: 'Chats',
    //   alias: 'chat',
    //   link: `/user/chat/id=${organizationId}`,
    //   translated: t('chat'),
    //   view: true,
    // },
  ];
<<<<<<< HEAD
  if (getItem('talawaPlugins')) {
    const talawaPlugins: string = getItem('talawaPlugins') || '{}';
    plugins = JSON.parse(talawaPlugins);
  }

  const { data: updatedPluginData } = useSubscription(
    PLUGIN_SUBSCRIPTION,
    // { variables: {  } }
  );
  function getPluginIndex(pluginName: string, pluginsArray: Plugin[]): number {
    return pluginsArray.findIndex((plugin) => plugin.pluginName === pluginName);
=======
  if (localStorage.getItem('talawaPlugins')) {
    const talawaPlugins: string = localStorage.getItem('talawaPlugins') || '{}';
    plugins = JSON.parse(talawaPlugins);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: updatedPluginData, loading: _loadingSub } = useSubscription(
    PLUGIN_SUBSCRIPTION
    // { variables: {  } }
  );
  function getPluginIndex(pluginName: string, pluginsArray: Plugin[]): number {
    for (let i = 0; i < pluginsArray.length; i++) {
      if (pluginsArray[i].pluginName === pluginName) {
        return i; // Return the index of the matching object
      }
    }
    return -1; // Return -1 if not found
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  }

  if (updatedPluginData != undefined) {
    const pluginName = updatedPluginData.onPluginUpdate.pluginName;
    const uninstalledOrgs = updatedPluginData.onPluginUpdate.uninstalledOrgs;
    const pluginIndexToRemove = getPluginIndex(pluginName, plugins);
    if (uninstalledOrgs.includes(organizationId)) {
      if (pluginIndexToRemove != -1) {
        plugins[pluginIndexToRemove].view = false;
<<<<<<< HEAD
        setItem('talawaPlugins', JSON.stringify(plugins));
=======
        localStorage.setItem('talawaPlugins', JSON.stringify(plugins));
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        console.log(`Plugin ${pluginName} has been removed.`);
      } else {
        console.log(`Plugin ${pluginName} is not present.`);
      }
    } else {
      if (pluginIndexToRemove != -1) {
        plugins[pluginIndexToRemove].view = true;
<<<<<<< HEAD
        setItem('talawaPlugins', JSON.stringify(plugins));
=======
        localStorage.setItem('talawaPlugins', JSON.stringify(plugins));
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      }
    }
  }
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
                onClick={
                  /* istanbul ignore next */
<<<<<<< HEAD
                  (): void => navigate(homeLink)
=======
                  (): void => history.push(homeLink)
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                }
              >
                {t('home')}
              </Nav.Link>
              {plugins.map(
                (plugin, idx) =>
                  plugin.view && (
                    <Nav.Link
                      active={props.currentPage == plugin.alias}
<<<<<<< HEAD
                      onClick={(): void => navigate(plugin.link)}
=======
                      onClick={(): void => history.push(plugin.link)}
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
                      key={idx}
                    >
                      {plugin.translated}
                    </Nav.Link>
<<<<<<< HEAD
                  ),
=======
                  )
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
              )}
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
                  <Dropdown.Item>
                    <Link to="/user/settings" className={styles.link}>
                      {t('settings')}
                    </Link>
                  </Dropdown.Item>
<<<<<<< HEAD
=======
                  <Dropdown.Item>
                    <Link to="/user/tasks" className={styles.link}>
                      {t('myTasks')}
                    </Link>
                  </Dropdown.Item>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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

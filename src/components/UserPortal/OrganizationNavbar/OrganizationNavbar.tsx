/**
 * OrganizationNavbar Component
 *
 * This component renders a responsive navigation bar for an organization portal.
 * It includes branding, navigation links, language selection, and user account options.
 *
 * @param props - Component props including currentPage: string.
 *
 * @returns The rendered OrganizationNavbar component.
 *
 * @remarks
 * - Uses `react-bootstrap` for layout and styling.
 * - Integrates `i18next` for language translation.
 * - Fetches organization details using Apollo GraphQL query.
 * - Provides user logout functionality and redirects to the home page.
 */
import React from 'react';
import styles from './OrganizationNavbar.module.css';
import TalawaImage from 'assets/images/talawa-logo-600x600.png';
import { Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { languages } from 'utils/languages';
import i18next from 'i18next';
import cookies from 'js-cookie';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { ORGANIZATION_LIST } from 'GraphQl/Queries/Queries';
import { useNavigate, useParams } from 'react-router-dom';
import useLocalStorage from 'utils/useLocalstorage';
import DropDownButton from 'shared-components/DropDownButton';
import { InterfaceNavbarProps } from 'types/UserPortal/OrganizationNavbar/interface';

function organizationNavbar(props: InterfaceNavbarProps): JSX.Element {
  const { t } = useTranslation('translation', {
    keyPrefix: 'userNavbar',
  });
  const { t: tCommon } = useTranslation('common');

  const navigate = useNavigate();

  const [organizationDetails, setOrganizationDetails] = React.useState<{
    name: string;
  }>({ name: '' });

  const { orgId: organizationId } = useParams();

  const { data } = useQuery(ORGANIZATION_LIST, {
    variables: { id: organizationId },
  });

  const [currentLanguageCode, setCurrentLanguageCode] = React.useState(
    cookies.get('i18next') || 'en',
  );

  const { getItem, clearAllItems } = useLocalStorage();

  /**
   * Handles user logout by clearing local storage and redirecting to the home page.
   */
  const handleLogout = async (): Promise<void> => {
    clearAllItems();
    window.location.replace('/');
  };

  const handleLanguageChange = async (languageCode: string): Promise<void> => {
    setCurrentLanguageCode(languageCode);
    await i18next.changeLanguage(languageCode);
  };

  const handleUserAction = async (action: string): Promise<void> => {
    switch (action) {
      case 'settings':
        navigate('/user/settings');
        break;
      case 'logout':
        await handleLogout();
        break;
    }
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
            alt={t('talawaBranding')}
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
            <Offcanvas.Title>{t('talawa')}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="me-auto flex-grow-1 pe-3 pt-1" variant="dark">
              <Nav.Link
                active={props.currentPage === 'home'}
                onClick={async (): Promise<void> => {
                  await navigate(homeLink);
                }}
              >
                {t('home')}
              </Nav.Link>
            </Nav>
            <Navbar.Collapse className="justify-content-end">
              <DropDownButton
                id="language-dropdown"
                options={languages.map((language) => ({
                  value: language.code,
                  label: language.name,
                }))}
                selectedValue={currentLanguageCode}
                onSelect={handleLanguageChange}
                dataTestIdPrefix="language"
                variant="light"
                btnStyle={styles.colorWhite}
                icon={
                  <LanguageIcon
                    className={styles.colorWhite}
                    data-testid="languageIcon"
                  />
                }
                placeholder=""
                ariaLabel={tCommon('changeLanguage')}
              />

              <div className={styles.userMenuContainer}>
                <span className={styles.userName}>
                  <b>{userName as string}</b>
                </span>
                <DropDownButton
                  id="user-dropdown"
                  options={[
                    {
                      value: 'settings',
                      label: tCommon('settings'),
                    },
                    {
                      value: 'logout',
                      label: tCommon('logout'),
                    },
                  ]}
                  onSelect={handleUserAction}
                  dataTestIdPrefix="user"
                  variant="light"
                  btnStyle={styles.colorWhite}
                  icon={
                    <PermIdentityIcon
                      className={styles.colorWhite}
                      data-testid="personIcon"
                    />
                  }
                  placeholder=""
                  ariaLabel={tCommon('userMenu')}
                />
              </div>
            </Navbar.Collapse>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default organizationNavbar;

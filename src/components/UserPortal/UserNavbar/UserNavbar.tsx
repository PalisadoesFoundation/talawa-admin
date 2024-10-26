import React from 'react';
import styles from './UserNavbar.module.css';
import TalawaImage from 'assets/images/talawa-logo-600x600.png';
import { Container, Dropdown, Navbar } from 'react-bootstrap';
import { languages } from 'utils/languages';
import i18next from 'i18next';
import cookies from 'js-cookie';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from 'utils/useLocalstorage';

/**
 * Navbar component for user-specific actions and settings.
 *
 * This component provides:
 * - A branding image and name.
 * - A dropdown for language selection.
 * - A dropdown for user actions including profile settings and logout.
 *
 * @returns JSX.Element - The rendered Navbar component.
 */
function userNavbar(): JSX.Element {
  // Hook for local storage operations
  const { getItem } = useLocalStorage();

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Translation hook for internationalization
  const { t } = useTranslation('translation', {
    keyPrefix: 'userNavbar',
  });
  const { t: tCommon } = useTranslation('common');

  // Mutation hook for revoking the refresh token
  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);

  // State for managing the current language code
  const [currentLanguageCode, setCurrentLanguageCode] = React.useState(
    /* istanbul ignore next */
    cookies.get('i18next') || 'en',
  );

  // Retrieve the username from local storage
  const userName = getItem('name');

  /**
   * Handles user logout by revoking the refresh token and clearing local storage.
   * Redirects to the home page after logout.
   */
  /* istanbul ignore next */
  const handleLogout = (): void => {
    revokeRefreshToken();
    localStorage.clear();
    navigate('/');
  };

  return (
    <Navbar variant="dark" className={`${styles.colorPrimary}`}>
      <Container fluid>
        {/* Navbar brand with logo and name */}
        <Navbar.Brand href="#">
          <img
            className={styles.talawaImage}
            src={TalawaImage}
            alt="Talawa Branding"
          />
          <b>{t('talawa')}</b>
        </Navbar.Brand>

        {/* Navbar toggle button for responsive design */}
        <Navbar.Toggle />

        {/* Navbar collapsible content */}
        <Navbar.Collapse className="justify-content-end">
          {/* Dropdown for language selection */}
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

          {/* Dropdown for user actions */}
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
              {/* Display the user's name */}
              <Dropdown.ItemText>
                <b>{userName}</b>
              </Dropdown.ItemText>
              {/* Link to user settings */}
              <Dropdown.Item
                onClick={() => navigate('/user/settings')}
                className={styles.link}
              >
                {tCommon('settings')}
              </Dropdown.Item>
              {/* Logout button */}
              <Dropdown.Item onClick={handleLogout} data-testid={`logoutBtn`}>
                {tCommon('logout')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default userNavbar;

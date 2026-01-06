/**
 * UserNavbar Component
 *
 * This component renders a responsive navigation bar for the user portal.
 * It includes branding, language selection, and user action options such as
 * navigating to settings or logging out.
 *
 * @component
 * @returns {JSX.Element} The rendered UserNavbar component.
 *
 * @remarks
 * - Utilizes `react-bootstrap` for layout and styling.
 * - Supports internationalization using `i18next` and `react-i18next`.
 * - Handles user logout by revoking the refresh token and clearing local storage.
 *
 * @dependencies
 * - `react-bootstrap` for Navbar, Dropdown, and Container components.
 * - `i18next` and `react-i18next` for language translation.
 * - `@apollo/client` for GraphQL logout mutation.
 * - `@mui/icons-material` for icons.
 * - `js-cookie` for managing language preference cookies.
 * - `react-router-dom` for navigation.
 *
 * @example
 * ```tsx
 * import UserNavbar from './UserNavbar';
 *
 * function App() {
 *   return <UserNavbar />;
 * }
 * ```
 *
 * @hook
 * - `useLocalStorage` for accessing local storage.
 * - `useNavigate` for programmatic navigation.
 * - `useTranslation` for translation and localization.
 * - `useMutation` for executing GraphQL mutations.
 *
 * @state
 * - `currentLanguageCode` (string): Tracks the currently selected language code.
 *
 * @function handleLogout
 * - Revokes the refresh token, clears local storage, and redirects to the home page.
 *
 */
import React from 'react';
import styles from './UserNavbar.module.css';
import TalawaImage from 'assets/images/talawa-logo-600x600.png';
import { Container, Dropdown, Navbar } from 'react-bootstrap';
import { languages } from 'utils/languages';
import i18next from 'i18next';
import cookies from 'js-cookie';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import NotificationIcon from 'components/NotificationIcon/NotificationIcon';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { LOGOUT_MUTATION } from 'GraphQl/Mutations/mutations';
import { useNavigate } from 'react-router';
import useLocalStorage from 'utils/useLocalstorage';

function userNavbar(): JSX.Element {
  // Hook for local storage operations
  const { getItem, clearAllItems } = useLocalStorage();

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Translation hook for internationalization
  const { t } = useTranslation('translation', {
    keyPrefix: 'userNavbar',
  });
  const { t: tCommon } = useTranslation('common');

  // Mutation hook for logout
  const [logout] = useMutation(LOGOUT_MUTATION);

  // State for managing the current language code
  const [currentLanguageCode, setCurrentLanguageCode] = React.useState(
    cookies.get('i18next') || 'en',
  );

  // Retrieve the username from local storage
  const userName = getItem('name') as string;

  /**
   * Handles user logout by revoking the refresh token and clearing the local storage.
   * Redirects to the home page after logout.
   */

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error(tCommon('errorOccurred'));
    } finally {
      clearAllItems();
      navigate('/');
    }
  };

  return (
    <Navbar variant="dark" className={`${styles.colorPrimary}`}>
      <Container fluid>
        {/* Navbar brand with logo and name */}
        <Navbar.Brand href="#">
          <img
            className={styles.talawaImage}
            src={TalawaImage}
            alt={t('talawaBranding')}
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

          <NotificationIcon />

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
                <b>{userName || ''}</b>
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

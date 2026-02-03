/**
 * UserNavbar Component
 *
 * This component renders a responsive navigation bar for the user portal.
 * It includes branding, language selection, and user action options such as
 * navigating to settings or logging out.
 *
 * @returns The rendered UserNavbar component.
 *
 * @remarks
 * - Utilizes `react-bootstrap` for layout and styling.
 * - Supports internationalization using `i18next` and `react-i18next`.
 * - Handles user logout by revoking the refresh token and clearing local storage.
 *
 * dependencies
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
 * hook
 * - `useLocalStorage` for accessing local storage.
 * - `useNavigate` for programmatic navigation.
 * - `useTranslation` for translation and localization.
 * - `useMutation` for executing GraphQL mutations.
 *
 * state
 * - `currentLanguageCode` (string): Tracks the currently selected language code.
 *
 * function handleLogout
 * - Revokes the refresh token, clears local storage, and redirects to the home page.
 *
 */
import React from 'react';
import styles from './UserNavbar.module.css';
import TalawaImage from 'assets/images/talawa-logo-600x600.png';
import { Container, Navbar } from 'react-bootstrap';
import { languages } from 'utils/languages';
import i18next from 'i18next';
import cookies from 'js-cookie';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import NotificationIcon from 'components/NotificationIcon/NotificationIcon';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { LOGOUT_MUTATION } from 'GraphQl/Mutations/mutations';
import { useNavigate } from 'react-router';
import useLocalStorage from 'utils/useLocalstorage';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';
import DropDownButton from 'shared-components/DropDownButton';

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
   * Handles language change with i18next.
   */
  const handleLanguageChange = async (languageCode: string): Promise<void> => {
    setCurrentLanguageCode(languageCode);
    await i18next.changeLanguage(languageCode);
  };

  /**
   * Handles user actions (settings or logout).
   */
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

  /**
   * Handles user logout by revoking the refresh token and clearing the local storage.
   * Redirects to the home page after logout.
   */

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
      NotificationToast.error(tCommon('errorOccurred'));
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
            data-testid="brandLogo"
          />
          <b data-testid="brandName">{t('talawa')}</b>
        </Navbar.Brand>

        {/* Navbar toggle button for responsive design */}
        <Navbar.Toggle />

        {/* Navbar collapsible content */}
        <Navbar.Collapse className="justify-content-end">
          {/* Dropdown for language selection */}
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

          <NotificationIcon />

          {/* Dropdown for user actions */}
          <div className={styles.userMenuContainer}>
            <span className={styles.userName}>
              <b>{userName || ''}</b>
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
      </Container>
    </Navbar>
  );
}

export default userNavbar;

/**
 * ProfileDropdown component renders a dropdown menu for user profile actions.
 * It displays the user's profile picture, name, and role, and provides options
 * to view the profile or log out of the application.
 *
 * @returns The ProfileDropdown component.
 *
 * @remarks
 * - Uses `useSession` to manage session-related actions like ending the session.
 * - Utilizes `useLocalStorage` to fetch user details such as name, role, and profile image.
 * - Employs `useMutation` from Apollo Client to handle the `LOGOUT_MUTATION` mutation.
 * - Integrates `react-bootstrap` for dropdown UI and `react-router-dom` for navigation.
 * - Supports internationalization using `react-i18next`.
 *
 * @example
 * ```tsx
 * <ProfileDropdown />
 * ```
 *
 * Dependencies:
 * - `Avatar`: Displays a fallback avatar if no user image is available.
 * - `useSession`: Provides session management utilities.
 * - `useLocalStorage`: Fetches user data from local storage.
 * - `useMutation`: Executes GraphQL mutations.
 * - `useNavigate`, `useParams`: Handles navigation and route parameters.
 *
 * @internal
 * - The `handleLogout` function calls the logout mutation, clears local storage, and navigates to the home page.
 * - The `displayedName` truncates the user's name if it exceeds the maximum length.
 *
 * Accessibility:
 * - Includes `aria-label` attributes for better screen reader support.
 * - Uses `data-testid` attributes for testing purposes.
 */
import Avatar from 'shared-components/Avatar/Avatar';
import React from 'react';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import useLocalStorage from 'utils/useLocalstorage';
import styles from 'style/app-fixed.module.css';
import dropdownStyles from './ProfileDropdown.module.css';
import { LOGOUT_MUTATION } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import useSession from 'utils/useSession';
import { resolveProfileNavigation } from 'utils/profileNavigation';

export const MAX_NAME_LENGTH = 20;

interface InterfaceProfileDropdownProps {
  portal?: 'admin' | 'user';
}

const ProfileDropdown = ({
  portal = 'admin',
}: InterfaceProfileDropdownProps): JSX.Element => {
  const { endSession } = useSession();
  const { t: tCommon } = useTranslation('common');
  const [logout] = useMutation(LOGOUT_MUTATION);
  const { getItem, clearAllItems } = useLocalStorage();
  const userRole = getItem<string>('role');
  const name: string = getItem<string>('name') || '';
  const userImage: string = getItem<string>('UserImage') || '';
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
    clearAllItems();
    endSession();
    navigate('/');
  };
  const displayedName =
    name.length > MAX_NAME_LENGTH
      ? name.substring(0, MAX_NAME_LENGTH - 3) + '...'
      : name;

  const profileDestination = resolveProfileNavigation({
    portal,
    role: userRole,
  });

  return (
    <Dropdown as={ButtonGroup} variant="none" className={styles.customDropdown}>
      <div className={styles.profileContainer}>
        <div className={styles.imageContainer}>
          {userImage && userImage !== 'null' ? (
            <img
              src={userImage}
              alt={tCommon('profilePicture')}
              data-testid="display-img"
              crossOrigin="anonymous"
            />
          ) : (
            <Avatar
              avatarStyle={styles.avatarStyle}
              data-testid="display-img"
              size={45}
              name={name}
              alt={tCommon('profilePicturePlaceholder')}
            />
          )}
        </div>
        <div className={styles.profileText}>
          <span className={styles.primaryText} data-testid="display-name">
            {displayedName}
          </span>
          <span className={styles.secondaryText} data-testid="display-type">
            {`${userRole}`}
          </span>
        </div>
      </div>
      <Dropdown.Toggle
        split
        variant="none"
        data-testid="togDrop"
        id="dropdown-split-basic"
        className={styles.dropdownToggle}
        aria-label={tCommon('userProfileMenu')}
      />
      <Dropdown.Menu>
        <Dropdown.Item
          data-testid="profileBtn"
          onClick={() => navigate(profileDestination)}
          aria-label={tCommon('viewProfile')}
        >
          {tCommon('viewProfile')}
        </Dropdown.Item>
        <Dropdown.Item
          className={dropdownStyles.logoutBtn}
          onClick={handleLogout}
          data-testid="logoutBtn"
        >
          {tCommon('logout')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileDropdown;

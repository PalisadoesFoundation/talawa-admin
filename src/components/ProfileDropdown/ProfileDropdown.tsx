/**
 * ProfileDropdown component renders a dropdown menu for user profile actions.
 * It displays the user's profile picture, name, and role, and provides options
 * to view the profile or log out of the application.
 *
 * @component
 * @returns {JSX.Element} The ProfileDropdown component.
 *
 * @remarks
 * - Uses `useSession` to manage session-related actions like ending the session.
 * - Utilizes `useLocalStorage` to fetch user details such as name, role, and profile image.
 * - Employs `useMutation` from Apollo Client to handle the `REVOKE_REFRESH_TOKEN` mutation.
 * - Integrates `react-bootstrap` for dropdown UI and `react-router-dom` for navigation.
 * - Supports internationalization using `react-i18next`.
 *
 * @example
 * ```tsx
 * <ProfileDropdown />
 * ```
 *
 * @dependencies
 * - `Avatar`: Displays a fallback avatar if no user image is available.
 * - `useSession`: Provides session management utilities.
 * - `useLocalStorage`: Fetches user data from local storage.
 * - `useMutation`: Executes GraphQL mutations.
 * - `useNavigate`, `useParams`: Handles navigation and route parameters.
 *
 * @internal
 * - The `logout` function clears local storage, revokes the refresh token, and navigates to the home page.
 * - The `displayedName` truncates the user's name if it exceeds the maximum length.
 *
 * @accessibility
 * - Includes `aria-label` attributes for better screen reader support.
 * - Uses `data-testid` attributes for testing purposes.
 */
import Avatar from 'components/Avatar/Avatar';
import React from 'react';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import useLocalStorage from 'utils/useLocalstorage';
import styles from 'style/app-fixed.module.css';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import useSession from 'utils/useSession';
import { toast } from 'react-toastify';

const profileDropdown = (): JSX.Element => {
  const { endSession } = useSession();
  const { t: tCommon } = useTranslation('common');
  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);
  const { getItem } = useLocalStorage();
  const userRole = getItem('role');
  const name: string = getItem('name') || '';
  const userImage: string = getItem('UserImage') || '';
  const navigate = useNavigate();
  const { orgId } = useParams();

  const logout = async (): Promise<void> => {
    try {
      await revokeRefreshToken();
      toast.success(tCommon('logoutSuccess') || 'Successfully logged out');
    } catch (error) {
      /* istanbul ignore next */
      toast.error(
        tCommon('errorLogout') ||
          'Failed to logout. Please try again or clear browser cache.',
      );
      /* istanbul ignore next */
      if (error instanceof Error) {
        console.error('Error revoking refresh token:', error.message);
      }
    }
    localStorage.clear();
    endSession();
    navigate('/');
  };
  const MAX_NAME_LENGTH = 20;
  const displayedName =
    name.length > MAX_NAME_LENGTH
      ? name.substring(0, MAX_NAME_LENGTH - 3) + '...'
      : name;

  return (
    <Dropdown as={ButtonGroup} variant="none" className={styles.customDropdown}>
      <div className={styles.profileContainer}>
        <div className={styles.imageContainer}>
          {userImage && userImage !== 'null' ? (
            <img
              src={userImage}
              alt={`profile picture`}
              data-testid="display-img"
              crossOrigin="anonymous"
            />
          ) : (
            <Avatar
              avatarStyle={styles.avatarStyle}
              data-testid="display-img"
              size={45}
              name={name}
              alt={`dummy picture`}
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
        aria-label="User Profile Menu"
      />
      <Dropdown.Menu>
        <Dropdown.Item
          data-testid="profileBtn"
          onClick={() =>
            userRole === 'regular'
              ? navigate(`/user/settings`)
              : navigate(`/member/${orgId || ''}`)
          }
          aria-label="View Profile"
        >
          {tCommon('viewProfile')}
        </Dropdown.Item>
        <Dropdown.Item
          style={{ color: 'red' }}
          onClick={logout}
          data-testid="logoutBtn"
        >
          {tCommon('logout')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default profileDropdown;

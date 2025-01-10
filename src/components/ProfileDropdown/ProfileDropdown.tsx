import Avatar from 'components/Avatar/Avatar';
import React from 'react';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import useLocalStorage from 'utils/useLocalstorage';
import styles from './ProfileDropdown.module.css';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import useSession from 'utils/useSession';

/**
 * Renders a profile dropdown menu for the user.
 *
 * This component displays the user's profile picture or an avatar, their name (truncated if necessary),
 * and their role (SuperAdmin, Admin, or User). It provides options to view the profile or log out.
 *
 * - If a user image is available, it displays that; otherwise, it shows an avatar.
 * - The displayed name is truncated if it exceeds a specified length.
 * - The logout function revokes the refresh token and clears local storage before redirecting to the home page.
 *
 * @returns JSX.Element - The profile dropdown menu.
 */
const profileDropdown = (): JSX.Element => {
  const { endSession } = useSession();
  const { t: tCommon } = useTranslation('common');
  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);
  const { getItem } = useLocalStorage();
  const superAdmin = getItem('SuperAdmin');
  const adminFor = getItem('AdminFor');
  const userRole = superAdmin
    ? 'SuperAdmin'
    : adminFor?.length > 0
      ? 'Admin'
      : 'User';
  const firstName = getItem('FirstName');
  const lastName = getItem('LastName');
  const userImage = getItem('UserImage');
  const navigate = useNavigate();
  const { orgId } = useParams();

  const logout = async (): Promise<void> => {
    try {
      await revokeRefreshToken();
    } catch (error) {
      /*istanbul ignore next*/
      console.error('Error revoking refresh token:', error);
    }
    localStorage.clear();
    endSession();
    navigate('/');
  };
  const MAX_NAME_LENGTH = 20;
  const fullName = `${firstName} ${lastName}`;
  const displayedName =
    fullName.length > MAX_NAME_LENGTH
      ? /*istanbul ignore next*/
        fullName.substring(0, MAX_NAME_LENGTH - 3) + '...'
      : fullName;

  return (
    <Dropdown as={ButtonGroup} variant="none">
      <div className={styles.profileContainer}>
        <div className={styles.imageContainer}>
          {userImage && userImage !== 'null' ? (
            /*istanbul ignore next*/
            <img
              src={userImage}
              alt={`profile picture`}
              data-testid="display-img"
            />
          ) : (
            <Avatar
              data-testid="display-img"
              size={45}
              avatarStyle={styles.avatarStyle}
              name={`${firstName} ${lastName}`}
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
        style={{ backgroundColor: 'white' }}
        data-testid="togDrop"
        id="dropdown-split-basic"
        className={styles.dropdownToggle}
        aria-label="User Profile Menu"
      />
      <Dropdown.Menu>
        <Dropdown.Item
          data-testid="profileBtn"
          onClick={() =>
            userRole === 'User'
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

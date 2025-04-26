import React from 'react';
import Avatar from 'components/Avatar/Avatar';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import useLocalStorage from 'utils/useLocalstorage';
import styles from '../../style/app.module.css';
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
  const { handleLogout } = useSession();
  const { t: tCommon } = useTranslation('common');
  const { getItem } = useLocalStorage();
  const userRole = getItem('role');
  const name: string = getItem('name') || '';
  const userImage: string = getItem('UserImage') || '';
  const navigate = useNavigate();
  const { orgId } = useParams();

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
          onClick={handleLogout}
          data-testid="logoutBtn"
        >
          {tCommon('logout')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default profileDropdown;

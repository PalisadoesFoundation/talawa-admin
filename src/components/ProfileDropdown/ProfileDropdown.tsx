import Avatar from 'components/Avatar/Avatar';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ButtonGroup } from 'react-bootstrap';
import useLocalStorage from 'utils/useLocalstorage';
import styles from '../../style/app.module.css';
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
  const userRole = getItem('role');
  const name = getItem('name') || '';
  const userImage = getItem('UserImage');
  const navigate = useNavigate();
  const { orgId } = useParams();

  const logout = async (): Promise<void> => {
    try {
      await revokeRefreshToken();
    } catch (error) {
      console.error('Error revoking refresh token:', error);
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
    <div className={styles.Profilebox}>
      <div className={styles.profileContainerarrowright}>
        <div className={styles.imageContainerSidebar}>
          {userImage && userImage !== 'null' ? (
            <img
              src={userImage}
              alt={`profile picture`}
              data-testid="display-img"
              crossOrigin="anonymous"
            />
          ) : (
            <Avatar
              data-testid="display-img"
              size={45}
              avatarStyle={styles.avatarStyle}
              name={name}
              alt={`dummy picture`}
            />
          )}
        </div>
        <div
          className={styles.profileTextTitle}
          role="button"
          tabIndex={0}
          aria-label="View Profile"
          data-testid="profileBtn"
          onClick={() =>
            userRole === 'regular'
              ? navigate(`/user/settings`)
              : navigate(`/member/${orgId || ''}`)
          }
        >
          <span className={styles.primaryText} data-testid="display-name">
            {displayedName}
            <span className={styles.arrowbtn}>
              <i className="fa fa-angle-right" aria-hidden="true"></i>
            </span>
          </span>
          <span className={styles.secondaryText} data-testid="display-type">
            {userRole}
          </span>
        </div>
      </div>
      <div>
        <ButtonGroup
          className={styles.logoutBtn}
          onClick={logout}
          data-testid="logoutBtn"
        >
          {tCommon('logout')}
        </ButtonGroup>
      </div>
    </div>
  );
};

export default profileDropdown;

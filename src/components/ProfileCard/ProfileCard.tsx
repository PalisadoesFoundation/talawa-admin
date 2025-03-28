import Avatar from 'components/Avatar/Avatar';
import React from 'react';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import useLocalStorage from 'utils/useLocalstorage';
import styles from 'style/app-fixed.module.css';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

/**
 * Renders a profile card for the user.
 *
 * This component displays the user's profile picture or an avatar, their name (truncated if necessary),
 * and their role (SuperAdmin, Admin, or User). It provides options to view the profile.
 *
 * - If a user image is available, it displays that; otherwise, it shows an avatar.
 * - The displayed name is truncated if it exceeds a specified length.

 *
 * @returns JSX.Element - The profile card .
 */
const ProfileCard = (): JSX.Element => {
  const { getItem } = useLocalStorage();
  const superAdmin = getItem('SuperAdmin');
  const adminFor: string | string[] = getItem('AdminFor') || [];
  const userRole = superAdmin
    ? 'SuperAdmin'
    : adminFor?.length > 0
      ? 'Admin'
      : 'User';
  const firstName = getItem('FirstName');
  const lastName = getItem('LastName');
  const userImage = getItem('UserImage') as string;
  const navigate = useNavigate();
  const { orgId } = useParams();

  const MAX_NAME_LENGTH = 20;
  const fullName = `${firstName} ${lastName}`;
  const displayedName =
    fullName.length > MAX_NAME_LENGTH
      ? fullName.substring(0, MAX_NAME_LENGTH - 3) + '...'
      : fullName;

  return (
    <Dropdown as={ButtonGroup} variant="none">
      <div className={styles.profileContainer}>
        <div className={styles.imageContainer}>
          {userImage && userImage !== 'null' ? (
            <img
              src={userImage}
              alt={`profile picture`}
              data-testid="display-img"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = 'none';
              }}
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
        <div className={styles.profileTextUserSidebarOrg}>
          <span className={styles.primaryText} data-testid="display-name">
            {displayedName}
          </span>
          <span className={styles.secondaryText} data-testid="display-type">
            {`${userRole}`}
          </span>
        </div>
        <button
          className={styles.chevronRightbtn}
          data-testid="profileBtn"
          onClick={() =>
            userRole === 'User'
              ? navigate(`/user/settings`)
              : navigate(`/member/${orgId || ''}`)
          }
        >
          <ChevronRightIcon className={styles.chevronIcon} />
        </button>
      </div>
    </Dropdown>
  );
};

export default ProfileCard;

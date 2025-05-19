/**
 * ProfileCard Component
 *
 * This component renders a user profile card with the user's avatar, name, and role.
 * It also provides navigation functionality based on the user's role.
 *
 * @component
 * @returns {JSX.Element} A dropdown containing the user's profile information.
 *
 * @remarks
 * - The component uses `useLocalStorage` to retrieve user details such as name, role, and profile image.
 * - The user's role is determined based on the presence of `SuperAdmin` or `AdminFor` in local storage.
 * - If the user's full name exceeds the maximum length, it is truncated and appended with ellipses.
 * - The profile image is displayed if available; otherwise, a default avatar is shown.
 * - Clicking the chevron button navigates the user to different routes based on their role.
 *
 * @example
 * ```tsx
 * <ProfileCard />
 * ```
 *
 * @dependencies
 * - `Avatar`: A component used to display a default avatar when no profile image is available.
 * - `react-bootstrap`: Provides the `Dropdown` and `ButtonGroup` components for layout.
 * - `react-router-dom`: Used for navigation (`useNavigate`) and extracting route parameters (`useParams`).
 * - `@mui/icons-material`: Provides the `ChevronRightIcon` for the navigation button.
 *
 * @localStorage
 * - `SuperAdmin`: Boolean indicating if the user is a super admin.
 * - `AdminFor`: Array or string indicating the organizations the user is an admin for.
 * - `FirstName`: The user's first name.
 * - `LastName`: The user's last name.
 * - `UserImage`: URL of the user's profile image.
 *
 * @styles
 * - `styles.profileContainer`: Styles the main container of the profile card.
 * - `styles.imageContainer`: Styles the container for the profile image or avatar.
 * - `styles.profileTextUserSidebarOrg`: Styles the text container for the user's name and role.
 * - `styles.chevronRightbtn`: Styles the chevron button for navigation.
 * - `styles.chevronIcon`: Styles the chevron icon inside the button.
 */
import Avatar from 'components/Avatar/Avatar';
import React from 'react';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import useLocalStorage from 'utils/useLocalstorage';
import styles from 'style/app-fixed.module.css';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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

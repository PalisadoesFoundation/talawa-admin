import Avatar from 'components/Avatar/Avatar';
import React from 'react';
import { ButtonGroup, Dropdown } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import useLocalStorage from 'utils/useLocalstorage';
import styles from './profileDropdown.module.css';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';

const profileDropdown = (): JSX.Element => {
  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);
  const { getItem } = useLocalStorage();
  const userType = getItem('UserType');
  const firstName = getItem('FirstName');
  const lastName = getItem('LastName');
  const userImage = getItem('UserImage');
  const { orgId } = useParams();
  const navigate = useNavigate();

  const logout = async (): Promise<void> => {
    try {
      await revokeRefreshToken();
    } catch (error) {
      console.error('Error revoking refresh token:', error);
    }
    localStorage.clear();
    navigate('/');
  };
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
            /*istanbul ignore next*/
            <img src={userImage} alt={`profile picture`} />
          ) : (
            <Avatar
              size={45}
              avatarStyle={styles.avatarStyle}
              name={`${firstName} ${lastName}`}
              alt={`dummy picture`}
            />
          )}
        </div>
        <div className={styles.profileText}>
          <span className={styles.primaryText}>{displayedName}</span>
          <span className={styles.secondaryText}>
            {`${userType}`.toLowerCase()}
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
          onClick={() => navigate(`/member/${orgId}`)}
          aria-label="View Profile"
        >
          View Profile
        </Dropdown.Item>
        <Dropdown.Item
          style={{ color: 'red' }}
          onClick={logout}
          data-testid="logoutBtn"
        >
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default profileDropdown;

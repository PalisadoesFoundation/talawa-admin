import { Dropdown } from 'react-bootstrap';
import { InterfaceUserDropdownProps } from 'types/UserPortalNavigationBar/interface';

// Render user profile dropdown
const UserProfileDropdown = (
  props: InterfaceUserDropdownProps,
): JSX.Element | null => {
  const {
    showUserProfile,
    testIdPrefix,
    dropDirection,
    handleLogout,
    finalUserName,
    navigate,
    tCommon,
    styles,
    PermIdentityIcon,
  } = props;
  if (!showUserProfile) return null;

  return (
    <Dropdown drop={dropDirection}>
      <Dropdown.Toggle
        variant="white"
        id="dropdown-basic"
        data-testid={`${testIdPrefix}logoutDropdown`}
        className={styles.colorWhite}
      >
        <PermIdentityIcon
          className={styles.colorWhite}
          data-testid={`${testIdPrefix}personIcon`}
        />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.ItemText>
          <b>{finalUserName || ''}</b>
        </Dropdown.ItemText>
        <Dropdown.Item
          onClick={() => navigate('/user/settings')}
          className={styles.link}
        >
          {tCommon('settings')}
        </Dropdown.Item>
        <Dropdown.Item
          onClick={handleLogout}
          data-testid={`${testIdPrefix}logoutBtn`}
        >
          {tCommon('logout')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
export default UserProfileDropdown;

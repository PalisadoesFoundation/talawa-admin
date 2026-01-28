import { Dropdown } from 'react-bootstrap';
import { InterfaceUserDropdownProps } from 'types/UserPortal/UserPortalNavigationBar/interface';
/**
 * UserProfileDropdown Component
 *
 * Renders a dropdown menu for user profile actions including settings navigation
 * and logout functionality. This component is typically used in the navigation bar
 * to provide quick access to user-related actions.
 *
 *
 * @param showUserProfile - Whether to display the dropdown (returns null if false)
 * @param testIdPrefix - Prefix for test IDs to ensure unique identifiers
 * @param dropDirection - Direction the dropdown menu opens
 * @param handleLogout - Callback function executed when user clicks logout
 * @param finalUserName - User's display name shown in the dropdown
 * @param navigate - React Router navigation function for routing
 * @param tCommon - i18next translation function for common translations
 * @param styles - CSS module classes for styling
 * @param PermIdentityIcon - Material-UI icon component for user avatar
 *
 * @returns The rendered dropdown component, or null if showUserProfile is false
 *
 * @example
 * ```tsx
 * <UserProfileDropdown
 *   showUserProfile={true}
 *   testIdPrefix="navbar"
 *   dropDirection="start"
 *   handleLogout={handleLogoutAction}
 *   finalUserName="John Doe"
 *   navigate={navigate}
 *   tCommon={t}
 *   styles={navbarStyles}
 *   PermIdentityIcon={PermIdentityIcon}
 * />
 * ```
 *
 * @see {@link InterfaceUserDropdownProps} for detailed prop type definitions
 */
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
        aria-label={tCommon('userMenu')}
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

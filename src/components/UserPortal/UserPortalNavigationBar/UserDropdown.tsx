import DropDownButton from 'shared-components/DropDownButton';
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
    handleLogout,
    finalUserName,
    navigate,
    tCommon,
    styles,
    PermIdentityIcon,
    dropDirection,
  } = props;
  if (!showUserProfile) return null;
  const handleUserAction = (action: string): void => {
    switch (action) {
      case 'settings':
        navigate('/user/settings');
        break;
      case 'logout':
        handleLogout();
        break;
    }
  };

  return (
    <div className={styles.userMenuContainer}>
      <span className={styles.userName}>
        <b>{finalUserName || ''}</b>
      </span>
      <DropDownButton
        // i18n-ignore-next-line
        id={`${testIdPrefix}user-dropdown`}
        options={[
          {
            value: 'settings',
            label: tCommon('settings'),
          },
          {
            value: 'logout',
            label: tCommon('logout'),
          },
        ]}
        drop={dropDirection}
        onSelect={handleUserAction}
        // i18n-ignore-next-line
        dataTestIdPrefix={`${testIdPrefix}user`}
        variant="light"
        btnStyle={styles.colorWhite}
        icon={
          <PermIdentityIcon
            className={styles.colorWhite}
            data-testid={`${testIdPrefix}personIcon`}
          />
        }
        ariaLabel={tCommon('userMenu')}
        placeholder=""
      />
    </div>
  );
};
export default UserProfileDropdown;

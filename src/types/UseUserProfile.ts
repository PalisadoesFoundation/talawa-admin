/**
 * Return type for the useUserProfile hook.
 *
 * @remarks
 * Provides user profile data and actions (logout, translation) for rendering
 * profile dropdowns in portal screens.
 */
export interface InterfaceUseUserProfileReturn {
  name: string;
  displayedName: string;
  userRole: string;
  userImage: string;
  profileDestination: string;
  handleLogout: () => Promise<void>;
  tCommon: (key: string) => string;
}

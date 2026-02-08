export interface InterfaceUseUserProfileReturn {
  name: string;
  displayedName: string;
  userRole: string;
  userImage: string;
  profileDestination: string;
  handleLogout: () => Promise<void>;
  tCommon: (key: string) => string;
}

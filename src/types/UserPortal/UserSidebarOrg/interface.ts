import type { TargetsType } from 'state/reducers/routesReducer';

/**
 * Props for UserSidebarOrg component.
 */
export interface InterfaceUserSidebarOrgProps {
  orgId: string;
  targets: TargetsType[];
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

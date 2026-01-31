import type { TargetsType } from 'state/reducers/routesReducer';
/**
 * Props for LeftDrawerOrg component.
 */
export interface InterfaceLeftDrawerOrgProps {
  orgId: string;
  targets: TargetsType[];
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

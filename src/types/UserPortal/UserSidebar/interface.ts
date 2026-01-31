/**
 * Interface for UserSidebar Type Definitions
 */
import type { Dispatch, SetStateAction } from 'react';
/**
 * Interface definition for UserSidebar props
 */
export interface InterfaceUserSidebarProps {
  hideDrawer: boolean;
  setHideDrawer: Dispatch<SetStateAction<boolean>>;
}

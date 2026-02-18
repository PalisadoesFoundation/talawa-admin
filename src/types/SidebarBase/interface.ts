/**
 * Interface for SidebarBase component props.
 */
export interface ISidebarBaseProps {
  /** State indicating whether the sidebar is hidden */
  hideDrawer: boolean;
  /** Function to toggle sidebar visibility */
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  /** Type of portal (admin or user) */
  portalType: 'admin' | 'user';
  /** Navigation items and other content */
  children: React.ReactNode;
  /** (Optional) Content after branding (e.g., org section) */
  headerContent?: React.ReactNode;
  /** (Optional) Footer content */
  footerContent?: React.ReactNode;
  /** (Optional) Background color override */
  backgroundColor?: string;
  /** (Optional) Whether to persist toggle state to localStorage */
  persistToggleState?: boolean;
}

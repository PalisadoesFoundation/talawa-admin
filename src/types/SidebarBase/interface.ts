/**
 * Interface for SidebarBase component props.
 *
 * @param hideDrawer - State indicating whether the sidebar is hidden
 * @param setHideDrawer - Function to toggle sidebar visibility
 * @param portalType - Type of portal (admin or user)
 * @param children - Navigation items and other content
 * @param headerContent - (Optional) Content after branding (e.g., org section)
 * @param footerContent - (Optional) Footer content
 * @param backgroundColor - (Optional) Background color override
 * @param persistToggleState - (Optional) Whether to persist toggle state to localStorage
 */
export interface ISidebarBaseProps {
  hideDrawer: boolean;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  portalType: 'admin' | 'user';
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  backgroundColor?: string;
  persistToggleState?: boolean;
}

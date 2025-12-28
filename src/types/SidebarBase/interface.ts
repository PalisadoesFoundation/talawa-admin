/**
 * Interface for SidebarBase component props.
 *
 * @interface ISidebarBaseProps
 * @property {boolean} hideDrawer - State indicating whether the sidebar is hidden
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setHideDrawer - Function to toggle sidebar visibility
 * @property {'admin' | 'user'} portalType - Type of portal (admin or user)
 * @property {React.ReactNode} children - Navigation items and other content
 * @property {React.ReactNode} [headerContent] - Optional content after branding (e.g., org section)
 * @property {React.ReactNode} [footerContent] - Optional footer content
 * @property {string} [backgroundColor] - Optional background color override
 * @property {boolean} [persistToggleState] - Whether to persist toggle state to localStorage
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

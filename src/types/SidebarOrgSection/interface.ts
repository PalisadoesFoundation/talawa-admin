/**
 * Interface for SidebarOrgSection component props.
 *
 * @interface ISidebarOrgSectionProps
 * @property {string} orgId - Organization ID to fetch and display
 * @property {boolean} hideDrawer - Whether the drawer is hidden/collapsed
 * @property {boolean} [isProfilePage] - Whether current page is the profile page
 */
export interface ISidebarOrgSectionProps {
  orgId: string;
  hideDrawer: boolean;
  isProfilePage?: boolean;
}

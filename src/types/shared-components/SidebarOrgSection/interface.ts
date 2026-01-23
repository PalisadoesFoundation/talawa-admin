/**
 * Props for the SidebarOrgSection component.
 */
export interface ISidebarOrgSectionProps {
  /** Organization ID to fetch and display. */
  orgId: string;
  /** Whether the drawer is hidden/collapsed. */
  hideDrawer: boolean;
  /** Whether current page is the profile page. */
  isProfilePage?: boolean;
}

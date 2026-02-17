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

export interface IOrganizationData {
  id: string;
  name: string;
  description?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  countryCode?: string | null;
  avatarURL?: string | null;
  createdAt: string;
  isUserRegistrationRequired?: boolean;
}

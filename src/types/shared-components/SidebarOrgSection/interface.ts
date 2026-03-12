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
  /** Unique identifier of the organization */
  id: string;

  /** Display name of the organization */
  name: string;

  /** Optional short description of the organization */
  description?: string | null;

  /** Primary address line */
  addressLine1?: string | null;

  /** Secondary address line */
  addressLine2?: string | null;

  /** City where the organization is located */
  city?: string | null;

  /** State or province of the organization */
  state?: string | null;

  /** Postal or ZIP code */
  postalCode?: string | null;

  /** ISO country code representing the organization's country */
  countryCode?: string | null;

  /** URL of the organization's avatar or logo image */
  avatarURL?: string | null;

  /** ISO timestamp string indicating when the organization was created */
  createdAt: string;

  /** Indicates whether user registration is required
   * before accessing organization resources*/
  isUserRegistrationRequired?: boolean;
}

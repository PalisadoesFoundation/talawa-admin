/**
 * Props for the OrgUpdate component.
 */
export interface InterfaceOrgUpdateProps {
  /** The unique identifier of the organization to update. */
  orgId: string;
}

/**
 * Represents an organization's basic data structure.
 */
export interface InterfaceOrganization {
  /** Unique identifier of the organization. */
  id: string;
  /** Name of the organization. */
  name: string;
  /** Description of the organization. */
  description: string;
  /** Primary address line. */
  addressLine1: string;
  /** Secondary address line. */
  addressLine2: string;
  /** City of the organization. */
  city: string;
  /** State or province. */
  state: string;
  /** Postal or ZIP code. */
  postalCode: string;
  /** ISO country code. */
  countryCode: string;
  /** URL of the organization's avatar image, or null if not set. */
  avatarURL: string | null;
  /** Whether user registration requires approval, or null if not configured. */
  isUserRegistrationRequired: boolean | null;
  /** Whether the organization is visible in search results. */
  isVisibleInSearch: boolean | null;
}

/**
 * Input type for the updateOrganization mutation.
 */
export interface InterfaceMutationUpdateOrganizationInput {
  id: string;
  name?: string;
  description?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  avatar?: File;
  isUserRegistrationRequired?: boolean;
  isVisibleInSearch?: boolean;
}

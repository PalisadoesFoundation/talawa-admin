export interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  image?: string;
  description: string;
  members?: {
    edges: {
      node: {
        id: string;
      };
    }[];
  };
  admins?: { id: string }[];
  addressLine1: string;
  membersCount?: number;
  adminsCount?: number;
  membershipRequestStatus?: string;
  userRegistrationRequired?: boolean;
  membershipRequests?: {
    id: string;
    user: {
      id: string;
    };
  }[];
  isJoined?: boolean;
  avatarURL?: string | null;
  createdAt?: string;
  role: string;
}

/**
 * Props for the OrganizationCard component.
 *
 * @remarks
 * This interface wraps the organization data for the card component.
 *
 * @example
 * ```tsx
 * <OrganizationCard
 *   data={{
 *     id: '123',
 *     name: 'Example Org',
 *     description: 'An example organization',
 *     // ... other organization properties
 *   }}
 * />
 * ```
 */
export interface InterfaceOrganizationCardPropsPG {
  /**
   * The organization data to display in the card
   */
  data: InterfaceOrganizationCardProps;
}

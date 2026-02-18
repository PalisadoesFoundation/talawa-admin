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

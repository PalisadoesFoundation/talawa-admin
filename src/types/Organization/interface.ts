export interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
  members?: {
    id: string;
  }[];
  address: {
    city: string;
    countryCode: string;
    line1: string;
    postalCode: string;
    state: string;
  };
  membersCount: number;
  adminsCount: number;
  membershipRequestStatus: string;
  isUserRegistrationRequired: boolean;
  membershipRequests?: InterfaceMembershipRequestSummary[];
  isJoined?: boolean;
}

export type InterfaceMembershipRequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected';

export interface InterfaceMembershipRequestSummary {
  status: InterfaceMembershipRequestStatus;
  membershipRequestId: string;
}

export interface InterfaceOrgPeopleListCardProps {
  id: string | undefined;
  toggleRemoveModal: () => void;
}

export interface InterfaceOrganizationCardStartProps {
  image: string;
  id: string;
  name: string;
}

export interface InterfaceOrgPostCardProps {
  postID: string;
  id: string;
  postTitle: string;
  postInfo: string;
  postAuthor: string;
  postPhoto: string | null;
  postVideo: string | null;
  pinned: boolean;
}

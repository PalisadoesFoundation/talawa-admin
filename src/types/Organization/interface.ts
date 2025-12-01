export interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
  members?: {
    id: string;
  }[];
  addressLine1: string;
  membersCount: number;
  adminsCount: number;
  membershipRequestStatus: string;
  userRegistrationRequired: boolean;
  membershipRequests: {
    id: string;
    user: {
      id: string;
    };
  }[];
  isJoined?: boolean;
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

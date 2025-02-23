export interface InterfaceOrganizationCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
  admins: {
    id: string;
  }[];
  members: {
    id: string;
  }[];
  address: {
    city: string;
    countryCode: string;
    line1: string;
    postalCode: string;
    state: string;
  };
  membershipRequestStatus: string;
  userRegistrationRequired: boolean;
  membershipRequests: {
    _id: string;
    user: {
      _id: string;
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

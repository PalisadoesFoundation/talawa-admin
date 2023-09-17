export interface InterfaceUserType {
  user: {
    firstName: string;
    lastName: string;
    image: string | null;
    email: string;
    userType: string;
    adminFor: {
      _id: string;
      name: string;
      image: string | null;
    }[];
  };
}

export interface InterfaceOrgConnectionInfoType {
  _id: string;
  image: string | null;
  creator: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  name: string;
  members: {
    _id: string;
  }[];
  admins: {
    _id: string;
  }[];
  createdAt: string;
  location: string;
}
export interface InterfaceOrgConnectionType {
  organizationsConnection: InterfaceOrgConnectionInfoType[];
}

export interface InterfaceQueryOrganizationsListObject {
  _id: string;
  image: string | null;
  creator: {
    firstName: string;
    lastName: string;
    email: string;
  };
  name: string;
  description: string;
  location: string;
  isPublic: boolean;
  visibleInSearch: boolean;
  members: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
  admins: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
  membershipRequests: {
    _id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  }[];
  blockedUsers: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
}

export interface InterfaceQueryOrganizationPostListItem {
  _id: string;
  title: string;
  text: string;
  imageUrl: null;
  videoUrl: null;
  creator: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
}
export interface InterfaceQueryOrganizationEventListItem {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  recurring: boolean;
  isPublic: boolean;
  isRegisterable: boolean;
}

export interface InterfaceQueryBlockPageMemberListItem {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  organizationsBlockedBy: {
    _id: string;
  }[];
}

export interface InterfaceUserType {
  user: {
    firstName: string;
    lastName: string;
    image: string | null;
    email: string;
  };
}

export interface InterfaceActionItemCategoryInfo {
  _id: string;
  name: string;
  isDisabled: boolean;
}

export interface InterfaceActionItemCategoryList {
  actionItemCategoriesByOrganization: InterfaceActionItemCategoryInfo[];
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
  address: InterfaceAddress;
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
  address: InterfaceAddress;
  userRegistrationRequired: boolean;
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
  createdAt: string;
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

export interface InterfaceQueryUserListItem {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string | null;
    email: string;
    adminApproved: boolean;
    organizationsBlockedBy: {
      _id: string;
      name: string;
      image: string | null;
      address: InterfaceAddress;
      creator: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        image: string | null;
      };
      createdAt: string;
    }[];
    joinedOrganizations: {
      _id: string;
      name: string;
      address: InterfaceAddress;
      image: string | null;
      createdAt: string;
      creator: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        image: string | null;
      };
    }[];
    createdAt: string;
    registeredEvents: { _id: string }[];
    membershipRequests: { _id: string }[];
  };
  appUserProfile: {
    _id: string;
    adminFor: { _id: string }[];
    isSuperAdmin: boolean;
    createdOrganizations: { _id: string }[];
    createdEvents: { _id: string }[];
    eventAdmin: { _id: string }[];
  };
}

export interface InterfaceQueryRequestListItem {
  _id: string;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  userType: string;
  adminApproved: boolean;
  createdAt: string;
}

export interface InterfaceAddress {
  city: string;
  countryCode: string;
  dependentLocality: string;
  line1: string;
  line2: string;
  postalCode: string;
  sortingCode: string;
  state: string;
}

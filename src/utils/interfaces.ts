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

export interface InterfaceActionItemInfo {
  _id: string;
  assignee: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  assigner: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  actionItemCategory: {
    _id: string;
    name: string;
  };
  preCompletionNotes: string;
  postCompletionNotes: string;
  assignmentDate: Date;
  dueDate: Date;
  completionDate: Date;
  isCompleted: boolean;
  event: {
    _id: string;
    title: string;
  };
  creator: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

export interface InterfaceActionItemList {
  actionItemsByOrganization: InterfaceActionItemInfo[];
}

export interface InterfaceMembersList {
  organizations: {
    _id: string;
    members: InterfaceMemberInfo[];
  }[];
}

export interface InterfaceMemberInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  createdAt: string;
  organizationsBlockedBy: {
    _id: string;
  }[];
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
export interface InterfacePostForm {
  posttitle: string;
  postinfo: string;
  postphoto: string | null;
  postvideo: string | null;
  pinned: boolean;
}
export interface InterfaceQueryOrganizationPostListItem {
  posts: {
    edges: {
      node: {
        _id: string;
        title: string;
        text: string;
        imageUrl: string | null;
        videoUrl: string | null;
        creator: {
          _id: string;
          firstName: string;
          lastName: string;
          email: string;
        };
        createdAt: string;
        likeCount: number;
        commentCount: number;
        pinned: boolean;
      };
      cursor: string;
    }[];
    pageInfo: {
      startCursor: string;
      endCursor: string;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    totalCount: number;
  };
}
export interface InterfaceQueryOrganizationFunds {
  fundsByOrganization: {
    _id: string;
    name: string;
    refrenceNumber: string;
    taxDeductible: boolean;
    isArchived: boolean;
    isDefault: boolean;
    createdAt: string;
    organizationId: string;
    creator: { _id: string; firstName: string; lastName: string };
  }[];
}
export interface InterfaceQueryOrganizationFundCampaigns {
  campaigns: {
    _id: string;
    name: string;
    fundingGoal: number;
    startDate: Date;
    endDate: Date;
    createdAt: string;
    currency: string;
  }[];
}
export interface InterfaceQueryFundCampaignsPledges {
  startDate: Date;
  endDate: Date;
  pledges: {
    _id: string;
    amount: number;
    currency: string;
    endDate: string;
    startDate: string;
    users: {
      _id: string;
      firstName: string;
    }[];
  }[];
}
export interface InterfaceFundInfo {
  _id: string;
  name: string;
  refrenceNumber: string;
  taxDeductible: boolean;
  isArchived: boolean;
  isDefault: boolean;
  createdAt: string;
}
export interface InterfaceCampaignInfo {
  _id: string;
  name: string;
  fundingGoal: number;
  startDate: Date;
  endDate: Date;
  createdAt: string;
  currency: string;
}
export interface InterfacePledgeInfo {
  _id: string;
  amount: number;
  currency: string;
  endDate: string;
  startDate: string;
  users: {
    _id: string;
    firstName: string;
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

export interface InterfaceQueryVenueListItem {
  _id: string;
  name: string;
  description: string;
  image: string | null;
  capacity: string;
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
export interface InterfaceCreateFund {
  fundName: string;
  fundRef: string;
}

export interface InterfacePostCard {
  id: string;
  creator: {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
  };
  image: string | null;
  video: string | null;
  text: string;
  title: string;
  likeCount: number;
  commentCount: number;
  comments: {
    creator: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    likeCount: number;
    likedBy: {
      id: string;
    }[];
    text: string;
  }[];
  likedBy: {
    firstName: string;
    lastName: string;
    id: string;
  }[];
}
export interface InterfaceCreateCampaign {
  campaignName: string;
  campaignCurrency: string;
  campaignGoal: number;
  campaignStartDate: Date;
  campaignEndDate: Date;
}

export interface InterfaceCreatePledge {
  pledgeAmount: number;
  pledgeCurrency: string;
  pledgeStartDate: Date;
  pledgeEndDate: Date;
}

export interface InterfaceQueryMembershipRequestsListItem {
  organizations: {
    _id: string;
    membershipRequests: {
      _id: string;
      user: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
    }[];
  }[];
}

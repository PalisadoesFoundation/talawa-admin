export interface InterfaceUserType {
  user: {
    firstName: string;
    lastName: string;
    image: string | null;
    email: string;
  };
}

export interface InterfaceUserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  image?: string | null;
}

// Base interface for common event properties
export interface InterfaceBaseEvent {
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
}

export interface InterfaceActionItemCategoryInfo {
  _id: string;
  name: string;
  isDisabled: boolean;
  createdAt: string;
  creator: { _id: string; firstName: string; lastName: string };
}

export interface InterfaceActionItemCategoryList {
  actionItemCategoriesByOrganization: InterfaceActionItemCategoryInfo[];
}

export interface InterfaceActionItemInfo {
  _id: string;
  assigneeType: 'EventVolunteer' | 'EventVolunteerGroup' | 'User';
  assignee: InterfaceEventVolunteerInfo | null;
  assigneeGroup: InterfaceVolunteerGroupInfo | null;
  assigneeUser: InterfaceUserInfo | null;
  assigner: InterfaceUserInfo;
  actionItemCategory: {
    _id: string;
    name: string;
  };
  preCompletionNotes: string;
  postCompletionNotes: string | null;
  assignmentDate: Date;
  dueDate: Date;
  completionDate: Date | null;
  isCompleted: boolean;
  event: {
    _id: string;
    title: string;
  } | null;
  creator: InterfaceUserInfo;
  allottedHours: number | null;
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
    createdAt: string;
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

export interface InterfaceQueryOrganizationListObject {
  _id: string;
  image: string | null;
  creator: {
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

export interface InterfacePostForm {
  posttitle: string;
  postinfo: string;
  mediaFile: File | null;
  pinned: boolean;
}
export interface InterfaceQueryOrganizationPostListItem {
  posts: {
    edges: {
      node: {
        _id: string;
        title: string;
        text: string;
        file: {
          _id: string;
          fileName: string;
          mimeType: string;
          size: number;
          hash: {
            value: string;
            algorithm: string;
          };
          uri: string;
          metadata: {
            objectKey: string;
          };
          visibility: string;
          status: string;
        };
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

        likedBy: { _id: string }[];
        comments: {
          _id: string;
          text: string;
          creator: { _id: string };
          createdAt: string;
          likeCount: number;
          likedBy: { _id: string }[];
        }[];
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

export interface InterfaceTagData {
  _id: string;
  name: string;
  parentTag: { _id: string };
  usersAssignedTo: {
    totalCount: number;
  };
  childTags: {
    totalCount: number;
  };
  ancestorTags: {
    _id: string;
    name: string;
  }[];
}

interface InterfaceTagNodeData {
  edges: {
    node: InterfaceTagData;
    cursor: string;
  }[];
  pageInfo: {
    startCursor: string;
    endCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  totalCount: number;
}

interface InterfaceTagMembersData {
  edges: {
    node: {
      _id: string;
      firstName: string;
      lastName: string;
    };
  }[];
  pageInfo: {
    startCursor: string;
    endCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  totalCount: number;
}

export interface InterfaceQueryOrganizationUserTags {
  userTags: InterfaceTagNodeData;
}

export interface InterfaceQueryUserTagChildTags {
  name: string;
  childTags: InterfaceTagNodeData;
  ancestorTags: {
    _id: string;
    name: string;
  }[];
}

export interface InterfaceQueryUserTagsAssignedMembers {
  name: string;
  usersAssignedTo: InterfaceTagMembersData;
  ancestorTags: {
    _id: string;
    name: string;
  }[];
}

export interface InterfaceQueryUserTagsMembersToAssignTo {
  name: string;
  usersToAssignTo: InterfaceTagMembersData;
}

export interface InterfaceQueryOrganizationAdvertisementListItem {
  advertisements: {
    edges: {
      node: {
        _id: string;
        name: string;
        mediaUrl: string;
        endDate: string;
        startDate: string;
        type: 'BANNER' | 'MENU' | 'POPUP';
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

export interface InterfaceQueryOrganizationFundCampaigns {
  name: string;
  isArchived: boolean;
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
export interface InterfaceUserCampaign {
  _id: string;
  name: string;
  fundingGoal: number;
  startDate: Date;
  endDate: Date;
  currency: string;
}
export interface InterfaceQueryFundCampaignsPledges {
  fundId: {
    name: string;
  };
  name: string;
  fundingGoal: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  pledges: InterfacePledgeInfo[];
}
export interface InterfaceFundInfo {
  _id: string;
  name: string;
  refrenceNumber: string;
  taxDeductible: boolean;
  isArchived: boolean;
  isDefault: boolean;
  createdAt: string;
  organizationId: string;
  creator: { _id: string; firstName: string; lastName: string };
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
  campaign?: { _id: string; name: string; endDate: Date };
  amount: number;
  currency: string;
  endDate: string;
  startDate: string;
  users: InterfaceUserInfo[];
}
export interface InterfaceQueryOrganizationEventListItem
  extends InterfaceBaseEvent {
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
  description: string | null;
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
  isDefault: boolean;
  isArchived: boolean;
  taxDeductible: boolean;
}

export interface InterfacePostCard {
  id: string;
  creator: {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    image: string;
  };
  postedAt: string;
  image: string | null;
  video: string | null;
  text: string;
  title: string;
  likeCount: number;
  commentCount: number;
  comments: {
    id: string;
    creator: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      image: string;
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
  fetchPosts: () => void;
}

export interface InterfaceCreatePledge {
  pledgeUsers: InterfaceUserInfo[];
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

export interface InterfaceAgendaItemCategoryInfo {
  _id: string;
  name: string;
  description: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

export interface InterfaceAgendaItemCategoryList {
  agendaItemCategoriesByOrganization: InterfaceAgendaItemCategoryInfo[];
}

export interface InterfaceAgendaItemInfo {
  _id: string;
  title: string;
  description: string;
  duration: string;
  attachments: string[];
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  urls: string[];
  users: {
    _id: string;
    firstName: string;
    lastName: string;
  }[];
  sequence: number;
  categories: {
    _id: string;
    name: string;
  }[];
  organization: {
    _id: string;
    name: string;
  };
  relatedEvent: {
    _id: string;
    title: string;
  };
}

export interface InterfaceAgendaItemList {
  agendaItemByEvent: InterfaceAgendaItemInfo[];
}

export interface InterfaceMapType {
  [key: string]: string;
}

export interface InterfaceCustomFieldData {
  type: string;
  name: string;
}

export interface InterfaceEventVolunteerInfo {
  _id: string;
  hasAccepted: boolean;
  hoursVolunteered: number | null;
  user: InterfaceUserInfo;
  assignments: {
    _id: string;
  }[];
  groups: {
    _id: string;
    name: string;
    volunteers: {
      _id: string;
    }[];
  }[];
}

export interface InterfaceVolunteerGroupInfo {
  _id: string;
  name: string;
  description: string | null;
  event: {
    _id: string;
  };
  volunteersRequired: number | null;
  createdAt: string;
  creator: InterfaceUserInfo;
  leader: InterfaceUserInfo;
  volunteers: {
    _id: string;
    user: InterfaceUserInfo;
  }[];
  assignments: {
    _id: string;
    actionItemCategory: {
      _id: string;
      name: string;
    };
    allottedHours: number;
    isCompleted: boolean;
  }[];
}

export interface InterfaceCreateVolunteerGroup {
  name: string;
  description: string | null;
  leader: InterfaceUserInfo | null;
  volunteersRequired: number | null;
  volunteerUsers: InterfaceUserInfo[];
}

export interface InterfaceUserEvents extends InterfaceBaseEvent {
  volunteerGroups: {
    _id: string;
    name: string;
    volunteersRequired: number;
    description: string;
    volunteers: { _id: string }[];
  }[];
  volunteers: {
    _id: string;
    user: {
      _id: string;
    };
  }[];
}

export interface InterfaceVolunteerMembership {
  _id: string;
  status: string;
  createdAt: string;
  event: {
    _id: string;
    title: string;
    startDate: string;
  };
  volunteer: {
    _id: string;
    user: InterfaceUserInfo;
  };
  group: {
    _id: string;
    name: string;
  };
}

export interface InterfaceVolunteerRank {
  rank: number;
  hoursVolunteered: number;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string | null;
  };
}

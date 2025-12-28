/**
 * @file queryResults.ts
 * @description Defines TypeScript interfaces for GraphQL query and mutation results.
 * These are used as type parameters for useQuery and useMutation hooks.
 */

import type { InterfaceVolunteerMembership } from 'types/Volunteer/interface';

// ============================================
// User Queries
// ============================================

export interface IUserDetailsResult {
  user: {
    id: string;
    name: string;
    emailAddress: string;
    avatarURL: string | null;
    birthDate: string | null;
    city: string | null;
    countryCode: string | null;
    createdAt: string;
    updatedAt: string;
    educationGrade: string | null;
    employmentStatus: string | null;
    isEmailAddressVerified: boolean;
    maritalStatus: string | null;
    natalSex: string | null;
    naturalLanguageCode: string | null;
    postalCode: string | null;
    role: string;
    state: string | null;
    mobilePhoneNumber: string | null;
    homePhoneNumber: string | null;
    workPhoneNumber: string | null;
    firstName?: string;
    lastName?: string;
    organizationsWhereMember: {
      edges: Array<{ node: { id: string; name: string } }>;
    };
    createdOrganizations: Array<{ id: string; name: string }>;
  };
}

export interface ICurrentUserResult {
  currentUser: {
    id: string;
    name: string;
    role: string;
    emailAddress: string;
    avatarURL?: string | null;
  };
}

// Organization Queries

export interface IOrganizationListResult {
  organizations: Array<{
    id: string;
    name: string;
    description?: string;
    avatarURL?: string | null;
    createdAt: string;
  }>;
}

export interface IOrganizationMembersResult {
  organization: {
    members: {
      edges: Array<{
        cursor: string;
        node: {
          id: string;
          name: string;
          role: string;
          avatarURL?: string;
          createdAt: string;
          emailAddress?: string;
        };
      }>;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
    };
  };
}

export interface IMembershipRequestResult {
  organization: {
    membershipRequests: Array<{
      membershipRequestId: string;
      createdAt: string;
      status: string;
      user: {
        avatarURL?: string;
        id: string;
        name: string;
        emailAddress: string;
      };
    }>;
  };
}

// Campaign & Fund Queries

export interface ICampaignEdge {
  node: {
    id: string;
    name: string;
    currencyCode: string;
    goalAmount: number;
    startAt: string;
    endAt: string;
  };
}

export interface IFundEdge {
  node: {
    campaigns?: {
      edges: ICampaignEdge[];
    };
  };
}

export interface IUserFundCampaignsResult {
  organization: {
    funds: {
      edges: IFundEdge[];
    };
  };
}

// Donation Queries

export interface IDonationConnectionResult {
  getDonationByOrgIdConnection: Array<{
    _id: string;
    nameOfUser: string;
    amount: number;
    userId: string;
    payPalId: string;
    updatedAt: string;
  }>;
}

// Event Queries

export interface IOrganizationEventsResult {
  organization: {
    events: {
      edges: Array<{
        node: {
          id: string;
          name: string;
          description: string;
          startAt: string;
          endAt: string;
          allDay: boolean;
          location: string | null;
          isPublic: boolean;
          isRegisterable: boolean;
          isRecurringEventTemplate: boolean;
          baseEvent?: { id: string } | null;
          sequenceNumber?: number;
          totalCount?: number;
          hasExceptions?: boolean;
          progressLabel?: string;
          recurrenceDescription?: string;
          recurrenceRule?: { id: string; frequency: string } | null;
          creator: { id: string; name: string };
        };
      }>;
    };
  };
}

// Post Queries

export interface IOrganizationPostListResult {
  organization: {
    posts: {
      edges: Array<{
        node: {
          id: string;
          caption: string;
          createdAt: string;
          creator: {
            id: string;
            name: string;
            avatarURL?: string | null;
          };
          upVotesCount: number;
          downVotesCount: number;
          pinnedAt: string | null;
          hasUserVoted: boolean | null;
          commentsCount: number;
        };
      }>;
      pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string;
        endCursor: string;
      };
    };
    postsCount: number;
  };
}

export interface IOrganizationPinnedPostListResult {
  organization: {
    pinnedPosts: {
      edges: Array<{
        node: {
          id: string;
          caption: string;
          createdAt: string;
          creator: {
            id: string;
            name: string;
            avatarURL?: string | null;
          };
          upVotesCount: number;
          downVotesCount: number;
          pinnedAt: string | null;
          hasUserVoted: boolean | null;
          commentsCount: number;
        };
      }>;
    };
  };
}

export interface IAdvertisementListResult {
  organizations: Array<{
    advertisements?: {
      edges: Array<{
        node: {
          _id: string;
          name: string;
          type: 'BANNER' | 'MENU' | 'POPUP';
          mediaUrl: string;
          endDate: string;
          startDate: string;
        };
      }>;
    };
  }>;
}

// Volunteer Queries

export interface IGetVolunteerMembershipResult {
  getVolunteerMembership: InterfaceVolunteerMembership[];
}

// Action Item Queries

export interface IActionItemCategoryResult {
  actionItemCategory: {
    id: string;
    name: string;
  };
}

export interface IMembersListResult {
  usersByOrganizationId: Array<{
    id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
  }>;
}

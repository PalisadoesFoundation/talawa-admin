/**
 * @file queryResults.ts
 * @description Defines TypeScript interfaces for GraphQL query and mutation results.
 * These are used as type parameters for useQuery and useMutation hooks.
 */

import type { InterfaceVolunteerMembership } from 'types/Volunteer/interface';

// ============================================
// User Queries
// ============================================

export interface UserDetailsResult {
  user: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      image: string | null;
    };
  };
}

export interface CurrentUserResult {
  currentUser: {
    id: string;
    name: string;
    role: string;
    emailAddress: string;
    avatarURL?: string | null;
  };
}

// Organization Queries

export interface OrganizationListResult {
  organizations: Array<{
    id: string;
    name: string;
    description?: string;
    avatarURL?: string | null;
    createdAt: string;
  }>;
}

export interface OrganizationMembersResult {
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

export interface MembershipRequestResult {
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

export interface CampaignEdge {
  node: {
    id: string;
    name: string;
    currencyCode: string;
    goalAmount: number;
    startAt: string;
    endAt: string;
  };
}

export interface FundEdge {
  node: {
    campaigns?: {
      edges: CampaignEdge[];
    };
  };
}

export interface UserFundCampaignsResult {
  organization: {
    funds: {
      edges: FundEdge[];
    };
  };
}

// Donation Queries

export interface DonationConnectionResult {
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

export interface OrganizationEventsResult {
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

export interface OrganizationPostListResult {
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

export interface OrganizationPinnedPostListResult {
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

export interface AdvertisementListResult {
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

export interface GetVolunteerMembershipResult {
  getVolunteerMembership: InterfaceVolunteerMembership[];
}

// Action Item Queries

export interface ActionItemCategoryResult {
  actionItemCategory: {
    id: string;
    name: string;
  };
}

export interface MembersListResult {
  usersByOrganizationId: Array<{
    id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
  }>;
}

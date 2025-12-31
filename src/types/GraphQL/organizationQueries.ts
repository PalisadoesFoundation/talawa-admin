/**
 * @file organizationQueries.ts
 * @description Defines TypeScript interfaces for organization-related GraphQL query and mutation results.
 */

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
        hasPreviousPage?: boolean;
        endCursor: string;
        startCursor?: string;
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

export interface IOrganizationListNoMembersResult {
  organizations: Array<{
    id: string;
    name: string;
    addressLine1?: string;
  }>;
}

export interface ICreateOrganizationResult {
  createOrganization: {
    id: string;
  };
}

export interface IOrganizationFilterListResult {
  organizations: Array<{
    id: string;
    name: string;
  }>;
}

export interface ICreateOrganizationMembershipResult {
  createOrganizationMembership: {
    id: string;
  };
}

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

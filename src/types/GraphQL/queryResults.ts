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

export interface IGetEventVolunteerGroupsResult {
  event: {
    id: string;
    recurrenceRule?: {
      id: string;
    } | null;
    baseEvent?: {
      id: string;
    } | null;
    volunteerGroups: Array<{
      id: string;
      name: string;
      description: string | null;
      volunteersRequired: number | null;
      isTemplate: boolean;
      isInstanceException: boolean;
      createdAt: string;
      creator: {
        id: string;
        name: string;
        avatarURL?: string | null;
      };
      leader: {
        id: string;
        name: string;
        avatarURL?: string | null;
      };
      volunteers: Array<{
        id: string;
        hasAccepted: boolean;
        user: {
          id: string;
          name: string;
          avatarURL?: string | null;
        };
      }>;
      event: {
        id: string;
      };
    }>;
  };
}

export interface IGetEventVolunteersResult {
  event: {
    id: string;
    recurrenceRule?: {
      id: string;
    } | null;
    baseEvent?: {
      id: string;
    } | null;
    volunteers: Array<{
      id: string;
      hasAccepted: boolean;
      volunteerStatus: string;
      hoursVolunteered: number;
      isPublic: boolean;
      isTemplate: boolean;
      isInstanceException: boolean;
      createdAt: string;
      updatedAt: string;
      user: {
        id: string;
        name: string;
        avatarURL?: string | null;
      };
      event: {
        id: string;
        name: string;
      };
      creator: {
        id: string;
        name: string;
      };
      updater: {
        id: string;
        name: string;
      };
      groups: Array<{
        id: string;
        name: string;
        description: string | null;
        volunteers: Array<{
          id: string;
        }>;
      }>;
    }>;
  };
}

export interface IUserEventsVolunteerResult {
  organization: {
    id: string;
    events: {
      edges: Array<{
        node: {
          id: string;
          name: string;
          description: string;
          startAt: string;
          endAt: string;
          location: string | null;
          allDay: boolean;
          isRecurringEventTemplate: boolean;
          baseEvent?: {
            id: string;
            name: string;
            isRecurringEventTemplate: boolean;
          } | null;
          recurrenceRule?: {
            id: string;
            frequency: string;
          } | null;
          volunteers: Array<{
            id: string;
            hasAccepted: boolean;
            volunteerStatus: string;
            user: {
              id: string;
              name: string;
            };
          }>;
          volunteerGroups: Array<{
            id: string;
            name: string;
            description: string | null;
            volunteersRequired: number | null;
            volunteers: Array<{
              id: string;
              hasAccepted: boolean;
              user: {
                id: string;
                name: string;
              };
            }>;
          }>;
        };
      }>;
    };
  };
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
    emailAddress?: string;
    avatarURL?: string | null;
    role?: string;
  }>;
}

// ============================================
// Authentication Queries & Mutations
// ============================================

export interface ISignInResult {
  signIn: {
    user: {
      id: string;
      name: string;
      emailAddress: string;
      role: string;
      countryCode: string | null;
      avatarURL?: string | null;
    };
    authenticationToken: string;
    refreshToken: string;
  };
}

export interface ISignUpResult {
  signUp: {
    user: {
      id: string;
      name?: string;
      emailAddress?: string;
    };
    authenticationToken: string;
    refreshToken: string;
  };
}

export interface IRecaptchaResult {
  recaptcha: boolean;
}

export interface ICommunityDataResult {
  community: {
    id: string;
    name: string;
    logoURL: string;
    websiteURL: string;
    createdAt: string;
    updatedAt: string;
    facebookURL?: string | null;
    githubURL?: string | null;
    instagramURL?: string | null;
    linkedinURL?: string | null;
    redditURL?: string | null;
    slackURL?: string | null;
    xURL?: string | null;
    youtubeURL?: string | null;
    inactivityTimeoutDuration?: number | null;
    logoMimeType?: string | null;
  } | null;
}

export interface ICommunitySessionTimeoutResult {
  community: {
    inactivityTimeoutDuration: number | null;
  } | null;
}

// ============================================
// User Mutations
// ============================================

export interface IUpdateCurrentUserResult {
  updateCurrentUser: {
    id: string;
    name: string;
    emailAddress: string;
    role: string;
    avatarURL?: string | null;
    addressLine1?: string;
    addressLine2?: string;
    avatarMimeType?: string | null;
    birthDate?: string | null;
    city?: string;
    countryCode?: string | null;
    createdAt?: string;
    description?: string;
    educationGrade?: string | null;
    employmentStatus?: string | null;
    homePhoneNumber?: string;
    isEmailAddressVerified?: boolean;
    maritalStatus?: string | null;
    mobilePhoneNumber?: string;
    natalSex?: string | null;
    naturalLanguageCode?: string;
    postalCode?: string;
    state?: string;
    updatedAt?: string;
    workPhoneNumber?: string;
  };
}

// ============================================
// Notification Queries
// ============================================

export interface IUserNotificationsResult {
  user: {
    notifications: Array<{
      _id: string;
      id?: string;
      title: string;
      body: string;
      createdAt: string;
      read: boolean;
      isRead?: boolean;
      navigation?: string;
    }>;
  };
}

// ============================================
// Organization Queries
// ============================================

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

// ============================================
// Fund Campaign Queries
// ============================================

export interface IFundCampaignResult {
  fund: {
    id: string;
    name: string;
    campaigns: {
      edges: Array<{
        node: {
          id: string;
          name: string;
          currencyCode: string;
          goalAmount: number;
          startAt: string;
          endAt: string;
        };
      }>;
    };
  };
}

export interface IFundListResult {
  organization: {
    funds: {
      edges: Array<{
        node: {
          id: string;
          name: string;
          isTaxDeductible: boolean;
          isArchived: boolean;
          createdAt: string;
          creator?: {
            name: string;
          } | null;
          organization?: {
            name: string;
          } | null;
          updater?: {
            name: string;
          } | null;
        };
      }>;
    };
  };
}

export interface IFundCampaignPledgeResult {
  fundCampaign: {
    id: string;
    name: string;
    goalAmount: number;
    currencyCode: string;
    startAt: string;
    endAt: string;
    pledges: {
      edges: Array<{
        node: {
          id: string;
          amount: number;
          endDate: string;
          pledger: {
            id: string;
            name: string;
            avatarURL?: string | null;
          };
        };
      }>;
    };
    totalPledged: number;
    totalRaised: number;
  };
}

// ============================================
// Venue Queries
// ============================================

export interface IVenueListResult {
  organization: {
    venues: {
      edges: Array<{
        node: {
          id: string;
          name: string;
          description?: string | null;
          capacity: number;
        };
      }>;
    };
  };
}

// ============================================
// Invitation Mutations
// ============================================

export interface IVerifyEventInvitationResult {
  verifyEventInvitation: {
    invitationToken: string;
    eventId: string;
    organizationId: string;
  };
}

export interface IAcceptEventInvitationResult {
  acceptEventInvitation: {
    id: string;
  };
}

// ============================================
// User List Queries
// ============================================

export interface IUserListForTableResult {
  allUsers: {
    pageInfo: {
      endCursor: string | null;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor: string | null;
    };
    edges: Array<{
      cursor: string;
      node: {
        id: string;
        name: string;
        role: string;
        avatarURL?: string | null;
        emailAddress: string;
      };
    }>;
  };
}

// ============================================
// Additional Mutations
// ============================================

export interface IBlockUserResult {
  blockUser: boolean;
}

export interface ICreateOrganizationMembershipResult {
  createOrganizationMembership: {
    id: string;
  };
}

export interface IRefreshTokenResult {
  refreshToken: {
    authenticationToken: string;
    refreshToken: string;
  };
}

export interface IGenerateOtpResult {
  otp: {
    otpToken: string;
  };
}

export interface IForgotPasswordResult {
  forgotPassword: boolean;
}

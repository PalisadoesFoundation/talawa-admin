/**
 * @file queryResults.ts
 * @description Re-exports all GraphQL query and mutation result interfaces.
 * This file maintains backward compatibility by re-exporting all interfaces
 * from the split modules.
 */

// User Queries
export type {
  IUserDetailsResult,
  ICurrentUserResult,
  IUpdateCurrentUserResult,
  IUserNotificationsResult,
  IUserListForTableResult,
  IMembersListResult,
  IBlockUserResult,
} from './userQueries';

// Organization Queries
export type {
  IOrganizationListResult,
  IOrganizationMembersResult,
  IMembershipRequestResult,
  IOrganizationListNoMembersResult,
  ICreateOrganizationResult,
  IOrganizationFilterListResult,
  ICreateOrganizationMembershipResult,
  IOrganizationPostListResult,
  IOrganizationPinnedPostListResult,
  IAdvertisementListResult,
} from './organizationQueries';

// Event Queries
export type { IOrganizationEventsResult } from './eventQueries';

// Volunteer Queries
export type {
  IGetVolunteerMembershipResult,
  IGetEventVolunteerGroupsResult,
  IGetEventVolunteersResult,
  IUserEventsVolunteerResult,
} from './volunteerQueries';

// Fund & Campaign Queries
export type {
  ICampaignEdge,
  IFundEdge,
  IUserFundCampaignsResult,
  IDonationConnectionResult,
  IFundCampaignResult,
  IFundListResult,
  IFundCampaignPledgeResult,
} from './fundQueries';

// Authentication Queries & Mutations
export type {
  ISignInResult,
  ISignUpResult,
  IRecaptchaResult,
  ICommunityDataResult,
  ICommunitySessionTimeoutResult,
  IRefreshTokenResult,
  IGenerateOtpResult,
  IForgotPasswordResult,
} from './authQueries';

// Miscellaneous Queries
export type {
  IActionItemCategoryResult,
  IVenueListResult,
  IVerifyEventInvitationResult,
  IAcceptEventInvitationResult,
} from './miscQueries';

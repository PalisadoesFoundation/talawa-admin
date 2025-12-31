/**
 * @file userQueries.ts
 * @description Defines TypeScript interfaces for user-related GraphQL query and mutation results.
 */

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

export interface IBlockUserResult {
  blockUser: boolean;
}

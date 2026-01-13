import type { Organization } from 'types/AdminPortal/Organization/type';
// types/user.ts

export type User = {
  _id: string;
  address?: Address;
  birthDate?: Date;
  createdAt: Date;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  updatedAt?: Date;
};

export type Address = {
  city?: string;
  countryCode?: string;
  dependentLocality?: string;
  line1?: string;
  line2?: string;
  postalCode?: string;
  sortingCode?: string;
  state?: string;
};

export type UserPhone = {
  home?: string;
  mobile?: string;
  work?: string;
};

export type UserInput = {
  appLanguageCode: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  selectedOrganization: string;
};

export type AppUserProfile = {
  _id: string; // ID in GraphQL maps to string in TypeScript
  adminFor: Organization[];
  appLanguageCode: string;
  createdEvents: Event[];
  createdOrganizations: Organization[];
  eventAdmin: Event[];
  isSuperAdmin: boolean;
  userId: User;
};

export type CreateUserFamilyInput = {
  title: string;
  userIds: string[];
};

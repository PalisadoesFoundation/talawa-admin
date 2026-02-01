import type { Address, AddressInput } from 'types/AdminPortal/address';
import type { User } from 'types/shared-components/User/type';
import type { ActionItemCategory } from 'types/AdminPortal/actionItem';
import type { AgendaCategory } from 'types/AdminPortal/Agenda/type';
import type { MembershipRequest } from 'types/AdminPortal/membership';
import type { Post } from 'types/Post/type';
import type { Venue } from 'types/AdminPortal/venue';

// export const OrganizationOrderByInput = {
//   apiUrl_ASC: 'apiUrl_ASC',
//   apiUrl_DESC: 'apiUrl_DESC',
//   createdAt_ASC: 'createdAt_ASC',
//   createdAt_DESC: 'createdAt_DESC',
//   description_ASC: 'description_ASC',
//   description_DESC: 'description_DESC',
//   id_ASC: 'id_ASC',
//   id_DESC: 'id_DESC',
//   name_ASC: 'name_ASC',
//   name_DESC: 'name_DESC',
// }   as const;

// export type OrganizationOrderByInput = typeof OrganizationOrderByInput[keyof typeof OrganizationOrderByInput];

export type Organization = {
  _id: string;
  actionItemCategories?: ActionItemCategory[]; // Optional and nullable
  address?: Address; // Optional
  admins?: User[]; // Optional and non-nullable
  agendaCategories?: AgendaCategory[]; // Optional and nullable
  apiUrl: string;
  blockedUsers?: User[]; // Optional and nullable
  createdAt: Date;
  creator?: User; // Optional
  customFields: OrganizationCustomField[];
  description: string;
  image?: string; // Optional
  members?: User[]; // Optional and nullable
  membershipRequests?: MembershipRequest[]; // Optional and nullable
  name: string;
  pinnedPosts?: Post[]; // Optional and nullable
  updatedAt: Date;
  userRegistrationRequired: boolean;
  visibleInSearch: boolean;
  venues?: Venue[]; // Optional and nullable
};

export type OrganizationCustomField = {
  _id: string;
  name: string;
  organizationId: string;
  type: string;
};

export type OrganizationInput = {
  address: AddressInput;
  apiUrl?: string; // Optional
  attendees?: string; // Optional
  description: string;
  image?: string; // Optional
  name: string;
  userRegistrationRequired?: boolean; // Optional
  visibleInSearch?: boolean;
};

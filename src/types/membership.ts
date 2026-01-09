import type { User } from './AdminPortal/User/type';
import type { Organization } from 'types/Organization/type';

export type MembershipRequest = {
  _id: string;
  organization: Organization;
  user: User;
};

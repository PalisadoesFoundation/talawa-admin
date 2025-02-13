import type { User } from './user';
import type { Organization } from './organization';

export type MembershipRequest = {
  _id: string;
  organization: Organization;
  user: User;
};

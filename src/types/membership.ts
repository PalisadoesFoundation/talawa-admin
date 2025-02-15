import type { User } from './User/type';
import type { Organization } from './organization';

export type MembershipRequest = {
  _id: string;
  organization: Organization;
  user: User;
};

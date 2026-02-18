import type { User } from '../shared-components/User/type';
import type { Organization } from 'types/AdminPortal/Organization/type';

export type MembershipRequest = {
  _id: string;
  organization: Organization;
  user: User;
};

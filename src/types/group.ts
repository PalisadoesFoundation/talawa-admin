import type { User } from './User/type';
import type { Organization } from 'types/Organization/type';

export type Group = {
  _id: string;
  admins: User[]; //non-nullable
  createdAt: Date;
  description?: string; // Optional
  organization: Organization;
  title: string;
  updatedAt: Date;
};

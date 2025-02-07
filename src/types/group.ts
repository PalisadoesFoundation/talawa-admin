import type { User } from './user';
import type { Organization } from './organization';

export type Group = {
  _id: string;
  admins: User[]; //non-nullable
  createdAt: Date;
  description?: string; // Optional
  organization: Organization;
  title: string;
  updatedAt: Date;
};

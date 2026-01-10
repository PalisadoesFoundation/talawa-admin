import type { User } from '../shared-components/User/type';
import type { Organization } from 'types/Organization/type';

export type AgendaCategory = {
  _id: string;
  createdAt: Date;
  createdBy: User;
  description?: string; // Optional
  name: string;
  organization: Organization;
  updatedAt?: Date; // Optional
  updatedBy?: User; // Optional
};

import type { User } from './User/type';
import type { Organization } from './organization';

export type FundraisingCampaign = {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  fundingGoal: number;
  description?: string;
  creator?: User;
  organization: Organization;
  members?: User[];
  isPublic: boolean;
  isArchived: boolean;
  refrenceNumber?: string;
  createdAt: Date;
  updatedAt: Date;
};

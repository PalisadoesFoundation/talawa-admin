import type { User } from '../shared-components/User/type';
import type { Organization } from 'types/AdminPortal/Organization/type';
// types/actionItem.ts

export type ActionItem = {
  _id: string;
  actionItemCategory?: ActionItemCategory; // Optional
  assignee?: User; // Optional
  assigner?: User; // Optional
  assignmentDate: Date;
  completionDate: Date;
  createdAt: Date;
  creator?: User; // Optional
  dueDate: Date;
  event?: Event; // Optional
  isCompleted: boolean;
  postCompletionNotes?: string; // Optional
  preCompletionNotes?: string; // Optional
  updatedAt: Date;
};

export type ActionItemCategory = {
  _id: string;
  createdAt: Date;
  creator?: User; // Optional
  isDisabled: boolean;
  name: string;
  organization?: Organization; // Optional
  updatedAt: Date;
};

export type CreateActionItemInput = {
  assigneeId: string;
  dueDate?: Date; // Optional
  eventId?: string; // Optional
  preCompletionNotes?: string; // Optional
};

export type UpdateActionItemInput = {
  assigneeId?: string; // Optional
  completionDate?: Date; // Optional
  dueDate?: Date; // Optional
  isCompleted?: boolean; // Optional
  postCompletionNotes?: string; // Optional
  preCompletionNotes?: string; // Optional
};

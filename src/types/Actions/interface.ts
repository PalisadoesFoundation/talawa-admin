import { InterfaceEvent } from 'types/Event/interface';

export interface IActionItemCategoryInfo {
  id: string;
  name: string;
  description: string | null;
  isDisabled: boolean;
  createdAt: string;
  updatedAt?: string;
  creatorId?: string;
  organizationId: string;
}

export interface IActionItemCategoryList {
  actionItemCategoriesByOrganization: IActionItemCategoryInfo[];
}

interface IActionUserInfo {
  id: string;
  name: string;
  avatarURL: string;
  emailAddress: string;
}

export interface IActionItemInfo {
  id: string;
  assigneeId: string | null;
  categoryId: string | null;
  eventId: string | null;
  recurringEventInstanceId: string | null;
  organizationId: string;
  creatorId: string | null;
  updaterId: string | null;
  assignedAt: Date;
  completionAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  isCompleted: boolean;
  preCompletionNotes: string | null;
  postCompletionNotes: string | null;
  hasExceptions?: boolean;
  isInstanceException?: boolean;
  isTemplate?: boolean;

  // Related entities (populated via GraphQL)
  assignee: IActionUserInfo | null;
  creator: IActionUserInfo | null;
  event: InterfaceEvent | null;
  recurringEventInstance: InterfaceEvent | null;
  category: IActionItemCategoryInfo | null;
}

export interface IActionItemList {
  actionItemsByOrganization: IActionItemInfo[];
}

export interface ICreateActionItemInput {
  assigneeId: string;
  categoryId: string;
  eventId?: string;
  recurringEventInstanceId?: string;
  organizationId: string;
  preCompletionNotes?: string;
  assignedAt?: string;
  isTemplate?: boolean;
}

export interface IUpdateActionItemInput {
  id: string;
  assigneeId?: string;
  categoryId?: string;
  isCompleted: boolean;
  preCompletionNotes?: string;
  postCompletionNotes?: string;
}

export interface IDeleteActionItemInput {
  id: string;
}

export interface IMarkActionItemAsPendingInput {
  id: string;
}

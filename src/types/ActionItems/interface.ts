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
  volunteerId: string | null;
  volunteerGroupId: string | null;
  avatarURL?: string;
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
  volunteer: {
    id: string;
    hasAccepted: boolean;
    isPublic: boolean;
    hoursVolunteered: number;
    user: {
      id: string;
      name: string;
      avatarURL?: string | null;
    };
  } | null;
  volunteerGroup: {
    id: string;
    name: string;
    description: string | null;
    volunteersRequired: number | null;
    leader: {
      id: string;
      name: string;
      avatarURL?: string | null;
    };
    volunteers?: {
      id: string;
      user: {
        id: string;
        name: string;
      };
    }[];
  } | null;
  creator: IActionUserInfo | null;
  event: InterfaceEvent | null;
  recurringEventInstance: InterfaceEvent | null;
  category: IActionItemCategoryInfo | null;
}

export interface IActionItemList {
  actionItemsByOrganization: IActionItemInfo[];
}

export interface ICreateActionItemInput {
  volunteerId?: string;
  volunteerGroupId?: string;
  categoryId: string;
  eventId?: string;
  recurringEventInstanceId?: string;
  organizationId: string;
  preCompletionNotes?: string;
  assignedAt?: string;
  isTemplate?: boolean;
}

export interface ICreateActionItemVariables {
  input: ICreateActionItemInput;
}

export interface IUpdateActionItemInput {
  id: string;
  volunteerId?: string;
  volunteerGroupId?: string;
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

export interface IFormStateType {
  assignedAt: Date;
  categoryId: string;
  volunteerId: string;
  volunteerGroupId: string;
  eventId?: string;
  preCompletionNotes: string;
  postCompletionNotes: string | null;
  isCompleted: boolean;
}

export interface IItemModalProps {
  isOpen: boolean;
  hide: () => void;
  orgId: string;
  eventId: string | undefined;
  actionItemsRefetch: () => void;
  orgActionItemsRefetch?: () => void;
  actionItem: IActionItemInfo | null;
  editMode: boolean;
  isRecurring?: boolean;
  baseEvent?: { id: string } | null;
}

export interface IUpdateActionItemForInstanceInput {
  actionId: string;
  preCompletionNotes?: string;
  postCompletionNotes?: string;
  isCompleted?: boolean;
  eventId?: string;
  volunteerId?: string;
  volunteerGroupId?: string;
  categoryId?: string;
  assignedAt?: string;
}

export interface IUpdateActionItemForInstanceVariables {
  input: IUpdateActionItemForInstanceInput;
}

export interface IUpdateActionForInstanceInput {
  actionId: string;
  eventId?: string;
  volunteerId?: string;
  volunteerGroupId?: string;
  categoryId?: string;
  assignedAt?: string;
  preCompletionNotes?: string;
}

export interface IEventVolunteerGroup {
  id: string;
  name: string;
  description: string | null;
  volunteersRequired: number | null;
  isTemplate: boolean;
  isInstanceException: boolean;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    avatarURL?: string | null;
  };
  leader: {
    id: string;
    name: string;
    avatarURL?: string | null;
  };
  volunteers: Array<{
    id: string;
    hasAccepted: boolean;
    user: {
      id: string;
      name: string;
      avatarURL?: string | null;
    };
  }>;
  event: {
    id: string;
  };
}

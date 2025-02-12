export const PaginationDirection = {
  BACKWARD: 'BACKWARD',
  FORWARD: 'FORWARD',
} as const;
export type PaginationDirection =
  (typeof PaginationDirection)[keyof typeof PaginationDirection];

export type CreateActionItemInput = {
  assigneeId: string;
  dueDate?: Date; //Optional
  eventId?: string; //Optional
  preCompletionNotes?: string; //Optional
};

export type CreateAgendaCategoryInput = {
  description?: string; //Optional
  name: string;
  organizationId: string;
};

export type CreateUserTagInput = {
  name: string;
  organizationId: string;
  parentTagId?: string; //Optional
};

export type CursorPaginationInput = {
  cursor?: string; //Optional
  direction: PaginationDirection;
  limit: number;
};

export type DonationWhereInput = {
  id?: string;
  id_contains?: string;
  id_in?: string[];
  id_not?: string;
  id_not_in?: string[];
  id_starts_with?: string;
  name_of_user?: string;
  name_of_user_contains?: string;
  name_of_user_in?: string[];
  name_of_user_not?: string;
  name_of_user_not_in?: string[];
  name_of_user_starts_with?: string;
};

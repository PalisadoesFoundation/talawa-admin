import { ACTION_ITEM_LIST, MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/ActionItemCategoryQueries';
import {
  UPDATE_ACTION_ITEM_MUTATION,
  MARK_ACTION_ITEM_AS_PENDING_MUTATION,
} from 'GraphQl/Mutations/ActionItemMutations';

export const actionItemCategory1 = {
  id: 'actionItemCategoryId1',
  name: 'Category 1',
  isDisabled: false,
  organizationId: 'orgId',
  creatorId: 'userId',
  createdAt: '2024-08-26',
  updatedAt: '2024-08-26',
};

export const actionItemCategory2 = {
  id: 'actionItemCategoryId2',
  name: 'Category 2',
  isDisabled: false,
  organizationId: 'orgId',
  creatorId: 'userId',
  createdAt: '2024-08-25',
  updatedAt: '2024-08-25',
};

export const baseActionItem = {
  organizationId: 'orgId',
  creatorId: 'userId',
  updaterId: 'userId',
  createdAt: new Date('2024-08-27'),
  updatedAt: new Date('2024-08-27'),
  creator: {
    id: 'userId',
    name: 'Wilt Shepherd',
    emailAddress: 'wilt@example.com',
    avatarURL: null,
  },
};

export const itemWithUser1 = {
  id: '1',
  assigneeId: 'userId1',
  categoryId: 'actionItemCategoryId1',
  eventId: 'eventId',
  assignedAt: new Date('2024-08-27'),
  completionAt: new Date('2044-09-03'),
  preCompletionNotes: 'Notes 1',
  postCompletionNotes: 'Cmp Notes 1',
  isCompleted: true,
  assignee: {
    id: 'userId1',
    name: 'John Doe',
    emailAddress: 'john@example.com',
    avatarURL: 'user-image',
  },
  category: actionItemCategory1,
  event: {
    id: 'eventId',
    name: 'Test Event',
    description: 'Test Event Description',
    startAt: new Date('2024-08-27'),
    endAt: new Date('2024-08-30'),
  },
  ...baseActionItem,
};

export const itemWithUser2 = {
  id: '2',
  assigneeId: 'userId2',
  categoryId: 'actionItemCategoryId2',
  eventId: null,
  assignedAt: new Date('2024-08-28'),
  completionAt: null,
  preCompletionNotes: 'Notes 2',
  postCompletionNotes: null,
  isCompleted: false,
  assignee: {
    id: 'userId2',
    name: 'Jane Doe',
    emailAddress: 'jane@example.com',
    avatarURL: null,
  },
  category: actionItemCategory2,
  event: null,
  ...baseActionItem,
};

export const memberListQuery = {
  request: {
    query: MEMBERS_LIST,
    variables: { organizationId: 'orgId' },
  },
  result: {
    data: {
      usersByOrganizationId: [
        {
          id: 'userId1',
          name: 'John Doe',
          emailAddress: 'john@example.com',
          role: 'REGULAR',
          avatarURL: 'user-image',
          createdAt: '2024-02-14',
          updatedAt: '2024-02-14',
        },
        {
          id: 'userId2',
          name: 'Jane Doe',
          emailAddress: 'jane@example.com',
          role: 'REGULAR',
          avatarURL: null,
          createdAt: '2024-02-14',
          updatedAt: '2024-02-14',
        },
        {
          id: 'userId3',
          name: 'Wilt Shepherd',
          emailAddress: 'wilt@example.com',
          role: 'ADMIN',
          avatarURL: null,
          createdAt: '2024-02-14',
          updatedAt: '2024-02-14',
        },
      ],
    },
  },
};

export const actionItemCategoryListQuery = {
  request: {
    query: ACTION_ITEM_CATEGORY_LIST,
    variables: {
      input: {
        organizationId: 'orgId',
      },
    },
  },
  result: {
    data: {
      actionCategoriesByOrganization: [
        {
          id: 'categoryId1',
          name: 'Category 1',
          isDisabled: false,
          organizationId: 'orgId',
          creatorId: 'creatorId1',
          createdAt: '2024-08-26',
          updatedAt: '2024-08-26',
        },
        {
          id: 'categoryId2',
          name: 'Category 2',
          isDisabled: false,
          organizationId: 'orgId',
          creatorId: 'creatorId2',
          createdAt: '2024-08-25',
          updatedAt: '2024-08-25',
        },
      ],
    },
  },
};

export const actionItemListQuery = {
  request: {
    query: ACTION_ITEM_LIST,
    variables: {
      input: {
        organizationId: 'orgId',
      },
    },
  },
  result: {
    data: {
      actionItemsByOrganization: [itemWithUser1, itemWithUser2],
    },
  },
};

export const actionItemListQueryEmpty = {
  request: {
    query: ACTION_ITEM_LIST,
    variables: {
      input: {
        organizationId: 'orgId',
      },
    },
  },
  result: {
    data: {
      actionItemsByOrganization: [],
    },
  },
};

export const actionItemListQueryError = {
  request: {
    query: ACTION_ITEM_LIST,
    variables: {
      input: {
        organizationId: 'orgId',
      },
    },
  },
  error: new Error('Failed to fetch action items'),
};

export const actionItemListQueryLoading = {
  request: {
    query: ACTION_ITEM_LIST,
    variables: {
      input: {
        organizationId: 'orgId',
      },
    },
  },
  delay: 30000, // Long delay to simulate loading
  result: {
    data: {
      actionItemsByOrganization: [],
    },
  },
};

// Add mutation mocks for ItemUpdateStatusModal tests
export const updateActionItemMutation = {
  request: {
    query: UPDATE_ACTION_ITEM_MUTATION,
    variables: {
      input: {
        id: 'actionItemId1',
        isCompleted: true,
        postCompletionNotes: 'Cmp Notes 1',
      },
    },
  },
  result: {
    data: {
      updateActionItem: {
        id: 'actionItemId1',
        isCompleted: true,
        postCompletionNotes: 'Cmp Notes 1',
        updatedAt: '2025-07-01T07:49:24Z',
      },
    },
  },
};

export const markActionItemAsPendingMutation = {
  request: {
    query: MARK_ACTION_ITEM_AS_PENDING_MUTATION,
    variables: {
      input: {
        id: 'actionItemId1',
      },
    },
  },
  result: {
    data: {
      markActionItemAsPending: {
        id: 'actionItemId1',
        isCompleted: false,
        postCompletionNotes: null,
        updatedAt: '2025-07-01T07:49:24Z',
      },
    },
  },
};

export const markActionItemAsPendingMutationError = {
  request: {
    query: MARK_ACTION_ITEM_AS_PENDING_MUTATION,
    variables: {
      input: {
        id: 'actionItemId1',
      },
    },
  },
  error: new Error('Mock Graphql Error'),
};

// Combined mock arrays for different scenarios
export const MOCKS = [
  actionItemListQuery,
  memberListQuery,
  actionItemCategoryListQuery,
  updateActionItemMutation,
  markActionItemAsPendingMutation,
];

export const MOCKS_EMPTY = [
  actionItemListQueryEmpty,
  memberListQuery,
  actionItemCategoryListQuery,
];

export const MOCKS_ERROR = [
  actionItemListQuery,
  memberListQuery,
  actionItemCategoryListQuery,
  markActionItemAsPendingMutationError,
];

export const MOCKS_LOADING = [
  actionItemListQueryLoading,
  memberListQuery,
  actionItemCategoryListQuery,
];

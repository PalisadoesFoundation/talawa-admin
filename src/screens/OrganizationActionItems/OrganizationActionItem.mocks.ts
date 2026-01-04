import { ACTION_ITEM_LIST, MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import { ACTION_ITEM_CATEGORY_LIST } from 'GraphQl/Queries/ActionItemCategoryQueries';
import {
  UPDATE_ACTION_ITEM_MUTATION,
  MARK_ACTION_ITEM_AS_PENDING_MUTATION,
  DELETE_ACTION_ITEM_MUTATION,
  DELETE_ACTION_ITEM_FOR_INSTANCE,
  COMPLETE_ACTION_ITEM_FOR_INSTANCE,
  MARK_ACTION_ITEM_AS_PENDING_FOR_INSTANCE,
} from 'GraphQl/Mutations/ActionItemMutations';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const actionItemCategory1 = {
  id: 'actionItemCategoryId1',
  name: 'Category 1',
  isDisabled: false,
  organizationId: 'orgId',
  creatorId: 'userId',
  createdAt: dayjs.utc().toISOString(),
  updatedAt: dayjs.utc().toISOString(),
};

export const actionItemCategory2 = {
  id: 'actionItemCategoryId2',
  name: 'Category 2',
  isDisabled: false,
  organizationId: 'orgId',
  creatorId: 'userId',
  createdAt: dayjs.utc().subtract(1, 'day').toISOString(),
  updatedAt: dayjs.utc().subtract(1, 'day').toISOString(),
};

export const baseActionItem = {
  organizationId: 'orgId',
  creatorId: 'userId',
  updaterId: 'userId',
  volunteerId: null,
  volunteerGroupId: null,
  recurringEventInstanceId: null,
  createdAt: dayjs.utc().toDate(),
  updatedAt: dayjs.utc().toDate(),
  creator: {
    id: 'userId',
    name: 'Wilt Shepherd',
    emailAddress: 'wilt@example.com',
    avatarURL: null,
  },
  recurringEventInstance: null,
  volunteer: null,
  volunteerGroup: null,
};

export const itemWithUser1 = {
  ...baseActionItem,
  volunteerId: 'volunteerUserId1',
  volunteerGroupId: null,
  id: '1',
  categoryId: 'actionItemCategoryId1',
  eventId: 'eventId',
  assignedAt: dayjs.utc().toDate(),
  completionAt: dayjs.utc().toDate(),
  preCompletionNotes: 'Notes 1',
  postCompletionNotes: 'Cmp Notes 1',
  isCompleted: true,
  volunteer: {
    id: 'volunteerUserId1',
    hasAccepted: true,
    isPublic: true,
    hoursVolunteered: 8,
    user: {
      id: 'userId1',
      name: 'John Doe',
      avatarURL: 'user-image',
    },
  },
  category: actionItemCategory1,
  event: {
    id: 'eventId',
    name: 'Test Event',
    description: 'Test Event Description',
    startAt: dayjs.utc().toDate(),
    endAt: dayjs.utc().add(3, 'day').toDate(),
  },
};

export const itemWithUser2 = {
  ...baseActionItem,
  volunteerId: 'volunteerUserId2',
  volunteerGroupId: null,
  id: '2',
  categoryId: 'actionItemCategoryId2',
  eventId: null,
  assignedAt: dayjs.utc().subtract(1, 'day').toDate(),
  completionAt: null,
  preCompletionNotes: 'Notes 2',
  postCompletionNotes: null,
  isCompleted: false,
  volunteer: {
    id: 'volunteerUserId2',
    hasAccepted: true,
    isPublic: true,
    hoursVolunteered: 5,
    user: {
      id: 'userId2',
      name: 'Jane Doe',
      avatarURL: null,
    },
  },
  category: actionItemCategory2,
  event: null,
};

// Additional test items for edge cases
export const itemWithoutAssignee = {
  ...baseActionItem,
  volunteerId: null,
  volunteerGroupId: null,
  id: '3',
  categoryId: 'actionItemCategoryId1',
  eventId: null,
  assignedAt: dayjs.utc().subtract(2, 'day').toDate(),
  completionAt: null,
  preCompletionNotes: 'Notes 3',
  postCompletionNotes: null,
  isCompleted: false,
  volunteer: null,
  volunteerGroup: null,
  category: actionItemCategory1,
  event: null,
};

export const itemWithoutCategory = {
  ...baseActionItem,
  volunteerId: 'volunteerUserId1',
  volunteerGroupId: null,
  id: '4',
  categoryId: null,
  eventId: null,
  assignedAt: dayjs.utc().subtract(3, 'day').toDate(),
  completionAt: null,
  preCompletionNotes: 'Notes 4',
  postCompletionNotes: null,
  isCompleted: false,
  volunteer: {
    id: 'volunteerUserId1',
    hasAccepted: true,
    isPublic: true,
    hoursVolunteered: 8,
    user: {
      id: 'userId1',
      name: 'John Doe',
      avatarURL: 'user-image',
    },
  },
  category: null,
  event: null,
};

export const itemWithEmptyAssigneeName = {
  ...baseActionItem,
  volunteerId: 'volunteerUserId3',
  volunteerGroupId: null,
  id: '5',
  categoryId: 'actionItemCategoryId2',
  eventId: null,
  assignedAt: dayjs.utc().subtract(4, 'day').toDate(),
  completionAt: null,
  preCompletionNotes: 'Notes 5',
  postCompletionNotes: null,
  isCompleted: false,
  volunteer: {
    id: 'volunteerUserId3',
    hasAccepted: false,
    isPublic: false,
    hoursVolunteered: 0,
    user: {
      id: 'userId3',
      name: '',
      avatarURL: null,
    },
  },
  category: actionItemCategory2,
  event: null,
};

export const itemWithVolunteerGroup = {
  ...baseActionItem,
  id: '6',
  volunteerId: null,
  volunteerGroupId: 'volunteerGroupId1',
  categoryId: 'actionItemCategoryId1',
  eventId: null,
  assignedAt: dayjs.utc().subtract(5, 'day').toDate(),
  completionAt: null,
  preCompletionNotes: 'Group task',
  postCompletionNotes: null,
  isCompleted: false,
  volunteer: null,
  volunteerGroup: {
    id: 'volunteerGroupId1',
    name: 'Community Helpers',
    description: 'Helps with community outreach',
    volunteersRequired: 3,
    leader: {
      id: 'leaderId1',
      name: 'Casey GroupLeader',
      avatarURL: null,
    },
    volunteers: [
      {
        id: 'member1',
        user: {
          id: 'userId4',
          name: 'Group Member One',
        },
      },
    ],
  },
  category: actionItemCategory1,
  event: null,
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
          createdAt: dayjs.utc().toISOString(),
          updatedAt: dayjs.utc().toISOString(),
        },
        {
          id: 'userId2',
          name: 'Jane Doe',
          emailAddress: 'jane@example.com',
          role: 'REGULAR',
          avatarURL: null,
          createdAt: dayjs.utc().toISOString(),
          updatedAt: dayjs.utc().toISOString(),
        },
        {
          id: 'userId3',
          name: 'Wilt Shepherd',
          emailAddress: 'wilt@example.com',
          role: 'ADMIN',
          avatarURL: null,
          createdAt: dayjs.utc().toISOString(),
          updatedAt: dayjs.utc().toISOString(),
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
          createdAt: dayjs.utc().toISOString(),
          updatedAt: dayjs.utc().toISOString(),
        },
        {
          id: 'categoryId2',
          name: 'Category 2',
          isDisabled: false,
          organizationId: 'orgId',
          creatorId: 'creatorId2',
          createdAt: dayjs.utc().subtract(1, 'day').toISOString(),
          updatedAt: dayjs.utc().subtract(1, 'day').toISOString(),
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
      actionItemsByOrganization: [
        itemWithUser1,
        itemWithUser2,
        itemWithoutAssignee,
        itemWithoutCategory,
        itemWithEmptyAssigneeName,
        itemWithVolunteerGroup,
      ],
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
        updatedAt: dayjs.utc().toISOString(),
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
        updatedAt: dayjs.utc().toISOString(),
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

// Add delete action item mutation mocks
export const deleteActionItemMutation = {
  request: {
    query: DELETE_ACTION_ITEM_MUTATION,
    variables: {
      input: {
        id: 'actionItemId1',
      },
    },
  },
  result: {
    data: {
      deleteActionItem: {
        id: 'actionItemId1',
      },
    },
  },
};

export const deleteActionItemMutationError = {
  request: {
    query: DELETE_ACTION_ITEM_MUTATION,
    variables: {
      input: {
        id: 'actionItemId1',
      },
    },
  },
  error: new Error('Mock Graphql Error'),
};

export const deleteActionItemForInstanceMutation = {
  request: {
    query: DELETE_ACTION_ITEM_FOR_INSTANCE,
    variables: {
      input: {
        actionId: 'actionItemId1',
        eventId: 'event123',
      },
    },
  },
  result: {
    data: {
      deleteActionItemForInstance: {
        id: 'actionItemId1',
      },
    },
  },
};

export const deleteActionItemForInstanceMutationError = {
  request: {
    query: DELETE_ACTION_ITEM_FOR_INSTANCE,
    variables: {
      input: {
        actionId: 'actionItemId1',
        eventId: 'event123',
      },
    },
  },
  error: new Error('Mock Graphql Error'),
};

// Add mocks for instance-specific mutations
export const completeActionForInstanceMutation = {
  request: {
    query: COMPLETE_ACTION_ITEM_FOR_INSTANCE,
    variables: {
      input: {
        actionId: 'actionItemId1',
        eventId: 'instanceId1',
        postCompletionNotes: 'Valid completion notes',
      },
    },
  },
  result: {
    data: {
      completeActionForInstance: {
        id: 'actionItemId1',
      },
    },
  },
};

export const completeActionForInstanceMutationError = {
  request: {
    query: COMPLETE_ACTION_ITEM_FOR_INSTANCE,
    variables: {
      input: {
        actionId: 'actionItemId1',
        eventId: 'instanceId1',
        postCompletionNotes: 'Valid completion notes',
      },
    },
  },
  error: new Error('Mock Graphql Error'),
};

export const markActionAsPendingForInstanceMutation = {
  request: {
    query: MARK_ACTION_ITEM_AS_PENDING_FOR_INSTANCE,
    variables: {
      input: {
        actionId: 'actionItemId1',
        eventId: 'instanceId1',
      },
    },
  },
  result: {
    data: {
      markActionAsPendingForInstance: {
        id: 'actionItemId1',
      },
    },
  },
};

export const markActionAsPendingForInstanceMutationError = {
  request: {
    query: MARK_ACTION_ITEM_AS_PENDING_FOR_INSTANCE,
    variables: {
      input: {
        actionId: 'actionItemId1',
        eventId: 'instanceId1',
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
  deleteActionItemMutation,
  deleteActionItemForInstanceMutation,
  completeActionForInstanceMutation,
  markActionAsPendingForInstanceMutation,
];

export const MOCKS_ERROR = [
  actionItemListQueryError,
  memberListQuery,
  actionItemCategoryListQuery,
  markActionItemAsPendingMutationError,
  deleteActionItemMutationError,
  deleteActionItemForInstanceMutationError,
  completeActionForInstanceMutationError,
  markActionAsPendingForInstanceMutationError,
];

import dayjs from 'dayjs';
import {
  CREATE_ACTION_ITEM_MUTATION,
  DELETE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
} from 'GraphQl/Mutations/ActionItemMutations';
import {
  ACTION_ITEM_CATEGORY_LIST,
  ACTION_ITEM_LIST,
  MEMBERS_LIST,
} from 'GraphQl/Queries/Queries';

const baseActionItem = {
  assigner: {
    _id: 'userId2',
    firstName: 'Wilt',
    lastName: 'Shepherd',
    image: null,
  },
  creator: {
    _id: 'userId2',
    firstName: 'Wilt',
    lastName: 'Shepherd',
    __typename: 'User',
  },
};

const actionItem1 = {
  _id: 'actionItemId1',
  assignee: {
    _id: 'userId1',
    firstName: 'John',
    lastName: 'Doe',
    image: null,
  },
  actionItemCategory: {
    _id: 'actionItemCategoryId1',
    name: 'Category 1',
  },
  preCompletionNotes: 'Notes 1',
  postCompletionNotes: 'Cmp Notes 1',
  assignmentDate: '2024-08-27',
  dueDate: '2044-08-30',
  completionDate: '2044-09-03',
  isCompleted: true,
  event: null,
  allotedHours: 24,
  ...baseActionItem,
};

const actionItem2 = {
  _id: 'actionItemId2',
  assignee: {
    _id: 'userId1',
    firstName: 'Jane',
    lastName: 'Doe',
    image: 'image-url',
  },
  actionItemCategory: {
    _id: 'actionItemCategoryId2',
    name: 'Category 2',
  },
  preCompletionNotes: 'Notes 2',
  postCompletionNotes: null,
  assignmentDate: '2024-08-27',
  dueDate: '2044-09-30',
  completionDate: '2044-10-03',
  isCompleted: false,
  event: null,
  allotedHours: null,
  ...baseActionItem,
};

const memberListQuery = {
  request: {
    query: MEMBERS_LIST,
    variables: { id: 'orgId' },
  },
  result: {
    data: {
      organizations: [
        {
          _id: 'orgId',
          members: [
            {
              _id: 'userId1',
              firstName: 'Harve',
              lastName: 'Lance',
              email: 'harve@example.com',
              image: '',
              organizationsBlockedBy: [],
              createdAt: '2024-02-14',
            },
            {
              _id: 'userId2',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              email: 'wilt@example.com',
              image: '',
              organizationsBlockedBy: [],
              createdAt: '2024-02-14',
            },
          ],
        },
      ],
    },
  },
};

const actionItemCategoryListQuery = {
  request: {
    query: ACTION_ITEM_CATEGORY_LIST,
    variables: {
      organizationId: 'orgId',
      where: { is_disabled: false },
    },
  },
  result: {
    data: {
      actionItemCategoriesByOrganization: [
        {
          _id: 'categoryId1',
          name: 'Category 1',
          isDisabled: false,
          createdAt: '2024-08-26',
          creator: {
            _id: 'creatorId1',
            firstName: 'Wilt',
            lastName: 'Shepherd',
          },
        },
        {
          _id: 'categoryId2',
          name: 'Category 2',
          isDisabled: true,
          createdAt: '2024-08-25',
          creator: {
            _id: 'creatorId2',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      ],
    },
  },
};

export const MOCKS = [
  {
    request: {
      query: ACTION_ITEM_LIST,
      variables: {
        organizationId: 'orgId',
        orderBy: null,
        where: {
          assigneeName: '',
        },
      },
    },
    result: {
      data: {
        actionItemsByOrganization: [actionItem1, actionItem2],
      },
    },
  },
  {
    request: {
      query: ACTION_ITEM_LIST,
      variables: {
        organizationId: 'orgId',
        orderBy: null,
        where: {
          categoryName: '',
        },
      },
    },
    result: {
      data: {
        actionItemsByOrganization: [actionItem1, actionItem2],
      },
    },
  },
  {
    request: {
      query: ACTION_ITEM_LIST,
      variables: {
        organizationId: 'orgId',
        orderBy: 'dueDate_ASC',
        where: {
          assigneeName: '',
        },
      },
    },
    result: {
      data: {
        actionItemsByOrganization: [actionItem1, actionItem2],
      },
    },
  },
  {
    request: {
      query: ACTION_ITEM_LIST,
      variables: {
        organizationId: 'orgId',
        orderBy: 'dueDate_DESC',
        where: {
          assigneeName: '',
        },
      },
    },
    result: {
      data: {
        actionItemsByOrganization: [actionItem2, actionItem1],
      },
    },
  },
  {
    request: {
      query: ACTION_ITEM_LIST,
      variables: {
        organizationId: 'orgId',
        orderBy: null,
        where: {
          assigneeName: '',
          is_completed: true,
        },
      },
    },
    result: {
      data: {
        actionItemsByOrganization: [actionItem1],
      },
    },
  },
  {
    request: {
      query: ACTION_ITEM_LIST,
      variables: {
        organizationId: 'orgId',
        orderBy: null,
        where: {
          assigneeName: '',
          is_completed: false,
        },
      },
    },
    result: {
      data: {
        actionItemsByOrganization: [actionItem2],
      },
    },
  },
  {
    request: {
      query: ACTION_ITEM_LIST,
      variables: {
        organizationId: 'orgId',
        orderBy: null,
        where: {
          assigneeName: 'John',
        },
      },
    },
    result: {
      data: {
        actionItemsByOrganization: [actionItem1],
      },
    },
  },
  {
    request: {
      query: ACTION_ITEM_LIST,
      variables: {
        organizationId: 'orgId',
        orderBy: null,
        where: {
          categoryName: 'Category 1',
        },
      },
    },
    result: {
      data: {
        actionItemsByOrganization: [actionItem1],
      },
    },
  },
  {
    request: {
      query: DELETE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItemId1',
      },
    },
    result: {
      data: {
        removeActionItem: {
          _id: 'actionItemId1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItemId1',
        assigneeId: 'userId1',
        postCompletionNotes: '',
        isCompleted: false,
      },
    },
    result: {
      data: {
        updateActionItem: {
          _id: 'actionItemId1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItemId1',
        assigneeId: 'userId1',
        actionItemCategoryId: 'categoryId2',
        postCompletionNotes: 'Cmp Notes 2',
        allotedHours: 19,
      },
    },
    result: {
      data: {
        updateActionItem: {
          _id: 'actionItemId1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItemId2',
        assigneeId: 'userId1',
        actionItemCategoryId: 'categoryId1',
        preCompletionNotes: 'Notes 3',
        allotedHours: 19,
        dueDate: '2044-01-02',
      },
    },
    result: {
      data: {
        updateActionItem: {
          _id: 'actionItemId1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItemId1',
        assigneeId: 'userId1',
        postCompletionNotes: 'Cmp Notes 1',
        isCompleted: true,
      },
    },
    result: {
      data: {
        updateActionItem: {
          _id: 'actionItemId1',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_ACTION_ITEM_MUTATION,
      variables: {
        assigneeId: 'userId1',
        actionItemCategoryId: 'categoryId1',
        preCompletionNotes: 'Notes',
        allotedHours: 9,
        dueDate: '2044-01-02',
      },
    },
    result: {
      data: {
        createActionItem: {
          _id: 'actionItemId1',
        },
      },
    },
  },
  memberListQuery,
  actionItemCategoryListQuery,
];

export const MOCKS_ERROR = [
  {
    request: {
      query: ACTION_ITEM_LIST,
      variables: {
        organizationId: 'orgId',
        orderBy: null,
        where: {
          assigneeName: '',
        },
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: DELETE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItemId1',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItemId1',
        assigneeId: 'userId1',
        postCompletionNotes: '',
        isCompleted: false,
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: CREATE_ACTION_ITEM_MUTATION,
      variables: {
        preCompletionNotes: '',
        allotedHours: null,
        dueDate: dayjs().format('YYYY-MM-DD'),
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItemId1',
        assigneeId: 'userId1',
        postCompletionNotes: 'Cmp Notes 2',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  memberListQuery,
  actionItemCategoryListQuery,
];

export const MOCKS_EMPTY = [
  {
    request: {
      query: ACTION_ITEM_LIST,
      variables: {
        organizationId: 'orgId',
        orderBy: null,
        where: {
          assigneeName: '',
        },
      },
    },
    result: {
      data: {
        actionItemsByOrganization: [],
      },
    },
  },
  memberListQuery,
  actionItemCategoryListQuery,
];

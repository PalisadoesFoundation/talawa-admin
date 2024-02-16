import {
  CREATE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
  DELETE_ACTION_ITEM_MUTATION,
} from 'GraphQl/Mutations/mutations';

import {
  ACTION_ITEM_CATEGORY_LIST,
  ACTION_ITEM_LIST,
  MEMBERS_LIST,
} from 'GraphQl/Queries/Queries';

export const MOCKS = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: { organizationId: '123' },
    },
    result: {
      data: {
        actionItemCategoriesByOrganization: [
          {
            _id: 'actionItemCategory1',
            name: 'ActionItemCategory 1',
            isDisabled: false,
          },
          {
            _id: 'actionItemCategory2',
            name: 'ActionItemCategory 2',
            isDisabled: true,
          },
          {
            _id: 'actionItemCategory3',
            name: 'ActionItemCategory 3',
            isDisabled: false,
          },
          {
            _id: 'actionItemCategory4',
            name: 'ActionItemCategory 4',
            isDisabled: true,
          },
        ],
      },
    },
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: { id: '123' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '123',
            members: [
              {
                _id: 'user1',
                firstName: 'Harve',
                lastName: 'Lance',
                email: 'harve@example.com',
                image: '',
                organizationsBlockedBy: [],
                createdAt: '2024-02-14',
              },
              {
                _id: 'user2',
                firstName: 'Scott',
                lastName: 'Tony',
                email: 'scott@example.com',
                image: '',
                organizationsBlockedBy: [],
                createdAt: '2024-02-14',
              },
              {
                _id: 'user3',
                firstName: 'Vyvyan',
                lastName: 'Kerry',
                email: 'vyvyan@example.com',
                image: '',
                organizationsBlockedBy: [],
                createdAt: '2024-02-14',
              },
              {
                _id: 'user4',
                firstName: 'Praise',
                lastName: 'Norris',
                email: 'praise@example.com',
                image: '',
                organizationsBlockedBy: [],
                createdAt: '2024-02-14',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: ACTION_ITEM_LIST,
      variables: {
        organizationId: '123',
        orderBy: 'createdAt_DESC',
        actionItemCategoryId: '',
        isActive: false,
        isCompleted: false,
      },
    },
    result: {
      data: {
        actionItemsByOrganization: [
          {
            _id: 'actionItem1',
            assignee: {
              _id: 'user1',
              firstName: 'Harve',
              lastName: 'Lance',
            },
            actionItemCategory: {
              _id: 'actionItemCategory1',
              name: 'ActionItemCategory 1',
            },
            preCompletionNotes: 'Pre Completion Notes',
            postCompletionNotes: 'Post Completion Notes',
            assignmentDate: '2024-02-14',
            dueDate: '2024-02-21',
            completionDate: '2024-20-21',
            isCompleted: false,
            assigner: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            event: {
              _id: 'event1',
              title: 'event 1',
            },
            creator: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
          },
          {
            _id: 'actionItem2',
            assignee: {
              _id: 'user1',
              firstName: 'Scott',
              lastName: 'Tony',
            },
            actionItemCategory: {
              _id: 'actionItemCategory2',
              name: 'ActionItemCategory 2',
            },
            preCompletionNotes: 'Pre Completion Notes',
            postCompletionNotes: 'Post Completion Notes',
            assignmentDate: '2024-02-14',
            dueDate: '2024-02-21',
            completionDate: '2024-20-21',
            isCompleted: true,
            assigner: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            event: {
              _id: 'event1',
              title: 'event 1',
            },
            creator: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
          },
          {
            _id: 'actionItem3',
            assignee: {
              _id: 'user1',
              firstName: 'Praise',
              lastName: 'Norris',
            },
            actionItemCategory: {
              _id: 'actionItemCategory3',
              name: 'ActionItemCategory 3',
            },
            preCompletionNotes: 'Pre Completion Notes',
            postCompletionNotes: 'Post Completion Notes',
            assignmentDate: '2024-02-14',
            dueDate: '2024-02-21',
            completionDate: '2024-20-21',
            isCompleted: false,
            assigner: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            event: {
              _id: 'event1',
              title: 'event 1',
            },
            creator: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: ACTION_ITEM_LIST,
      variables: {
        organizationId: '123',
        orderBy: 'createdAt_ASC',
        actionItemCategoryId: '',
        isActive: false,
        isCompleted: false,
      },
    },
    result: {
      data: {
        actionItemsByOrganization: [
          {
            _id: 'actionItem3',
            assignee: {
              _id: 'user1',
              firstName: 'Praise',
              lastName: 'Norris',
            },
            actionItemCategory: {
              _id: 'actionItemCategory3',
              name: 'ActionItemCategory 3',
            },
            preCompletionNotes: 'Pre Completion Notes',
            postCompletionNotes: 'Post Completion Notes',
            assignmentDate: '2024-02-14',
            dueDate: '2024-02-21',
            completionDate: '2024-20-21',
            isCompleted: false,
            assigner: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            event: {
              _id: 'event1',
              title: 'event 1',
            },
            creator: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
          },
          {
            _id: 'actionItem2',
            assignee: {
              _id: 'user1',
              firstName: 'Scott',
              lastName: 'Tony',
            },
            actionItemCategory: {
              _id: 'actionItemCategory2',
              name: 'ActionItemCategory 2',
            },
            preCompletionNotes: 'Pre Completion Notes',
            postCompletionNotes: 'Post Completion Notes',
            assignmentDate: '2024-02-14',
            dueDate: '2024-02-21',
            completionDate: '2024-20-21',
            isCompleted: true,
            assigner: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            event: {
              _id: 'event1',
              title: 'event 1',
            },
            creator: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
          },
          {
            _id: 'actionItem1',
            assignee: {
              _id: 'user1',
              firstName: 'Harve',
              lastName: 'Lance',
            },
            actionItemCategory: {
              _id: 'actionItemCategory1',
              name: 'ActionItemCategory 1',
            },
            preCompletionNotes: 'Pre Completion Notes',
            postCompletionNotes: 'Post Completion Notes',
            assignmentDate: '2024-02-14',
            dueDate: '2024-02-21',
            completionDate: '2024-20-21',
            isCompleted: false,
            assigner: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            event: {
              _id: 'event1',
              title: 'event 1',
            },
            creator: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
          },
        ],
      },
    },
  },
];

export const MOCKS_ERROR_ACTION_ITEM_CATEGORY_LIST_QUERY = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: { organizationId: '123' },
    },
    error: new Error('Mock Graphql Error'),
  },
];

export const MOCKS_ERROR_MEMBERS_LIST_QUERY = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: { organizationId: '123' },
    },
    result: {
      data: {
        actionItemCategoriesByOrganization: [
          {
            _id: 'actionItemCategory1',
            name: 'ActionItemCategory 1',
            isDisabled: false,
          },
          {
            _id: 'actionItemCategory2',
            name: 'ActionItemCategory 2',
            isDisabled: true,
          },
          {
            _id: 'actionItemCategory3',
            name: 'ActionItemCategory 3',
            isDisabled: false,
          },
          {
            _id: 'actionItemCategory4',
            name: 'ActionItemCategory 4',
            isDisabled: true,
          },
        ],
      },
    },
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: { id: '123' },
    },
    error: new Error('Mock Graphql Error'),
  },
];

export const MOCKS_ERROR_ACTION_ITEM_LIST_QUERY = [
  {
    request: {
      query: ACTION_ITEM_CATEGORY_LIST,
      variables: { organizationId: '123' },
    },
    result: {
      data: {
        actionItemCategoriesByOrganization: [
          {
            _id: 'actionItemCategory1',
            name: 'ActionItemCategory 1',
            isDisabled: false,
          },
          {
            _id: 'actionItemCategory2',
            name: 'ActionItemCategory 2',
            isDisabled: true,
          },
          {
            _id: 'actionItemCategory3',
            name: 'ActionItemCategory 3',
            isDisabled: false,
          },
          {
            _id: 'actionItemCategory4',
            name: 'ActionItemCategory 4',
            isDisabled: true,
          },
        ],
      },
    },
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: { id: '123' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '123',
            members: [
              {
                _id: 'user1',
                firstName: 'Harve',
                lastName: 'Lance',
                email: 'harve@example.com',
                image: '',
                organizationsBlockedBy: [],
                createdAt: '2024-02-14',
              },
              {
                _id: 'user2',
                firstName: 'Scott',
                lastName: 'Tony',
                email: 'scott@example.com',
                image: '',
                organizationsBlockedBy: [],
                createdAt: '2024-02-14',
              },
              {
                _id: 'user3',
                firstName: 'Vyvyan',
                lastName: 'Kerry',
                email: 'vyvyan@example.com',
                image: '',
                organizationsBlockedBy: [],
                createdAt: '2024-02-14',
              },
              {
                _id: 'user4',
                firstName: 'Praise',
                lastName: 'Norris',
                email: 'praise@example.com',
                image: '',
                organizationsBlockedBy: [],
                createdAt: '2024-02-14',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: ACTION_ITEM_LIST,
      variables: { id: '123' },
    },
    error: new Error('Mock Graphql Error'),
  },
];

import { CREATE_ACTION_ITEM_MUTATION } from 'GraphQl/Mutations/mutations';

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
            completionDate: '2024-02-21',
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
              _id: 'user2',
              firstName: 'John',
              lastName: 'Doe',
            },
            actionItemCategory: {
              _id: 'actionItemCategory2',
              name: 'ActionItemCategory 2',
            },
            preCompletionNotes: 'Pre Completion Notes',
            postCompletionNotes: 'Post Completion Notes',
            assignmentDate: '2024-02-14',
            dueDate: '2024-02-21',
            completionDate: '2024-02-21',
            isCompleted: false,
            assigner: {
              _id: 'user0',
              firstName: 'Wilt',
              lastName: 'Shepherd',
            },
            event: null,
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
        eventId: 'event1',
        orderBy: 'createdAt_DESC',
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
            completionDate: '2024-02-21',
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
            completionDate: '2024-02-21',
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
        isActive: true,
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
            completionDate: '2024-02-21',
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
        isCompleted: true,
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
            completionDate: '2024-02-21',
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
        actionItemCategoryId: 'actionItemCategory1',
        isActive: false,
        isCompleted: true,
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
            completionDate: '2024-02-21',
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
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemCategoryId: 'actionItemCategory1',
        assigneeId: 'user1',
        preCompletionNotes: 'pre completion notes',
        dueDate: '2024-02-14',
      },
    },
    result: {
      data: {
        createActionItem: {
          _id: 'actionItem2',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_ACTION_ITEM_MUTATION,
      variables: {
        eventId: 'event1',
        actionItemCategoryId: 'actionItemCategory1',
        assigneeId: 'user1',
        preCompletionNotes: 'pre completion notes',
        dueDate: '2024-02-14',
      },
    },
    result: {
      data: {
        createActionItem: {
          _id: 'actionItem2',
        },
      },
    },
  },
];

import { ACTION_ITEMS_BY_USER } from 'GraphQl/Queries/ActionItemQueries';

const action1 = {
  _id: 'actionId1',
  assignee: {
    _id: 'volunteerId1',
    user: {
      _id: 'userId',
      firstName: 'Teresa',
      lastName: 'Bradley',
      image: null,
    },
  },
  assigneeGroup: null,
  assigneeType: 'EventVolunteer',
  assigner: {
    _id: 'userId1',
    firstName: 'Wilt',
    lastName: 'Shepherd',
    image: null,
  },
  actionItemCategory: {
    _id: 'categoryId1',
    name: 'Category 1',
  },
  preCompletionNotes: '',
  postCompletionNotes: '',
  assignmentDate: '2024-10-25',
  dueDate: '2025-10-25',
  completionDate: '2024-11-01',
  isCompleted: false,
  event: {
    _id: 'eventId1',
    title: 'Event 1',
  },
  creator: {
    _id: 'userId1',
    firstName: 'Wilt',
    lastName: 'Shepherd',
  },
  allottedHours: 8,
};

const action2 = {
  _id: 'actionId2',
  assignee: null,
  assigneeGroup: {
    _id: 'groupId1',
    name: 'Group 1',
  },
  assigneeType: 'EventVolunteerGroup',
  assigner: {
    _id: 'userId1',
    firstName: 'Wilt',
    lastName: 'Shepherd',
    image: null,
  },
  actionItemCategory: {
    _id: 'categoryId2',
    name: 'Category 2',
  },
  preCompletionNotes: '',
  postCompletionNotes: '',
  assignmentDate: '2024-10-25',
  dueDate: '2025-10-26',
  completionDate: '2024-11-01',
  isCompleted: false,
  event: {
    _id: 'eventId1',
    title: 'Event 1',
  },
  creator: {
    _id: 'userId1',
    firstName: 'Wilt',
    lastName: 'Shepherd',
  },
  allottedHours: 8,
};

const action3 = {
  _id: 'actionId3',
  assignee: {
    _id: 'volunteerId3',
    user: {
      _id: 'userId',
      firstName: 'Teresa',
      lastName: 'Bradley',
      image: 'img-url',
    },
  },
  assigneeGroup: null,
  assigneeType: 'EventVolunteer',
  assigner: {
    _id: 'userId1',
    firstName: 'Wilt',
    lastName: 'Shepherd',
    image: null,
  },
  actionItemCategory: {
    _id: 'categoryId3',
    name: 'Category 3',
  },
  preCompletionNotes: '',
  postCompletionNotes: '',
  assignmentDate: '2024-10-25',
  dueDate: '2024-10-27',
  completionDate: '2024-11-01',
  isCompleted: true,
  event: {
    _id: 'eventId2',
    title: 'Event 2',
  },
  creator: {
    _id: 'userId1',
    firstName: 'Wilt',
    lastName: 'Shepherd',
  },
  allottedHours: null,
};

export const MOCKS = [
  {
    request: {
      query: ACTION_ITEMS_BY_USER,
      variables: {
        userId: 'userId',
        orderBy: null,
        where: {
          orgId: 'orgId',
          assigneeName: '',
        },
      },
    },
    result: {
      data: {
        actionItemsByUser: [action1, action2, action3],
      },
    },
  },
  {
    request: {
      query: ACTION_ITEMS_BY_USER,
      variables: {
        userId: 'userId',
        orderBy: 'dueDate_DESC',
        where: {
          orgId: 'orgId',
          assigneeName: '',
        },
      },
    },
    result: {
      data: {
        actionItemsByUser: [action2, action1],
      },
    },
  },
  {
    request: {
      query: ACTION_ITEMS_BY_USER,
      variables: {
        userId: 'userId',
        orderBy: 'dueDate_ASC',
        where: {
          orgId: 'orgId',
          assigneeName: '',
        },
      },
    },
    result: {
      data: {
        actionItemsByUser: [action1, action2],
      },
    },
  },
  {
    request: {
      query: ACTION_ITEMS_BY_USER,
      variables: {
        userId: 'userId',
        orderBy: null,
        where: {
          orgId: 'orgId',
          assigneeName: '1',
        },
      },
    },
    result: {
      data: {
        actionItemsByUser: [action2],
      },
    },
  },
  {
    request: {
      query: ACTION_ITEMS_BY_USER,
      variables: {
        userId: 'userId',
        orderBy: null,
        where: {
          orgId: 'orgId',
          categoryName: '',
        },
      },
    },
    result: {
      data: {
        actionItemsByUser: [action1, action2],
      },
    },
  },
  {
    request: {
      query: ACTION_ITEMS_BY_USER,
      variables: {
        userId: 'userId',
        orderBy: null,
        where: {
          orgId: 'orgId',
          categoryName: '1',
        },
      },
    },
    result: {
      data: {
        actionItemsByUser: [action1],
      },
    },
  },
];

export const EMPTY_MOCKS = [
  {
    request: {
      query: ACTION_ITEMS_BY_USER,
      variables: {
        userId: 'userId',
        orderBy: null,
        where: {
          orgId: 'orgId',
          assigneeName: '',
        },
      },
    },
    result: {
      data: {
        actionItemsByUser: [],
      },
    },
  },
];

export const ERROR_MOCKS = [
  {
    request: {
      query: ACTION_ITEMS_BY_USER,
      variables: {
        userId: 'userId',
        orderBy: null,
        where: {
          orgId: 'orgId',
          assigneeName: '',
        },
      },
    },
    error: new Error('Mock Graphql ACTION_ITEMS_BY_USER Error'),
  },
];

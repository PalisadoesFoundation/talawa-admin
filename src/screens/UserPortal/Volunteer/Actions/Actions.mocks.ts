import type { MockedResponse } from '@apollo/react-testing';
import { ACTION_ITEM_LIST } from 'GraphQl/Queries/ActionItemQueries';

const action1 = {
  id: 'actionId1',
  volunteer: {
    id: 'volunteerId1',
    hasAccepted: true,
    isPublic: true,
    hoursVolunteered: 8,
    user: {
      id: 'userId',
      name: 'Teresa Bradley',
      avatarURL: null,
    },
  },
  volunteerGroup: null,
  creator: {
    id: 'userId1',
    name: 'Wilt Shepherd',
  },
  updater: {
    id: 'userId1',
    name: 'Wilt Shepherd',
  },
  category: {
    id: 'categoryId1',
    name: 'Category 1',
    description: 'Category 1 description',
  },
  preCompletionNotes: '',
  postCompletionNotes: '',
  assignedAt: '2024-08-25',
  completionAt: '2024-09-01',
  createdAt: '2024-08-20',
  isCompleted: false,
  event: {
    id: 'eventId1',
    name: 'Event 1',
    description: 'Event 1 description',
  },
  recurringEventInstance: null,
  organization: {
    id: 'orgId',
    name: 'Organization 1',
    description: 'Organization 1 description',
  },
};

const action2 = {
  id: 'actionId2',
  volunteer: null,
  volunteerGroup: {
    id: 'groupId1',
    name: 'Group 1',
    description: 'Group 1 description',
    volunteersRequired: 5,
    leader: {
      id: 'userId1',
      name: 'Wilt Shepherd',
      avatarURL: null,
    },
    volunteers: [
      {
        id: 'volunteerGroupMemberId1',
        user: {
          id: 'userId',
          name: 'Teresa Bradley',
        },
      },
    ],
  },
  creator: {
    id: 'userId1',
    name: 'Wilt Shepherd',
  },
  updater: {
    id: 'userId1',
    name: 'Wilt Shepherd',
  },
  category: {
    id: 'categoryId2',
    name: 'Category 2',
    description: 'Category 2 description',
  },
  preCompletionNotes: '',
  postCompletionNotes: '',
  assignedAt: '2024-10-25',
  completionAt: '2024-11-01',
  createdAt: '2024-10-20',
  isCompleted: false,
  event: {
    id: 'eventId1',
    name: 'Event 1',
    description: 'Event 1 description',
  },
  recurringEventInstance: null,
  organization: {
    id: 'orgId',
    name: 'Organization 1',
    description: 'Organization 1 description',
  },
};

const action3 = {
  id: 'actionId3',
  volunteer: {
    id: 'volunteerId2',
    hasAccepted: true,
    isPublic: false,
    hoursVolunteered: 4,
    user: {
      id: 'userId2',
      name: 'John Doe',
      avatarURL: null,
    },
  },
  volunteerGroup: null,
  creator: {
    id: 'userId1',
    name: 'Wilt Shepherd',
  },
  updater: {
    id: 'userId1',
    name: 'Wilt Shepherd',
  },
  category: {
    id: 'categoryId3',
    name: 'Category 3',
    description: 'Category 3 description',
  },
  preCompletionNotes: '',
  postCompletionNotes: '',
  assignedAt: '2024-07-10',
  completionAt: '2024-07-20',
  createdAt: '2024-07-05',
  isCompleted: true,
  event: {
    id: 'eventId2',
    name: 'Event 2',
    description: 'Event 2 description',
  },
  recurringEventInstance: null,
  organization: {
    id: 'orgId',
    name: 'Organization 1',
    description: 'Organization 1 description',
  },
};

export const MOCKS: MockedResponse[] = [
  {
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
        actionItemsByOrganization: [action1, action2, action3],
      },
    },
  },
];

export const EMPTY_MOCKS: MockedResponse[] = [
  {
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
  },
];

export const ERROR_MOCKS: MockedResponse[] = [
  {
    request: {
      query: ACTION_ITEM_LIST,
      variables: {
        input: {
          organizationId: 'orgId',
        },
      },
    },
    error: new Error('Mock Graphql ACTION_ITEM_LIST Error'),
  },
];

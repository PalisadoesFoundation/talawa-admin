import dayjs from 'dayjs';
import {
  CREATE_ACTION_ITEM_MUTATION,
  DELETE_ACTION_ITEM_MUTATION,
  UPDATE_ACTION_ITEM_MUTATION,
} from 'GraphQl/Mutations/ActionItemMutations';
import {
  EVENT_VOLUNTEER_GROUP_LIST,
  EVENT_VOLUNTEER_LIST,
} from 'GraphQl/Queries/EventVolunteerQueries';
import {
  ACTION_ITEM_CATEGORY_LIST,
  ACTION_ITEM_LIST,
  MEMBERS_LIST,
} from 'GraphQl/Queries/Queries';
import type { InterfaceActionItemInfo } from 'utils/interfaces';

const actionItemCategory1 = {
  _id: 'actionItemCategoryId1',
  name: 'Category 1',
};

const actionItemCategory2 = {
  _id: 'actionItemCategoryId2',
  name: 'Category 2',
};

const baseActionItem = {
  assigner: {
    _id: 'userId',
    firstName: 'Wilt',
    lastName: 'Shepherd',
    image: null,
  },
  creator: {
    _id: 'userId',
    firstName: 'Wilt',
    lastName: 'Shepherd',
    image: null,
    __typename: 'User',
  },
};

const itemWithVolunteer: InterfaceActionItemInfo = {
  _id: 'actionItemId1',
  assigneeType: 'EventVolunteer',
  assignee: {
    _id: 'volunteerId1',
    hasAccepted: true,
    hoursVolunteered: 12,
    assignments: [],
    groups: [],
    user: {
      _id: 'userId1',
      firstName: 'John',
      lastName: 'Doe',
      image: null,
    },
  },
  assigneeUser: null,
  assigneeGroup: null,
  preCompletionNotes: 'Notes 1',
  postCompletionNotes: 'Cmp Notes 1',
  assignmentDate: new Date('2024-08-27'),
  dueDate: new Date('2044-08-30'),
  completionDate: new Date('2044-09-03'),
  isCompleted: true,
  event: null,
  allotedHours: 24,
  actionItemCategory: actionItemCategory1,
  ...baseActionItem,
};

const itemWithVolunteerImage: InterfaceActionItemInfo = {
  _id: 'actionItemId1b',
  assigneeType: 'EventVolunteer',
  assignee: {
    _id: 'volunteerId1',
    hasAccepted: true,
    hoursVolunteered: 12,
    assignments: [],
    groups: [],
    user: {
      _id: 'userId1',
      firstName: 'John',
      lastName: 'Doe',
      image: 'user-image',
    },
  },
  assigneeUser: null,
  assigneeGroup: null,
  preCompletionNotes: 'Notes 1',
  postCompletionNotes: 'Cmp Notes 1',
  assignmentDate: new Date('2024-08-27'),
  dueDate: new Date('2044-08-30'),
  completionDate: new Date('2044-09-03'),
  isCompleted: true,
  event: null,
  allotedHours: 24,
  actionItemCategory: actionItemCategory1,
  ...baseActionItem,
};

const itemWithUser: InterfaceActionItemInfo = {
  _id: 'actionItemId2',
  assigneeType: 'User',
  assigneeUser: {
    _id: 'userId1',
    firstName: 'Jane',
    lastName: 'Doe',
    image: null,
  },
  assignee: null,
  assigneeGroup: null,
  preCompletionNotes: 'Notes 2',
  postCompletionNotes: null,
  assignmentDate: new Date('2024-08-27'),
  dueDate: new Date('2044-09-30'),
  completionDate: new Date('2044-10-03'),
  isCompleted: false,
  event: null,
  allotedHours: null,
  actionItemCategory: actionItemCategory2,
  ...baseActionItem,
};

const itemWithUserImage: InterfaceActionItemInfo = {
  _id: 'actionItemId2b',
  assigneeType: 'User',
  assigneeUser: {
    _id: 'userId1',
    firstName: 'Jane',
    lastName: 'Doe',
    image: 'user-image',
  },
  assignee: null,
  assigneeGroup: null,
  preCompletionNotes: 'Notes 2',
  postCompletionNotes: null,
  assignmentDate: new Date('2024-08-27'),
  dueDate: new Date('2044-09-30'),
  completionDate: new Date('2044-10-03'),
  isCompleted: false,
  event: null,
  allotedHours: null,
  actionItemCategory: actionItemCategory2,
  ...baseActionItem,
};

const itemWithGroup: InterfaceActionItemInfo = {
  _id: 'actionItemId3',
  assigneeType: 'EventVolunteerGroup',
  assigneeUser: null,
  assignee: null,
  assigneeGroup: {
    _id: 'volunteerGroupId1',
    name: 'Group 1',
    description: 'Group 1 Description',
    volunteersRequired: 10,
    event: {
      _id: 'eventId1',
    },
    assignments: [],
    volunteers: [],
    createdAt: '2024-08-27',
    creator: {
      _id: 'userId1',
      firstName: 'John',
      lastName: 'Doe',
      image: undefined,
    },
    leader: {
      _id: 'userId1',
      firstName: 'John',
      lastName: 'Doe',
      image: undefined,
    },
  },
  preCompletionNotes: 'Notes 1',
  postCompletionNotes: 'Cmp Notes 1',
  assignmentDate: new Date('2024-08-27'),
  dueDate: new Date('2044-08-30'),
  completionDate: new Date('2044-09-03'),
  isCompleted: true,
  event: null,
  allotedHours: 24,
  actionItemCategory: actionItemCategory1,
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

const volunteerListQuery = [
  {
    request: {
      query: EVENT_VOLUNTEER_LIST,
      variables: { where: { eventId: 'eventId', hasAccepted: true } },
    },
    result: {
      data: {
        getEventVolunteers: [
          {
            _id: 'volunteerId1',
            hasAccepted: true,
            hoursVolunteered: 0,
            user: {
              _id: 'userId1',
              firstName: 'Teresa',
              lastName: 'Bradley',
              image: null,
            },
            assignments: [],
            groups: [
              {
                _id: 'groupId1',
                name: 'group1',
                volunteers: [
                  {
                    _id: 'volunteerId1',
                  },
                ],
              },
            ],
          },
          {
            _id: 'volunteerId2',
            hasAccepted: true,
            hoursVolunteered: 0,
            user: {
              _id: 'userId3',
              firstName: 'Bruce',
              lastName: 'Graza',
              image: null,
            },
            assignments: [],
            groups: [],
          },
        ],
      },
    },
  },
  {
    request: {
      query: EVENT_VOLUNTEER_LIST,
      variables: { where: { hasAccepted: true } },
    },
    result: {
      data: {
        getEventVolunteers: [],
      },
    },
  },
];

const groupListQuery = [
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: { where: { eventId: 'eventId' } },
    },
    result: {
      data: {
        getEventVolunteerGroups: [
          {
            _id: 'groupId1',
            name: 'group1',
            description: 'desc',
            volunteersRequired: 10,
            createdAt: '2024-10-27T15:34:15.889Z',
            creator: {
              _id: 'userId2',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
            },
            leader: {
              _id: 'userId1',
              firstName: 'Teresa',
              lastName: 'Bradley',
              image: null,
            },
            volunteers: [
              {
                _id: 'volunteerId1',
                user: {
                  _id: 'userId1',
                  firstName: 'Teresa',
                  lastName: 'Bradley',
                  image: null,
                },
              },
            ],
            assignments: [],
            event: {
              _id: 'eventId',
            },
          },
          {
            _id: 'groupId2',
            name: 'group2',
            description: 'desc',
            volunteersRequired: 10,
            createdAt: '2024-10-27T15:34:15.889Z',
            creator: {
              _id: 'userId2',
              firstName: 'Wilt',
              lastName: 'Shepherd',
              image: null,
            },
            leader: {
              _id: 'userId1',
              firstName: 'Teresa',
              lastName: 'Bradley',
              image: null,
            },
            volunteers: [],
            assignments: [],
            event: {
              _id: 'eventId',
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: { where: { eventId: undefined } },
    },
    result: {
      data: {
        getEventVolunteerGroups: [],
      },
    },
  },
];

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
        actionItemsByOrganization: [
          itemWithVolunteer,
          itemWithUser,
          itemWithGroup,
          itemWithVolunteerImage,
          itemWithUserImage,
        ],
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
        actionItemsByOrganization: [itemWithVolunteer, itemWithUser],
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
        actionItemsByOrganization: [itemWithVolunteer, itemWithUser],
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
        actionItemsByOrganization: [itemWithUser, itemWithVolunteer],
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
        actionItemsByOrganization: [itemWithVolunteer],
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
        actionItemsByOrganization: [itemWithUser],
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
        actionItemsByOrganization: [itemWithVolunteer],
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
        actionItemsByOrganization: [itemWithVolunteer],
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
        assigneeType: 'User',
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
        assigneeType: 'User',
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
        actionItemId: 'actionItemId1',
        assigneeId: 'volunteerGroupId1',
        assigneeType: 'EventVolunteerGroup',
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
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItemId2',
        assigneeId: 'userId1',
        assigneeType: 'User',
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
      query: UPDATE_ACTION_ITEM_MUTATION,
      variables: {
        actionItemId: 'actionItemId2',
        assigneeId: 'volunteerId2',
        assigneeType: 'EventVolunteer',
        actionItemCategoryId: 'categoryId1',
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
        assigneeId: 'groupId2',
        assigneeType: 'EventVolunteerGroup',
        actionItemCategoryId: 'categoryId1',
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
      query: CREATE_ACTION_ITEM_MUTATION,
      variables: {
        assigneeId: 'userId1',
        assigneeType: 'User',
        actionItemCategoryId: 'categoryId1',
        preCompletionNotes: 'Notes',
        allotedHours: 9,
        dDate: '2044-01-02',
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
  {
    request: {
      query: CREATE_ACTION_ITEM_MUTATION,
      variables: {
        assigneeId: 'userId1',
        assigneeType: 'User',
        actionItemCategoryId: 'categoryId1',
        preCompletionNotes: 'Notes',
        allotedHours: 9,
        dDate: '2044-01-02',
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
  {
    request: {
      query: CREATE_ACTION_ITEM_MUTATION,
      variables: {
        assigneeId: 'volunteerId1',
        assigneeType: 'EventVolunteer',
        actionItemCategoryId: 'categoryId1',
        preCompletionNotes: 'Notes',
        allotedHours: 9,
        dDate: '2044-01-02',
        eventId: 'eventId',
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
  {
    request: {
      query: CREATE_ACTION_ITEM_MUTATION,
      variables: {
        assigneeId: 'groupId1',
        assigneeType: 'EventVolunteerGroup',
        actionItemCategoryId: 'categoryId1',
        preCompletionNotes: 'Notes',
        allotedHours: 9,
        dDate: '2044-01-02',
        eventId: 'eventId',
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
  ...volunteerListQuery,
  ...groupListQuery,
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
        assigneeId: 'volunteerId1',
        assigneeType: 'EventVolunteer',
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
        assigneeId: '',
        assigneeType: 'User',
        preCompletionNotes: '',
        allotedHours: null,
        dDate: dayjs().format('YYYY-MM-DD'),
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
        assigneeType: 'User',
        postCompletionNotes: 'Cmp Notes 2',
      },
    },
    error: new Error('Mock Graphql Error'),
  },
  memberListQuery,
  actionItemCategoryListQuery,
  ...volunteerListQuery,
  ...groupListQuery,
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
  ...volunteerListQuery,
  ...groupListQuery,
];

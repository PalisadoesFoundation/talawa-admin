import {
  CREATE_VOLUNTEER_GROUP,
  DELETE_VOLUNTEER_GROUP,
  UPDATE_VOLUNTEER_GROUP,
} from 'GraphQl/Mutations/EventVolunteerMutation';
import { EVENT_VOLUNTEER_GROUP_LIST } from 'GraphQl/Queries/EventVolunteerQueries';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';

const group1 = {
  _id: 'groupId1',
  name: 'Group 1',
  description: 'desc',
  volunteersRequired: null,
  createdAt: '2024-10-25T16:16:32.978Z',
  creator: {
    _id: 'creatorId1',
    firstName: 'Wilt',
    lastName: 'Shepherd',
    image: null,
  },
  leader: {
    _id: 'userId',
    firstName: 'Teresa',
    lastName: 'Bradley',
    image: 'img-url',
  },
  volunteers: [
    {
      _id: 'volunteerId1',
      user: {
        _id: 'userId',
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
};

const group2 = {
  _id: 'groupId2',
  name: 'Group 2',
  description: 'desc',
  volunteersRequired: null,
  createdAt: '2024-10-27T15:25:13.044Z',
  creator: {
    _id: 'creatorId2',
    firstName: 'Wilt',
    lastName: 'Shepherd',
    image: null,
  },
  leader: {
    _id: 'userId',
    firstName: 'Teresa',
    lastName: 'Bradley',
    image: null,
  },
  volunteers: [
    {
      _id: 'volunteerId2',
      user: {
        _id: 'userId',
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
};

const group3 = {
  _id: 'groupId3',
  name: 'Group 3',
  description: 'desc',
  volunteersRequired: null,
  createdAt: '2024-10-27T15:34:15.889Z',
  creator: {
    _id: 'creatorId3',
    firstName: 'Wilt',
    lastName: 'Shepherd',
    image: null,
  },
  leader: {
    _id: 'userId1',
    firstName: 'Bruce',
    lastName: 'Garza',
    image: null,
  },
  volunteers: [
    {
      _id: 'volunteerId3',
      user: {
        _id: 'userId',
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
};

export const MOCKS = [
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          eventId: 'eventId',
          leaderName: null,
          name_contains: '',
        },
        orderBy: null,
      },
    },
    result: {
      data: {
        getEventVolunteerGroups: [group1, group2, group3],
      },
    },
  },
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          eventId: 'eventId',
          leaderName: null,
          name_contains: '',
        },
        orderBy: 'members_DESC',
      },
    },
    result: {
      data: {
        getEventVolunteerGroups: [group1, group2],
      },
    },
  },

  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          eventId: 'eventId',
          leaderName: null,
          name_contains: '',
        },
        orderBy: 'members_ASC',
      },
    },
    result: {
      data: {
        getEventVolunteerGroups: [group2, group1],
      },
    },
  },
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          eventId: 'eventId',
          leaderName: null,
          name_contains: '1',
        },
        orderBy: null,
      },
    },
    result: {
      data: {
        getEventVolunteerGroups: [group1],
      },
    },
  },
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          eventId: 'eventId',
          leaderName: '',
          name_contains: null,
        },
        orderBy: null,
      },
    },
    result: {
      data: {
        getEventVolunteerGroups: [group1, group2, group3],
      },
    },
  },
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          eventId: 'eventId',
          leaderName: 'Bruce',
          name_contains: null,
        },
        orderBy: null,
      },
    },
    result: {
      data: {
        getEventVolunteerGroups: [group3],
      },
    },
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: {
        id: 'orgId',
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'orgId',
            members: [
              {
                _id: 'userId',
                firstName: 'Harve',
                lastName: 'Lance',
                email: 'harve@example.com',
                image: '',
                organizationsBlockedBy: [],
                createdAt: '2024-02-14',
              },
              {
                _id: 'userId2',
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@example.com',
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
      query: CREATE_VOLUNTEER_GROUP,
      variables: {
        data: {
          eventId: 'eventId',
          leaderId: 'userId',
          name: 'Group 1',
          description: 'desc',
          volunteerUserIds: ['userId', 'userId2'],
          volunteersRequired: 10,
        },
      },
    },
    result: {
      data: {
        createEventVolunteerGroup: {
          _id: 'groupId',
        },
      },
    },
  },
  {
    request: {
      query: DELETE_VOLUNTEER_GROUP,
      variables: {
        id: 'groupId',
      },
    },
    result: {
      data: {
        removeEventVolunteerGroup: {
          _id: 'groupId',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_VOLUNTEER_GROUP,
      variables: {
        id: 'groupId',
        data: {
          eventId: 'eventId',
          name: 'Group 2',
          description: 'desc new',
          volunteersRequired: 10,
        },
      },
    },
    result: {
      data: {
        updateEventVolunteerGroup: {
          _id: 'groupId',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_VOLUNTEER_GROUP,
      variables: {
        id: 'groupId',
        data: {
          eventId: 'eventId',
        },
      },
    },
    result: {
      data: {
        updateEventVolunteerGroup: {
          _id: 'groupId',
        },
      },
    },
  },
];

export const MOCKS_EMPTY = [
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          eventId: 'eventId',
          leaderName: null,
          name_contains: '',
        },
        orderBy: null,
      },
    },
    result: {
      data: {
        getEventVolunteerGroups: [],
      },
    },
  },
];

export const MOCKS_ERROR = [
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          eventId: 'eventId',
          leaderName: null,
          name_contains: '',
        },
        orderBy: null,
      },
    },
    error: new Error('An error occurred'),
  },
  {
    request: {
      query: DELETE_VOLUNTEER_GROUP,
      variables: {
        id: 'groupId',
      },
    },
    error: new Error('An error occurred'),
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: {
        id: 'orgId',
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'orgId',
            members: [
              {
                _id: 'userId',
                firstName: 'Harve',
                lastName: 'Lance',
                email: 'harve@example.com',
                image: '',
                organizationsBlockedBy: [],
                createdAt: '2024-02-14',
              },
              {
                _id: 'userId2',
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@example.com',
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
      query: CREATE_VOLUNTEER_GROUP,
      variables: {
        data: {
          eventId: 'eventId',
          leaderId: 'userId',
          name: 'Group 1',
          description: 'desc',
          volunteerUserIds: ['userId', 'userId2'],
          volunteersRequired: 10,
        },
      },
    },
    error: new Error('An error occurred'),
  },
  {
    request: {
      query: UPDATE_VOLUNTEER_GROUP,
      variables: {
        id: 'groupId',
        data: {
          eventId: 'eventId',
          name: 'Group 2',
          description: 'desc new',
          volunteersRequired: 10,
        },
      },
    },
    error: new Error('An error occurred'),
  },
];

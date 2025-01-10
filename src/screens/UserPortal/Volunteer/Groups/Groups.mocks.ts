import {
  UPDATE_VOLUNTEER_GROUP,
  UPDATE_VOLUNTEER_MEMBERSHIP,
} from 'GraphQl/Mutations/EventVolunteerMutation';
import {
  EVENT_VOLUNTEER_GROUP_LIST,
  USER_VOLUNTEER_MEMBERSHIP,
} from 'GraphQl/Queries/EventVolunteerQueries';

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
    _id: 'eventId1',
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
    _id: 'eventId2',
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
    _id: 'eventId3',
  },
};

const membership1 = {
  _id: 'membershipId1',
  status: 'requested',
  createdAt: '2024-10-29T10:18:05.851Z',
  event: {
    _id: 'eventId',
    title: 'Event 1',
    startDate: '2044-10-31',
  },
  volunteer: {
    _id: 'volunteerId1',
    user: {
      _id: 'userId1',
      firstName: 'John',
      lastName: 'Doe',
      image: 'img-url',
    },
  },
  group: {
    _id: 'groupId',
    name: 'Group 1',
  },
};

const membership2 = {
  _id: 'membershipId2',
  status: 'requested',
  createdAt: '2024-10-29T10:18:05.851Z',
  event: {
    _id: 'eventId',
    title: 'Event 1',
    startDate: '2044-10-31',
  },
  volunteer: {
    _id: 'volunteerId2',
    user: {
      _id: 'userId2',
      firstName: 'Teresa',
      lastName: 'Bradley',
      image: null,
    },
  },
  group: {
    _id: 'groupId',
    name: 'Group 2',
  },
};

export const MOCKS = [
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          userId: 'userId',
          orgId: 'orgId',
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
          userId: 'userId',
          orgId: 'orgId',
          leaderName: null,
          name_contains: '',
        },
        orderBy: 'volunteers_DESC',
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
          userId: 'userId',
          orgId: 'orgId',
          leaderName: null,
          name_contains: '',
        },
        orderBy: 'volunteers_ASC',
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
          userId: 'userId',
          orgId: 'orgId',
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
          userId: 'userId',
          orgId: 'orgId',
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
          userId: 'userId',
          orgId: 'orgId',
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
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          eventId: 'eventId',
          groupId: 'groupId',
          status: 'requested',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership1, membership2],
      },
    },
  },
  {
    request: {
      query: UPDATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        id: 'membershipId1',
        status: 'accepted',
      },
    },
    result: {
      data: {
        updateVolunteerMembership: {
          _id: 'membershipId1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        id: 'membershipId1',
        status: 'rejected',
      },
    },
    result: {
      data: {
        updateVolunteerMembership: {
          _id: 'membershipId1',
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

export const EMPTY_MOCKS = [
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          userId: 'userId',
          orgId: 'orgId',
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
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          eventId: 'eventId',
          group: 'groupId',
          status: 'requested',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [],
      },
    },
  },
];

export const ERROR_MOCKS = [
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          userId: 'userId',
          orgId: 'orgId',
          leaderName: null,
          name_contains: '',
        },
        orderBy: null,
      },
    },
    error: new Error('Mock Graphql EVENT_VOLUNTEER_GROUP_LIST Error'),
  },
];

export const UPDATE_ERROR_MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          eventId: 'eventId',
          groupId: 'groupId',
          status: 'requested',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership1, membership2],
      },
    },
  },
  {
    request: {
      query: UPDATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        id: 'membershipId1',
        status: 'accepted',
      },
    },
    error: new Error('Mock Graphql UPDATE_VOLUNTEER_MEMBERSHIP Error'),
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
    error: new Error('Mock Graphql UPDATE_VOLUNTEER_GROUP Error'),
  },
];

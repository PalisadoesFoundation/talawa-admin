import {
  UPDATE_VOLUNTEER_GROUP,
  UPDATE_VOLUNTEER_MEMBERSHIP,
} from 'GraphQl/Mutations/EventVolunteerMutation';
import {
  EVENT_VOLUNTEER_GROUP_LIST,
  USER_VOLUNTEER_MEMBERSHIP,
} from 'GraphQl/Queries/EventVolunteerQueries';

const group1 = {
  id: 'groupId1',
  name: 'Group 1',
  description: 'Volunteer Group Description',
  volunteersRequired: null,
  createdAt: '2024-10-25T16:16:32.978Z',
  creator: {
    id: 'creatorId1',
    name: 'Wilt Shepherd',
    avatarURL: null,
  },
  leader: {
    id: 'userId',
    name: 'Teresa Bradley',
    avatarURL: 'img-url',
  },
  volunteers: [
    {
      id: 'volunteerId1',
      hasAccepted: false,
      user: {
        id: 'userId',
        name: 'Teresa Bradley',
        avatarURL: null,
      },
    },
  ],
  event: {
    id: 'eventId1',
  },
};

const group2 = {
  id: 'groupId2',
  name: 'Group 2',
  description: 'Volunteer Group Description',
  volunteersRequired: null,
  createdAt: '2024-10-27T15:25:13.044Z',
  creator: {
    id: 'creatorId2',
    name: 'Wilt Shepherd',
    avatarURL: null,
  },
  leader: {
    id: 'userId',
    name: 'Teresa Bradley',
    avatarURL: null,
  },
  volunteers: [
    {
      id: 'volunteerId2',
      hasAccepted: false,
      user: {
        id: 'userId',
        name: 'Teresa Bradley',
        avatarURL: null,
      },
    },
  ],
  event: {
    id: 'eventId2',
  },
};

const group3 = {
  id: 'groupId3',
  name: 'Group 3',
  description: 'Volunteer Group Description',
  volunteersRequired: null,
  createdAt: '2024-10-27T15:34:15.889Z',
  creator: {
    id: 'creatorId3',
    name: 'Wilt Shepherd',
    avatarURL: null,
  },
  leader: {
    id: 'userId1',
    name: 'Bruce Garza',
    avatarURL: null,
  },
  volunteers: [
    {
      id: 'volunteerId3',
      hasAccepted: false,
      user: {
        id: 'userId',
        name: 'Teresa Bradley',
        avatarURL: null,
      },
    },
  ],
  event: {
    id: 'eventId3',
  },
};

const membership1 = {
  id: 'membershipId1',
  status: 'requested',
  createdAt: '2024-10-29T10:18:05.851Z',
  updatedAt: '2024-10-29T10:18:05.851Z',
  event: {
    id: 'eventId',
    name: 'Event 1',
    startAt: '2044-10-31',
    endAt: '2044-10-31',
    recurrenceRule: null,
  },
  volunteer: {
    id: 'volunteerId1',
    hasAccepted: false,
    hoursVolunteered: 0,
    user: {
      id: 'userId1',
      name: 'John Doe',
      emailAddress: 'john@example.com',
      avatarURL: 'img-url',
    },
  },
  group: {
    id: 'groupId',
    name: 'Group 1',
    description: 'Group 1 description',
  },
  createdBy: {
    id: 'adminId',
    name: 'Admin User',
  },
  updatedBy: {
    id: 'adminId',
    name: 'Admin User',
  },
};

const membership2 = {
  id: 'membershipId2',
  status: 'requested',
  createdAt: '2024-10-29T10:18:05.851Z',
  updatedAt: '2024-10-29T10:18:05.851Z',
  event: {
    id: 'eventId',
    name: 'Event 1',
    startAt: '2044-10-31',
    endAt: '2044-10-31',
    recurrenceRule: null,
  },
  volunteer: {
    id: 'volunteerId2',
    hasAccepted: false,
    hoursVolunteered: 0,
    user: {
      id: 'userId2',
      name: 'Teresa Bradley',
      emailAddress: 'teresa@example.com',
      avatarURL: null,
    },
  },
  group: {
    id: 'groupId',
    name: 'Group 2',
    description: 'Group 2 description',
  },
  createdBy: {
    id: 'adminId',
    name: 'Admin User',
  },
  updatedBy: {
    id: 'adminId',
    name: 'Admin User',
  },
};

export const MOCKS = [
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          eventId: undefined,
          userId: 'userId',
          orgId: 'orgId',
          leaderName: undefined,
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
          eventId: undefined,
          userId: 'userId',
          orgId: 'orgId',
          leaderName: 'Bruce',
          name_contains: undefined,
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
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          eventId: undefined,
          userId: 'userId',
          orgId: 'orgId',
          leaderName: undefined,
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
          eventId: undefined,
          userId: 'userId',
          orgId: 'orgId',
          leaderName: undefined,
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
          eventId: undefined,
          userId: 'userId',
          orgId: 'orgId',
          leaderName: undefined,
          name_contains: '1',
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
          id: 'membershipId1',
          status: 'accepted',
          updatedAt: '2024-10-29T10:20:05.851Z',
          volunteer: {
            id: 'volunteerId1',
            hasAccepted: false,
            user: {
              id: 'userId1',
              name: 'John Doe',
            },
          },
          event: {
            id: 'eventId',
            name: 'Event 1',
          },
          updatedBy: {
            id: 'adminId',
            name: 'Admin User',
          },
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
          id: 'membershipId1',
          status: 'rejected',
          updatedAt: '2024-10-29T10:20:05.851Z',
          volunteer: {
            id: 'volunteerId1',
            hasAccepted: false,
            user: {
              id: 'userId1',
              name: 'John Doe',
            },
          },
          event: {
            id: 'eventId',
            name: 'Event 1',
          },
          updatedBy: {
            id: 'adminId',
            name: 'Admin User',
          },
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
          id: 'groupId',
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
          id: 'groupId',
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
          eventId: undefined,
          userId: 'userId',
          orgId: 'orgId',
          leaderName: undefined,
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
          groupId: 'groupId',
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

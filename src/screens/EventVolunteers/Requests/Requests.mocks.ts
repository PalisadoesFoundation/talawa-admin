import { UPDATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import { USER_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Queries/EventVolunteerQueries';

const membership1 = {
  id: 'membershipId1',
  status: 'requested',
  createdAt: '2030-10-29T10:18:05.851Z',
  updatedAt: '2030-10-29T10:18:05.851Z',
  event: {
    id: 'eventId',
    name: 'Event 1',
    startAt: '2030-10-31',
    endAt: '2030-10-31',
    recurrenceRule: null,
  },
  volunteer: {
    id: 'volunteerId1',
    hasAccepted: false,
    hoursVolunteered: null,
    user: {
      id: 'userId1',
      name: 'John Doe',
      emailAddress: 'john@example.com',
      avatarURL: 'img-url',
      createdAt: '2030-01-01T00:00:00Z',
    },
  },
  group: null,
  createdBy: {
    id: 'creatorId1',
    name: 'Creator',
  },
  updatedBy: {
    id: 'updaterId1',
    name: 'Updater',
  },
};

const membership2 = {
  id: 'membershipId2',
  status: 'requested',
  createdAt: '2030-10-30T10:18:05.851Z',
  updatedAt: '2030-10-30T10:18:05.851Z',
  event: {
    id: 'eventId',
    name: 'Event 2',
    startAt: '2030-11-31',
    endAt: '2030-11-31',
    recurrenceRule: null,
  },
  volunteer: {
    id: 'volunteerId2',
    hasAccepted: false,
    hoursVolunteered: null,
    user: {
      id: 'userId2',
      name: 'Teresa Bradley',
      emailAddress: 'teresa@example.com',
      avatarURL: null,
      createdAt: '2030-01-01T00:00:00Z',
    },
  },
  group: null,
  createdBy: {
    id: 'creatorId2',
    name: 'Creator',
  },
  updatedBy: {
    id: 'updaterId2',
    name: 'Updater',
  },
};

const membershipWithGroup = {
  id: 'membershipId3',
  status: 'requested',
  createdAt: '2030-10-28T10:18:05.851Z',
  updatedAt: '2030-10-28T10:18:05.851Z',
  event: {
    id: 'eventId',
    name: 'Event 3',
    startAt: '2030-12-31',
    endAt: '2030-12-31',
    recurrenceRule: null,
  },
  volunteer: {
    id: 'volunteerId3',
    hasAccepted: false,
    hoursVolunteered: null,
    user: {
      id: 'userId3',
      name: 'Group Volunteer',
      emailAddress: 'group@example.com',
      avatarURL: null,
      createdAt: '2030-01-01T00:00:00Z',
    },
  },
  group: {
    id: 'groupId1',
    name: 'Volunteer Group 1',
  },
  createdBy: {
    id: 'creatorId3',
    name: 'Creator',
  },
  updatedBy: {
    id: 'updaterId3',
    name: 'Updater',
  },
};

export const MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          eventId: 'eventId',
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
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          eventId: 'eventId',
          status: 'requested',
        },
        orderBy: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership2, membership1],
      },
    },
  },
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          eventId: 'eventId',
          status: 'requested',
        },
        orderBy: 'createdAt_ASC',
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
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          eventId: 'eventId',
          status: 'requested',
          userName: 'T',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership2],
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
        },
      },
    },
  },
];

export const MOCKS_WITH_FILTER_DATA = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          eventId: 'eventId',
          status: 'requested',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership1, membership2, membershipWithGroup],
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
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        id: 'membershipId2',
        status: 'accepted',
      },
    },
    result: {
      data: {
        updateVolunteerMembership: {
          id: 'membershipId2',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        id: 'membershipId3',
        status: 'accepted',
      },
    },
    result: {
      data: {
        updateVolunteerMembership: {
          id: 'membershipId3',
        },
      },
    },
  },
];

export const EMPTY_MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          eventId: 'eventId',
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
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          eventId: 'eventId',
          status: 'requested',
          userName: undefined,
        },
        orderBy: undefined,
      },
    },
    error: new Error('Mock Graphql USER_VOLUNTEER_MEMBERSHIP Error'),
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
];

export const UPDATE_ERROR_MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          eventId: 'eventId',
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
];

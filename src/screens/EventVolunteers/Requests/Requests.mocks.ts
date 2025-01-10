import { UPDATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import { USER_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Queries/EventVolunteerQueries';

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
  group: null,
};

const membership2 = {
  _id: 'membershipId2',
  status: 'requested',
  createdAt: '2024-10-30T10:18:05.851Z',
  event: {
    _id: 'eventId',
    title: 'Event 2',
    startDate: '2044-11-31',
  },
  volunteer: {
    _id: 'volunteerId1',
    user: {
      _id: 'userId1',
      firstName: 'Teresa',
      lastName: 'Bradley',
      image: null,
    },
  },
  group: null,
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

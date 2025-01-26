import { UPDATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import { USER_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Queries/EventVolunteerQueries';

const membership1 = {
  _id: 'membershipId1',
  status: 'invited',
  createdAt: '2024-10-29T10:18:05.851Z',
  event: {
    _id: 'eventId',
    title: 'Event 1',
    startDate: '2044-10-31',
  },
  volunteer: {
    _id: 'volunteerId1',
    user: {
      _id: 'userId',
      firstName: 'John',
      lastName: 'Doe',
      image: 'img-url',
    },
  },
  group: null,
};

const membership2 = {
  _id: 'membershipId2',
  status: 'invited',
  createdAt: '2024-10-30T10:18:05.851Z',
  event: {
    _id: 'eventId',
    title: 'Event 2',
    startDate: '2044-11-31',
  },
  volunteer: {
    _id: 'volunteerId1',
    user: {
      _id: 'userId',
      firstName: 'John',
      lastName: 'Doe',
      image: null,
    },
  },
  group: {
    _id: 'groupId1',
    name: 'Group 1',
  },
};

export const MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
          filter: null,
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
          userId: 'userId',
          status: 'invited',
          filter: null,
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
          userId: 'userId',
          status: 'invited',
          filter: null,
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
          userId: 'userId',
          status: 'invited',
          filter: 'group',
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
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
          filter: 'individual',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership1],
      },
    },
  },
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
          filter: null,
          eventTitle: '1',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership1],
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
          userId: 'userId',
          status: 'invited',
          filter: null,
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
          userId: 'userId',
          status: 'invited',
          filter: null,
        },
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
          userId: 'userId',
          status: 'invited',
          filter: null,
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

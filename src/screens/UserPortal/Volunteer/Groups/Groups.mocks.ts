import {
  UPDATE_VOLUNTEER_GROUP,
  UPDATE_VOLUNTEER_MEMBERSHIP,
} from 'GraphQl/Mutations/EventVolunteerMutation';
import {
  EVENT_VOLUNTEER_GROUP_LIST,
  USER_VOLUNTEER_MEMBERSHIP,
} from 'GraphQl/Queries/EventVolunteerQueries';

const group1 = {
  __typename: 'EventVolunteerGroup',
  id: 'groupId1',
  name: 'Group 1',
  description: 'Volunteer Group Description',
  volunteersRequired: null,
  createdAt: '2024-10-25T16:16:32.978Z',
  leader: {
    __typename: 'User',
    id: 'userId',
    name: 'Teresa Bradley',
    avatarURL: null,
  },
  volunteers: [],
  event: { __typename: 'Event', id: 'eventId1' },
};

const group2 = {
  __typename: 'EventVolunteerGroup',
  id: 'groupId2',
  name: 'Group 2',
  description: 'Volunteer Group Description',
  volunteersRequired: null,
  createdAt: '2024-10-27T15:25:13.044Z',
  leader: {
    __typename: 'User',
    id: 'userId',
    name: 'Teresa Bradley',
    avatarURL: null,
  },
  volunteers: [],
  event: { __typename: 'Event', id: 'eventId2' },
};

const membership1 = {
  __typename: 'VolunteerMembership',
  id: 'membershipId1',
  status: 'requested',
};

export const MOCKS = [
  {
    request: {
      query: EVENT_VOLUNTEER_GROUP_LIST,
      variables: {
        where: {
          orgId: 'orgId',
          userId: 'userId',
          eventId: undefined,
          leaderName: undefined,
          name_contains: '',
        },
        orderBy: null,
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
          orgId: 'orgId',
          userId: 'userId',
          eventId: undefined,
          leaderName: undefined,
          name_contains: 'Group 1',
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
          __typename: 'VolunteerMembership',
          id: 'membershipId1',
          status: 'accepted',
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
          __typename: 'EventVolunteerGroup',
          id: 'groupId',
        },
      },
    },
  },
];

export const UPDATE_ERROR_MOCKS = [
  {
    request: {
      query: UPDATE_VOLUNTEER_GROUP,
      variables: {
        id: 'groupId1',
        data: {
          name: 'Updated Group',
          description: 'Updated Description',
        },
      },
    },
    error: new Error('Mock Graphql UPDATE_VOLUNTEER_GROUP Error'),
  },
];

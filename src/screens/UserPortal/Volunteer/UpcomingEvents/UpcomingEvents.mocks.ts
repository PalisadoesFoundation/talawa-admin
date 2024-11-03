import { CREATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import { USER_EVENTS_VOLUNTEER } from 'GraphQl/Queries/PlugInQueries';

const event1 = {
  _id: 'eventId1',
  title: 'Event 1',
  startDate: '2044-10-30',
  endDate: '2044-10-30',
  location: 'Mumbai',
  startTime: null,
  endTime: null,
  allDay: true,
  recurring: true,
  volunteerGroups: [
    {
      _id: 'groupId1',
      name: 'Group 1',
      volunteersRequired: null,
      description: 'desc',
      volunteers: [
        {
          _id: 'volunteerId1',
        },
        {
          _id: 'volunteerId2',
        },
      ],
    },
  ],
  volunteers: [
    {
      _id: 'volunteerId1',
      user: {
        _id: 'userId1',
      },
    },
    {
      _id: 'volunteerId2',
      user: {
        _id: 'userId2',
      },
    },
  ],
};

const event2 = {
  _id: 'eventId2',
  title: 'Event 2',
  startDate: '2044-10-31',
  endDate: '2044-10-31',
  location: 'Pune',
  startTime: null,
  endTime: null,
  allDay: true,
  recurring: false,
  volunteerGroups: [
    {
      _id: 'groupId2',
      name: 'Group 2',
      volunteersRequired: null,
      description: 'desc',
      volunteers: [
        {
          _id: 'volunteerId3',
        },
      ],
    },
  ],
  volunteers: [
    {
      _id: 'volunteerId3',
      user: {
        _id: 'userId3',
      },
    },
  ],
};

const event3 = {
  _id: 'eventId3',
  title: 'Event 3',
  startDate: '2044-10-31',
  endDate: '2022-10-31',
  location: 'Delhi',
  startTime: null,
  endTime: null,
  description: 'desc',
  allDay: true,
  recurring: true,
  volunteerGroups: [
    {
      _id: 'groupId3',
      name: 'Group 3',
      volunteersRequired: null,
      description: 'desc',
      volunteers: [
        {
          _id: 'userId',
        },
      ],
    },
  ],
  volunteers: [
    {
      _id: 'volunteerId',
      user: {
        _id: 'userId',
      },
    },
  ],
};

export const MOCKS = [
  {
    request: {
      query: USER_EVENTS_VOLUNTEER,
      variables: {
        organization_id: 'orgId',
        title_contains: '',
        location_contains: '',
        upcomingOnly: true,
        first: null,
        skip: null,
      },
    },
    result: {
      data: {
        eventsByOrganizationConnection: [event1, event2, event3],
      },
    },
  },
  {
    request: {
      query: USER_EVENTS_VOLUNTEER,
      variables: {
        organization_id: 'orgId',
        title_contains: '1',
        location_contains: '',
        upcomingOnly: true,
        first: null,
        skip: null,
      },
    },
    result: {
      data: {
        eventsByOrganizationConnection: [event1],
      },
    },
  },
  {
    request: {
      query: USER_EVENTS_VOLUNTEER,
      variables: {
        organization_id: 'orgId',
        title_contains: '',
        location_contains: 'M',
        upcomingOnly: true,
        first: null,
        skip: null,
      },
    },
    result: {
      data: {
        eventsByOrganizationConnection: [event1],
      },
    },
  },
  {
    request: {
      query: CREATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        data: {
          event: 'eventId1',
          group: null,
          status: 'requested',
          userId: 'userId',
        },
      },
    },
    result: {
      data: {
        createVolunteerMembership: {
          _id: 'membershipId1',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        data: {
          event: 'eventId1',
          group: 'groupId1',
          status: 'requested',
          userId: 'userId',
        },
      },
    },
    result: {
      data: {
        createVolunteerMembership: {
          _id: 'membershipId1',
        },
      },
    },
  },
];

export const EMPTY_MOCKS = [
  {
    request: {
      query: USER_EVENTS_VOLUNTEER,
      variables: {
        organization_id: 'orgId',
        title_contains: '',
        location_contains: '',
        upcomingOnly: true,
        first: null,
        skip: null,
      },
    },
    result: {
      data: {
        eventsByOrganizationConnection: [],
      },
    },
  },
];

export const ERROR_MOCKS = [
  {
    request: {
      query: USER_EVENTS_VOLUNTEER,
      variables: {
        organization_id: 'orgId',
        title_contains: '',
        location_contains: '',
        upcomingOnly: true,
        first: null,
        skip: null,
      },
    },
    error: new Error('Mock Graphql USER_EVENTS_VOLUNTEER Error'),
  },
];

export const CREATE_ERROR_MOCKS = [
  {
    request: {
      query: USER_EVENTS_VOLUNTEER,
      variables: {
        organization_id: 'orgId',
        title_contains: '',
        location_contains: '',
        upcomingOnly: true,
        first: null,
        skip: null,
      },
    },
    result: {
      data: {
        eventsByOrganizationConnection: [event1, event2],
      },
    },
  },
  {
    request: {
      query: CREATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        data: {
          event: 'eventId1',
          group: null,
          status: 'requested',
          userId: 'userId',
        },
      },
    },
    error: new Error('Mock Graphql CREATE_VOLUNTEER_MEMBERSHIP Error'),
  },
];

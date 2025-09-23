import { CREATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import {
  USER_EVENTS_VOLUNTEER,
  USER_VOLUNTEER_MEMBERSHIP,
} from 'GraphQl/Queries/EventVolunteerQueries';

// Helper function to create common volunteer membership response
const createMembershipResponse = (
  id: string,
  eventId: string,
  groupId?: string,
) => ({
  id: `membershipId${id}`,
  status: 'requested',
  createdAt: '2025-09-20T15:20:00.000Z',
  volunteer: {
    id: `volunteerId${id}`,
    hasAccepted: false,
    user: { id: 'userId', name: 'User Name' },
  },
  event: { id: eventId, name: `Event ${id}` },
  createdBy: { id: 'createrId', name: 'Creator Name' },
  ...(groupId && {
    group: { id: groupId, name: `Group ${id}`, description: 'desc' },
  }),
});

// Base events
const event1 = {
  _id: 'eventId1',
  title: 'Event 1',
  name: 'Event 1',
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
      volunteers: [{ _id: 'volunteerId1' }, { _id: 'volunteerId2' }],
    },
  ],
  volunteers: [
    { _id: 'volunteerId1', user: { _id: 'userId1' } },
    { _id: 'volunteerId2', user: { _id: 'userId2' } },
  ],
};

const event2 = {
  _id: 'eventId2',
  title: 'Event 2',
  name: 'Event 2',
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
      volunteers: [{ _id: 'volunteerId3' }],
    },
  ],
  volunteers: [{ _id: 'volunteerId3', user: { _id: 'userId3' } }],
};

const event3 = {
  _id: 'eventId3',
  title: 'Event 3',
  name: 'Event 3',
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
      volunteers: [{ _id: 'userId' }],
    },
  ],
  volunteers: [{ _id: 'volunteerId', user: { _id: 'userId' } }],
};

const recurringInstanceEvent = {
  id: 'eventInstanceId1',
  name: 'Recurring Event Instance 1',
  startAt: '2044-11-01T10:00:00.000Z',
  endAt: '2044-11-01T12:00:00.000Z',
  location: 'Mumbai',
  description: 'A recurring event instance',
  isRecurringEventTemplate: false,
  baseEvent: { id: 'baseEventId1', isRecurringEventTemplate: true },
  volunteerGroups: [
    {
      id: 'recurringGroupId1',
      name: 'Recurring Group 1',
      description: 'desc',
      volunteersRequired: 5,
      volunteers: [],
    },
  ],
  volunteers: [],
  recurrenceRule: { frequency: 'WEEKLY' },
};

const baseRecurringEvent = {
  id: 'baseEventId1',
  name: 'Base Recurring Event',
  startAt: '2044-11-01T10:00:00.000Z',
  endAt: '2044-11-01T12:00:00.000Z',
  location: 'Mumbai',
  description: 'Base template for recurring event',
  isRecurringEventTemplate: true,
  baseEvent: null,
  volunteerGroups: [
    {
      id: 'recurringGroupId1',
      name: 'Recurring Group 1',
      description: 'desc',
      volunteersRequired: 5,
      volunteers: [],
    },
  ],
  volunteers: [],
  recurrenceRule: { frequency: 'WEEKLY' },
};

// Common queries
const eventsQuery = {
  request: {
    query: USER_EVENTS_VOLUNTEER,
    variables: { organizationId: 'orgId', upcomingOnly: true, first: 30 },
  },
};

const membershipQuery = {
  request: {
    query: USER_VOLUNTEER_MEMBERSHIP,
    variables: { where: { userId: 'userId' } },
  },
};

export const MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          events: {
            edges: [{ node: event1 }, { node: event2 }, { node: event3 }],
          },
        },
      },
    },
  },
  {
    ...membershipQuery,
    result: { data: { getVolunteerMembership: [] } },
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
        createVolunteerMembership: createMembershipResponse('1', 'eventId1'),
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
        createVolunteerMembership: createMembershipResponse(
          '2',
          'eventId1',
          'groupId1',
        ),
      },
    },
  },
];

export const RECURRING_MODAL_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          events: {
            edges: [
              { node: recurringInstanceEvent },
              { node: baseRecurringEvent },
            ],
          },
        },
      },
    },
  },
  {
    ...membershipQuery,
    result: { data: { getVolunteerMembership: [] } },
  },
  // Series volunteering
  {
    request: {
      query: CREATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        data: {
          event: 'baseEventId1',
          group: null,
          status: 'requested',
          userId: 'userId',
          scope: 'ENTIRE_SERIES',
        },
      },
    },
    result: {
      data: {
        createVolunteerMembership: createMembershipResponse(
          '3',
          'baseEventId1',
        ),
      },
    },
  },
  // Instance volunteering
  {
    request: {
      query: CREATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        data: {
          event: 'baseEventId1',
          group: null,
          status: 'requested',
          userId: 'userId',
          scope: 'THIS_INSTANCE_ONLY',
          recurringEventInstanceId: 'eventInstanceId1',
        },
      },
    },
    result: {
      data: {
        createVolunteerMembership: createMembershipResponse(
          '4',
          'baseEventId1',
        ),
      },
    },
  },
  // Group series volunteering
  {
    request: {
      query: CREATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        data: {
          event: 'baseEventId1',
          group: 'recurringGroupId1',
          status: 'requested',
          userId: 'userId',
          scope: 'ENTIRE_SERIES',
        },
      },
    },
    result: {
      data: {
        createVolunteerMembership: createMembershipResponse(
          '5',
          'baseEventId1',
          'recurringGroupId1',
        ),
      },
    },
  },
  // Group instance volunteering
  {
    request: {
      query: CREATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        data: {
          event: 'baseEventId1',
          group: 'recurringGroupId1',
          status: 'requested',
          userId: 'userId',
          scope: 'THIS_INSTANCE_ONLY',
          recurringEventInstanceId: 'eventInstanceId1',
        },
      },
    },
    result: {
      data: {
        createVolunteerMembership: createMembershipResponse(
          '6',
          'baseEventId1',
          'recurringGroupId1',
        ),
      },
    },
  },
];

export const MEMBERSHIP_STATUS_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          events: {
            edges: [{ node: event1 }, { node: event2 }],
          },
        },
      },
    },
  },
  {
    ...membershipQuery,
    result: {
      data: {
        getVolunteerMembership: [
          {
            id: 'membership1',
            status: 'accepted',
            event: { id: 'eventId1' },
            group: null,
          },
          {
            id: 'membership2',
            status: 'rejected',
            event: { id: 'eventId2' },
            group: { id: 'groupId2' },
          },
          {
            id: 'membership3',
            status: 'requested',
            event: { id: 'eventId1' },
            group: { id: 'groupId1' },
          },
        ],
      },
    },
  },
];

export const EMPTY_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: { organization: { events: { edges: [] } } },
    },
  },
];

export const ERROR_MOCKS = [
  {
    ...eventsQuery,
    error: new Error('Mock Graphql USER_EVENTS_VOLUNTEER Error'),
  },
];

export const CREATE_ERROR_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          events: {
            edges: [{ node: event1 }, { node: event2 }, { node: event3 }],
          },
        },
      },
    },
  },
  {
    ...membershipQuery,
    result: { data: { getVolunteerMembership: [] } },
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

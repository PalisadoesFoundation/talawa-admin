import { CREATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import {
  USER_EVENTS_VOLUNTEER,
  USER_VOLUNTEER_MEMBERSHIP,
} from 'GraphQl/Queries/EventVolunteerQueries';

// Helper functions
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

const createMembershipWithStatus = (
  id: string,
  eventId: string,
  status: string,
  groupId?: string,
) => ({
  id: `membership${id}`,
  status,
  createdAt: '2024-10-30T10:00:00.000Z',
  updatedAt: '2024-10-30T10:00:00.000Z',
  event: {
    id: eventId,
    name: eventId === 'eventId1' ? 'Test Event' : `Event ${eventId}`,
    startAt: '2044-10-30T10:00:00.000Z',
    endAt: '2044-10-30T12:00:00.000Z',
    recurrenceRule: null,
  },
  volunteer: {
    id: `volunteerId${id}`,
    createdBy: { id: 'userId' },
    updatedBy: { id: 'userId' },
  },
  ...(groupId && {
    group: {
      id: groupId,
      name: 'Test Group',
      description: 'Test Description',
    },
  }),
});

// Base event template
const baseEventTemplate = {
  startTime: null,
  endTime: null,
  allDay: true,
  description: 'desc',
  volunteers: [{ _id: 'volunteerId1', user: { _id: 'userId1' } }],
};

// Base events
const event1 = {
  ...baseEventTemplate,
  _id: 'eventId1',
  title: 'Event 1',
  name: 'Event 1',
  startDate: '2044-10-30',
  endDate: '2044-10-30',
  location: 'Mumbai',
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
  ...baseEventTemplate,
  _id: 'eventId2',
  title: 'Event 2',
  name: 'Event 2',
  startDate: '2044-10-31',
  endDate: '2044-10-31',
  location: 'Pune',
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
  ...baseEventTemplate,
  _id: 'eventId3',
  title: 'Event 3',
  name: 'Event 3',
  startDate: '2044-10-31',
  endDate: '2022-10-31',
  location: 'Delhi',
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

// Recurring event templates
export const baseRecurringEvent = {
  id: 'baseEventId1',
  name: 'Base Template Event',
  startAt: '2044-10-30T10:00:00.000Z',
  endAt: '2044-10-30T12:00:00.000Z',
  location: 'Test Location',
  description: 'Test Description',
  isRecurringEventTemplate: true,
  baseEvent: null,
  recurrenceRule: { frequency: 'WEEKLY' },
  volunteerGroups: [],
  volunteers: [],
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

// Common query objects
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

// Additional exports for tests
export const baseEvent = {
  startAt: '2044-10-30T10:00:00.000Z',
  endAt: '2044-10-30T12:00:00.000Z',
  location: 'Test Location',
  description: 'Test Description',
  isRecurringEventTemplate: false,
  baseEvent: null,
  recurrenceRule: null,
  volunteerGroups: [
    {
      id: 'groupId1',
      name: 'Test Group',
      description: 'Test Description',
      volunteersRequired: 5,
      volunteers: [],
    },
  ],
  volunteers: [],
};

// Base mock definitions
const createVolunteerMutation = (
  eventId: string,
  groupId?: string,
  scope?: string,
  instanceId?: string,
) => ({
  request: {
    query: CREATE_VOLUNTEER_MEMBERSHIP,
    variables: {
      data: {
        event: eventId,
        group: groupId || null,
        status: 'requested',
        userId: 'userId',
        ...(scope && { scope }),
        ...(instanceId && { recurringEventInstanceId: instanceId }),
      },
    },
  },
  result: {
    data: {
      createVolunteerMembership: createMembershipResponse(
        '1',
        eventId,
        groupId,
      ),
    },
  },
});

const basicEventsResult = {
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
};

const emptyMembershipResult = {
  ...membershipQuery,
  result: { data: { getVolunteerMembership: [] } },
};

// Consolidated exports
export const MOCKS = [
  basicEventsResult,
  emptyMembershipResult,
  createVolunteerMutation('eventId1'),
  createVolunteerMutation('eventId1', 'groupId1'),
];

// Create recurring events result
const createRecurringEventsResult = (additionalNodes: any[] = []) => ({
  ...eventsQuery,
  result: {
    data: {
      organization: {
        events: {
          edges: [
            { node: recurringInstanceEvent },
            { node: baseRecurringEvent },
            ...additionalNodes,
          ],
        },
      },
    },
  },
});

// Create membership result with various statuses
const createMembershipResult = (memberships: any[]) => ({
  ...membershipQuery,
  result: { data: { getVolunteerMembership: memberships } },
});

export const RECURRING_MODAL_MOCKS = [
  createRecurringEventsResult(),
  emptyMembershipResult,
  createVolunteerMutation('baseEventId1', undefined, 'ENTIRE_SERIES'),
  createVolunteerMutation(
    'baseEventId1',
    undefined,
    'THIS_INSTANCE_ONLY',
    'eventInstanceId1',
  ),
  createVolunteerMutation('baseEventId1', 'recurringGroupId1', 'ENTIRE_SERIES'),
  createVolunteerMutation(
    'baseEventId1',
    'recurringGroupId1',
    'THIS_INSTANCE_ONLY',
    'eventInstanceId1',
  ),
];

export const MEMBERSHIP_LOOKUP_MOCKS = [
  createRecurringEventsResult([
    {
      node: {
        id: 'eventInstanceId2',
        name: 'Recurring Event Instance 2',
        startAt: '2044-11-08T10:00:00.000Z',
        endAt: '2044-11-08T12:00:00.000Z',
        location: 'Mumbai',
        description: 'Another instance of recurring event',
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
      },
    },
  ]),
  createMembershipResult([
    {
      id: 'baseMembership1',
      status: 'accepted',
      event: { id: 'baseEventId1' },
      group: null,
    },
    {
      id: 'baseMembership2',
      status: 'requested',
      event: { id: 'baseEventId1' },
      group: { id: 'recurringGroupId1' },
    },
  ]),
];

export const MEMBERSHIP_STATUS_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          events: { edges: [{ node: event1 }, { node: event2 }] },
        },
      },
    },
  },
  createMembershipResult([
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
  ]),
];

// Create simple event result
const createSingleEventResult = (eventOverrides: any) => ({
  ...eventsQuery,
  result: {
    data: {
      organization: {
        events: {
          edges: [{ node: { ...event1, ...eventOverrides } }],
        },
      },
    },
  },
});

export const EMPTY_MOCKS = [
  {
    ...eventsQuery,
    result: { data: { organization: { events: { edges: [] } } } },
  },
];

export const ERROR_MOCKS = [
  {
    ...eventsQuery,
    error: new Error('Mock Graphql USER_EVENTS_VOLUNTEER Error'),
  },
];

export const CREATE_ERROR_MOCKS = [
  basicEventsResult,
  emptyMembershipResult,
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

export const REJECTED_STATUS_MOCKS = [
  createSingleEventResult({ id: 'eventId1' }),
  createMembershipResult([
    createMembershipWithStatus('1', 'eventId1', 'rejected'),
    createMembershipWithStatus('2', 'eventId1', 'rejected', 'groupId1'),
  ]),
];

export const DEFAULT_STATUS_MOCKS = [
  createSingleEventResult({
    id: 'eventId1',
    name: 'Test Event for Default Case',
  }),
  createMembershipResult([
    createMembershipWithStatus('1', 'eventId1', 'unknown_status'),
  ]),
];

export const PAST_EVENT_MOCKS = [
  createSingleEventResult({
    id: 'eventId1',
    name: 'Past Test Event',
    startAt: '2020-10-30T10:00:00.000Z',
    endAt: '2020-10-30T12:00:00.000Z',
  }),
  emptyMembershipResult,
];

export const DUPLICATE_MEMBERSHIP_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          events: {
            edges: [
              { node: baseRecurringEvent },
              {
                node: {
                  ...recurringInstanceEvent,
                  id: 'instanceEventId1',
                  name: 'Instance Event 1',
                  startAt: '2044-11-06T10:00:00.000Z',
                  endAt: '2044-11-06T12:00:00.000Z',
                },
              },
            ],
          },
        },
      },
    },
  },
  createMembershipResult([
    {
      ...createMembershipWithStatus('1', 'baseEventId1', 'accepted'),
      event: {
        ...createMembershipWithStatus('1', 'baseEventId1', 'accepted').event,
        name: 'Base Template Event',
        recurrenceRule: { frequency: 'WEEKLY' },
      },
    },
    {
      ...createMembershipWithStatus('2', 'instanceEventId1', 'requested'),
      createdAt: '2024-11-01T10:00:00.000Z',
      updatedAt: '2024-11-01T10:00:00.000Z',
      event: {
        ...createMembershipWithStatus('2', 'instanceEventId1', 'requested')
          .event,
        name: 'Instance Event 1',
        startAt: '2044-11-06T10:00:00.000Z',
        endAt: '2044-11-06T12:00:00.000Z',
      },
    },
  ]),
];

// Simple mutation response
const simpleMembershipResponse = (id: string) => ({
  result: { data: { createVolunteerMembership: { id, status: 'requested' } } },
});

export const RECURRING_WITHOUT_BASE_MOCKS = [
  createSingleEventResult({
    ...baseRecurringEvent,
    id: 'templateEventId1',
    name: 'Template Event',
  }),
  emptyMembershipResult,
  {
    request: {
      query: CREATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        data: {
          event: 'templateEventId1',
          group: null,
          status: 'requested',
          userId: 'userId',
          scope: 'ENTIRE_SERIES',
          recurringEventInstanceId: undefined,
        },
      },
    },
    ...simpleMembershipResponse('membership1'),
  },
  {
    request: {
      query: CREATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        data: {
          event: 'templateEventId1',
          group: null,
          status: 'requested',
          userId: 'userId',
          scope: 'THIS_INSTANCE_ONLY',
          recurringEventInstanceId: 'templateEventId1',
        },
      },
    },
    ...simpleMembershipResponse('membership2'),
  },
];

// Create event with base template
const createEventWithTemplate = (overrides: any) => ({
  id: 'eventId1',
  startAt: '2044-10-30T10:00:00.000Z',
  endAt: '2044-10-30T12:00:00.000Z',
  location: 'Test Location',
  description: 'Test Description',
  isRecurringEventTemplate: false,
  baseEvent: null,
  recurrenceRule: null,
  volunteers: null,
  ...overrides,
});

export const NULL_FIELDS_MOCKS = [
  createSingleEventResult(
    createEventWithTemplate({
      name: 'Event with Null Fields',
      volunteerGroups: null,
    }),
  ),
  emptyMembershipResult,
];

export const GROUP_VOLUNTEERS_NULL_MOCKS = [
  createSingleEventResult(
    createEventWithTemplate({
      id: 'eventGroupVolsNull',
      name: 'Event with Group Volunteers Null',
      volunteerGroups: [
        {
          id: 'groupIdNull',
          name: 'Group NullVols',
          description: 'desc',
          volunteersRequired: null,
          volunteers: null,
        },
      ],
    }),
  ),
  emptyMembershipResult,
];

export const GROUP_JOINED_MOCKS = [
  createSingleEventResult(
    createEventWithTemplate({
      name: 'Event With Group Joined',
      volunteerGroups: [
        {
          id: 'groupId1',
          name: 'Test Group',
          description: 'Test Description',
          volunteersRequired: 5,
          volunteers: [],
        },
      ],
      volunteers: [],
    }),
  ),
  createMembershipResult([
    {
      id: 'membership1',
      status: 'accepted',
      event: { id: 'eventId1', name: 'Event With Group Joined' },
      group: {
        id: 'groupId1',
        name: 'Test Group',
        description: 'Test Description',
      },
    },
  ]),
];

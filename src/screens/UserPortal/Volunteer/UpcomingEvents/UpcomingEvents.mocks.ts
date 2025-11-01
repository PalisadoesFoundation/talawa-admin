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

export const baseRecurringEvent = {
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

// Mocks for testing membership lookup enhancement with recurring events
export const MEMBERSHIP_LOOKUP_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          events: {
            edges: [
              { node: recurringInstanceEvent },
              { node: baseRecurringEvent },
              // Add another instance that references the same base
              {
                node: {
                  id: 'eventInstanceId2',
                  name: 'Recurring Event Instance 2',
                  startAt: '2044-11-08T10:00:00.000Z',
                  endAt: '2044-11-08T12:00:00.000Z',
                  location: 'Mumbai',
                  description: 'Another instance of recurring event',
                  isRecurringEventTemplate: false,
                  baseEvent: {
                    id: 'baseEventId1',
                    isRecurringEventTemplate: true,
                  },
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
            ],
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
          // Base event membership (should cascade to instances)
          {
            id: 'baseMembership1',
            status: 'accepted',
            event: { id: 'baseEventId1' },
            group: null,
          },
          // Base event group membership (should cascade to instances)
          {
            id: 'baseMembership2',
            status: 'requested',
            event: { id: 'baseEventId1' },
            group: { id: 'recurringGroupId1' },
          },
        ],
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

// Helper function to create membership with specific status
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

// Mock for testing rejected volunteer status
export const REJECTED_STATUS_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          events: {
            edges: [{ node: { ...event1, id: 'eventId1' } }],
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
          createMembershipWithStatus('1', 'eventId1', 'rejected'),
          createMembershipWithStatus('2', 'eventId1', 'rejected', 'groupId1'),
        ],
      },
    },
  },
];

// Mock for testing default case in getVolunteerStatus
export const DEFAULT_STATUS_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          events: {
            edges: [
              {
                node: {
                  ...event1,
                  id: 'eventId1',
                  name: 'Test Event for Default Case',
                },
              },
            ],
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
          createMembershipWithStatus('1', 'eventId1', 'unknown_status'),
        ],
      },
    },
  },
];

// Create past event based on existing event structure
const pastEvent = {
  ...event1,
  id: 'eventId1',
  name: 'Past Test Event',
  startAt: '2020-10-30T10:00:00.000Z',
  endAt: '2020-10-30T12:00:00.000Z', // Past date
};

// Mock for testing past events
export const PAST_EVENT_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          events: {
            edges: [{ node: pastEvent }],
          },
        },
      },
    },
  },
  {
    ...membershipQuery,
    result: {
      data: {
        getVolunteerMembership: [],
      },
    },
  },
];

// Create instance event for duplicate membership testing
const duplicateInstanceEvent = {
  ...recurringInstanceEvent,
  id: 'instanceEventId1',
  name: 'Instance Event 1',
  startAt: '2044-11-06T10:00:00.000Z',
  endAt: '2044-11-06T12:00:00.000Z',
};

// Mock for testing membership lookup with duplicate instance keys
export const DUPLICATE_MEMBERSHIP_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          events: {
            edges: [
              { node: baseRecurringEvent },
              { node: duplicateInstanceEvent },
            ],
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
            ...createMembershipWithStatus('1', 'baseEventId1', 'accepted'),
            event: {
              ...createMembershipWithStatus('1', 'baseEventId1', 'accepted')
                .event,
              name: 'Base Template Event',
              recurrenceRule: { frequency: 'WEEKLY' },
            },
          },
          // This membership for the instance should not overwrite the base template membership
          {
            ...createMembershipWithStatus('2', 'instanceEventId1', 'requested'),
            createdAt: '2024-11-01T10:00:00.000Z',
            updatedAt: '2024-11-01T10:00:00.000Z',
            event: {
              ...createMembershipWithStatus(
                '2',
                'instanceEventId1',
                'requested',
              ).event,
              name: 'Instance Event 1',
              startAt: '2044-11-06T10:00:00.000Z',
              endAt: '2044-11-06T12:00:00.000Z',
            },
          },
        ],
      },
    },
  },
];

// Mock for testing recurring events without baseEventId
export const RECURRING_WITHOUT_BASE_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          events: {
            edges: [
              {
                node: {
                  ...baseRecurringEvent,
                  id: 'templateEventId1',
                  name: 'Template Event',
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    ...membershipQuery,
    result: {
      data: {
        getVolunteerMembership: [],
      },
    },
  },
  {
    request: {
      query: CREATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        data: {
          event: 'templateEventId1', // Should use current event ID since no baseEventId
          group: null,
          status: 'requested',
          userId: 'userId',
          scope: 'ENTIRE_SERIES',
          recurringEventInstanceId: undefined,
        },
      },
    },
    result: {
      data: {
        createVolunteerMembership: {
          id: 'membership1',
          status: 'requested',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        data: {
          event: 'templateEventId1', // Should use current event ID since no baseEventId
          group: null,
          status: 'requested',
          userId: 'userId',
          scope: 'THIS_INSTANCE_ONLY',
          recurringEventInstanceId: 'templateEventId1',
        },
      },
    },
    result: {
      data: {
        createVolunteerMembership: {
          id: 'membership2',
          status: 'requested',
        },
      },
    },
  },
];

// Mock for testing null volunteerGroups and volunteers
export const NULL_FIELDS_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          events: {
            edges: [
              {
                node: {
                  id: 'eventId1',
                  name: 'Event with Null Fields',
                  startAt: '2044-10-30T10:00:00.000Z',
                  endAt: '2044-10-30T12:00:00.000Z',
                  location: 'Test Location',
                  description: 'Test Description',
                  isRecurringEventTemplate: false,
                  baseEvent: null,
                  recurrenceRule: null,
                  volunteerGroups: null, // This will test the null case
                  volunteers: null, // This will test the null case
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    ...membershipQuery,
    result: {
      data: {
        getVolunteerMembership: [],
      },
    },
  },
];

// Mock for testing group.volunteers being null while volunteerGroups exists
export const GROUP_VOLUNTEERS_NULL_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          events: {
            edges: [
              {
                node: {
                  id: 'eventGroupVolsNull',
                  name: 'Event with Group Volunteers Null',
                  startAt: '2044-10-30T10:00:00.000Z',
                  endAt: '2044-10-30T12:00:00.000Z',
                  location: 'Test Location',
                  description: 'Test Description',
                  isRecurringEventTemplate: false,
                  baseEvent: null,
                  recurrenceRule: null,
                  volunteerGroups: [
                    {
                      id: 'groupIdNull',
                      name: 'Group NullVols',
                      description: 'desc',
                      volunteersRequired: null,
                      volunteers: null, // Explicitly set to null
                    },
                  ],
                  volunteers: null, // event-level volunteers set to null as well
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    ...membershipQuery,
    result: {
      data: {
        getVolunteerMembership: [],
      },
    },
  },
];
export const GROUP_JOINED_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          events: {
            edges: [
              {
                node: {
                  id: 'eventId1',
                  name: 'Event With Group Joined',
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
                },
              },
            ],
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
            event: {
              id: 'eventId1',
              name: 'Event With Group Joined',
            },
            group: {
              id: 'groupId1',
              name: 'Test Group',
              description: 'Test Description',
            }, // ← This is the key part - group membership
          },
        ],
      },
    },
  },
];

export const GROUP_JOIN_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          events: {
            edges: [
              {
                node: {
                  id: 'eventId1',
                  name: 'Event With Group Join',
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
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    ...membershipQuery,
    result: {
      data: {
        getVolunteerMembership: [], // No membership - triggers default case
      },
    },
  },
];

export const NO_GROUPS_VOLUNTEER_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          events: {
            edges: [
              {
                node: {
                  id: 'eventId1',
                  name: 'Event No Groups Volunteer',
                  startAt: '2044-10-30T10:00:00.000Z',
                  endAt: '2044-10-30T12:00:00.000Z',
                  location: 'Test Location',
                  description: 'Test Description',
                  isRecurringEventTemplate: false,
                  baseEvent: null,
                  recurrenceRule: null,
                  volunteerGroups: [], // Empty array - no groups
                  volunteers: [],
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    ...membershipQuery,
    result: {
      data: {
        getVolunteerMembership: [], // No membership
      },
    },
  },
];

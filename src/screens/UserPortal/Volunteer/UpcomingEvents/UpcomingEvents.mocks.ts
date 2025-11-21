import { CREATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import {
  USER_EVENTS_VOLUNTEER,
  USER_VOLUNTEER_MEMBERSHIP,
} from 'GraphQl/Queries/EventVolunteerQueries';
import {
  createMembershipRecord,
  createMembershipResponse,
} from './UpcomingEvents.mockHelpers';
import {
  event1,
  event2,
  event3,
  nullVolunteerGroups,
  pastEvent,
  duplicateInstanceEvent,
  recurringInstanceEvent,
  baseRecurringEvent,
} from './UpcomingEvents.mockEvents';

// Re-export for backward compatibility
export { baseRecurringEvent } from './UpcomingEvents.mockEvents';

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
          id: 'orgId',
          events: {
            edges: [
              { node: event1 },
              { node: event2 },
              { node: event3 },
              { node: nullVolunteerGroups },
              { node: pastEvent },
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
          createMembershipRecord({
            id: 'membership1',
            status: 'accepted',
            eventId: 'eventId2',
            eventName: 'Event With Group Joined',
            groupId: 'groupId2',
            groupName: 'Test Group',
          }),
          createMembershipRecord({
            id: 'membershipUnknown',
            status: 'unknown_status',
            eventId: 'eventId1',
            eventName: 'Test Event',
          }),
          createMembershipRecord({
            id: 'membershipBase',
            status: 'accepted',
            eventId: 'baseEventId1',
            eventName: 'Base Template Event',
            recurrenceRuleId: 'baseRecurrenceRule',
          }),
          createMembershipRecord({
            id: 'membershipInstance',
            status: 'requested',
            eventId: 'instanceEventId1',
            eventName: 'Instance Event 1',
            startAt: '2044-11-06T10:00:00.000Z',
            endAt: '2044-11-06T12:00:00.000Z',
          }),
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        data: {
          event: 'eventId1',
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
          id: 'orgId',
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
          id: 'orgId',
          events: {
            edges: [
              { node: recurringInstanceEvent },
              { node: baseRecurringEvent },
              {
                node: {
                  id: 'eventInstanceId2',
                  name: 'Recurring Event Instance 2',
                  description: 'Another instance of recurring event',
                  startAt: '2044-11-08T10:00:00.000Z',
                  endAt: '2044-11-08T12:00:00.000Z',
                  location: 'Mumbai',
                  allDay: false,
                  isRecurringEventTemplate: false,
                  baseEvent: {
                    id: 'baseEventId1',
                    name: 'Base Template Event',
                    isRecurringEventTemplate: true,
                  },
                  recurrenceRule: {
                    id: 'recurrenceRuleInstance3',
                    frequency: 'WEEKLY',
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
          createMembershipRecord({
            id: 'baseMembership1',
            status: 'accepted',
            eventId: 'baseEventId1',
            eventName: 'Base Template Event',
          }),
          createMembershipRecord({
            id: 'baseMembership2',
            status: 'requested',
            eventId: 'baseEventId1',
            eventName: 'Base Template Event',
            groupId: 'recurringGroupId1',
            groupName: 'Recurring Group 1',
          }),
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
          id: 'orgId',
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
          createMembershipRecord({
            id: 'membershipAccepted',
            status: 'accepted',
            eventId: 'eventId1',
          }),
          createMembershipRecord({
            id: 'membershipRejected',
            status: 'rejected',
            eventId: 'eventId2',
            groupId: 'groupId2',
          }),
          createMembershipRecord({
            id: 'membershipRequested',
            status: 'requested',
            eventId: 'eventId1',
            groupId: 'groupId1',
          }),
        ],
      },
    },
  },
];

export const EMPTY_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: { organization: { id: 'orgId', events: { edges: [] } } },
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
          id: 'orgId',
          events: {
            edges: [{ node: event2 }, { node: event1 }, { node: event3 }],
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

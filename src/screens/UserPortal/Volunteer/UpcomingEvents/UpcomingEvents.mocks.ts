/**
 * Mock data for UpcomingEvents component tests
 * Split into separate files to maintain file size limits
 */

import { CREATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import {
  USER_EVENTS_VOLUNTEER,
  USER_VOLUNTEER_MEMBERSHIP,
} from 'GraphQl/Queries/EventVolunteerQueries';
import {
  createMembershipResponse,
  createMembershipWithStatus,
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
  baseEvent,
} from './UpcomingEvents.mockData';

export { baseRecurringEvent, baseEvent };

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
          __typename: 'Organization',
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
          {
            __typename: 'VolunteerMembership',
            id: 'membership1',
            status: 'accepted',
            event: {
              __typename: 'Event',
              id: 'eventId2',
              name: 'Event With Group Joined',
            },
            group: {
              __typename: 'EventVolunteerGroup',
              id: 'groupId2',
              name: 'Test Group',
              description: 'Test Description',
            }, // ← This is the key part - group membership
          },
          createMembershipWithStatus('1', 'eventId1', 'unknown_status'),
          // Base event membership (should cascade to instances)
          {
            ...createMembershipWithStatus('3', 'baseEventId1', 'accepted'),
            event: {
              ...createMembershipWithStatus('3', 'baseEventId1', 'accepted')
                .event,
              name: 'Base Template Event',
              recurrenceRule: {
                __typename: 'RecurrenceRule',
                frequency: 'WEEKLY',
              },
            },
          },
          // Instance event membership
          {
            ...createMembershipWithStatus('4', 'instanceEventId1', 'requested'),
            createdAt: '2024-11-01T10:00:00.000Z',
            updatedAt: '2024-11-01T10:00:00.000Z',
            event: {
              ...createMembershipWithStatus(
                '4',
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
          __typename: 'Organization',
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
          __typename: 'Organization',
          id: 'orgId',
          events: {
            edges: [
              { node: recurringInstanceEvent },
              { node: baseRecurringEvent },
              // Add another instance that references the same base
              {
                node: {
                  __typename: 'Event',
                  id: 'eventInstanceId2',
                  name: 'Recurring Event Instance 2',
                  startAt: '2044-11-08T10:00:00.000Z',
                  endAt: '2044-11-08T12:00:00.000Z',
                  location: 'Mumbai',
                  description: 'Another instance of recurring event',
                  isRecurringEventTemplate: false,
                  baseEvent: {
                    __typename: 'Event',
                    id: 'baseEventId1',
                    isRecurringEventTemplate: true,
                  },
                  volunteerGroups: [
                    {
                      __typename: 'EventVolunteerGroup',
                      id: 'recurringGroupId1',
                      name: 'Recurring Group 1',
                      description: 'desc',
                      volunteersRequired: 5,
                      volunteers: [],
                    },
                  ],
                  volunteers: [],
                  recurrenceRule: {
                    __typename: 'RecurrenceRule',
                    frequency: 'WEEKLY',
                  },
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
            __typename: 'VolunteerMembership',
            id: 'baseMembership1',
            status: 'accepted',
            event: { __typename: 'Event', id: 'baseEventId1' },
            group: null,
          },
          // Base event group membership (should cascade to instances)
          {
            __typename: 'VolunteerMembership',
            id: 'baseMembership2',
            status: 'requested',
            event: { __typename: 'Event', id: 'baseEventId1' },
            group: {
              __typename: 'EventVolunteerGroup',
              id: 'recurringGroupId1',
            },
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
          __typename: 'Organization',
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
          {
            __typename: 'VolunteerMembership',
            id: 'membership1',
            status: 'accepted',
            event: { __typename: 'Event', id: 'eventId1' },
            group: null,
          },
          {
            __typename: 'VolunteerMembership',
            id: 'membership2',
            status: 'rejected',
            event: { __typename: 'Event', id: 'eventId2' },
            group: { __typename: 'EventVolunteerGroup', id: 'groupId2' },
          },
          {
            __typename: 'VolunteerMembership',
            id: 'membership3',
            status: 'requested',
            event: { __typename: 'Event', id: 'eventId1' },
            group: { __typename: 'EventVolunteerGroup', id: 'groupId1' },
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
      data: {
        organization: {
          __typename: 'Organization',
          id: 'orgId',
          events: { edges: [] },
        },
      },
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
          __typename: 'Organization',
          id: 'orgId',
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

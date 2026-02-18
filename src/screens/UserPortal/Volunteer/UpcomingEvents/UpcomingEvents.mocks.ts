import {
  USER_EVENTS_VOLUNTEER,
  USER_VOLUNTEER_MEMBERSHIP,
} from 'GraphQl/Queries/EventVolunteerQueries';
import { createMembershipRecord } from './UpcomingEvents.mockHelpers';
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

export { baseRecurringEvent } from './UpcomingEvents.mockEvents';

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
            groupId: 'groupId2',
          }),
        ],
      },
    },
  },
];

export const MEMBERSHIP_LOOKUP_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          id: 'orgId',
          events: {
            edges: [
              { node: baseRecurringEvent },
              { node: recurringInstanceEvent },
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
            id: 'baseMembership',
            status: 'accepted',
            eventId: 'baseEventId1',
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
      data: {
        organization: { id: 'orgId', events: { edges: [] } },
      },
    },
  },
];

export const ERROR_MOCKS = [
  {
    ...eventsQuery,
    error: new Error('Mock USER_EVENTS_VOLUNTEER Error'),
  },
];

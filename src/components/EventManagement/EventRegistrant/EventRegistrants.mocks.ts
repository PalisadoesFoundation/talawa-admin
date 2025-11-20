import { REMOVE_EVENT_ATTENDEE } from 'GraphQl/Mutations/mutations';
import {
  EVENT_REGISTRANTS,
  EVENT_DETAILS,
  EVENT_CHECKINS,
} from 'GraphQl/Queries/Queries';

export const EVENT_DETAILS_MOCK = {
  request: {
    query: EVENT_DETAILS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      event: {
        __typename: 'Event',
        id: 'event123',
        name: 'Test Event',
        description: 'A test event.',
        location: 'Test Location',
        allDay: false,
        isPublic: true,
        isRegisterable: true,
        startAt: '2024-07-22T10:00:00.000Z',
        endAt: '2024-07-22T12:00:00.000Z',
        createdAt: '2024-07-22T09:00:00.000Z',
        updatedAt: '2024-07-22T09:00:00.000Z',
        isRecurringEventTemplate: false,
        baseEvent: null,
        recurrenceRule: null,
        creator: {
          __typename: 'User',
          id: 'user1',
          name: 'Test User',
          emailAddress: 'test@example.com',
        },
        updater: {
          __typename: 'User',
          id: 'user1',
          name: 'Test User',
          emailAddress: 'test@example.com',
        },
        organization: {
          __typename: 'Organization',
          id: 'org123',
          name: 'Test Organization',
        },
      },
    },
  },
};

export const EVENT_DETAILS_RECURRING_MOCK = {
  request: {
    query: EVENT_DETAILS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      event: {
        __typename: 'Event',
        id: 'event123',
        name: 'Test Event',
        description: 'A test event.',
        location: 'Test Location',
        allDay: false,
        isPublic: true,
        isRegisterable: true,
        startAt: '2024-07-22T10:00:00.000Z',
        endAt: '2024-07-22T12:00:00.000Z',
        createdAt: '2024-07-22T09:00:00.000Z',
        updatedAt: '2024-07-22T09:00:00.000Z',
        isRecurringEventTemplate: false,
        baseEvent: null,
        recurrenceRule: {
          __typename: 'RecurrenceRule',
          id: 'recurrence123',
        },
        creator: {
          __typename: 'User',
          id: 'user1',
          name: 'Test User',
          emailAddress: 'test@example.com',
        },
        updater: {
          __typename: 'User',
          id: 'user1',
          name: 'Test User',
          emailAddress: 'test@example.com',
        },
        organization: {
          __typename: 'Organization',
          id: 'org123',
          name: 'Test Organization',
        },
      },
    },
  },
};

export const EVENT_CHECKINS_MOCK = {
  request: {
    query: EVENT_CHECKINS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      event: {
        id: 'event123',
        attendeesCheckInStatus: [],
      },
    },
  },
};

export const EVENT_CHECKINS_WITH_CHECKED_IN_MOCK = {
  request: {
    query: EVENT_CHECKINS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      event: {
        id: 'event123',
        attendeesCheckInStatus: [
          {
            user: { id: 'user1', __typename: 'User' },
            isCheckedIn: true,
          },
        ],
      },
    },
  },
};

export const REMOVE_REGISTRANT_SUCCESS_MOCK = {
  request: {
    query: REMOVE_EVENT_ATTENDEE,
    variables: { userId: 'user1', eventId: 'event123' },
  },
  result: {
    data: {
      removeEventAttendee: {
        id: 'user1',
        name: 'Bruce Garza',
        emailAddress: 'bruce@example.com',
        __typename: 'User',
      },
    },
  },
};

export const MOCK_REGISTRANTS = {
  request: {
    query: EVENT_REGISTRANTS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      getEventAttendeesByEventId: [
        {
          id: 'user1',
          user: {
            id: 'user1',
            name: 'Bruce Garza',
            emailAddress: 'bruce@example.com',
            __typename: 'User',
          },
          isRegistered: true,
          isInvited: false,
          createdAt: '2024-07-22T10:30:00.000Z',
          __typename: 'EventAttendee',
        },
        {
          id: 'user2',
          user: {
            id: 'user2',
            name: 'Jane Smith',
            emailAddress: 'jane@example.com',
            __typename: 'User',
          },
          isRegistered: true,
          isInvited: false,
          createdAt: '2024-07-22T11:00:00.000Z',
          __typename: 'EventAttendee',
        },
      ],
    },
  },
};

// Edge case mocks for testing
export const MOCK_REGISTRANTS_WITH_NULL_CREATED_AT = {
  request: {
    query: EVENT_REGISTRANTS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      getEventAttendeesByEventId: [
        {
          id: 'user1',
          user: {
            id: 'user1',
            name: 'Jane Doe',
            emailAddress: 'jane@example.com',
          },
          isRegistered: true,
          isInvited: false,
          createdAt: null,
          __typename: 'EventAttendee',
        },
      ],
    },
  },
};

export const MOCK_REGISTRANTS_WITH_EMPTY_USER = {
  request: {
    query: EVENT_REGISTRANTS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      getEventAttendeesByEventId: [
        {
          id: '1',
          user: {},
          isRegistered: true,
          createdAt: '2023-09-25T10:00:00.000Z',
          __typename: 'EventAttendee',
        },
      ],
    },
  },
};

export const EVENT_CHECKINS_WITH_UNDEFINED_ATTENDEES = {
  request: {
    query: EVENT_CHECKINS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      event: {
        __typename: 'Event',
      },
    },
  },
};

export const MOCK_REGISTRANTS_NULL = {
  request: {
    query: EVENT_REGISTRANTS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      getEventAttendeesByEventId: null,
    },
  },
};

export const COMBINED_MOCKS = [
  MOCK_REGISTRANTS,
  EVENT_DETAILS_MOCK,
  EVENT_CHECKINS_MOCK,
];

// Type for all possible mocks
export type EventRegistrantsMockType =
  | typeof MOCK_REGISTRANTS
  | typeof EVENT_DETAILS_MOCK
  | typeof EVENT_DETAILS_RECURRING_MOCK
  | typeof EVENT_CHECKINS_MOCK
  | typeof EVENT_CHECKINS_WITH_CHECKED_IN_MOCK
  | typeof REMOVE_REGISTRANT_SUCCESS_MOCK
  | typeof MOCK_REGISTRANTS_WITH_NULL_CREATED_AT
  | typeof MOCK_REGISTRANTS_WITH_EMPTY_USER
  | typeof EVENT_CHECKINS_WITH_UNDEFINED_ATTENDEES
  | typeof MOCK_REGISTRANTS_NULL;

import type { MockedResponse } from '@apollo/client/testing';
import {
  EVENT_REGISTRANTS,
  EVENT_DETAILS,
  EVENT_CHECKINS,
} from 'GraphQl/Queries/Queries';
import { REMOVE_EVENT_ATTENDEE } from 'GraphQl/Mutations/mutations';

// Event Details Mocks
export const EVENT_DETAILS_MOCK: MockedResponse = {
  request: {
    query: EVENT_DETAILS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      event: {
        id: 'event123',
        name: 'Test Event',
        description: 'Test Description',
        location: 'Test Location',
        allDay: false,
        isPublic: true,
        isRegisterable: true,
        startAt: '2030-04-13T10:00:00.000Z',
        endAt: '2030-04-13T12:00:00.000Z',
        createdAt: '2030-01-01T00:00:00.000Z',
        updatedAt: '2030-01-01T00:00:00.000Z',
        isRecurringEventTemplate: false,
        baseEvent: null,
        recurrenceRule: null,
        creator: {
          id: 'creator1',
          name: 'Creator Name',
          emailAddress: 'creator@example.com',
          __typename: 'User',
        },
        updater: {
          id: 'updater1',
          name: 'Updater Name',
          emailAddress: 'updater@example.com',
          __typename: 'User',
        },
        organization: {
          id: 'org123',
          name: 'Test Org',
          __typename: 'Organization',
        },
        __typename: 'Event',
      },
    },
  },
};

export const RECURRING_EVENT_DETAILS_MOCK: MockedResponse = {
  request: {
    query: EVENT_DETAILS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      event: {
        id: 'event123',
        name: 'Recurring Event',
        description: 'Recurring Description',
        location: 'Recurring Location',
        allDay: false,
        isPublic: true,
        isRegisterable: true,
        startAt: '2030-04-13T10:00:00.000Z',
        endAt: '2030-04-13T12:00:00.000Z',
        createdAt: '2030-01-01T00:00:00.000Z',
        updatedAt: '2030-01-01T00:00:00.000Z',
        isRecurringEventTemplate: true,
        baseEvent: null,
        recurrenceRule: {
          id: 'rule1',
          __typename: 'RecurrenceRule',
        },
        creator: {
          id: 'creator1',
          name: 'Creator Name',
          emailAddress: 'creator@example.com',
          __typename: 'User',
        },
        updater: {
          id: 'updater1',
          name: 'Updater Name',
          emailAddress: 'updater@example.com',
          __typename: 'User',
        },
        organization: {
          id: 'org123',
          name: 'Test Org',
          __typename: 'Organization',
        },
        __typename: 'Event',
      },
    },
  },
};

// Event Check-ins Mocks
export const EVENT_CHECKINS_MOCK: MockedResponse = {
  request: {
    query: EVENT_CHECKINS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      event: {
        attendeesCheckInStatus: [
          {
            user: { id: '6589386a2caa9d8d69087484' },
            isCheckedIn: true,
          },
          {
            user: { id: '6589386a2caa9d8d69087485' },
            isCheckedIn: false,
          },
        ],
      },
    },
  },
};

export const EMPTY_EVENT_CHECKINS_MOCK: MockedResponse = {
  request: {
    query: EVENT_CHECKINS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      event: {
        attendeesCheckInStatus: [],
      },
    },
  },
};

// Event Registrants Mocks
export const REGISTRANTS_MOCK: MockedResponse = {
  request: {
    query: EVENT_REGISTRANTS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      getEventAttendeesByEventId: [
        {
          id: '6589386a2caa9d8d69087484',
          user: {
            id: '6589386a2caa9d8d69087484',
            name: 'Bruce Garza',
            emailAddress: 'bruce@example.com',
          },
          isRegistered: true,
          isInvited: false,
          createdAt: '2030-04-13T10:23:17.742Z',
        },
        {
          id: '6589386a2caa9d8d69087485',
          user: {
            id: '6589386a2caa9d8d69087485',
            name: 'Jane Smith',
            emailAddress: 'jane@example.com',
          },
          isRegistered: true,
          isInvited: false,
          createdAt: '2030-04-13T10:23:17.742Z',
        },
      ],
    },
  },
};

export const EMPTY_REGISTRANTS_MOCK: MockedResponse = {
  request: {
    query: EVENT_REGISTRANTS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      getEventAttendeesByEventId: [],
    },
  },
};

export const RECURRING_EVENT_REGISTRANTS_MOCK: MockedResponse = {
  request: {
    query: EVENT_REGISTRANTS,
    variables: { recurringEventInstanceId: 'event123' },
  },
  result: {
    data: {
      getEventAttendeesByEventId: [],
    },
  },
};

export const REGISTRANTS_MISSING_DATE_MOCK: MockedResponse = {
  request: {
    query: EVENT_REGISTRANTS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      getEventAttendeesByEventId: [
        {
          id: '1',
          user: {
            id: 'user1',
            name: 'John Doe',
            emailAddress: 'john@example.com',
          },
          isRegistered: true,
          isInvited: false,
          createdAt: null,
        },
      ],
    },
  },
};

export const REGISTRANTS_MISSING_NAME_MOCK: MockedResponse = {
  request: {
    query: EVENT_REGISTRANTS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      getEventAttendeesByEventId: [
        {
          id: '1',
          user: {
            id: 'user1',
            name: null,
            emailAddress: 'john@example.com',
          },
          isRegistered: true,
          isInvited: false,
          createdAt: '2030-04-13T10:23:17.742Z',
        },
      ],
    },
  },
};

export const REGISTRANTS_ERROR_USER_MOCK: MockedResponse = {
  request: {
    query: EVENT_REGISTRANTS,
    variables: { eventId: 'event123' },
  },
  result: {
    data: {
      getEventAttendeesByEventId: [
        {
          id: 'user3',
          user: {
            id: 'user3',
            name: 'Error User',
            emailAddress: 'error@example.com',
          },
          isRegistered: true,
          isInvited: false,
          createdAt: '2030-04-13T10:23:17.742Z',
        },
      ],
    },
  },
};

// Remove Attendee Mocks
export const REMOVE_ATTENDEE_SUCCESS_MOCK: MockedResponse = {
  request: {
    query: REMOVE_EVENT_ATTENDEE,
    variables: { userId: '6589386a2caa9d8d69087485', eventId: 'event123' },
  },
  result: {
    data: {
      removeEventAttendee: {
        id: '6589386a2caa9d8d69087485',
      },
    },
  },
};

export const REMOVE_ATTENDEE_ERROR_MOCK: MockedResponse = {
  request: {
    query: REMOVE_EVENT_ATTENDEE,
    variables: { userId: 'user3', eventId: 'event123' },
  },
  error: new Error('Failed to remove attendee'),
};

// Combined Mock Sets
export const COMBINED_MOCKS: MockedResponse[] = [
  EVENT_DETAILS_MOCK,
  EVENT_CHECKINS_MOCK,
  REGISTRANTS_MOCK,
  REMOVE_ATTENDEE_SUCCESS_MOCK,
  REMOVE_ATTENDEE_ERROR_MOCK,
];

export const EMPTY_STATE_MOCKS: MockedResponse[] = [
  EVENT_DETAILS_MOCK,
  EMPTY_REGISTRANTS_MOCK,
  EMPTY_EVENT_CHECKINS_MOCK,
];

export const RECURRING_EVENT_MOCKS: MockedResponse[] = [
  RECURRING_EVENT_DETAILS_MOCK,
  RECURRING_EVENT_REGISTRANTS_MOCK,
  EMPTY_EVENT_CHECKINS_MOCK,
];

export const MISSING_DATE_MOCKS: MockedResponse[] = [
  EVENT_DETAILS_MOCK,
  REGISTRANTS_MISSING_DATE_MOCK,
  EVENT_CHECKINS_MOCK,
];

export const MISSING_NAME_MOCKS: MockedResponse[] = [
  EVENT_DETAILS_MOCK,
  REGISTRANTS_MISSING_NAME_MOCK,
  EVENT_CHECKINS_MOCK,
];

export const ERROR_DELETION_MOCKS: MockedResponse[] = [
  EVENT_DETAILS_MOCK,
  EVENT_CHECKINS_MOCK,
  REGISTRANTS_ERROR_USER_MOCK,
  REMOVE_ATTENDEE_ERROR_MOCK,
];

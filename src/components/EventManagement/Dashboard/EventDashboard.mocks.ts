import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';

export const MOCKS_WITH_TIME = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'event123' },
    },
    result: {
      data: {
        event: {
          _id: 'event123',
          id: 'event123',
          name: 'Test Event',
          description: 'Test Description',
          startAt: '2024-01-01T09:00:00Z',
          endAt: '2024-01-02T17:00:00Z',
          startTime: '09:00:00',
          endTime: '17:00:00',
          allDay: false,
          location: 'India',
          isPublic: true,
          isRegisterable: true,
          attendees: [{ _id: 'user1' }, { _id: 'user2' }],
          creator: {
            _id: 'creator1',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      },
    },
  },
];

export const MOCKS_WITHOUT_TIME = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'event123' },
    },
    result: {
      data: {
        event: {
          _id: 'event123',
          id: 'event123',
          name: 'Test Event',
          description: 'Test Description',
          startAt: '2024-01-01T00:00:00Z',
          endAt: '2024-01-02T00:00:00Z',
          startTime: null,
          endTime: null,
          allDay: true,
          location: 'India',
          isPublic: true,
          isRegisterable: true,
          attendees: [{ _id: 'user1' }, { _id: 'user2' }],
          creator: {
            _id: 'creator1',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      },
    },
  },
];

export const MOCKS_NO_EVENT = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'event123' },
    },
    result: {
      data: {
        event: null,
      },
    },
  },
];

export const MOCKS_WITH_NULL_LOCATION = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'event123' },
    },
    result: {
      data: {
        event: {
          _id: 'event123',
          id: 'event123',
          name: 'Test Event',
          description: 'Test Description',
          startAt: '2024-01-01T09:00:00Z',
          endAt: '2024-01-02T17:00:00Z',
          startTime: '09:00:00',
          endTime: '17:00:00',
          allDay: false,
          location: null,
          isPublic: true,
          isRegisterable: true,
          attendees: [],
          creator: {
            _id: 'creator1',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      },
    },
  },
];

export const MOCKS_WITH_NULL_DESCRIPTION = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'event123' },
    },
    result: {
      data: {
        event: {
          _id: 'event123',
          id: 'event123',
          name: 'Test Event',
          description: null,
          startAt: '2024-01-01T09:00:00Z',
          endAt: '2024-01-02T17:00:00Z',
          startTime: '09:00:00',
          endTime: '17:00:00',
          allDay: false,
          location: 'India',
          isPublic: true,
          isRegisterable: true,
          attendees: [],
          creator: {
            _id: 'creator1',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      },
    },
  },
];

export const MOCKS_WITH_ADMIN_ROLE = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'event123' },
    },
    result: {
      data: {
        event: {
          _id: 'event123',
          id: 'event123',
          name: 'Test Event',
          description: 'Test Description',
          startAt: '2024-01-01T09:00:00Z',
          endAt: '2024-01-02T17:00:00Z',
          startTime: '09:00:00',
          endTime: '17:00:00',
          allDay: false,
          location: 'India',
          isPublic: true,
          isRegisterable: true,
          attendees: [{ _id: 'user1' }, { _id: 'user2' }],
          creator: {
            _id: 'creator1',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      },
    },
  },
];

export const MOCKS_INVALID_DATE = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'event123' },
    },
    result: {
      data: {
        event: {
          _id: 'event123',
          id: 'event123',
          name: 'Test Event',
          description: 'Test Description',
          startAt: 'invalid-date-string',
          endAt: 'another-invalid-format',
          startTime: null,
          endTime: null,
          allDay: false,
          location: 'India',
          isPublic: true,
          isRegisterable: true,
          attendees: [],
          creator: {
            _id: 'creator1',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      },
    },
  },
];

export const MOCK_BOUNDARY_TIME = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'event123' },
    },
    result: {
      data: {
        event: {
          _id: 'event123',
          id: 'event123',
          name: 'Test Event',
          description: 'Test Description',
          startAt: '2024-01-01T00:05:00Z',
          endAt: '2024-01-02T23:55:00Z',
          startTime: '00:05:00',
          endTime: '23:55:00',
          allDay: false,
          location: 'India',
          isPublic: true,
          isRegisterable: true,
          attendees: [],
          creator: {
            _id: 'creator1',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      },
    },
  },
];

export const MOCK_EMPTY_START_TIME = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'event123' },
    },
    result: {
      data: {
        event: {
          _id: 'event123',
          id: 'event123',
          name: 'Test Event',
          description: 'Test Description',
          startAt: null,
          endAt: null,
          startTime: null,
          endTime: null,
          allDay: false,
          location: 'India',
          isPublic: true,
          isRegisterable: true,
          attendees: [],
          creator: {
            _id: 'creator1',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      },
    },
  },
];

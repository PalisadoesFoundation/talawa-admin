import { EVENT_DETAILS, EVENT_DETAILS_BASIC } from 'GraphQl/Queries/Queries';

export const mockEventData = {
  event: {
    id: 'event123',
    name: 'Test Event',
    description: 'Test Description',
    location: 'Test Location',
    allDay: false,
    isPublic: true,
    isRegisterable: true,
    startAt: '2030-01-01T09:00:00Z',
    endAt: '2030-01-02T17:00:00Z',
    createdAt: '2030-01-01T00:00:00Z',
    updatedAt: '2030-01-01T00:00:00Z',
    recurrenceRule: { id: 'rule123' },
    isRecurringEventTemplate: true,
    attendees: [
      { id: 'user1', gender: 'MALE' },
      { id: 'user2', gender: 'FEMALE' },
    ],
    creator: {
      id: 'user1',
      name: 'John Doe',
      emailAddress: 'john@example.com',
    },
    updater: {
      id: 'user1',
      name: 'John Doe',
      emailAddress: 'john@example.com',
    },
    organization: { id: 'org123', name: 'Test Org' },
  },
};

export const mockEventBasicData = {
  event: {
    id: 'event123',
    name: 'Test Event',
    location: 'Test Location',
    startAt: '2030-01-01T09:00:00Z',
    organization: { id: 'org123', name: 'Test Org' },
  },
};

export const mocks = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'event123' },
    },
    result: {
      data: mockEventData,
    },
  },
  {
    request: {
      query: EVENT_DETAILS_BASIC,
      variables: { eventId: 'event123' },
    },
    result: {
      data: mockEventBasicData,
    },
  },
];

export const errorMocks = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'event123' },
    },
    error: new Error('An error occurred'),
  },
  {
    request: {
      query: EVENT_DETAILS_BASIC,
      variables: { eventId: 'event123' },
    },
    error: new Error('An error occurred'),
  },
];

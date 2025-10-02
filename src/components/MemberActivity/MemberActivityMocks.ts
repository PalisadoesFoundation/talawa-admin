import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';

export const mockEventData = {
  event: {
    id: 'event123',
    _id: 'event123',
    name: 'Test Event',
    title: 'Test Event',
    description: 'Test Description',
    startAt: '2030-01-01T09:00:00.000Z',
    endAt: '2030-01-02T17:00:00.000Z',
    startDate: '2030-01-01',
    endDate: '2030-01-02',
    startTime: '09:00',
    endTime: '17:00',
    allDay: false,
    isPublic: true,
    isRegisterable: true,
    location: 'Test Location',
    recurring: true,
    baseRecurringEvent: { _id: 'base123' },
    organization: {
      id: 'org123',
      _id: 'org123',
      name: 'Test Organization',
      members: [
        { _id: 'user1', firstName: 'John', lastName: 'Doe' },
        { _id: 'user2', firstName: 'Jane', lastName: 'Smith' },
      ],
    },
    creator: {
      id: 'creator1',
      name: 'Alice Creator',
      emailAddress: 'alice@example.com',
    },
    updater: {
      id: 'updater1',
      name: 'Bob Updater',
      emailAddress: 'bob@example.com',
    },
    createdAt: '2029-12-01T10:00:00.000Z',
    updatedAt: '2030-01-10T15:30:00.000Z',
    attendees: [
      { _id: 'user1', gender: 'MALE' },
      { _id: 'user2', gender: 'FEMALE' },
    ],
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
];

export const errorMocks = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'event123' },
    },
    error: new Error('An error occurred'),
  },
];

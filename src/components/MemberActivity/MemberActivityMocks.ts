import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';

export const mockEventData = {
  event: {
    _id: 'event123',
    title: 'Test Event',
    // Provide name/startAt/endAt to align with EVENT_DETAILS fields
    name: 'Test Event',
    description: 'Test Description',
    startDate: '2030-01-01',
    endDate: '2030-01-02',
    startAt: '2030-01-01T09:00:00.000Z',
    endAt: '2030-01-02T17:00:00.000Z',
    startTime: '09:00',
    endTime: '17:00',
    allDay: false,
    location: 'Test Location',
    recurring: true,
    baseRecurringEvent: { _id: 'base123' },
    organization: {
      _id: 'org123',
      members: [
        { _id: 'user1', firstName: 'John', lastName: 'Doe' },
        { _id: 'user2', firstName: 'Jane', lastName: 'Smith' },
      ],
    },
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
      // EVENT_DETAILS query parameter is $eventId
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

import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';

export const mockEventData = {
  event: {
    _id: 'event123',
    title: 'Test Event',
    description: 'Test Description',
    startDate: '2023-01-01',
    endDate: '2023-01-02',
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
      variables: { id: 'event123' },
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
      variables: { id: 'event123' },
    },
    error: new Error('An error occurred'),
  },
];

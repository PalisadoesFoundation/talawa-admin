import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';

export const MOCKS_WITH_TIME = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { id: 'event123' },
    },
    result: {
      data: {
        event: {
          _id: 'event123',
          title: 'Test Event',
          description: 'Test Description',
          startDate: '2024-01-01',
          endDate: '2024-01-02',
          startTime: '09:00:00',
          endTime: '17:00:00',
          allDay: false,
          location: 'India',
          recurring: false,
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
      variables: { id: 'event123' },
    },
    result: {
      data: {
        event: {
          _id: 'event123',
          title: 'Test Event',
          description: 'Test Description',
          startDate: '2024-01-01',
          endDate: '2024-01-02',
          startTime: null,
          endTime: null,
          allDay: true,
          location: 'India',
          recurring: false,
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

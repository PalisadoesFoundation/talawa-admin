import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

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
          startAt: dayjs
            .utc()
            .add(10, 'days')
            .hour(9)
            .minute(0)
            .second(0)
            .toISOString(),
          endAt: dayjs
            .utc()
            .add(11, 'days')
            .hour(17)
            .minute(0)
            .second(0)
            .toISOString(),
          startTime: '09:00:00',
          endTime: '17:00:00',
          allDay: false,
          location: 'India',
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
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
          startAt: dayjs.utc().add(10, 'days').startOf('day').toISOString(),
          endAt: dayjs.utc().add(11, 'days').startOf('day').toISOString(),
          startTime: null,
          endTime: null,
          allDay: true,
          location: 'India',
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
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

export const MOCKS_MISSING_DATA = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'event123' },
    },
    result: {
      data: null,
    },
  },
];

export const MOCKS_NO_LOCATION = [
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
          description: '',
          startAt: dayjs
            .utc()
            .add(10, 'days')
            .hour(9)
            .minute(0)
            .second(0)
            .toISOString(),
          endAt: dayjs
            .utc()
            .add(11, 'days')
            .hour(17)
            .minute(0)
            .second(0)
            .toISOString(),
          startTime: '09:00:00',
          endTime: '17:00:00',
          allDay: false,
          location: null,
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
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

export const MOCKS_INVALID_DATETIME = [
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
          startAt: dayjs
            .utc()
            .add(10, 'days')
            .hour(9)
            .minute(0)
            .second(0)
            .toISOString(),
          endAt: dayjs
            .utc()
            .add(11, 'days')
            .hour(17)
            .minute(0)
            .second(0)
            .toISOString(),
          startTime: '09:00:00', // Changed from null to valid time
          endTime: '17:00:00', // Changed from null to valid time
          allDay: false,
          location: 'India',
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
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

import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const creator = {
  id: 'creator1',
  name: 'John Doe',
  emailAddress: 'john.doe@example.com',
};

const updater = {
  id: 'updater1',
  name: 'Updater Person',
  emailAddress: 'updater@example.com',
};

const organization = {
  id: 'org1',
  name: 'Test Org',
};

const baseEventFields = {
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-02T00:00:00.000Z',
  isRecurringEventTemplate: false,
  baseEvent: null,
  recurrenceRule: null,
  updater,
  organization,
};

export const MOCKS_WITH_TIME = [
  {
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
          location: 'India',
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
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
          creator,
          ...baseEventFields,
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
          id: 'event123',
          name: 'Test Event',
          description: 'Test Description',
          location: 'India',
          allDay: true,
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
          startAt: dayjs.utc().add(10, 'days').startOf('day').toISOString(),
          endAt: dayjs.utc().add(11, 'days').startOf('day').toISOString(),
          creator,
          ...baseEventFields,
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
          id: 'event123',
          name: 'Test Event',
          description: '',
          location: null,
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
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
          creator,
          ...baseEventFields,
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
          id: 'event123',
          name: 'Test Event',
          description: 'Test Description',
          location: 'India',
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
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
          creator,
          ...baseEventFields,
        },
      },
    },
  },
];

export const MOCKS_UNDEFINED_INVITE_ONLY = [
  {
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
          location: 'India',
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: undefined,
          startAt: dayjs.utc().add(10, 'days').toISOString(),
          endAt: dayjs.utc().add(11, 'days').toISOString(),
          creator,
          ...baseEventFields,
        },
      },
    },
  },
];

export const MOCKS_EMPTY_DATE_STRINGS = [
  {
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
          location: 'India',
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
          startAt: '',
          endAt: '',
          creator,
          ...baseEventFields,
        },
      },
    },
  },
];

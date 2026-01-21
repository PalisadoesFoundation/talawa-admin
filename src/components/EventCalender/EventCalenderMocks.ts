import {
  DELETE_STANDALONE_EVENT_MUTATION,
  UPDATE_EVENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const eventData = [
  {
    id: '1',
    name: 'Event 1',
    description: 'This is event 1',
    startAt: dayjs
      .utc()
      .startOf('month')
      .hour(10)
      .minute(0)
      .second(0)
      .toISOString(),
    endAt: dayjs
      .utc()
      .startOf('month')
      .hour(12)
      .minute(0)
      .second(0)
      .toISOString(),
    location: 'New York',
    startTime: '10:00',
    endTime: '12:00',
    allDay: false,
    isPublic: true,
    isRegisterable: true,
    isInviteOnly: false,
    attendees: [],
    creator: {
      id: '1',
      name: 'Creator 1',
    },
  },
  {
    id: '2',
    name: 'Event 2',
    description: 'This is event 2',
    startAt: dayjs
      .utc()
      .startOf('month')
      .add(2, 'days')
      .hour(14)
      .minute(0)
      .second(0)
      .toISOString(),
    endAt: dayjs
      .utc()
      .startOf('month')
      .add(2, 'days')
      .hour(16)
      .minute(0)
      .second(0)
      .toISOString(),
    location: 'Los Angeles',
    startTime: '14:00',
    endTime: '16:00',
    allDay: false,
    isPublic: true,
    isRegisterable: true,
    isInviteOnly: false,
    attendees: [],
    creator: {
      id: '2',
      name: 'Creator 2',
    },
  },
];

export const MOCKS = [
  {
    request: {
      query: DELETE_STANDALONE_EVENT_MUTATION,
      variable: { id: '123' },
    },
    result: {
      data: {
        removeEvent: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_EVENT_MUTATION,
      variable: {
        id: '123',
        name: 'Updated name',
        description: 'This is a new update',
        isPublic: true,
        isRegisterable: true,
        allDay: false,
        location: 'New Delhi',
        startTime: '02:00',
        endTime: '07:00',
      },
    },
    result: {
      data: {
        updateEvent: {
          _id: '1',
        },
      },
    },
  },
];

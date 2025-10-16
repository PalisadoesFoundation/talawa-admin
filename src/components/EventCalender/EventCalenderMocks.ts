import {
  DELETE_STANDALONE_EVENT_MUTATION,
  UPDATE_EVENT_MUTATION,
} from 'GraphQl/Mutations/mutations';

export const eventData = [
  {
    id: '1',
    name: 'Event 1',
    description: 'This is event 1',
    startAt: '2022-05-01T10:00:00Z',
    endAt: '2022-05-01T12:00:00Z',
    location: 'New York',
    startTime: '10:00',
    endTime: '12:00',
    allDay: false,
    isPublic: true,
    isRegisterable: true,
    attendees: [],
    creator: {},
  },
  {
    id: '2',
    name: 'Event 2',
    description: 'This is event 2',
    startAt: '2022-05-03T14:00:00Z',
    endAt: '2022-05-03T16:00:00Z',
    location: 'Los Angeles',
    startTime: '14:00',
    endTime: '16:00',
    allDay: false,
    isPublic: true,
    isRegisterable: true,
    attendees: [],
    creator: {},
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

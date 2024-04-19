import {
  DELETE_EVENT_MUTATION,
  REGISTER_EVENT,
  UPDATE_EVENT_MUTATION,
} from 'GraphQl/Mutations/mutations';

export const MOCKS = [
  {
    request: {
      query: DELETE_EVENT_MUTATION,
      variables: { id: '1' },
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
      query: DELETE_EVENT_MUTATION,
      variables: { id: '1', recurringEventDeleteType: 'thisInstance' },
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
      variables: {
        id: '1',
        title: 'Updated title',
        description: 'This is a new update',
        isPublic: false,
        recurring: false,
        isRegisterable: true,
        allDay: true,
        startDate: '2022-03-18',
        endDate: '2022-03-20',
        location: 'New Delhi',
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
  {
    request: {
      query: UPDATE_EVENT_MUTATION,
      variables: {
        id: '1',
        title: 'Updated title',
        description: 'This is a new update',
        isPublic: false,
        recurring: false,
        isRegisterable: true,
        allDay: false,
        startDate: '2022-03-18',
        endDate: '2022-03-20',
        location: 'New Delhi',
        startTime: '09:00:00Z',
        endTime: '17:00:00Z',
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
  {
    request: {
      query: REGISTER_EVENT,
      variables: { eventId: '1' },
    },
    result: {
      data: {
        registerForEvent: [
          {
            _id: '123',
          },
        ],
      },
    },
  },
];

export const ERROR_MOCKS = [
  {
    request: {
      query: DELETE_EVENT_MUTATION,
      variables: {
        id: '1',
      },
    },
    error: new Error('Something went wrong'),
  },
];

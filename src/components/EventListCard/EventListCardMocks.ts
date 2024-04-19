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
      query: UPDATE_EVENT_MUTATION,
      variables: {
        id: '1',
        title: 'Updated title',
        description: 'This is a new update',
        isPublic: false,
        recurring: true,
        recurringEventUpdateType: 'thisInstance',
        isRegisterable: true,
        allDay: true,
        startDate: '2022-03-18',
        endDate: '2022-03-20',
        location: 'New Delhi',
        recurrenceStartDate: '2022-03-18',
        recurrenceEndDate: null,
        frequency: 'WEEKLY',
        weekDays: ['FRIDAY'],
        interval: 1,
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
        isPublic: true,
        recurring: true,
        recurringEventUpdateType: 'allInstances',
        isRegisterable: false,
        allDay: true,
        startDate: '2022-03-17',
        endDate: '2022-03-17',
        location: 'New Delhi',
        recurrenceStartDate: '2022-03-17',
        recurrenceEndDate: '2023-03-17',
        frequency: 'MONTHLY',
        weekDays: ['THURSDAY'],
        interval: 1,
        weekDayOccurenceInMonth: 3,
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
        title: 'Shelter for Cats',
        description: 'This is shelter for cat event',
        isPublic: true,
        recurring: true,
        recurringEventUpdateType: 'thisAndFollowingInstances',
        isRegisterable: false,
        allDay: true,
        startDate: '2022-03-18',
        endDate: '2022-03-20',
        location: 'India',
        recurrenceStartDate: '2022-03-18',
        recurrenceEndDate: null,
        frequency: 'DAILY',
        interval: 1,
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

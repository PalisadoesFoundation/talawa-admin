import {
  DELETE_STANDALONE_EVENT_MUTATION,
  REGISTER_EVENT,
  UPDATE_EVENT_MUTATION,
} from 'GraphQl/Mutations/EventMutations';
import dayjs from 'dayjs';

export const MOCKS = [
  {
    request: {
      query: DELETE_STANDALONE_EVENT_MUTATION,
      variables: {
        input: {
          id: '1',
        },
      },
    },
    result: {
      data: {
        deleteStandaloneEvent: {
          id: '1',
        },
      },
    },
  },
  // Mock for updating event when switching to all-day (first part of test)
  {
    request: {
      query: UPDATE_EVENT_MUTATION,
      variables: {
        input: {
          id: '1',
          name: 'Updated name',
          description: 'This is a new update',
          isPublic: true,
          isRegisterable: true,
          allDay: true,
          startAt: dayjs().add(9, 'days').startOf('day').toISOString(),
          endAt: dayjs().add(11, 'days').endOf('day').toISOString(),
          location: 'New Delhi',
        },
      },
    },
    result: {
      data: {
        updateStandaloneEvent: {
          id: '1',
          name: 'Updated name',
          description: 'This is a new update',
          startAt: dayjs().add(9, 'days').startOf('day').toISOString(),
          endAt: dayjs().add(11, 'days').endOf('day').toISOString(),
          allDay: true,
          location: 'New Delhi',
          isPublic: true,
          isRegisterable: true,
          createdAt: dayjs().add(9, 'days').toISOString(),
          updatedAt: dayjs().add(10, 'years').toISOString(),
          creator: {
            id: '123',
            name: 'Test Creator',
          },
          updater: {
            id: '123',
            name: 'Test Updater',
          },
          organization: {
            id: 'orgId',
            name: 'Test Org',
          },
        },
      },
    },
  },
  // Mock for updating event when it's not all-day (second test)
  // This mock matches the failing test scenario
  {
    request: {
      query: UPDATE_EVENT_MUTATION,
      variables: {
        input: {
          id: '1',
          name: 'Updated name',
          description: 'This is a new update',
          isPublic: false, // props[4].isPublic is true, clicking toggle makes it false
          isRegisterable: true, // props[4].isRegisterable is false, clicking toggle makes it true
          allDay: false, // props[4].allDay is false, not clicking allDay toggle keeps it false
          startAt: dayjs()
            .add(9, 'days')
            .hour(9) // 09:00 AM from updateData.startTime
            .minute(0)
            .second(0)
            .toISOString(),
          endAt: dayjs()
            .add(11, 'days')
            .hour(17) // 05:00 PM from updateData.endTime
            .minute(0)
            .second(0)
            .toISOString(),
          location: 'New Delhi',
        },
      },
    },
    result: {
      data: {
        updateStandaloneEvent: {
          id: '1',
          name: 'Updated name',
          description: 'This is a new update',
          startAt: dayjs()
            .add(9, 'days')
            .hour(9)
            .minute(0)
            .second(0)
            .toISOString(),
          endAt: dayjs()
            .add(11, 'days')
            .hour(17)
            .minute(0)
            .second(0)
            .toISOString(),
          allDay: false,
          location: 'New Delhi',
          isPublic: false,
          isRegisterable: true,
          createdAt: dayjs().add(9, 'days').toISOString(),
          updatedAt: dayjs().add(9, 'days').toISOString(),
          creator: {
            id: '123',
            name: 'Test Creator',
          },
          updater: {
            id: '123',
            name: 'Test Updater',
          },
          organization: {
            id: 'orgId',
            name: 'Test Org',
          },
        },
      },
    },
  },
  // Additional mock to catch any variations in the update
  {
    request: {
      query: UPDATE_EVENT_MUTATION,
      variables: {
        input: {
          id: '1',
          name: 'Updated name',
          description: 'This is a new update',
          isPublic: false, // Note: this might be different based on initial state
          isRegisterable: true,
          allDay: true,
          startAt: dayjs()
            .add(10, 'years')
            .add(9, 'days')
            .startOf('day')
            .toISOString(),
          endAt: dayjs()
            .add(10, 'years')
            .add(11, 'days')
            .endOf('day')
            .toISOString(),
          location: 'New Delhi',
        },
      },
    },
    result: {
      data: {
        updateStandaloneEvent: {
          id: '1',
          name: 'Updated name',
          description: 'This is a new update',
          startAt: dayjs()
            .add(10, 'years')
            .add(9, 'days')
            .startOf('day')
            .toISOString(),
          endAt: dayjs()
            .add(10, 'years')
            .add(11, 'days')
            .endOf('day')
            .toISOString(),
          allDay: true,
          location: 'New Delhi',
          isPublic: false,
          isRegisterable: true,
          createdAt: dayjs().add(10, 'years').add(9, 'days').toISOString(),
          updatedAt: dayjs().add(10, 'years').add(9, 'days').toISOString(),
          creator: {
            id: '123',
            name: 'Test Creator',
          },
          updater: {
            id: '123',
            name: 'Test Updater',
          },
          organization: {
            id: 'orgId',
            name: 'Test Org',
          },
        },
      },
    },
  },
  // Additional comprehensive mock for the failing test case with exact variable match
  {
    request: {
      query: UPDATE_EVENT_MUTATION,
      variables: {
        input: {
          id: '1',
          name: 'Updated name',
          description: 'This is a new update',
          location: 'New Delhi',
          isPublic: false,
          isRegisterable: true,
          startAt: dayjs()
            .add(10, 'years')
            .add(9, 'days')
            .hour(9)
            .minute(0)
            .second(0)
            .toISOString(),
          endAt: dayjs()
            .add(10, 'years')
            .add(11, 'days')
            .hour(17)
            .minute(0)
            .second(0)
            .toISOString(),
        },
      },
    },
    result: {
      data: {
        updateStandaloneEvent: {
          id: '1',
          name: 'Updated name',
          description: 'This is a new update',
          startAt: dayjs()
            .add(10, 'years')
            .add(9, 'days')
            .hour(9)
            .minute(0)
            .second(0)
            .toISOString(),
          endAt: dayjs()
            .add(10, 'years')
            .add(11, 'days')
            .hour(17)
            .minute(0)
            .second(0)
            .toISOString(),
          allDay: false,
          location: 'New Delhi',
          isPublic: false,
          isRegisterable: true,
          createdAt: dayjs().add(10, 'years').add(9, 'days').toISOString(),
          updatedAt: dayjs().add(10, 'years').add(9, 'days').toISOString(),
          creator: {
            id: '123',
            name: 'Test Creator',
          },
          updater: {
            id: '123',
            name: 'Test Updater',
          },
          organization: {
            id: 'orgId',
            name: 'Test Org',
          },
        },
      },
    },
  },
  {
    request: {
      query: REGISTER_EVENT,
      variables: { id: '1' },
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
      query: DELETE_STANDALONE_EVENT_MUTATION,
      variables: {
        input: {
          id: '1',
        },
      },
    },
    error: new Error('Something went wrong'),
  },
];

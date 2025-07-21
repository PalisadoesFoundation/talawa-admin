import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';

export const MOCKS = [
  {
    request: {
      query: CREATE_EVENT_MUTATION,
      variables: {
        input: {
          name: 'Dummy Org',
          location: 'New Delhi',
          description: 'This is a dummy organization',
          isPublic: false,
          isRegisterable: true,
          organizationId: '',
          startAt: '2022-03-28T00:00:00.000Z',
          endAt: '2022-03-30T23:59:59.999Z',
          allDay: true,
        },
      },
    },
    result: {
      data: {
        createEvent: {
          id: '1',
          name: 'Dummy Org',
          description: 'This is a dummy organization',
          startAt: '2022-03-28T00:00:00.000Z',
          endAt: '2022-03-30T23:59:59.999Z',
          allDay: true,
          location: 'New Delhi',
          isPublic: false,
          isRegisterable: true,
          createdAt: '2022-03-28T00:00:00.000Z',
          updatedAt: '2022-03-28T00:00:00.000Z',
          isRecurringTemplate: false,
          recurringEventId: null,
          instanceStartTime: null,
          isMaterialized: false,
          baseEventId: null,
          hasExceptions: false,
          sequenceNumber: 1,
          totalCount: 1,
          progressLabel: 'Event 1 of 1',
          creator: {
            id: '1',
            name: 'Admin User',
          },
          updater: {
            id: '1',
            name: 'Admin User',
          },
          organization: {
            id: '1',
            name: 'Test Organization',
          },
        },
      },
    },
  },
  {
    request: {
      query: CREATE_EVENT_MUTATION,
      variables: {
        input: {
          name: 'Dummy Org',
          location: 'New Delhi',
          description: 'This is a dummy organization',
          isPublic: true,
          isRegisterable: false,
          organizationId: '',
          startAt: '2022-03-28T03:30:00.540Z',
          endAt: '2022-03-30T11:30:00.540Z',
          allDay: false,
        },
      },
    },
    result: {
      data: {
        createEvent: {
          id: '2',
          name: 'Dummy Org',
          description: 'This is a dummy organization',
          startAt: '2022-03-28T03:30:00.540Z',
          endAt: '2022-03-30T11:30:00.540Z',
          allDay: false,
          location: 'New Delhi',
          isPublic: true,
          isRegisterable: false,
          createdAt: '2022-03-28T00:00:00.000Z',
          updatedAt: '2022-03-28T00:00:00.000Z',
          isRecurringTemplate: false,
          recurringEventId: null,
          instanceStartTime: null,
          isMaterialized: false,
          baseEventId: null,
          hasExceptions: false,
          sequenceNumber: 1,
          totalCount: 1,
          progressLabel: 'Event 1 of 1',
          creator: {
            id: '1',
            name: 'Admin User',
          },
          updater: {
            id: '1',
            name: 'Admin User',
          },
          organization: {
            id: '1',
            name: 'Test Organization',
          },
        },
      },
    },
  },
  // Additional mock for successful event creation test
  {
    request: {
      query: CREATE_EVENT_MUTATION,
      variables: {
        input: {
          name: 'Dummy Org',
          location: 'New Delhi',
          description: 'This is a dummy organization',
          isPublic: true,
          isRegisterable: false,
          organizationId: '',
          startAt: '2022-03-28T00:00:00.000Z',
          endAt: '2022-03-30T23:59:59.999Z',
          allDay: true,
        },
      },
    },
    result: {
      data: {
        createEvent: {
          id: '3',
          name: 'Dummy Org',
          description: 'This is a dummy organization',
          startAt: '2022-03-28T00:00:00.000Z',
          endAt: '2022-03-30T23:59:59.999Z',
          allDay: true,
          location: 'New Delhi',
          isPublic: true,
          isRegisterable: false,
          createdAt: '2022-03-28T00:00:00.000Z',
          updatedAt: '2022-03-28T00:00:00.000Z',
          isRecurringTemplate: false,
          recurringEventId: null,
          instanceStartTime: null,
          isMaterialized: false,
          baseEventId: null,
          hasExceptions: false,
          sequenceNumber: 1,
          totalCount: 1,
          progressLabel: 'Event 1 of 1',
          creator: {
            id: '1',
            name: 'Admin User',
          },
          updater: {
            id: '1',
            name: 'Admin User',
          },
          organization: {
            id: '1',
            name: 'Test Organization',
          },
        },
      },
    },
  },
];

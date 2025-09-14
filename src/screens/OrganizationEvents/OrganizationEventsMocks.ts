import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
import {
  GET_ORGANIZATION_EVENTS_PG,
  GET_ORGANIZATION_DATA_PG,
} from 'GraphQl/Queries/Queries';

export const MOCKS = [
  // Mock for GET_ORGANIZATION_EVENTS_PG with events having different data scenarios
  {
    request: {
      query: GET_ORGANIZATION_EVENTS_PG,
    },
    result: {
      data: {
        organization: {
          events: {
            edges: [
              // Event with null description and location (to test fallback to empty string)
              {
                node: {
                  id: '1',
                  name: 'Event with null description',
                  description: null,
                  startAt: '2030-03-28T09:00:00.000Z',
                  endAt: '2030-03-28T17:00:00.000Z',
                  allDay: false,
                  location: null,
                  isPublic: true,
                  isRegisterable: true,
                  isMaterialized: false,
                  isRecurringTemplate: false,
                  recurringEventId: null,
                  instanceStartTime: null,
                  baseEventId: null,
                  sequenceNumber: null,
                  totalCount: null,
                  hasExceptions: false,
                  progressLabel: null,
                  attachments: [],
                  creator: {
                    id: '1',
                    name: 'Creator User',
                  },
                  organization: {
                    id: '1',
                    name: 'Test Organization',
                  },
                  createdAt: '2030-03-28T00:00:00.000Z',
                  updatedAt: '2030-03-28T00:00:00.000Z',
                },
                cursor: 'cursor1',
              },
              // All-day event (to test startTime/endTime being undefined)
              {
                node: {
                  id: '2',
                  name: 'All Day Event',
                  description: 'This is an all day event',
                  startAt: '2030-03-29T00:00:00.000Z',
                  endAt: '2030-03-29T23:59:59.999Z',
                  allDay: true,
                  location: 'Conference Room A',
                  isPublic: false,
                  isRegisterable: false,
                  isMaterialized: false,
                  isRecurringTemplate: false,
                  recurringEventId: null,
                  instanceStartTime: null,
                  baseEventId: null,
                  sequenceNumber: null,
                  totalCount: null,
                  hasExceptions: false,
                  progressLabel: null,
                  attachments: [],
                  creator: {
                    id: '2',
                    name: 'Another Creator',
                  },
                  organization: {
                    id: '1',
                    name: 'Test Organization',
                  },
                  createdAt: '2030-03-29T00:00:00.000Z',
                  updatedAt: '2030-03-29T00:00:00.000Z',
                },
                cursor: 'cursor2',
              },
              // Timed event (to test startTime/endTime being set)
              {
                node: {
                  id: '3',
                  name: 'Timed Event',
                  description: 'This is a timed event',
                  startAt: '2030-03-30T14:30:00.000Z',
                  endAt: '2030-03-30T16:30:00.000Z',
                  allDay: false,
                  location: 'Meeting Room B',
                  isPublic: true,
                  isRegisterable: true,
                  isMaterialized: false,
                  isRecurringTemplate: false,
                  recurringEventId: null,
                  instanceStartTime: null,
                  baseEventId: null,
                  sequenceNumber: null,
                  totalCount: null,
                  hasExceptions: false,
                  progressLabel: null,
                  attachments: [],
                  creator: {
                    id: '3',
                    name: 'Third Creator',
                  },
                  organization: {
                    id: '1',
                    name: 'Test Organization',
                  },
                  createdAt: '2030-03-30T00:00:00.000Z',
                  updatedAt: '2030-03-30T00:00:00.000Z',
                },
                cursor: 'cursor3',
              },
            ],
          },
        },
      },
    },
  },
  // Mock for GET_ORGANIZATION_DATA_PG
  {
    request: {
      query: GET_ORGANIZATION_DATA_PG,
    },
    result: {
      data: {
        organization: {
          id: '1',
          name: 'Test Organization',
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
          isPublic: false,
          isRegisterable: true,
          organizationId: '',
          startAt: '2030-03-28T00:00:00.000Z',
          endAt: '2030-03-30T23:59:59.999Z',
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
          startAt: '2030-03-28T00:00:00.000Z',
          endAt: '2030-03-30T23:59:59.999Z',
          allDay: true,
          location: 'New Delhi',
          isPublic: false,
          isRegisterable: true,
          createdAt: '2030-03-28T00:00:00.000Z',
          updatedAt: '2030-03-28T00:00:00.000Z',
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
          startAt: '2030-03-28T03:30:00.540Z',
          endAt: '2030-03-30T11:30:00.540Z',
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
          startAt: '2030-03-28T03:30:00.540Z',
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

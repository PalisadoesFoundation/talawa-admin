import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
import {
  GET_ORGANIZATION_EVENTS_PG,
  GET_ORGANIZATION_DATA_PG,
} from 'GraphQl/Queries/Queries';
import { expect } from 'vitest';

export const MOCKS = [
  // Mock for GET_ORGANIZATION_EVENTS_PG with events having different data scenarios
  {
    request: {
      query: GET_ORGANIZATION_EVENTS_PG,
      variables: expect.any(Object),
    },
    result: {
      data: {
        organization: {
          events: {
            edges: [
              {
                cursor: 'cursor1',
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
                  isRecurringEventTemplate: false,
                  baseEvent: null,
                  sequenceNumber: null,
                  totalCount: null,
                  hasExceptions: false,
                  progressLabel: null,
                  recurrenceDescription: null,
                  recurrenceRule: null,
                  attachments: [],
                  creator: { id: '1', name: 'Creator User' },
                  organization: { id: '1', name: 'Test Organization' },
                  createdAt: '2030-03-28T00:00:00.000Z',
                  updatedAt: '2030-03-28T00:00:00.000Z',
                },
              },
              {
                cursor: 'cursor2',
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
                  isRecurringEventTemplate: false,
                  baseEvent: null,
                  sequenceNumber: null,
                  totalCount: null,
                  hasExceptions: false,
                  progressLabel: null,
                  recurrenceDescription: null,
                  recurrenceRule: null,
                  attachments: [],
                  creator: { id: '2', name: 'Another Creator' },
                  organization: { id: '1', name: 'Test Organization' },
                  createdAt: '2030-03-29T00:00:00.000Z',
                  updatedAt: '2030-03-29T00:00:00.000Z',
                },
              },
              {
                cursor: 'cursor3',
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
                  isRecurringEventTemplate: false,
                  baseEvent: null,
                  sequenceNumber: null,
                  totalCount: null,
                  hasExceptions: false,
                  progressLabel: null,
                  recurrenceDescription: null,
                  recurrenceRule: null,
                  attachments: [],
                  creator: { id: '3', name: 'Third Creator' },
                  organization: { id: '1', name: 'Test Organization' },
                  createdAt: '2030-03-30T00:00:00.000Z',
                  updatedAt: '2030-03-30T00:00:00.000Z',
                },
              },
            ],
          },
        },
      },
    },
  },

  // GET_ORGANIZATION_DATA_PG success (component expects org data)
  {
    request: {
      query: GET_ORGANIZATION_DATA_PG,
      variables: expect.any(Object),
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
      variables: expect.any(Object),
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
          creator: { id: '1', name: 'Admin User' },
          updater: { id: '1', name: 'Admin User' },
          organization: { id: '1', name: 'Test Organization' },
        },
      },
    },
  },
];

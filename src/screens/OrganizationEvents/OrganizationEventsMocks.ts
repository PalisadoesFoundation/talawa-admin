import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
import { ORGANIZATION_EVENT_CONNECTION_LIST } from 'GraphQl/Queries/Queries';

export const MOCKS = [
  {
    request: {
      query: ORGANIZATION_EVENT_CONNECTION_LIST,
      variables: {
        organization_id: undefined,
        title_contains: '',
        description_contains: '',
        location_contains: '',
      },
    },
    result: {
      data: {
        eventsByOrganizationConnection: [
          {
            _id: 1,
            title: 'Event',
            description: 'Event Test',
            startDate: '',
            endDate: '',
            location: 'New Delhi',
            startTime: '02:00',
            endTime: '06:00',
            allDay: false,
            recurring: false,
            recurrenceRule: null,
            isRecurringEventException: false,
            isPublic: true,
            isRegisterable: true,
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_EVENT_CONNECTION_LIST,
      variables: {
        title_contains: '',
        description_contains: '',
        organization_id: undefined,
        location_contains: '',
      },
    },
    result: {
      data: {
        eventsByOrganizationConnection: [
          {
            _id: '1',
            title: 'Dummy Org',
            description: 'This is a dummy organization',
            location: 'string',
            startDate: '',
            endDate: '',
            startTime: '02:00',
            endTime: '06:00',
            allDay: false,
            recurring: false,
            recurrenceRule: null,
            isRecurringEventException: false,
            isPublic: true,
            isRegisterable: true,
          },
        ],
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
          organizationId: undefined,
          startAt: '2022-03-27T18:30:00.000Z',
          endAt: '2022-03-30T18:29:59.999Z',
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
          startAt: '2022-03-27T18:30:00.000Z',
          endAt: '2022-03-30T18:29:59.999Z',
          allDay: true,
          location: 'New Delhi',
          isPublic: false,
          isRegisterable: true,
          organization: {
            id: '1',
          },
          creator: {
            id: '1',
            name: 'Admin User',
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
          organizationId: undefined,
          startAt: '2022-03-28T03:30:00.540Z',
          endAt: '2022-03-30T11:30:00.540Z',
          allDay: false,
        },
      },
    },
    result: {
      data: {
        createEvent: {
          id: '1',
          name: 'Dummy Org',
          description: 'This is a dummy organization',
          startAt: '2022-03-28T03:30:00.540Z',
          endAt: '2022-03-30T11:30:00.540Z',
          allDay: false,
          location: 'New Delhi',
          isPublic: true,
          isRegisterable: false,
          organization: {
            id: '1',
          },
          creator: {
            id: '1',
            name: 'Admin User',
          },
        },
      },
    },
  },
  /* Removed unused recurring event mocks */
];

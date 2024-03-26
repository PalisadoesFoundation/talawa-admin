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
        title: 'Dummy Org',
        location: 'New Delhi',
        description: 'This is a dummy organization',
        isPublic: false,
        recurring: false,
        isRegisterable: true,
        organizationId: undefined,
        startDate: '2022-03-28',
        endDate: '2023-04-15',
        allDay: true,
      },
    },
    result: {
      data: {
        createEvent: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_EVENT_MUTATION,
      variables: {
        title: 'Dummy Org',
        location: 'New Delhi',
        description: 'This is a dummy organization',
        isPublic: true,
        recurring: false,
        isRegisterable: false,
        organizationId: undefined,
        startDate: '2022-03-28',
        endDate: '2023-04-15',
        allDay: false,
        startTime: '09:00:00Z',
        endTime: '17:00:00Z',
      },
    },
    result: {
      data: {
        createEvent: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_EVENT_MUTATION,
      variables: {
        title: 'Dummy Org',
        location: 'New Delhi',
        description: 'This is a dummy organization',
        isPublic: true,
        recurring: true,
        isRegisterable: false,
        organizationId: undefined,
        startDate: '2022-03-28',
        endDate: '2023-04-15',
        allDay: false,
        startTime: '09:00:00Z',
        endTime: '17:00:00Z',
        frequency: 'DAILY',
        interval: 1,
      },
    },
    result: {
      data: {
        createEvent: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_EVENT_MUTATION,
      variables: {
        title: 'Dummy Org',
        location: 'New Delhi',
        description: 'This is a dummy organization',
        isPublic: true,
        recurring: true,
        isRegisterable: false,
        organizationId: undefined,
        startDate: '2022-03-28',
        endDate: '2023-04-15',
        allDay: false,
        startTime: '09:00:00Z',
        endTime: '17:00:00Z',
        frequency: 'WEEKLY',
        interval: 1,
        weekDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
      },
    },
    result: {
      data: {
        createEvent: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_EVENT_MUTATION,
      variables: {
        title: 'Dummy Org',
        location: 'New Delhi',
        description: 'This is a dummy organization',
        isPublic: true,
        recurring: true,
        isRegisterable: false,
        organizationId: undefined,
        startDate: '2022-03-28',
        endDate: '2023-04-15',
        allDay: true,
        interval: 1,
        frequency: 'MONTHLY',
        weekDays: ['MONDAY'],
        weekDayOccurenceInMonth: 4,
      },
    },
    result: {
      data: {
        createEvent: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_EVENT_MUTATION,
      variables: {
        title: 'Dummy Org',
        location: 'New Delhi',
        description: 'This is a dummy organization',
        isPublic: true,
        recurring: true,
        isRegisterable: false,
        organizationId: undefined,
        startDate: '2022-03-28',
        allDay: true,
        frequency: 'DAILY',
        interval: 1,
        count: 100,
      },
    },
    result: {
      data: {
        createEvent: {
          _id: '1',
        },
      },
    },
  },
];

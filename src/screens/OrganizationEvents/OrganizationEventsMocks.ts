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
];

import { CREATE_EVENT_MUTATION } from 'GraphQl/Mutations/mutations';
import { GET_EVENTS_BY_ORGANIZATION_PG } from 'GraphQl/Queries/Queries';

export const MOCKS = [
  {
    request: {
      query: GET_EVENTS_BY_ORGANIZATION_PG,
      variables: {
        orgId: undefined,
        first: 32,
      },
    },
    result: {
      data: {
        organization: {
          events: {
            edges: [
              {
                node: {
                  id: '1',
                  name: 'Event',
                  description: 'Event Test',
                  startAt: '2023-01-01T02:00:00Z',
                  endAt: '2023-01-01T06:00:00Z',
                  createdAt: '2023-01-01T00:00:00Z',
                  updatedAt: '2023-01-01T00:00:00Z',
                  creator: {
                    id: '1',
                    name: 'User Name',
                  },
                  updater: null,
                  venues: {
                    edges: [
                      {
                        node: {
                          id: '1',
                          name: 'New Delhi',
                        },
                      },
                    ],
                  },
                  attachments: [],
                  organization: {
                    id: '1',
                    name: 'Test Organization',
                  },
                },
                cursor: 'cursor1',
              },
            ],
            pageInfo: {
              hasNextPage: false,
              endCursor: 'cursor1',
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: GET_EVENTS_BY_ORGANIZATION_PG,
      variables: {
        orgId: undefined,
        first: 32,
      },
    },
    result: {
      data: {
        organization: {
          events: {
            edges: [
              {
                node: {
                  id: '1',
                  name: 'Dummy Org',
                  description: 'This is a dummy organization',
                  startAt: '2023-01-01T02:00:00Z',
                  endAt: '2023-01-01T06:00:00Z',
                  createdAt: '2023-01-01T00:00:00Z',
                  updatedAt: '2023-01-01T00:00:00Z',
                  creator: {
                    id: '1',
                    name: 'User Name',
                  },
                  updater: null,
                  venues: {
                    edges: [
                      {
                        node: {
                          id: '1',
                          name: 'New Delhi',
                        },
                      },
                    ],
                  },
                  attachments: [],
                  organization: {
                    id: '1',
                    name: 'Test Organization',
                  },
                },
                cursor: 'cursor1',
              },
            ],
            pageInfo: {
              hasNextPage: false,
              endCursor: 'cursor1',
            },
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
          description: 'This is a dummy organization',
          startAt: '2022-03-28T00:00:00Z',
          endAt: '2022-03-30T23:59:59Z',
          organizationId: undefined,
        },
      },
    },
    result: {
      data: {
        createEvent: {
          id: '1',
          name: 'Dummy Org',
          description: 'This is a dummy organization',
          startAt: '2022-03-28T00:00:00Z',
          endAt: '2022-03-30T23:59:59Z',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          creator: {
            id: '1',
            name: 'User Name',
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
          description: 'This is a dummy organization',
          startAt: '2022-03-28T09:00:00Z',
          endAt: '2022-03-30T17:00:00Z',
          organizationId: undefined,
        },
      },
    },
    result: {
      data: {
        createEvent: {
          id: '1',
          name: 'Dummy Org',
          description: 'This is a dummy organization',
          startAt: '2022-03-28T09:00:00Z',
          endAt: '2022-03-30T17:00:00Z',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          creator: {
            id: '1',
            name: 'User Name',
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
          description: 'This is a dummy organization',
          startAt: '2022-03-28T09:00:00Z',
          endAt: '2022-03-30T17:00:00Z',
          organizationId: undefined,
        },
      },
    },
    result: {
      data: {
        createEvent: {
          id: '1',
          name: 'Dummy Org',
          description: 'This is a dummy organization',
          startAt: '2022-03-28T09:00:00Z',
          endAt: '2022-03-30T17:00:00Z',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          creator: {
            id: '1',
            name: 'User Name',
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
          description: 'This is a dummy organization',
          startAt: '2022-03-28T09:00:00Z',
          endAt: '2022-03-30T17:00:00Z',
          organizationId: undefined,
        },
      },
    },
    result: {
      data: {
        createEvent: {
          id: '1',
          name: 'Dummy Org',
          description: 'This is a dummy organization',
          startAt: '2022-03-28T09:00:00Z',
          endAt: '2022-03-30T17:00:00Z',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          creator: {
            id: '1',
            name: 'User Name',
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
          description: 'This is a dummy organization',
          startAt: '2022-03-28T00:00:00Z',
          endAt: '2022-03-30T23:59:59Z',
          organizationId: undefined,
        },
      },
    },
    result: {
      data: {
        createEvent: {
          id: '1',
          name: 'Dummy Org',
          description: 'This is a dummy organization',
          startAt: '2022-03-28T00:00:00Z',
          endAt: '2022-03-30T23:59:59Z',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          creator: {
            id: '1',
            name: 'User Name',
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
          description: 'This is a dummy organization',
          startAt: '2022-03-28T00:00:00Z',
          endAt: '2022-03-30T23:59:59Z',
          organizationId: undefined,
        },
      },
    },
    result: {
      data: {
        createEvent: {
          id: '1',
          name: 'Dummy Org',
          description: 'This is a dummy organization',
          startAt: '2022-03-28T00:00:00Z',
          endAt: '2022-03-30T23:59:59Z',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          creator: {
            id: '1',
            name: 'User Name',
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

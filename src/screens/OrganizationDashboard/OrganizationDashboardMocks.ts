import {
  GET_ORGANIZATION_MEMBERS_PG,
  GET_ORGANIZATION_POSTS_COUNT_PG,
  GET_ORGANIZATION_EVENTS_PG,
  GET_ORGANIZATION_POSTS_PG,
  GET_ORGANIZATION_BLOCKED_USERS_PG,
  GET_ORGANIZATION_VENUES_PG,
  MEMBERSHIP_REQUEST,
} from 'GraphQl/Queries/Queries';

export const MOCKS = [
  // Members Query
  {
    request: {
      query: GET_ORGANIZATION_MEMBERS_PG,
      variables: { id: 'orgId', first: 32, after: null },
    },
    result: {
      data: {
        organization: {
          members: {
            edges: [
              {
                node: {
                  id: '1',
                  role: 'administrator',
                  name: 'Admin User',
                  emailAddress: 'admin@example.com',
                },
                cursor: 'cursor1',
              },
              {
                node: {
                  id: '2',
                  role: 'member',
                  name: 'Member User',
                  emailAddress: 'member@example.com',
                },
                cursor: 'cursor2',
              },
            ],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      },
    },
  },

  // Posts Count Query
  {
    request: {
      query: GET_ORGANIZATION_POSTS_COUNT_PG,
      variables: { id: 'orgId' },
    },
    result: {
      data: {
        organization: {
          id: 'orgId',
          postsCount: 10,
        },
      },
    },
  },

  // Events Query
  {
    request: {
      query: GET_ORGANIZATION_EVENTS_PG,
      variables: { id: 'orgId', first: 50, after: null },
    },
    result: {
      data: {
        organization: {
          events: {
            edges: [
              {
                node: {
                  id: 'event1',
                  name: 'Event One',
                  description: 'Description for Event One',
                  startAt: '2025-10-29T00:00:00.000Z',
                  endAt: '2025-10-30T00:00:00.000Z',
                  allDay: false,
                  location: 'Test Location',
                  isPublic: true,
                  isRegisterable: true,
                  isRecurringEventTemplate: false,
                  baseEvent: null,
                  sequenceNumber: null,
                  totalCount: 1,
                  hasExceptions: false,
                  progressLabel: null,
                  recurrenceDescription: null,
                  recurrenceRule: null,
                  attachments: [],
                  creator: {
                    id: 'creator1',
                    name: 'John Doe',
                  },
                  organization: {
                    id: 'orgId',
                    name: 'Test Organization',
                  },
                  createdAt: '2025-10-28T00:00:00.000Z',
                  updatedAt: '2025-10-28T00:00:00.000Z',
                },
                cursor: 'event_cursor1',
              },
            ],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      },
    },
  },

  // Posts Query
  {
    request: {
      query: GET_ORGANIZATION_POSTS_PG,
      variables: { id: 'orgId', first: 5 },
    },
    result: {
      data: {
        organization: {
          posts: {
            edges: [
              {
                node: {
                  id: 'post1',
                  caption: 'Test post caption',
                  createdAt: '2025-10-28T00:00:00.000Z',
                  creator: {
                    id: 'creator1',
                    name: 'John Doe',
                  },
                },
              },
            ],
          },
        },
      },
    },
  },

  // Blocked Users Query
  {
    request: {
      query: GET_ORGANIZATION_BLOCKED_USERS_PG,
      variables: { id: 'orgId', first: 32, after: null },
    },
    result: {
      data: {
        organization: {
          blockedUsers: {
            edges: [
              {
                node: {
                  id: 'blocked1',
                  name: 'Blocked User 1',
                  emailAddress: 'blocked1@example.com',
                  role: 'member',
                },
                cursor: 'blocked_cursor1',
              },
              {
                node: {
                  id: 'blocked2',
                  name: 'Blocked User 2',
                  emailAddress: 'blocked2@example.com',
                  role: 'member',
                },
                cursor: 'blocked_cursor2',
              },
            ],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      },
    },
  },

  // Venues Query
  {
    request: {
      query: GET_ORGANIZATION_VENUES_PG,
      variables: { id: 'orgId', first: 32, after: null },
    },
    result: {
      data: {
        organization: {
          venues: {
            edges: [
              {
                node: {
                  id: 'venue1',
                  name: 'Test Venue',
                  capacity: 100,
                  description: 'A test venue',
                  attachments: [],
                },
                cursor: 'venue_cursor1',
              },
            ],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      },
    },
  },

  // Membership Requests Query
  {
    request: {
      query: MEMBERSHIP_REQUEST,
      variables: {
        input: { id: 'orgId' },
        skip: 0,
        first: 8,
        name_contains: '',
      },
    },
    result: {
      data: {
        organization: {
          id: 'orgId',
          membershipRequests: [
            {
              membershipRequestId: 'request1',
              createdAt: '2023-01-01T00:00:00Z',
              status: 'pending',
              user: {
                id: 'user1',
                name: 'Pending User 1',
                emailAddress: 'user1@example.com',
              },
            },
            {
              membershipRequestId: 'request2',
              createdAt: '2023-01-02T00:00:00Z',
              status: 'pending',
              user: {
                id: 'user2',
                name: 'Pending User 2',
                emailAddress: 'user2@example.com',
              },
            },
          ],
        },
      },
    },
  },
];

export const EMPTY_MOCKS = [
  {
    request: {
      query: GET_ORGANIZATION_MEMBERS_PG,
      variables: { id: 'orgId', first: 32, after: null },
    },
    result: {
      data: {
        organization: {
          members: {
            edges: [],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      },
    },
  },
  {
    request: {
      query: GET_ORGANIZATION_POSTS_COUNT_PG,
      variables: { id: 'orgId' },
    },
    result: {
      data: {
        organization: { id: 'orgId', postsCount: 0 },
      },
    },
  },
  {
    request: {
      query: GET_ORGANIZATION_EVENTS_PG,
      variables: { id: 'orgId', first: 50, after: null },
    },
    result: {
      data: {
        organization: {
          events: {
            edges: [],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      },
    },
  },
  {
    request: {
      query: GET_ORGANIZATION_POSTS_PG,
      variables: { id: 'orgId', first: 5 },
    },
    result: {
      data: {
        organization: {
          posts: { edges: [] },
        },
      },
    },
  },
  {
    request: {
      query: GET_ORGANIZATION_BLOCKED_USERS_PG,
      variables: { id: 'orgId', first: 32, after: null },
    },
    result: {
      data: {
        organization: {
          blockedUsers: {
            edges: [],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      },
    },
  },
  {
    request: {
      query: GET_ORGANIZATION_VENUES_PG,
      variables: { id: 'orgId', first: 32, after: null },
    },
    result: {
      data: {
        organization: {
          venues: {
            edges: [],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      },
    },
  },
  {
    request: {
      query: MEMBERSHIP_REQUEST,
      variables: {
        input: { id: 'orgId' },
        skip: 0,
        first: 8,
        name_contains: '',
      },
    },
    result: {
      data: {
        organization: {
          id: 'orgId',
          membershipRequests: [],
        },
      },
    },
  },
];

export const MIXED_REQUESTS_MOCK = [
  {
    request: {
      query: MEMBERSHIP_REQUEST,
      variables: {
        input: { id: 'orgId' },
        skip: 0,
        first: 8,
        name_contains: '',
      },
    },
    result: {
      data: {
        organization: {
          id: 'orgId',
          membershipRequests: [
            {
              membershipRequestId: 'request1',
              createdAt: '2023-01-01T00:00:00Z',
              status: 'pending',
              user: {
                id: 'user1',
                name: 'Pending User 1',
                emailAddress: 'user1@example.com',
              },
            },
            {
              membershipRequestId: 'request2',
              createdAt: '2023-01-02T00:00:00Z',
              status: 'pending',
              user: {
                id: 'user2',
                name: 'Pending User 2',
                emailAddress: 'user2@example.com',
              },
            },
            {
              membershipRequestId: 'request3',
              createdAt: '2023-01-03T00:00:00Z',
              status: 'pending',
              user: {
                id: 'user3',
                name: 'Pending User 3',
                emailAddress: 'user3@example.com',
              },
            },
            {
              membershipRequestId: 'request4',
              createdAt: '2023-01-04T00:00:00Z',
              status: 'rejected',
              user: {
                id: 'user4',
                name: 'Rejected User',
                emailAddress: 'rejected@example.com',
              },
            },
          ],
        },
      },
    },
  },
  ...MOCKS.filter((mock) => mock.request.query !== MEMBERSHIP_REQUEST),
];

export const ERROR_MOCKS = [
  {
    request: {
      query: GET_ORGANIZATION_MEMBERS_PG,
      variables: { id: 'orgId', first: 32, after: null },
    },
    error: new Error('Mock GraphQL GET_ORGANIZATION_MEMBERS_PG Error'),
  },
  {
    request: {
      query: GET_ORGANIZATION_POSTS_COUNT_PG,
      variables: { id: 'orgId' },
    },
    error: new Error('Mock GraphQL GET_ORGANIZATION_POSTS_COUNT_PG Error'),
  },
  {
    request: {
      query: GET_ORGANIZATION_EVENTS_PG,
      variables: { id: 'orgId', first: 50, after: null },
    },
    error: new Error('Mock GraphQL GET_ORGANIZATION_EVENTS_PG Error'),
  },
  {
    request: {
      query: GET_ORGANIZATION_POSTS_PG,
      variables: { id: 'orgId', first: 5 },
    },
    error: new Error('Mock GraphQL GET_ORGANIZATION_POSTS_PG Error'),
  },
  {
    request: {
      query: GET_ORGANIZATION_BLOCKED_USERS_PG,
      variables: { id: 'orgId', first: 32, after: null },
    },
    error: new Error('Mock GraphQL GET_ORGANIZATION_BLOCKED_USERS_PG Error'),
  },
  {
    request: {
      query: GET_ORGANIZATION_VENUES_PG,
      variables: { id: 'orgId', first: 32, after: null },
    },
    error: new Error('Mock GraphQL GET_ORGANIZATION_VENUES_PG Error'),
  },
  {
    request: {
      query: MEMBERSHIP_REQUEST,
      variables: {
        input: { id: 'orgId' },
        skip: 0,
        first: 8,
        name_contains: '',
      },
    },
    error: new Error('Mock GraphQL MEMBERSHIP_REQUEST Error'),
  },
];

import {
  GET_ORGANIZATION_POSTS_COUNT_PG,
  GET_ORGANIZATION_EVENTS_PG,
  GET_ORGANIZATION_POSTS_PG,
  MEMBERSHIP_REQUEST,
  ORGANIZATION_MEMBER_ADMIN_COUNT,
  GET_ORGANIZATION_BLOCKED_USERS_COUNT,
  GET_ORGANIZATION_VENUES_COUNT,
} from 'GraphQl/Queries/Queries';

export const MOCKS = [
  {
    request: {
      query: ORGANIZATION_MEMBER_ADMIN_COUNT,
      variables: { id: 'orgId' },
    },
    maxUsageCount: 2,
    result: {
      data: {
        organization: {
          id: '01960b81-bfed-7369-ae96-689dbd4281ba',
          membersCount: 2,
          adminsCount: 1,
        },
      },
      loading: false,
    },
  },

  // --- Organization Posts Count (Original) ---
  {
    request: {
      query: GET_ORGANIZATION_POSTS_COUNT_PG,
      variables: { id: 'orgId' },
    },
    result: {
      data: {
        organization: { id: 'orgId', postsCount: 10 },
      },
      loading: false,
    },
  },

  // --- Organization Events (Original) ---
  {
    request: {
      query: GET_ORGANIZATION_EVENTS_PG,
      variables: { id: 'orgId', first: 8, after: null },
    },
    result: {
      data: {
        organization: {
          eventsCount: 1,
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
                  isMaterialized: true,
                  isRecurringTemplate: false,
                  recurringEventId: null,
                  instanceStartTime: null,
                  baseEventId: null,
                  sequenceNumber: null,
                  totalCount: 1,
                  hasExceptions: false,
                  progressLabel: null,
                  attachments: [],
                  creator: { id: 'creator1', name: 'John Doe' },
                  organization: { id: 'orgId', name: 'Test Organization' },
                  createdAt: '2025-10-28T00:00:00.000Z',
                  updatedAt: '2025-10-28T00:00:00.000Z',
                },
                cursor: 'cursor1',
              },
            ],
            pageInfo: { hasNextPage: true, endCursor: 'cursor2' },
          },
        },
      },
      loading: false,
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
          posts: {
            edges: [
              {
                node: {
                  id: 'post1',
                  caption: 'First Post',
                  createdAt: '2025-01-01T12:00:00.000Z',
                  creator: { id: 'user1', name: 'John Doe' },
                },
                cursor: 'cursor1',
              },
            ],
          },
        },
      },
      loading: false,
    },
  },
  // Primary venues mock with attachments for comprehensive testing
  {
    request: {
      query: GET_ORGANIZATION_VENUES_COUNT,
      variables: { id: 'orgId' },
    },
    result: {
      data: {
        organization: {
          venuesCount: 10,
        },
      },
      loading: false,
    },
  },

  {
    request: {
      query: MEMBERSHIP_REQUEST,
      variables: {
        input: { id: 'orgId' },
        skip: 0,
        first: 8,
        firstName_contains: '',
      },
    },
    result: {
      data: {
        organization: {
          membershipRequestsCount: 1,
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
                avatarURL: 'https://example.com/avatar1.jpg',
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
                avatarURL: null,
              },
            },
          ],
        },
      },
    },
  },

  {
    request: {
      query: GET_ORGANIZATION_BLOCKED_USERS_COUNT,
      variables: { id: 'orgId' },
    },
    result: {
      data: {
        organization: {
          id: '01960b81-bfed-7369-ae96-689dbd4281ba',
          blockedUsersCount: 2,
        },
      },
      loading: false,
    },
  },

  //Organization Venues Count (Duplicate)
  {
    request: {
      query: GET_ORGANIZATION_VENUES_COUNT,
      variables: { id: 'orgId' },
    },
    result: {
      data: {
        organization: {
          venuesCount: 10,
        },
      },
      loading: false,
    },
  },

  //Organization Blocked Users Count (Duplicate)
  {
    request: {
      query: GET_ORGANIZATION_BLOCKED_USERS_COUNT,
      variables: { id: 'orgId' },
    },
    result: {
      data: {
        organization: {
          id: '01960b81-bfed-7369-ae96-689dbd4281ba',
          blockedUsersCount: 2,
        },
      },
      loading: false,
    },
  },

  // --- Organization Posts Count (Duplicate) ---
  {
    request: {
      query: GET_ORGANIZATION_POSTS_COUNT_PG,
      variables: { id: 'orgId' },
    },
    result: {
      data: {
        organization: { id: 'orgId', postsCount: 10 },
      },
      loading: false,
    },
  },
  // --- Organization membership request (Duplicate) ---
  {
    request: {
      query: MEMBERSHIP_REQUEST,
      variables: {
        input: { id: 'orgId' },
        skip: 0,
        first: 8,
        firstName_contains: '',
      },
    },
    result: {
      data: {
        organization: {
          membershipRequestsCount: 0,
          id: 'orgId',
          membershipRequests: [],
        },
      },
    },
  },

  // --- Organization Events (Duplicate) ---
  {
    request: {
      query: GET_ORGANIZATION_EVENTS_PG,
      variables: { id: 'orgId', first: 8, after: null },
    },
    result: {
      data: {
        organization: {
          eventsCount: 1,
          events: {
            edges: [],
            pageInfo: { hasNextPage: true, endCursor: 'cursor2' },
          },
        },
      },
      loading: false,
    },
  },
];

export const EMPTY_MOCKS = [
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
      variables: { id: 'orgId', first: 8, after: null },
    },
    result: {
      data: {
        organization: {
          eventsCount: 0,
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
      query: MEMBERSHIP_REQUEST,
      variables: {
        input: { id: 'orgId' },
        skip: 0,
        first: 8,
        firstName_contains: '',
      },
    },
    result: {
      data: {
        organization: {
          membershipRequestsCount: 0,
          id: 'orgId',
          membershipRequests: [],
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
        organization: { posts: { edges: [] } },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_MEMBER_ADMIN_COUNT,
      variables: { id: 'orgId' },
    },
    result: {
      data: {
        organization: {
          id: '01960b81-bfed-7369-ae96-689dbd4281ba',
          membersCount: 0,
          adminsCount: 0,
        },
      },
      loading: false,
    },
  },
  {
    request: {
      query: GET_ORGANIZATION_BLOCKED_USERS_COUNT,
      variables: { id: 'orgId' },
    },
    result: {
      data: {
        organization: {
          id: '01960b81-bfed-7369-ae96-689dbd4281ba',
          blockedUsersCount: 0,
        },
      },
      loading: false,
    },
  },
  {
    request: {
      query: GET_ORGANIZATION_VENUES_COUNT,
      variables: { id: 'orgId' },
    },
    result: {
      data: {
        organization: {
          venuesCount: 0,
        },
      },
      loading: false,
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
        firstName_contains: '',
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
                avatarURL: 'https://example.com/avatar1.jpg',
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
                avatarURL: 'https://example.com/avatar2.jpg',
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
                avatarURL: null,
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
                avatarURL: null,
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
      query: GET_ORGANIZATION_POSTS_COUNT_PG,
      variables: { id: 'orgId' },
    },
    error: new Error('Mock GraphQL GET_ORGANIZATION_POSTS_COUNT_PG Error'),
  },
  {
    request: {
      query: GET_ORGANIZATION_EVENTS_PG,
      variables: { id: 'orgId', first: 8, after: null },
    },
    error: new Error('Mock GraphQL GET_ORGANIZATION_EVENTS_PG Error'),
  },
  {
    request: {
      query: MEMBERSHIP_REQUEST,
      variables: {
        input: { id: 'orgId' },
        skip: 0,
        first: 8,
        firstName_contains: '',
      },
    },
    error: new Error('Mock GraphQL MEMBERSHIP_REQUEST Error'),
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
      query: ORGANIZATION_MEMBER_ADMIN_COUNT,
      variables: { id: 'orgId' },
    },
    error: new Error('Mock GraphQL ORGANIZATION_MEMBER_ADMIN_COUNT Error'),
  },
  {
    request: {
      query: GET_ORGANIZATION_BLOCKED_USERS_COUNT,
      variables: { id: 'orgId' },
    },
    error: new Error('Mock GraphQL GET_ORGANIZATION_BLOCKED_USERS_COUNT Error'),
  },
  {
    request: {
      query: GET_ORGANIZATION_VENUES_COUNT,
      variables: { id: 'orgId' },
    },
    error: new Error('Mock GraphQL GET_ORGANIZATION_VENUES_COUNT Error'),
  },
];

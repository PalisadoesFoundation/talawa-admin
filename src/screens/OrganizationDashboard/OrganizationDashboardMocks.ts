import {
  GET_ORGANIZATION_POSTS_COUNT_PG,
  GET_ORGANIZATION_EVENTS_PG,
  GET_ORGANIZATION_POSTS_PG,
  MEMBERSHIP_REQUEST_PG,
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
          __typename: 'Organization',
          id: 'orgId',
          membersCount: 2,
          adminsCount: 1,
          __typename: 'Organization',
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
    maxUsageCount: 5,
    result: {
      data: {
        organization: {
          __typename: 'Organization',
          id: 'orgId',
          postsCount: 10,
        },
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
    maxUsageCount: 5,
    result: {
      data: {
        organization: {
          __typename: 'Organization',
          id: 'orgId',
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
                  isRecurringEventTemplate: false,
                  baseEvent: null,
                  sequenceNumber: null,
                  totalCount: 1,
                  hasExceptions: false,
                  progressLabel: null,
                  recurrenceDescription: null,
                  recurrenceRule: {
                    id: 'recRule1',
                    frequency: 'DAILY',
                    interval: 1,
                    recurrenceStartDate: '2025-10-29',
                    recurrenceEndDate: null,
                    count: null,
                    byDay: null,
                    byMonth: null,
                    byMonthDay: null,
                    __typename: 'RecurrenceRule',
                  },
                  attachments: [
                    {
                      url: 'https://example.com',
                      mimeType: 'pdf',
                      __typename: 'Attachment',
                    },
                  ],
                  creator: {
                    id: 'creator1',
                    name: 'John Doe',
                    __typename: 'User',
                  },
                  organization: {
                    id: 'orgId',
                    name: 'Test Organization',
                    __typename: 'Organization',
                  },
                  createdAt: '2025-10-28T00:00:00.000Z',
                  updatedAt: '2025-10-28T00:00:00.000Z',
                  __typename: 'Event',
                },
                cursor: 'cursor1',
                __typename: 'OrganizationEventsConnectionEdge',
              },
            ],
            pageInfo: {
              hasNextPage: true,
              endCursor: 'cursor2',
              __typename: 'PageInfo',
            },
            __typename: 'OrganizationEventsConnection',
          },
          __typename: 'Organization',
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
    maxUsageCount: 5,
    result: {
      data: {
        organization: {
          __typename: 'Organization',
          id: 'orgId',
          posts: {
            edges: [
              {
                node: {
                  id: 'post1',
                  caption: 'First Post',
                  createdAt: '2025-01-01T12:00:00.000Z',
                  creator: {
                    id: 'user1',
                    name: 'John Doe',
                    __typename: 'User',
                  },
                  __typename: 'Post',
                },
                cursor: 'cursor1',
                __typename: 'OrganizationPostsConnectionEdge',
              },
            ],
            __typename: 'OrganizationPostsConnection',
          },
          __typename: 'Organization',
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
    maxUsageCount: 5,
    result: {
      data: {
        organization: {
          __typename: 'Organization',
          id: 'orgId',
          venuesCount: 10,
          __typename: 'Organization',
        },
      },
      loading: false,
    },
  },

  {
    request: {
      query: MEMBERSHIP_REQUEST_PG,
      variables: {
        input: { id: 'orgId' },
        skip: 0,
        first: 8,
        name_contains: '',
      },
    },
    maxUsageCount: 5,
    result: {
      data: {
        organization: {
          __typename: 'Organization',
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
                __typename: 'User',
              },
              __typename: 'MembershipRequest',
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
                __typename: 'User',
              },
              __typename: 'MembershipRequest',
            },
          ],
          __typename: 'Organization',
        },
      },
    },
  },

  {
    request: {
      query: GET_ORGANIZATION_BLOCKED_USERS_COUNT,
      variables: { id: 'orgId' },
    },
    maxUsageCount: 5,
    result: {
      data: {
        organization: {
          __typename: 'Organization',
          id: 'orgId',
          blockedUsersCount: 2,
          __typename: 'Organization',
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
    maxUsageCount: 5,
    result: {
      data: {
        organization: {
          __typename: 'Organization',
          id: 'orgId',
          postsCount: 0,
        },
      },
    },
  },

  {
    request: {
      query: GET_ORGANIZATION_EVENTS_PG,
      variables: { id: 'orgId', first: 8, after: null },
    },
    maxUsageCount: 5,
    result: {
      data: {
        organization: {
          __typename: 'Organization',
          id: 'orgId',
          eventsCount: 0,
          events: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              endCursor: null,
              __typename: 'PageInfo',
            },
            __typename: 'OrganizationEventsConnection',
          },
          __typename: 'Organization',
        },
      },
    },
  },

  {
    request: {
      query: MEMBERSHIP_REQUEST_PG,
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
          __typename: 'Organization',
          membershipRequestsCount: 0,
          id: 'orgId',
          membershipRequests: [],
          __typename: 'Organization',
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
          __typename: 'Organization',
          id: 'orgId',
          posts: { edges: [] },
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_MEMBER_ADMIN_COUNT,
      variables: { id: 'orgId' },
    },
    maxUsageCount: 3,
    result: {
      data: {
        organization: {
          __typename: 'Organization',
          id: 'orgId',
          membersCount: 0,
          adminsCount: 0,
          __typename: 'Organization',
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
    maxUsageCount: 3,
    result: {
      data: {
        organization: {
          __typename: 'Organization',
          id: 'orgId',
          blockedUsersCount: 0,
          __typename: 'Organization',
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
    maxUsageCount: 5,
    result: {
      data: {
        organization: {
          __typename: 'Organization',
          id: 'orgId',
          venuesCount: 0,
          __typename: 'Organization',
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
    maxUsageCount: 3,
    result: {
      data: {
        organization: {
          __typename: 'Organization',
          id: 'orgId',
          membershipRequestsCount: 4,
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
      query: MEMBERSHIP_REQUEST_PG,
      variables: {
        input: { id: 'orgId' },
        skip: 0,
        first: 8,
        name_contains: '',
      },
    },
    error: new Error('Mock GraphQL MEMBERSHIP_REQUEST_PG Error'),
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

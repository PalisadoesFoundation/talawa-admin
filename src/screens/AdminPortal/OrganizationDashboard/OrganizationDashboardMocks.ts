import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
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
          id: '01960b81-bfed-7369-ae96-689dbd4281ba',
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
          id: 'orgId',
          postsCount: 10,
          __typename: 'Organization',
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
          id: 'orgId',
          eventsCount: 1,
          events: {
            edges: [
              {
                node: {
                  id: 'event1',
                  name: 'Event One',
                  description: 'Description for Event One',
                  startAt: dayjs().add(1, 'year').add(1, 'day').toISOString(),
                  endAt: dayjs().add(1, 'year').add(2, 'days').toISOString(),
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
                    recurrenceStartDate: dayjs()
                      .add(1, 'year')
                      .add(1, 'day')
                      .format('YYYY-MM-DD'),
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
                  createdAt: dayjs().add(1, 'year').toISOString(),
                  updatedAt: dayjs().add(1, 'year').toISOString(),
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
          id: 'orgId',
          posts: {
            edges: [
              {
                node: {
                  id: 'post1',
                  caption: 'First Post',
                  createdAt: dayjs()
                    .add(1, 'year')
                    .startOf('year')
                    .hour(12)
                    .toISOString(),
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
          id: 'orgId',
          membershipRequests: [
            {
              membershipRequestId: 'request1',
              createdAt: dayjs().subtract(1, 'year').toISOString(),
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
              createdAt: dayjs()
                .subtract(1, 'year')
                .add(1, 'day')
                .toISOString(),
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
          id: '01960b81-bfed-7369-ae96-689dbd4281ba',
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
          id: 'orgId',
          postsCount: 0,
          __typename: 'Organization',
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
          posts: { edges: [], __typename: 'OrganizationPostsConnection' },
          __typename: 'Organization',
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
          id: '01960b81-bfed-7369-ae96-689dbd4281ba',
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
          id: '01960b81-bfed-7369-ae96-689dbd4281ba',
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
          id: 'orgId',
          venuesCount: 0,
          __typename: 'Organization',
        },
      },
      loading: false,
    },
  },
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

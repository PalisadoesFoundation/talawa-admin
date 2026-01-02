import dayjs from 'dayjs';
import {
  GET_ORGANIZATION_POSTS_COUNT_PG,
  GET_ORGANIZATION_EVENTS_PG,
  GET_ORGANIZATION_POSTS_PG,
  MEMBERSHIP_REQUEST_PG,
  ORGANIZATION_MEMBER_ADMIN_COUNT,
  GET_ORGANIZATION_BLOCKED_USERS_COUNT,
  GET_ORGANIZATION_VENUES_COUNT,
} from 'GraphQl/Queries/Queries';

export const MOCKS_ORG2 = [
  {
    request: {
      query: ORGANIZATION_MEMBER_ADMIN_COUNT,
      variables: { id: 'orgId2' },
    },
    maxUsageCount: 2,
    result: {
      data: {
        organization: {
          id: 'orgId2',
          membersCount: 5,
          adminsCount: 2,
          __typename: 'Organization',
        },
      },
      loading: false,
    },
  },
  {
    request: {
      query: GET_ORGANIZATION_POSTS_COUNT_PG,
      variables: { id: 'orgId2' },
    },
    maxUsageCount: 5,
    result: {
      data: {
        organization: {
          id: 'orgId2',
          postsCount: 20,
          __typename: 'Organization',
        },
      },
      loading: false,
    },
  },
  {
    request: {
      query: GET_ORGANIZATION_EVENTS_PG,
      variables: { id: 'orgId2', first: 8, after: null },
    },
    maxUsageCount: 5,
    result: {
      data: {
        organization: {
          id: 'orgId2',
          eventsCount: 3,
          events: {
            edges: [
              {
                node: {
                  id: 'event2',
                  name: 'Event Two',
                  description: 'Description for Event Two',
                  startAt: dayjs()
                    .add(1, 'year')
                    .month(10)
                    .date(29)
                    .startOf('day')
                    .toISOString(),
                  endAt: dayjs()
                    .add(1, 'year')
                    .month(10)
                    .date(30)
                    .startOf('day')
                    .toISOString(),
                  allDay: false,
                  location: 'Test Location 2',
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
                    id: 'creator2',
                    name: 'Jane Doe',
                    __typename: 'User',
                  },
                  organization: {
                    id: 'orgId2',
                    name: 'Test Organization 2',
                    __typename: 'Organization',
                  },
                  createdAt: dayjs()
                    .add(1, 'year')
                    .startOf('year')
                    .hour(12)
                    .toISOString(),
                  updatedAt: dayjs()
                    .add(1, 'year')
                    .startOf('year')
                    .hour(12)
                    .toISOString(),
                  __typename: 'Event',
                },
                cursor: 'cursor2',
                __typename: 'OrganizationEventsConnectionEdge',
              },
            ],
            pageInfo: {
              hasNextPage: false,
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
      variables: { id: 'orgId2', first: 5 },
    },
    maxUsageCount: 5,
    result: {
      data: {
        organization: {
          id: 'orgId2',
          posts: {
            edges: [
              {
                node: {
                  id: 'post2',
                  caption: 'Second Org Post',
                  createdAt: dayjs()
                    .add(1, 'year')
                    .startOf('year')
                    .add(1, 'day')
                    .hour(12)
                    .toISOString(),
                  creator: {
                    id: 'user2',
                    name: 'Jane Doe',
                    __typename: 'User',
                  },
                  __typename: 'Post',
                },
                cursor: 'cursor2',
                __typename: 'OrganizationPostsConnectionEdge',
              },
            ],
            __typename: 'OrganizationPostsConnection',
          },
        },
      },
      loading: false,
    },
  },
  {
    request: {
      query: GET_ORGANIZATION_VENUES_COUNT,
      variables: { id: 'orgId2' },
    },
    maxUsageCount: 5,
    result: {
      data: {
        organization: {
          id: 'orgId2',
          venuesCount: 5,
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
        input: { id: 'orgId2' },
        skip: 0,
        first: 8,
        name_contains: '',
      },
    },
    maxUsageCount: 5,
    result: {
      data: {
        organization: {
          id: 'orgId2',
          membershipRequests: [],
          __typename: 'Organization',
        },
      },
    },
  },
  {
    request: {
      query: GET_ORGANIZATION_BLOCKED_USERS_COUNT,
      variables: { id: 'orgId2' },
    },
    maxUsageCount: 5,
    result: {
      data: {
        organization: {
          id: 'orgId2',
          blockedUsersCount: 0,
          __typename: 'Organization',
        },
      },
      loading: false,
    },
  },
];

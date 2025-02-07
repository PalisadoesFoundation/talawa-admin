import {
  GET_ORGANIZATION_MEMBERS_PG,
  GET_ORGANIZATION_POSTS_COUNT_PG,
  GET_ORGANIZATION_EVENTS_PG, // re-enabled!
  GET_ORGANIZATION_POSTS_PG,
} from 'GraphQl/Queries/Queries';

export const MOCKS = [
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
              { node: { id: '1', role: 'administrator' }, cursor: 'cursor1' },
              { node: { id: '2', role: 'member' }, cursor: 'cursor2' },
            ],
            pageInfo: { hasNextPage: false, endCursor: null },
          },
        },
      },
      loading: false,
    },
  },

  // --- Organization Posts Count (duplicated) ---
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

  // --- Organization Events (duplicated) ---
  {
    request: {
      query: GET_ORGANIZATION_EVENTS_PG,
      variables: { id: 'orgId', first: 32, after: null },
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
                  creator: { id: 'creator1', name: 'John Doe' },
                },
                cursor: 'cursor1',
              },
            ],
            pageInfo: { hasNextPage: false, endCursor: null },
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
      variables: { id: 'orgId', first: 32, after: null },
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
        organization: { posts: { edges: [] } },
      },
    },
  },
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
      variables: { id: 'orgId', first: 32, after: null },
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
];

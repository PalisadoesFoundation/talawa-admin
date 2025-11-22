import { ORGANIZATION_POST_LIST } from 'GraphQl/Queries/Queries';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { enrichPostNode } from './OrgPostMocks.helpers';
import {
  getUserByIdMock,
  getUserByIdMockUser1,
  getUserByIdMockUser2,
  samplePosts,
  ORGANIZATION_PINNED_POST_LIST_WITH_PAGINATION_MOCK,
  ORGANIZATION_PINNED_POST_LIST_INITIAL_MOCK,
  getPostsByOrgInitialMock,
  mockOrgPostList1,
  mockOrgPostList2,
  ORGANIZATION_PINNED_POST_LIST_EMPTY_MOCK,
} from './OrgPostMocks.data';

// Export all data mocks
export * from './OrgPostMocks.data';
// Export helper
export { enrichPostNode } from './OrgPostMocks.helpers';

// Helper to generate multiple OrganizationPostList mocks
export const getOrganizationPostListMock = (count = 1) => {
  const mock = {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        input: { id: '123' },
        after: null,
        before: null,
        first: 6,
        last: null,
      },
    },
    result: {
      data: {
        organization: {
          id: '123',
          name: 'Test Organization',
          avatarURL: null,
          postsCount: samplePosts.length,
          posts: {
            edges: samplePosts.map((post) => ({
              node: enrichPostNode(post),
              cursor: `cursor-${post.id}`,
            })),
            totalCount: samplePosts.length,
            pageInfo: {
              startCursor: 'cursor-1',
              endCursor: `cursor-${samplePosts.length}`,
              hasNextPage: true,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  };
  return Array(count).fill(mock);
};

export const getMockOrgPostList1 = (count = 1) => {
  const mock = {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        input: { id: '123' },
        after: null,
        before: null,
        first: 6,
        last: null,
      },
    },
    result: { data: mockOrgPostList1 },
  };
  return Array(count).fill(mock);
};

// Composed mock arrays
export const baseMocks = [
  ...getOrganizationPostListMock(100),
  getPostsByOrgInitialMock,
  ...Array(100).fill(ORGANIZATION_PINNED_POST_LIST_WITH_PAGINATION_MOCK),
  ...Array(100).fill(ORGANIZATION_PINNED_POST_LIST_INITIAL_MOCK),
  {
    request: {
      query: CREATE_POST_MUTATION,
      variables: {
        input: {
          caption: 'Test Post Title',
          organizationId: '123',
          isPinned: false,
        },
      },
    },
    result: {
      data: {
        createPost: {
          id: '3',
          caption: 'Test Post Title',
          pinnedAt: null,
          attachments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    },
  },
  getUserByIdMock,
  getUserByIdMockUser1,
  getUserByIdMockUser2,
];

export const mocks1 = [
  getUserByIdMock,
  getUserByIdMockUser1,
  getUserByIdMockUser2,
  {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        input: { id: '123' },
        after: null,
        before: null,
        first: 6,
        last: null,
      },
    },
    result: { data: mockOrgPostList1 },
  },
  ORGANIZATION_PINNED_POST_LIST_WITH_PAGINATION_MOCK,
  {
    request: {
      query: CREATE_POST_MUTATION,
      variables: {
        input: {
          caption: 'Test Post Title',
          organizationId: '123',
          isPinned: false,
        },
      },
    },
    result: {
      data: {
        createPost: {
          id: '3',
          caption: 'Test Post Title',
          pinnedAt: null,
          attachments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    },
  },
];

export const mocks = [
  getUserByIdMock,
  getUserByIdMock,
  getUserByIdMock,
  getUserByIdMock,
  getUserByIdMockUser1,
  getUserByIdMockUser1,
  getUserByIdMockUser1,
  getUserByIdMockUser2,
  getUserByIdMockUser2,
  getUserByIdMockUser2,
  getPostsByOrgInitialMock,
  ...getMockOrgPostList1(5),
  {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        input: { id: '123' },
        after: 'cursor1',
        before: null,
        first: 6,
        last: null,
      },
    },
    result: { data: mockOrgPostList2 },
  },
  {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        input: { id: '123' },
        after: null,
        before: 'cursor2',
        first: null,
        last: 6,
      },
    },
    result: { data: mockOrgPostList1 },
  },
  ...Array(5).fill(ORGANIZATION_PINNED_POST_LIST_EMPTY_MOCK),
];

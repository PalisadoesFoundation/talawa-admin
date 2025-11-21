import {
  GET_POSTS_BY_ORG,
  ORGANIZATION_POST_LIST,
} from 'GraphQl/Queries/Queries';
import { ORGANIZATION_PINNED_POST_LIST } from 'GraphQl/Queries/OrganizationQueries';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import type { MockedResponse } from '@apollo/client/testing';

// Import from split files
import { enrichPostNode } from './OrgPostMocks.helpers';
import {
  getUserByIdMock,
  getUserByIdMockUser1,
  getUserByIdMockUser2,
  samplePosts,
} from './OrgPostMocks.data';

// Re-export for backward compatibility
export { enrichPostNode } from './OrgPostMocks.helpers';
export {
  getUserByIdMock,
  getUserByIdMockUser1,
  getUserByIdMockUser2,
  samplePosts,
} from './OrgPostMocks.data';

export const orgPinnedPostListMockBasic = {
  request: {
    query: ORGANIZATION_PINNED_POST_LIST,
    variables: {
      input: { id: '123' },
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
        postsCount: 3,
        pinnedPosts: {
          totalCount: 2,
          edges: [
            { node: enrichPostNode(samplePosts[0]), cursor: 'cursor1' },
            { node: enrichPostNode(samplePosts[1]), cursor: 'cursor2' },
          ],
          pageInfo: {
            startCursor: 'cursor1',
            endCursor: 'cursor2',
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      },
    },
  },
};

export const orgPostListMock = {
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
        postsCount: 3,
        posts: {
          totalCount: 3,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'cursor1',
            endCursor: 'cursor3',
          },
          edges: [
            { node: enrichPostNode(samplePosts[0]), cursor: 'cursor1' },
            { node: enrichPostNode(samplePosts[1]), cursor: 'cursor2' },
            { node: enrichPostNode(samplePosts[2]), cursor: 'cursor3' },
          ],
        },
      },
    },
  },
};

export const getPostsByOrgInitialMock = {
  request: {
    query: GET_POSTS_BY_ORG,
    variables: { input: { organizationId: '123' } },
  },
  result: {
    data: { postsByOrganization: samplePosts.map(enrichPostNode) },
  },
};

export const getPostsByOrgSearchMock = {
  request: {
    query: GET_POSTS_BY_ORG,
    variables: { input: { organizationId: '123' } },
  },
  result: {
    data: { postsByOrganization: samplePosts.map(enrichPostNode) },
  },
};

export const mockPosts = {
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
        name: 'Test Org',
        avatarURL: null,
        postsCount: 6,
        posts: {
          totalCount: 6,
          pageInfo: {
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: 'cursor1',
            endCursor: 'cursor2',
          },
          edges: [
            { node: enrichPostNode(samplePosts[0]), cursor: 'cursor1' },
            { node: enrichPostNode(samplePosts[1]), cursor: 'cursor2' },
          ],
        },
      },
    },
  },
};

export const mockOrgPostList = {
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
        postsCount: 6,
        posts: {
          totalCount: 6,
          pageInfo: {
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: 'cursor1',
            endCursor: 'cursor3',
          },
          edges: [
            { node: enrichPostNode(samplePosts[0]), cursor: 'cursor1' },
            { node: enrichPostNode(samplePosts[1]), cursor: 'cursor2' },
            { node: enrichPostNode(samplePosts[2]), cursor: 'cursor3' },
          ],
        },
      },
    },
  },
};

export const baseMocks = [
  getUserByIdMock,
  getUserByIdMockUser1,
  getUserByIdMockUser2,
  mockPosts,
  getPostsByOrgInitialMock,
  orgPinnedPostListMockBasic,
];

export const mockPosts1 = {
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
        name: 'Test Org',
        avatarURL: null,
        postsCount: 2,
        posts: {
          totalCount: 2,
          pageInfo: {
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: 'cursor1',
            endCursor: 'cursor2',
          },
          edges: [
            { node: enrichPostNode(samplePosts[0]), cursor: 'cursor1' },
            { node: enrichPostNode(samplePosts[1]), cursor: 'cursor2' },
          ],
        },
      },
    },
  },
};

export const mockOrgPostList1 = {
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
        postsCount: 2,
        posts: {
          totalCount: 2,
          pageInfo: {
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: 'cursor1',
            endCursor: 'cursor2',
          },
          edges: [
            { node: enrichPostNode(samplePosts[0]), cursor: 'cursor1' },
            { node: enrichPostNode(samplePosts[1]), cursor: 'cursor2' },
          ],
        },
      },
    },
  },
};

export const mockPosts2 = {
  request: {
    query: ORGANIZATION_POST_LIST,
    variables: {
      input: { id: '123' },
      after: 'cursor2',
      before: null,
      first: 6,
      last: null,
    },
  },
  result: {
    data: {
      organization: {
        id: '123',
        name: 'Test Org',
        avatarURL: null,
        postsCount: 1,
        posts: {
          totalCount: 1,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: true,
            startCursor: 'cursor3',
            endCursor: 'cursor3',
          },
          edges: [{ node: enrichPostNode(samplePosts[2]), cursor: 'cursor3' }],
        },
      },
    },
  },
};

export const mockPostsPrevious = {
  request: {
    query: ORGANIZATION_POST_LIST,
    variables: {
      input: { id: '123' },
      after: null,
      before: 'cursor3',
      first: null,
      last: 6,
    },
  },
  result: {
    data: {
      organization: {
        id: '123',
        name: 'Test Org',
        avatarURL: null,
        postsCount: 2,
        posts: {
          totalCount: 2,
          pageInfo: {
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: 'cursor1',
            endCursor: 'cursor2',
          },
          edges: [
            { node: enrichPostNode(samplePosts[0]), cursor: 'cursor1' },
            { node: enrichPostNode(samplePosts[1]), cursor: 'cursor2' },
          ],
        },
      },
    },
  },
};

export const mockOrgPostList2 = {
  request: {
    query: ORGANIZATION_POST_LIST,
    variables: {
      input: { id: '123' },
      after: 'cursor2',
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
        postsCount: 1,
        posts: {
          totalCount: 1,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: true,
            startCursor: 'cursor3',
            endCursor: 'cursor3',
          },
          edges: [{ node: enrichPostNode(samplePosts[2]), cursor: 'cursor3' }],
        },
      },
    },
  },
};

export const mocks1 = [
  getUserByIdMock,
  getUserByIdMockUser1,
  getUserByIdMockUser2,
  mockPosts1,
  mockPosts2,
  mockOrgPostList1,
  mockOrgPostList2,
];

export const mocks = [
  getUserByIdMock,
  getUserByIdMockUser1,
  getUserByIdMockUser2,
  getUserByIdMock,
  getUserByIdMockUser1,
  getUserByIdMockUser2,
  mockPosts,
  mockOrgPostList,
  mockPosts2,
  mockOrgPostList2,
  mockPostsPrevious,
  getPostsByOrgInitialMock,
  orgPinnedPostListMockBasic,
];

export const loadingMocks: MockedResponse[] = [
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
    result: {
      data: {
        organization: {
          id: '123',
          name: 'Test Organization',
          avatarURL: null,
          postsCount: 0,
          posts: {
            totalCount: 0,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
            edges: [],
          },
        },
      },
    },
  },
];

export const createPostSuccessMock: MockedResponse = {
  request: {
    query: CREATE_POST_MUTATION,
    variables: {
      input: {
        caption: 'Test caption',
        imageUrl: null,
        organizationId: '123',
        pinned: false,
        videoUrl: null,
      },
    },
  },
  result: {
    data: {
      createPost: {
        id: 'newPostId',
        caption: 'Test caption',
        imageUrl: null,
        videoUrl: null,
        pinned: false,
        createdAt: new Date().toISOString(),
        creator: {
          id: '123',
          firstName: 'Test',
          lastName: 'User',
          name: 'Test User',
          avatarURL: null,
          emailAddress: 'test@example.com',
        },
      },
    },
  },
};

export const NoOrgId: MockedResponse = {
  request: {
    query: ORGANIZATION_POST_LIST,
    variables: {
      input: { id: undefined },
      after: null,
      before: null,
      first: 6,
      last: null,
    },
  },
  error: new Error('Organization ID is required'),
};

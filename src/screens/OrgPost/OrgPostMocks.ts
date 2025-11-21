import {
  GET_POSTS_BY_ORG,
  ORGANIZATION_POST_LIST,
  GET_USER_BY_ID,
} from 'GraphQl/Queries/Queries';
import { ORGANIZATION_PINNED_POST_LIST } from 'GraphQl/Queries/OrganizationQueries';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import type { MockedResponse } from '@apollo/client/testing';

interface IPostCreator {
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  avatarURL?: string | null;
  emailAddress?: string;
}

interface IPostNode {
  id?: string;
  _id?: string;
  caption?: string;
  createdAt?: string;
  updatedAt?: string;
  pinnedAt?: string | null;
  pinned?: boolean;
  attachments?: unknown[];
  imageUrl?: string | null;
  videoUrl?: string | null;
  creator?: IPostCreator;
  postsCount?: number;
  commentsCount?: number;
  upVotesCount?: number;
  downVotesCount?: number;
  comments?: unknown[];
}

export const enrichPostNode = (post: IPostNode) => {
  const creator = {
    id: post.creator?.id || 'creator-id',
    firstName: post.creator?.firstName || 'Creator',
    lastName: post.creator?.lastName || 'Name',
    name:
      post.creator?.name ||
      (post.creator?.firstName
        ? `${post.creator.firstName} ${post.creator.lastName}`
        : 'Creator Name'),
    avatarURL: post.creator?.avatarURL || null,
    emailAddress: post.creator?.emailAddress || 'creator@example.com',
  };

  return {
    id: post.id ?? post._id ?? `post-${Math.random()}`,
    caption: post.caption ?? 'Untitled',
    createdAt: post.createdAt ?? new Date().toISOString(),
    updatedAt: post.updatedAt ?? post.createdAt ?? new Date().toISOString(),
    pinnedAt: post.pinnedAt ?? null,
    pinned: post.pinned ?? false,
    attachments: post.attachments ?? [],
    imageUrl: post.imageUrl ?? null,
    videoUrl: post.videoUrl ?? null,
    creator,
    postsCount: post.postsCount ?? 0,
    commentsCount: post.commentsCount ?? 0,
    upVotesCount: post.upVotesCount ?? 0,
    downVotesCount: post.downVotesCount ?? 0,
    comments: post.comments ?? [],
  };
};

export const getUserByIdMock = {
  request: {
    query: GET_USER_BY_ID,
    variables: { input: { id: '123' } },
  },
  result: {
    data: {
      user: {
        id: '123',
        name: 'Test User',
      },
    },
  },
};

export const getUserByIdMockUser1 = {
  request: {
    query: GET_USER_BY_ID,
    variables: { input: { id: 'user1' } },
  },
  result: {
    data: {
      user: {
        id: 'user1',
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        avatarURL: null,
        email: 'john.doe@example.com',
      },
    },
  },
};

export const getUserByIdMockUser2 = {
  request: {
    query: GET_USER_BY_ID,
    variables: { input: { id: 'user2' } },
  },
  result: {
    data: {
      user: {
        id: 'user2',
        name: 'User 2',
      },
    },
  },
};

export const samplePosts = [
  {
    id: '1',
    caption: 'First post title',
    createdAt: '2023-01-01T12:00:00Z',
    creator: {
      id: 'user1',
      name: 'John Doe',
      avatarURL: null,
      emailAddress: 'john.doe@example.com',
    },
    imageUrl: 'image1.jpg',
    videoUrl: null,
    pinned: false,
  },
  {
    id: '2',
    caption: 'Second post about testing',
    createdAt: '2023-01-02T12:00:00Z',
    creator: {
      id: 'user2',
      name: 'User 2',
      avatarURL: null,
      emailAddress: 'user2@example.com',
    },
    imageUrl: null,
    videoUrl: 'video2.mp4',
    pinned: true,
  },
  {
    id: '3',
    caption: 'Third post with random content',
    createdAt: '2023-01-03T12:00:00Z',
    creator: {
      id: 'user1',
      name: 'John Doe',
      avatarURL: null,
      emailAddress: 'john.doe@example.com',
    },
    imageUrl: 'image3.jpg',
    videoUrl: null,
    pinned: false,
  },
];

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
        name: 'Test Org',
        avatarURL: null,
        postsCount: 0,
        pinnedPosts: {
          edges: [],
          pageInfo: {
            startCursor: null,
            endCursor: null,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      },
    },
  },
};

export const ORGANIZATION_PINNED_POST_LIST_EMPTY_MOCK =
  orgPinnedPostListMockBasic;

export const ORGANIZATION_PINNED_POST_LIST_INITIAL_MOCK: MockedResponse = {
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
        postsCount: 2,
        pinnedPosts: {
          edges: [
            {
              node: enrichPostNode(samplePosts[0]),
              cursor: 'cursor1',
            },
            {
              node: enrichPostNode(samplePosts[1]),
              cursor: 'cursor2',
            },
          ],
          pageInfo: {
            startCursor: 'cursor1',
            endCursor: 'cursor2',
            hasNextPage: true,
            hasPreviousPage: false,
          },
        },
      },
    },
  },
};

export const ORGANIZATION_PINNED_POST_LIST_WITH_PAGINATION_MOCK = {
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
        name: 'Test Org',
        avatarURL: null,
        postsCount: 0,
        pinnedPosts: {
          edges: [],
          pageInfo: {
            startCursor: null,
            endCursor: null,
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

export const getPostsByOrgInitialMock = {
  request: {
    query: GET_POSTS_BY_ORG,
    variables: { input: { organizationId: '123' } },
  },
  result: { data: { postsByOrganization: samplePosts.map(enrichPostNode) } },
};

export const getPostsByOrgSearchMock = {
  request: {
    query: GET_POSTS_BY_ORG,
    variables: { input: { organizationId: '123' } },
  },
  result: { data: { postsByOrganization: samplePosts.map(enrichPostNode) } },
};

export const mockPosts = {
  postsByOrganization: [
    {
      id: '1',
      caption: 'Test Post 1',
      createdAt: '2024-02-23T10:00:00Z',
      creatorid: '123',
      imageUrl: null,
      videoUrl: null,
      isPinned: false,
      pinnedAt: null,
      attachments: [],
      creator: {
        id: 'u1',
        name: 'User 1',
        avatarURL: null,
        emailAddress: 'user1@example.com',
      },
      comments: [],
    },
    {
      id: '2',
      caption: 'Test Post 2',
      createdAt: '2024-02-23T11:00:00Z',
      creator: {
        id: 'u2',
        firstName: 'Jane',
        lastName: 'Smith',
        name: 'Jane Smith',
        avatarURL: null,
      },
      imageUrl: null,
      videoUrl: null,
      isPinned: true,
      pinnedAt: '2024-02-23T12:00:00Z',
      attachments: [],
      comments: [],
    },
  ],
};

export const mockOrgPostList = {
  organization: {
    id: '123',
    name: 'Test Org',
    avatarURL: null,
    postsCount: mockPosts.postsByOrganization.length,
    posts: {
      edges: mockPosts.postsByOrganization.map((post, index) => ({
        cursor: `cursor-${post.id ?? index}`,
        node: enrichPostNode(post),
      })),
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'cursor1',
        endCursor: 'cursor2',
      },
      totalCount: 2,
    },
  },
};

export const baseMocks = [
  ...getOrganizationPostListMock(100), // Provide many copies for all tests
  getPostsByOrgInitialMock,
  ...Array(100).fill(ORGANIZATION_PINNED_POST_LIST_WITH_PAGINATION_MOCK),
  ...Array(100).fill(ORGANIZATION_PINNED_POST_LIST_INITIAL_MOCK),
  // Additional mocks for create mutation if needed
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

export const mockPosts1 = {
  postsByOrganization: [
    {
      id: '1',
      caption: 'Early Post',
      createdAt: '2024-02-20T10:00:00Z',
      updatedAt: '2024-02-20T10:00:00Z',
      pinned: false,
      creator: {
        id: '123',
        name: 'User 123',
        firstName: 'User',
        lastName: '123',
        avatarURL: null,
        emailAddress: 'user123@example.com',
      },
      imageUrl: null,
      videoUrl: null,
      pinnedAt: null,
      attachments: [],
      comments: [],
    },
    {
      id: '2',
      caption: 'Later Post',
      createdAt: '2024-02-21T10:00:00Z',
      updatedAt: '2024-02-21T10:00:00Z',
      pinned: false,
      creator: {
        id: '123',
        name: 'User 123',
        firstName: 'User',
        lastName: '123',
        avatarURL: null,
        emailAddress: 'user123@example.com',
      },
      imageUrl: null,
      videoUrl: null,
      pinnedAt: null,
      attachments: [],
      comments: [],
    },
  ],
};

export const mockOrgPostList1 = {
  organization: {
    id: '123',
    name: 'Test Org',
    postsCount: mockPosts1.postsByOrganization.length,
    avatarURL: null,
    posts: {
      edges: mockPosts1.postsByOrganization.map((post, index) => ({
        cursor: `cursor-${post.id ?? index}`,
        node: enrichPostNode(post),
      })),
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'cursor1',
        endCursor: 'cursor1',
      },
      totalCount: 2,
    },
  },
};

export const mockPosts2 = {
  postsByOrganization: [
    {
      id: 'p3',
      caption: 'Post 3 on page 2',
      createdAt: new Date().toISOString(),
      pinnedAt: null,
      attachments: [],
      creator: {
        id: 'u3',
        name: 'User 3',
        firstName: 'User',
        lastName: '3',
        avatarURL: null,
        emailAddress: 'u3@example.com',
      },
      comments: [],
    },
    {
      id: 'p4',
      caption: 'Post 4 on page 2',
      createdAt: new Date().toISOString(),
      pinnedAt: null,
      attachments: [],
      creator: {
        id: 'u4',
        name: 'User 4',
        firstName: 'User',
        lastName: '4',
        avatarURL: null,
        emailAddress: 'u4@example.com',
      },
      comments: [],
    },
  ],
};

export const mockOrgPostList2 = {
  organization: {
    id: '123',
    name: 'Test Org',
    postsCount: mockPosts2.postsByOrganization.length,
    avatarURL: null,
    posts: {
      edges: mockPosts2.postsByOrganization.map((post, index) => ({
        cursor: `cursor-${post.id ?? index}`,
        node: enrichPostNode(post),
      })),
      pageInfo: {
        hasNextPage: false, // last page
        hasPreviousPage: true, // because we can go back
        startCursor: 'cursor2', //  matches endCursor from page 1
        endCursor: 'cursor3',
      },
      totalCount: 2,
    },
  },
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

export const mocks1 = [
  getUserByIdMock,
  getUserByIdMockUser1,
  getUserByIdMockUser2,
  {
    request: {
      query: GET_POSTS_BY_ORG,
      variables: { input: { organizationId: '123' } },
    },
    result: { data: mockPosts1 },
  },
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
  // Additional mocks for create mutation if needed
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
  // Duplicate User mocks to handle multiple calls
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

  // Initial GET_POSTS_BY_ORG
  getPostsByOrgInitialMock,

  // Page 1
  ...getMockOrgPostList1(5),

  // Page 2 (next page)
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

  // Back to Page 1 (previous page)
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

  // Use centralized pinned posts mock
  ...Array(5).fill(ORGANIZATION_PINNED_POST_LIST_EMPTY_MOCK),
];

export const loadingMocks: MockedResponse[] = [
  {
    request: {
      query: GET_POSTS_BY_ORG,
      variables: { input: { organizationId: '123' } },
    },
    result: { data: mockPosts },
    delay: 5000,
  },
  {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        input: { id: '123' },
        first: 6,
        last: null,
      },
    },
    result: { data: mockOrgPostList },
    delay: 5000,
  },
  {
    ...ORGANIZATION_PINNED_POST_LIST_EMPTY_MOCK,
    delay: 5000,
  },
];

export const createPostSuccessMock: MockedResponse = {
  request: {
    query: CREATE_POST_MUTATION,
    variables: {
      input: {
        caption: 'Test Post Title',
        organizationId: '123',
        isPinned: false,
        attachments: [
          new File(['dummy content'], 'test.png', { type: 'image/png' }),
        ],
      },
    },
  },
  result: {
    data: {
      createPost: {
        id: '3',
        caption: 'Test Post Title',
        pinnedAt: null,
        attachments: [{ url: 'base64String' }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  },
};

export const NoOrgId: MockedResponse = {
  request: {
    query: CREATE_POST_MUTATION,
    variables: {
      input: {
        caption: 'Test Post Title',
        organizationId: null,
        isPinned: false,
        attachments: [
          new File(['dummy content'], 'test.png', { type: 'image/png' }),
        ],
      },
    },
  },
  result: {
    data: {
      createPost: {
        id: '3',
        caption: 'Test Post Title',
        pinnedAt: null,
        attachments: [{ url: 'base64String' }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  },
};

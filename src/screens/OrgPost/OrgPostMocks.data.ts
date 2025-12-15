import { GET_POSTS_BY_ORG, GET_USER_BY_ID } from 'GraphQl/Queries/Queries';
import {
  ORGANIZATION_PINNED_POST_LIST,
  ORGANIZATION_POST_LIST_WITH_VOTES,
} from 'GraphQl/Queries/OrganizationQueries';
import { CREATE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import type { MockLink } from '@apollo/client/testing';
import { enrichPostNode } from './OrgPostMocks.helpers';

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
    hasUserVoted: { hasVoted: false, voteType: 'none' },
    commentsCount: 0,
    upVotesCount: 1,
    downVotesCount: 0,
    postsCount: 5,
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
    hasUserVoted: { hasVoted: true, voteType: 'UP' },
    commentsCount: 5,
    upVotesCount: 10,
    downVotesCount: 1,
    postsCount: 20,
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
    hasUserVoted: { hasVoted: false, voteType: 'none' },
    commentsCount: 2,
    upVotesCount: 5,
    downVotesCount: 0,
    postsCount: 10,
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

export const ORGANIZATION_PINNED_POST_LIST_INITIAL_MOCK: MockLink.MockedResponse =
  {
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
    query: ORGANIZATION_POST_LIST_WITH_VOTES,
    variables: {
      input: { id: '123' },
      userId: '',
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
      hasUserVoted: { hasVoted: false, voteType: 'none' },
      commentsCount: 0,
      upVotesCount: 0,
      downVotesCount: 0,
      postsCount: 0,
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
      hasUserVoted: { hasVoted: true, voteType: 'UP' },
      commentsCount: 1,
      upVotesCount: 2,
      downVotesCount: 0,
      postsCount: 2,
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
      hasUserVoted: { hasVoted: false, voteType: 'none' },
      commentsCount: 0,
      upVotesCount: 0,
      downVotesCount: 0,
      postsCount: 0,
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
      hasUserVoted: { hasVoted: false, voteType: 'none' },
      commentsCount: 0,
      upVotesCount: 0,
      downVotesCount: 0,
      postsCount: 0,
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
      hasUserVoted: { hasVoted: false, voteType: 'none' },
      commentsCount: 0,
      upVotesCount: 0,
      downVotesCount: 0,
      postsCount: 0,
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
      hasUserVoted: { hasVoted: false, voteType: 'none' },
      commentsCount: 0,
      upVotesCount: 0,
      downVotesCount: 0,
      postsCount: 0,
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

export const loadingMocks: MockLink.MockedResponse[] = [
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
      query: ORGANIZATION_POST_LIST_WITH_VOTES,
      variables: {
        input: { id: '123' },
        userId: '',
        after: null,
        before: null,
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

export const createPostSuccessMock: MockLink.MockedResponse = {
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
        attachments: [
          {
            fileHash: 'hash123',
            mimeType: 'image/png',
            name: 'test.png',
            objectName: 'test-object',
          },
        ],
      },
    },
  },
};

export const NoOrgId: MockLink.MockedResponse = {
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
        attachments: [
          {
            fileHash: 'hash123',
            mimeType: 'image/png',
            name: 'test.png',
            objectName: 'test-object',
          },
        ],
      },
    },
  },
};

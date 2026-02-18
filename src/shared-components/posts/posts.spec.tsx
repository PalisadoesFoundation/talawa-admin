import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router';
import PostsPage from './posts';
import { ORGANIZATION_POST_LIST_WITH_VOTES } from 'GraphQl/Queries/Queries';
import {
  ORGANIZATION_PINNED_POST_LIST,
  ORGANIZATION_POST_BY_ID,
} from 'GraphQl/Queries/OrganizationQueries';
import type { RenderResult } from '@testing-library/react';
import { InterfacePostEdge } from 'types/Post/interface';
import i18nForTest from 'utils/i18nForTest';
import { I18nextProvider } from 'test-utils/I18nextProviderMock';
import dayjs from 'dayjs';
import userEvent from '@testing-library/user-event';

// Hoisted mocks (must be before vi.mock calls)
const { mockNotificationToast } = vi.hoisted(() => ({
  mockNotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: mockNotificationToast,
}));

// Hoisted router mock
const routerMocks = vi.hoisted(() => ({
  useParams: vi.fn(() => ({ orgId: '123' })),
}));

// Hoisted localStorage mock
const localStorageMocks = vi.hoisted(() => ({
  getItem: vi.fn((): string | null => 'user-123'),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useParams: routerMocks.useParams };
});

// Mock useLocalStorage
vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: localStorageMocks.getItem,
    setItem: vi.fn(),
    removeItem: vi.fn(),
  }),
}));

// Mock LoadingState component
vi.mock('shared-components/LoadingState/LoadingState', () => ({
  default: ({
    isLoading,
    children,
  }: {
    isLoading: boolean;
    children: React.ReactNode;
  }) => {
    if (isLoading) return <div data-testid="loader">Loading...</div>;
    return children;
  },
}));

// Mock InfiniteScrollLoader
vi.mock('shared-components/InfiniteScrollLoader/InfiniteScrollLoader', () => ({
  default: () => (
    <div data-testid="infinite-scroll-loader">Loading more...</div>
  ),
}));

// Mock PostCard component
vi.mock('shared-components/postCard/PostCard', () => ({
  default: ({
    id,
    title,
    creator,
    fetchPosts,
  }: {
    id: string;
    title: string;
    creator: { name: string };
    fetchPosts?: () => void;
  }) => (
    <div data-testid="post-card" data-post-id={id}>
      <span data-testid="post-title">{title}</span>
      <span data-testid="creator-name">{creator?.name}</span>
      <button
        type="button"
        data-testid={`refetch-btn-${id}`}
        onClick={fetchPosts}
      >
        Refetch
      </button>
    </div>
  ),
}));

// Mock PinnedPostsLayout component
vi.mock('shared-components/pinnedPosts/pinnedPostsLayout', () => ({
  default: ({
    pinnedPosts,
    onStoryClick,
  }: {
    pinnedPosts: Array<{ node: { id: string; caption: string } }>;
    onStoryClick: (post: { id: string; caption: string }) => void;
  }) => (
    <div data-testid="pinned-posts-layout">
      {pinnedPosts.map((edge) => (
        <button
          type="button"
          key={edge.node.id}
          data-testid={`pinned-post-${edge.node.id}`}
          onClick={() => onStoryClick(edge.node)}
        >
          {edge.node.caption}
        </button>
      ))}
    </div>
  ),
}));

// Mock PageHeader component
vi.mock('shared-components/Navbar/Navbar', () => ({
  default: ({
    search,
    sorting,
    actions,
  }: {
    search: {
      placeholder: string;
      onSearch: (term: string) => void;
      inputTestId: string;
    };
    sorting: Array<{
      options: Array<{ label: string; value: string }>;
      selected: string;
      onChange: (option: string) => void;
      testIdPrefix: string;
    }>;
    actions: React.ReactNode;
  }) => (
    <div data-testid="page-header">
      <input
        data-testid={search.inputTestId}
        placeholder={search.placeholder}
        onChange={(e) => search.onSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            search.onSearch((e.target as HTMLInputElement).value);
          }
        }}
      />
      {sorting.map((sort, index) => (
        <div key={index}>
          <select
            data-testid={`${sort.testIdPrefix}-select`}
            value={sort.selected}
            onChange={(e) => sort.onChange(e.target.value)}
          >
            {sort.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      {actions}
    </div>
  ),
}));

// Mock CreatePostModal
vi.mock('shared-components/posts/createPostModal/createPostModal', () => ({
  default: ({
    show,
    onHide,
  }: {
    show: boolean;
    onHide: () => void;
    refetch: () => void;
    orgId?: string;
  }) =>
    show ? (
      <div data-testid="create-post-modal">
        <button type="button" data-testid="close-create-modal" onClick={onHide}>
          Close
        </button>
      </div>
    ) : null,
}));

// Mock PostViewModal
vi.mock('shared-components/PostViewModal/PostViewModal', () => ({
  default: ({
    show,
    onHide,
  }: {
    show: boolean;
    onHide: () => void;
    post: unknown;
    refetch: () => void;
  }) =>
    show ? (
      <div data-testid="post-view-modal">
        <button
          type="button"
          data-testid="close-post-view-button"
          onClick={onHide}
        >
          Close
        </button>
      </div>
    ) : null,
}));

// Mock InfiniteScroll
vi.mock('react-infinite-scroll-component', () => ({
  default: ({
    children,
    next,
    hasMore,
    loader,
    endMessage,
  }: {
    children: React.ReactNode;
    next: () => void;
    hasMore: boolean;
    loader: React.ReactNode;
    endMessage: React.ReactNode;
    dataLength: number;
    scrollThreshold: number;
    style: React.CSSProperties;
  }) => (
    <div data-testid="infinite-scroll" data-has-more={hasMore}>
      {children}
      {hasMore && loader}
      {!hasMore && endMessage}
      {hasMore && (
        <button type="button" data-testid="load-more-btn" onClick={next}>
          Load More
        </button>
      )}
    </div>
  ),
}));

// Deterministic values for stable testing
let nextId = 1;
// Use dynamic timestamp to avoid test staleness
const FIXED_TIMESTAMP = dayjs().subtract(14, 'days').toISOString();

// Helper function to enrich post node
const enrichPostNode = (
  post: Partial<{
    id: string;
    caption: string;
    createdAt: string;
    pinnedAt: string | null;
    pinned: boolean;
    creator: {
      id: string;
      name: string;
      avatarURL: string | null;
      emailAddress: string;
    };
    attachments: unknown[];
    imageUrl: string | null;
    videoUrl: string | null;
  }>,
) => ({
  id: post.id ?? `post-${nextId++}`,
  caption: post.caption ?? 'Test Caption',
  createdAt: post.createdAt ?? FIXED_TIMESTAMP,
  updatedAt: post.createdAt ?? FIXED_TIMESTAMP,
  pinnedAt: post.pinnedAt ?? null,
  pinned: post.pinned ?? false,
  attachments: post.attachments ?? [],
  imageUrl: post.imageUrl ?? null,
  videoUrl: post.videoUrl ?? null,
  creator: {
    id: post.creator?.id ?? 'user-1',
    name: post.creator?.name ?? 'Test User',
    firstName: 'Test',
    lastName: 'User',
    avatarURL: post.creator?.avatarURL ?? null,
    emailAddress: post.creator?.emailAddress ?? 'test@example.com',
  },
  postsCount: 0,
  commentsCount: 0,
  upVotesCount: 0,
  downVotesCount: 0,
  hasUserVoted: { hasVoted: false, voteType: null },
  comments: [],
});

// Sample posts data
const samplePosts = [
  {
    id: 'post-1',
    caption: 'First Post Title',
    // Use dynamic past date to avoid test staleness
    createdAt: dayjs().subtract(30, 'days').toISOString(),
    creator: {
      id: 'user-1',
      name: 'John Doe',
      avatarURL: null,
      emailAddress: 'john@example.com',
    },
    pinned: false,
    pinnedAt: null,
    imageUrl: 'image1.jpg',
    videoUrl: null,
    attachments: [],
  },
  {
    id: 'post-2',
    caption: 'Second Post About Testing',
    // Use dynamic past date to avoid test staleness
    createdAt: dayjs().subtract(29, 'days').toISOString(),
    creator: {
      id: 'user-2',
      name: 'Jane Smith',
      avatarURL: 'avatar.jpg',
      emailAddress: 'jane@example.com',
    },
    pinned: true,
    // Use dynamic past date for pinnedAt
    pinnedAt: dayjs().subtract(29, 'days').toISOString(),
    imageUrl: null,
    videoUrl: 'video.mp4',
    attachments: [],
  },
  {
    id: 'post-4-invalid-date',
    caption: 'Third Post Content',
    // Use dynamic past date to avoid test staleness
    createdAt: dayjs().subtract(28, 'days').toISOString(),
    creator: {
      id: 'user-1',
      name: 'John Doe',
      avatarURL: null,
      emailAddress: 'john@example.com',
    },
    pinned: false,
    pinnedAt: null,
    imageUrl: null,
    videoUrl: null,
    attachments: [],
  },
  {
    id: 'post-3',
    caption: 'Fourth Post Content',
    createdAt: 'invalid-date-string',
    creator: {
      id: 'user-1',
      name: 'John Doe',
      avatarURL: null,
      emailAddress: 'john@example.com',
    },
    pinned: false,
    pinnedAt: null,
    imageUrl: null,
    videoUrl: null,
    attachments: [],
  },
];

// Mock for ORGANIZATION_POST_LIST_WITH_VOTES
const orgPostListMock: MockedResponse = {
  request: {
    query: ORGANIZATION_POST_LIST_WITH_VOTES,
    variables: {
      input: { id: '123' },
      userId: 'user-123',
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
            startCursor: 'cursor-post-1',
            endCursor: 'cursor-post-3',
            hasNextPage: true,
            hasPreviousPage: false,
          },
        },
      },
    },
  },
};

// Mock for ORGANIZATION_PINNED_POST_LIST
const orgPinnedPostListMock: MockedResponse = {
  request: {
    query: ORGANIZATION_PINNED_POST_LIST,
    variables: {
      input: { id: '123' },
      first: 10,
      last: null,
      userId: 'user-123',
    },
  },
  result: {
    data: {
      organization: {
        id: '123',
        name: 'Test Organization',
        avatarURL: null,
        postsCount: 1,
        pinnedPosts: {
          edges: [
            {
              node: enrichPostNode(samplePosts[1]),
              cursor: 'cursor-pinned-1',
            },
          ],
          pageInfo: {
            startCursor: 'cursor-pinned-1',
            endCursor: 'cursor-pinned-1',
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      },
    },
  },
};

// Empty pinned posts mock
const emptyPinnedPostsMock: MockedResponse = {
  request: {
    query: ORGANIZATION_PINNED_POST_LIST,
    variables: {
      input: { id: '123' },
      first: 10,
      last: null,
      userId: 'user-123',
    },
  },
  result: {
    data: {
      organization: {
        id: '123',
        name: 'Test Organization',
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

// Error mock for org post list
const orgPostListErrorMock: MockedResponse = {
  request: {
    query: ORGANIZATION_POST_LIST_WITH_VOTES,
    variables: {
      input: { id: '123' },
      userId: 'user-123',
      after: null,
      before: null,
      first: 6,
      last: null,
    },
  },
  error: new Error('Organization post list error'),
};

// Error mock for pinned posts
const pinnedPostsErrorMock: MockedResponse = {
  request: {
    query: ORGANIZATION_PINNED_POST_LIST,
    variables: {
      input: { id: '123' },
      first: 10,
      last: null,
      userId: 'user-123',
    },
  },
  error: new Error('Pinned posts load error'),
};

// Error mock for preview post
const previewPostErrorMock: MockedResponse = {
  request: {
    query: ORGANIZATION_POST_BY_ID,
    variables: {
      postId: 'preview-post-123',
      userId: 'user-123',
    },
  },
  error: new Error('Preview post load error'),
};

// Helper render function
const renderComponent = (
  mocks: MockedResponse[],
  path = '/admin/orgpost/123',
): RenderResult =>
  render(
    <I18nextProvider i18n={i18nForTest}>
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/admin/orgpost/:orgId" element={<PostsPage />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    </I18nextProvider>,
  );

let user: ReturnType<typeof userEvent.setup>;

beforeEach(() => {
  user = userEvent.setup();
});

describe('PostsPage Component', () => {
  beforeEach(() => {
    nextId = 1;
    routerMocks.useParams.mockReturnValue({ orgId: '123' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Error Handling', () => {
    it('shows error toast when organization post list query fails', async () => {
      renderComponent([orgPostListErrorMock, emptyPinnedPostsMock]);

      await waitFor(() => {
        expect(mockNotificationToast.error).toHaveBeenCalledWith(
          'Error loading posts',
        );
      });
    });

    it('shows error toast when pinned posts query fails', async () => {
      renderComponent([orgPostListMock, pinnedPostsErrorMock]);

      await waitFor(() => {
        expect(mockNotificationToast.error).toHaveBeenCalledWith(
          'Error loading pinned posts',
        );
      });
    });

    it('shows error toast when preview post query fails', async () => {
      const searchParams = new URLSearchParams({
        previewPostID: 'preview-post-123',
      });

      renderComponent(
        [orgPostListMock, emptyPinnedPostsMock, previewPostErrorMock],
        `/admin/orgpost/123?${searchParams.toString()}`,
      );

      await waitFor(() => {
        expect(mockNotificationToast.error).toHaveBeenCalledWith(
          'Error loading preview post',
        );
      });
    });

    it('includes preview post loading state in main loading condition', async () => {
      const previewPostLoadingMock: MockedResponse = {
        request: {
          query: ORGANIZATION_POST_BY_ID,
          variables: {
            postId: 'preview-post-123',
            userId: 'user-123',
          },
        },
        delay: 100, // Simulate loading delay
        result: {
          data: {
            post: {
              id: 'preview-post-123',
              caption: 'Preview Post',
              createdAt: FIXED_TIMESTAMP,
              creator: {
                id: 'user-1',
                name: 'John Doe',
                avatarURL: null,
              },
              attachments: [],
              commentsCount: 0,
              upVotesCount: 0,
              downVotesCount: 0,
              hasUserVoted: { hasVoted: false, voteType: null },
            },
          },
        },
      };

      const searchParams = new URLSearchParams({
        previewPostID: 'preview-post-123',
      });

      renderComponent(
        [orgPostListMock, emptyPinnedPostsMock, previewPostLoadingMock],
        `/admin/orgpost/123?${searchParams.toString()}`,
      );

      // Should show loading state initially
      expect(screen.getByTestId('loader')).toBeInTheDocument();

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      });
    });
  });

  describe('Pinned Posts', () => {
    it('closes pinned post modal when close button is clicked', async () => {
      renderComponent([orgPostListMock, orgPinnedPostListMock]);

      await waitFor(() => {
        expect(screen.getByTestId('pinned-posts-layout')).toBeInTheDocument();
      });

      // Open modal
      const pinnedPostButton = screen.getByTestId('pinned-post-post-2');
      await user.click(pinnedPostButton);

      await waitFor(() => {
        expect(screen.getByTestId('post-view-modal')).toBeInTheDocument();
      });

      // Close modal
      const closeButton = screen.getByTestId('close-post-view-button');
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('post-view-modal')).not.toBeInTheDocument();
      });
    });

    it('handles URL update when closing modal with other query parameters present', async () => {
      // Mock window.location and history
      const originalLocation = window.location;
      const originalHistory = window.history;
      const mockReplaceState = vi.fn();

      try {
        Object.defineProperty(window, 'location', {
          value: {
            ...originalLocation,
            pathname: '/test/path',
            search: '?previewPostID=post-123&otherParam=value&sortBy=date',
          },
          writable: true,
        });

        Object.defineProperty(window, 'history', {
          value: {
            ...originalHistory,
            replaceState: mockReplaceState,
          },
          writable: true,
        });

        renderComponent([orgPostListMock, orgPinnedPostListMock]);

        await waitFor(() => {
          expect(screen.getByTestId('pinned-posts-layout')).toBeInTheDocument();
        });

        // Open modal
        const pinnedPostButton = screen.getByTestId('pinned-post-post-2');
        await user.click(pinnedPostButton);

        // Close the modal
        const closeButton = screen.getByTestId('close-post-view-button');
        await user.click(closeButton);

        // Verify URL was updated with remaining query parameters
        expect(mockReplaceState).toHaveBeenCalledWith(
          {},
          '',
          '/test/path?otherParam=value&sortBy=date',
        );
      } finally {
        // Restore original objects
        Object.defineProperty(window, 'location', {
          value: originalLocation,
          writable: true,
        });
        Object.defineProperty(window, 'history', {
          value: originalHistory,
          writable: true,
        });
      }
    });

    it('handles URL update when closing modal with only previewPostID parameter', async () => {
      // Mock window.location and history
      const originalLocation = window.location;
      const originalHistory = window.history;
      const mockReplaceState = vi.fn();
      try {
        Object.defineProperty(window, 'location', {
          value: {
            ...originalLocation,
            pathname: '/test/path',
            search: '?previewPostID=post-123',
          },
          writable: true,
        });

        Object.defineProperty(window, 'history', {
          value: {
            ...originalHistory,
            replaceState: mockReplaceState,
          },
          writable: true,
        });

        renderComponent([orgPostListMock, orgPinnedPostListMock]);

        await waitFor(() => {
          expect(screen.getByTestId('pinned-posts-layout')).toBeInTheDocument();
        });

        // Open modal
        const pinnedPostButton = screen.getByTestId('pinned-post-post-2');
        await user.click(pinnedPostButton);

        // Close the modal
        const closeButton = screen.getByTestId('close-post-view-button');
        await user.click(closeButton);

        // Verify URL was updated without query parameters (empty query string)
        expect(mockReplaceState).toHaveBeenCalledWith({}, '', '/test/path');
      } finally {
        // Restore original objects
        Object.defineProperty(window, 'location', {
          value: originalLocation,
          writable: true,
        });
        Object.defineProperty(window, 'history', {
          value: originalHistory,
          writable: true,
        });
      }
    });
  });

  describe('Search Functionality', () => {
    it('resets filtering when search term is cleared', async () => {
      renderComponent([orgPostListMock, emptyPinnedPostsMock]);

      await waitFor(() => {
        expect(screen.getByTestId('searchByName')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('searchByName');

      // Enter search term
      await user.clear(searchInput);
      await user.type(searchInput, 'test');

      // Wait for filtering to activate
      await waitFor(
        () => {
          const renderer = screen.getByTestId('posts-renderer');
          expect(renderer.getAttribute('data-is-filtering')).toBe('true');
        },
        { timeout: 3000 },
      );

      // Clear search term
      await user.clear(searchInput);

      await waitFor(
        () => {
          const renderer = screen.getByTestId('posts-renderer');
          expect(renderer.getAttribute('data-is-filtering')).toBe('false');
        },
        { timeout: 3000 },
      );
    });
  });

  it('handles search error gracefully', async () => {
    // Create a component where search will fail by not providing proper initial data
    const errorOrgPostListMock: MockedResponse = {
      request: {
        query: ORGANIZATION_POST_LIST_WITH_VOTES,
        variables: {
          input: { id: '123' },
          userId: 'user-123',
          after: null,
          before: null,
          first: 6,
          last: null,
        },
      },
      error: new Error('Organization post list error'),
    };

    renderComponent([errorOrgPostListMock, emptyPinnedPostsMock]);

    await waitFor(() => {
      expect(screen.getByTestId('searchByName')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');
    await user.clear(searchInput);
    await user.type(searchInput, 'test search');

    // Should show error toast for GraphQL error
    await waitFor(() => {
      expect(mockNotificationToast.error).toHaveBeenCalledWith(
        'Error loading posts',
      );
    });

    // For GraphQL errors, the filtering state should remain as is
    // since the error is not in the search function itself
    await waitFor(() => {
      const renderer = screen.getByTestId('posts-renderer');
      expect(renderer.getAttribute('data-is-filtering')).toBe('true');
    });
  });
});

describe('Sorting Functionality', () => {
  beforeEach(() => {
    nextId = 1;
    routerMocks.useParams.mockReturnValue({ orgId: '123' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('handles sorting when allPosts is empty', async () => {
    const emptyPostsMock: MockedResponse = {
      request: {
        query: ORGANIZATION_POST_LIST_WITH_VOTES,
        variables: {
          input: { id: '123' },
          userId: 'user-123',
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
              edges: [],
              totalCount: 0,
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

    renderComponent([emptyPostsMock, emptyPinnedPostsMock]);

    await waitFor(() => {
      expect(screen.getByTestId('sortpost-select')).toBeInTheDocument();
    });

    const sortSelect = screen.getByTestId('sortpost-select');
    await user.selectOptions(sortSelect, 'latest');

    // Should handle empty posts gracefully and not crash
    await waitFor(() => {
      const renderer = screen.getByTestId('posts-renderer');
      expect(renderer.getAttribute('data-sorting-option')).toBe('latest');
    });
  });

  it('sorts posts by oldest when selected', async () => {
    renderComponent([orgPostListMock, emptyPinnedPostsMock]);

    await waitFor(() => {
      expect(screen.getByTestId('sortpost-select')).toBeInTheDocument();
    });

    const sortSelect = screen.getByTestId('sortpost-select');

    await user.selectOptions(sortSelect, 'oldest');

    await waitFor(() => {
      const renderer = screen.getByTestId('posts-renderer');
      expect(renderer.getAttribute('data-sorting-option')).toBe('oldest');
    });
  });

  it('resets to paginated data when sorting is set to None', async () => {
    renderComponent([
      orgPostListMock,
      orgPostListMock, // Additional mock for refetch
      emptyPinnedPostsMock,
    ]);

    await waitFor(() => {
      expect(screen.getByTestId('sortpost-select')).toBeInTheDocument();
    });

    const sortSelect = screen.getByTestId('sortpost-select');

    // Sort by latest first
    await user.selectOptions(sortSelect, 'latest');

    // Reset to None
    await user.selectOptions(sortSelect, 'None');

    await waitFor(() => {
      const renderer = screen.getByTestId('posts-renderer');
      expect(renderer.getAttribute('data-sorting-option')).toBe('None');
    });
  });
});

describe('Create Post Modal', () => {
  beforeEach(() => {
    nextId = 1;
    routerMocks.useParams.mockReturnValue({ orgId: '123' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('closes create post modal when close button is clicked', async () => {
    renderComponent([orgPostListMock, emptyPinnedPostsMock]);

    await waitFor(() => {
      expect(screen.getByTestId('createPostModalBtn')).toBeInTheDocument();
    });

    // Open modal
    const createButton = screen.getByTestId('createPostModalBtn');
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByTestId('create-post-modal')).toBeInTheDocument();
    });

    // Close modal
    const closeButton = screen.getByTestId('close-create-modal');
    await user.click(closeButton);

    expect(screen.queryByTestId('create-post-modal')).not.toBeInTheDocument();
  });
});

describe('Infinite Scroll', () => {
  beforeEach(() => {
    nextId = 1;
    vi.clearAllMocks();
    routerMocks.useParams.mockReturnValue({ orgId: '123' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders infinite scroll component with hasMore=true initially', async () => {
    renderComponent([orgPostListMock, emptyPinnedPostsMock]);

    await waitFor(() => {
      expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
    });

    const infiniteScroll = screen.getByTestId('infinite-scroll');
    expect(infiniteScroll.getAttribute('data-has-more')).toBe('true');
  });

  it('resets infinite scroll when switching from filtered to paginated view', async () => {
    renderComponent([orgPostListMock, emptyPinnedPostsMock]);

    await waitFor(() => {
      expect(screen.getByTestId('searchByName')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchByName');

    // Enter search term to activate filtering
    await user.clear(searchInput);
    await user.type(searchInput, 'test');

    await waitFor(() => {
      const renderer = screen.getByTestId('posts-renderer');
      expect(renderer.getAttribute('data-is-filtering')).toBe('true');
    });

    // Clear search to return to paginated view
    await user.clear(searchInput);

    await waitFor(() => {
      const renderer = screen.getByTestId('posts-renderer');
      expect(renderer.getAttribute('data-is-filtering')).toBe('false');
    });

    // Infinite scroll should be back to normal state
    const infiniteScroll = screen.getByTestId('infinite-scroll');
    expect(infiniteScroll.getAttribute('data-has-more')).toBe('true');
  });
});

describe('Edge Cases', () => {
  beforeEach(() => {
    nextId = 1;
    vi.clearAllMocks();
    routerMocks.useParams.mockReturnValue({ orgId: '123' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('handles null page info', async () => {
    const nullPageInfoMock: MockedResponse = {
      request: {
        query: ORGANIZATION_POST_LIST_WITH_VOTES,
        variables: {
          input: { id: '123' },
          userId: 'user-123',
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
            postsCount: 1,
            posts: {
              edges: [
                {
                  node: enrichPostNode(samplePosts[0]),
                  cursor: 'cursor-1',
                },
              ],
              totalCount: 1,
              pageInfo: null,
            },
          },
        },
      },
    };

    renderComponent([nullPageInfoMock, emptyPinnedPostsMock]);

    await waitFor(() => {
      expect(screen.getAllByTestId('post-card').length).toBe(1);
    });
  });

  it('handles posts with undefined caption', async () => {
    const postWithUndefinedCaption = {
      ...samplePosts[0],
      id: 'post-undefined-caption',
      caption: undefined,
    };

    const mockWithUndefinedCaption: MockedResponse = {
      request: {
        query: ORGANIZATION_POST_LIST_WITH_VOTES,
        variables: {
          input: { id: '123' },
          userId: 'user-123',
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
            postsCount: 1,
            posts: {
              edges: [
                {
                  node: {
                    ...enrichPostNode(postWithUndefinedCaption),
                    caption: null,
                  },
                  cursor: 'cursor-1',
                },
              ],
              totalCount: 1,
              pageInfo: {
                startCursor: 'cursor-1',
                endCursor: 'cursor-1',
                hasNextPage: false,
                hasPreviousPage: false,
              },
            },
          },
        },
      },
    };

    renderComponent([mockWithUndefinedCaption, emptyPinnedPostsMock]);

    await waitFor(() => {
      expect(screen.getAllByTestId('post-card').length).toBe(1);
    });
  });

  it('loadMorePosts callback handles missing fetchMoreResult', async () => {
    const noResultMock: MockedResponse = {
      request: {
        query: ORGANIZATION_POST_LIST_WITH_VOTES,
        variables: {
          input: { id: '123' },
          userId: 'user-123',
          after: 'cursor-post-3',
          before: null,
          first: 6,
          last: null,
        },
      },
      result: {
        data: {
          organization: null,
        },
      },
    };

    renderComponent([orgPostListMock, noResultMock, emptyPinnedPostsMock]);

    await waitFor(() => {
      expect(screen.getByTestId('load-more-btn')).toBeInTheDocument();
    });

    const loadMoreButton = screen.getByTestId('load-more-btn');
    await user.click(loadMoreButton);

    // Should not crash and maintain current state
    await waitFor(() => {
      expect(screen.getByTestId('posts-renderer')).toBeInTheDocument();
    });
  });

  it('shows error toast when fetchMore fails', async () => {
    const fetchMoreErrorMock: MockedResponse = {
      request: {
        query: ORGANIZATION_POST_LIST_WITH_VOTES,
        variables: {
          input: { id: '123' },
          userId: 'user-123',
          after: 'cursor-post-3',
          before: null,
          first: 6,
          last: null,
        },
      },
      error: new Error('Error loading more posts'),
    };

    renderComponent([
      orgPostListMock,
      fetchMoreErrorMock,
      emptyPinnedPostsMock,
    ]);

    await waitFor(() => {
      expect(screen.getByTestId('load-more-btn')).toBeInTheDocument();
    });

    const loadMoreButton = screen.getByTestId('load-more-btn');
    await user.click(loadMoreButton);

    await waitFor(() => {
      expect(mockNotificationToast.error).toHaveBeenCalledWith(
        'Error loading more posts',
      );
    });
  });

  it('handles post with video URL and fallback values', async () => {
    const postWithVideo: InterfacePostEdge = {
      node: {
        id: 'video-post-1',
        caption: 'Video post',
        hasUserVoted: null, // Test fallback
        creator: null, // Test fallback
        commentsCount: undefined, // Test fallback
        pinnedAt: 'video',
        downVotesCount: undefined, // Test fallback
        upVotesCount: undefined, // Test fallback
        attachments: undefined,
        createdAt: dayjs().subtract(14, 'days').toISOString(),
      },
      cursor: 'cursor-video-post-1',
    };

    const mockWithVideo = {
      ...orgPostListMock,
      result: {
        data: {
          organization: {
            id: '123',
            name: 'Test Organization',
            avatarURL: null,
            postsCount: 1,
            posts: {
              edges: [postWithVideo],
              pageInfo: {
                startCursor: 'cursor-video-post-1',
                endCursor: 'cursor-video-post-1',
                hasNextPage: false,
                hasPreviousPage: false,
              },
            },
          },
        },
      },
    };

    renderComponent([mockWithVideo, emptyPinnedPostsMock]);

    await waitFor(() => {
      expect(screen.getByTestId('posts-renderer')).toBeInTheDocument();
    });

    // Post should still render with fallback values
    expect(screen.getByText('Video post')).toBeInTheDocument();
  });
});

describe('Missing User ID', () => {
  beforeEach(() => {
    nextId = 1;
    vi.clearAllMocks();
    routerMocks.useParams.mockReturnValue({ orgId: '123' });
  });

  afterEach(() => {
    vi.clearAllMocks();
    // Reset localStorage mock to default value
    localStorageMocks.getItem.mockReturnValue('user-123');
  });

  it('does not execute queries when userId is missing from localStorage', async () => {
    // Mock localStorage to return null for userId
    localStorageMocks.getItem.mockReturnValue(null);

    renderComponent([]);

    // Queries should be skipped, so no posts should be loaded
    // and no loading state should appear after initial mount
    await waitFor(() => {
      expect(screen.getByTestId('page-header')).toBeInTheDocument();
    });

    // Since queries are skipped, allPosts should remain empty
    // and no post cards should be rendered
    expect(screen.queryAllByTestId('post-card')).toHaveLength(0);

    // Error toasts should not be called since queries are skipped, not failed
    expect(mockNotificationToast.error).not.toHaveBeenCalled();
  });
});

describe('HandleSorting Edge Case', () => {
  beforeEach(() => {
    nextId = 1;
    vi.clearAllMocks();
    routerMocks.useParams.mockReturnValue({ orgId: '123' });
    localStorageMocks.getItem.mockReturnValue('user-123');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('handle sorting when has hasNextPage is false', async () => {
    const mockWithMorePages = {
      ...orgPostListMock,
      result: {
        data: {
          organization: {
            id: '123',
            name: 'Test Organization',
            avatarURL: null,
            postsCount: 10,
            posts: {
              edges: [
                {
                  node: enrichPostNode(samplePosts[0]),
                  cursor: 'cursor-post-1',
                },
                {
                  node: enrichPostNode(samplePosts[1]),
                  cursor: 'cursor-post-2',
                },
              ],
              pageInfo: {
                startCursor: 'cursor-post-1',
                endCursor: 'cursor-post-2',
                hasNextPage: false, // More pages not
                hasPreviousPage: false,
              },
            },
          },
        },
      },
    };

    renderComponent([mockWithMorePages, emptyPinnedPostsMock]);

    await waitFor(() => {
      expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
    });

    const sortSelect = screen.getByTestId('sortpost-select');

    // Verify hasMore is false when sorting is applied
    let infiniteScroll = screen.getByTestId('infinite-scroll');
    expect(infiniteScroll).toHaveAttribute('data-has-more', 'false');

    await user.selectOptions(sortSelect, 'None');

    await waitFor(() => {
      expect(sortSelect).toHaveValue('None');
    });

    // Verify hasMore is now false because hasNextPage is false
    infiniteScroll = screen.getByTestId('infinite-scroll');
    expect(infiniteScroll).toHaveAttribute('data-has-more', 'false');

    // Verify endMessage is displayed when hasMore is false
    expect(
      screen.getByText(i18nForTest.t('posts.noMorePosts')),
    ).toBeInTheDocument();
  });
});

describe('FetchMore Success Coverage', () => {
  beforeEach(() => {
    nextId = 1;
    vi.clearAllMocks();
    routerMocks.useParams.mockReturnValue({ orgId: '123' });
    localStorageMocks.getItem.mockReturnValue('user-123');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('covers successful fetchMore with pageInfo assignment', async () => {
    // Create a successful fetchMore mock that returns the pageInfo
    const fetchMoreSuccessMock: MockedResponse = {
      request: {
        query: ORGANIZATION_POST_LIST_WITH_VOTES,
        variables: {
          input: { id: '123' },
          userId: 'user-123',
          after: 'cursor-post-3',
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
              edges: [
                {
                  node: {
                    id: 'new-post-1',
                    caption: 'New Post From FetchMore',
                    createdAt: dayjs().subtract(27, 'days').toISOString(),
                    updatedAt: dayjs().subtract(27, 'days').toISOString(),
                    pinnedAt: null,
                    pinned: false,
                    attachments: [],
                    imageUrl: null,
                    videoUrl: null,
                    creator: {
                      id: 'user-3',
                      name: 'New User',
                      firstName: 'New',
                      lastName: 'User',
                      avatarURL: null,
                      emailAddress: 'new@example.com',
                    },
                    postsCount: 0,
                    commentsCount: 0,
                    upVotesCount: 0,
                    downVotesCount: 0,
                    hasUserVoted: { hasVoted: false, voteType: null },
                    comments: [],
                    body: null,
                    attachmentURL: null,
                  },
                  cursor: 'cursor-new-post-1',
                },
              ],
              totalCount: 2,
              pageInfo: {
                startCursor: 'cursor-new-post-1',
                endCursor: 'cursor-new-post-1',
                hasNextPage: false,
                hasPreviousPage: true,
              },
            },
          },
        },
      },
    };

    renderComponent([
      orgPostListMock,
      fetchMoreSuccessMock,
      emptyPinnedPostsMock,
    ]);

    await waitFor(() => {
      expect(screen.getByTestId('load-more-btn')).toBeInTheDocument();
    });

    const loadMoreButton = screen.getByTestId('load-more-btn');
    await user.click(loadMoreButton);

    // Wait for the new post to be loaded and verify pageInfo is handled
    await waitFor(() => {
      expect(screen.getByText('New Post From FetchMore')).toBeInTheDocument();
    });

    // Verify infinite scroll reflects the new hasNextPage status
    const infiniteScroll = screen.getByTestId('infinite-scroll');
    expect(infiniteScroll).toHaveAttribute('data-has-more', 'false');
  });
});

describe('LoadingState Wrapper', () => {
  beforeEach(() => {
    nextId = 1;
    vi.clearAllMocks();
    routerMocks.useParams.mockReturnValue({ orgId: '123' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows loader during initial data loading', async () => {
    // Create mocks with deliberate delay
    const delayedOrgPostMock = {
      ...orgPostListMock,
      delay: 100, // 100ms delay
    };
    const delayedPinnedPostMock = {
      ...orgPinnedPostListMock,
      delay: 100,
    };

    renderComponent([delayedOrgPostMock, delayedPinnedPostMock]);

    // Loader should be present during loading
    expect(screen.getByTestId('loader')).toBeInTheDocument();

    // Wait for content to load and loader to disappear
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      expect(screen.getByTestId('page-header')).toBeInTheDocument();
    });
  });

  it('renders content when not loading', async () => {
    renderComponent([orgPostListMock, emptyPinnedPostsMock]);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    // Verify main content is visible
    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    expect(screen.getByTestId('posts-renderer')).toBeInTheDocument();
  });
});

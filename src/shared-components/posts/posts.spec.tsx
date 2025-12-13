import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router';
import PostsPage from './posts';
import { ORGANIZATION_POST_LIST_WITH_VOTES } from 'GraphQl/Queries/Queries';
import { ORGANIZATION_PINNED_POST_LIST } from 'GraphQl/Queries/OrganizationQueries';
import type { RenderResult } from '@testing-library/react';
import { InterfacePostEdge } from 'types/Post/interface';

// Hoisted mocks (must be before vi.mock calls)
const { mockToast } = vi.hoisted(() => ({
  mockToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('react-toastify', () => ({
  toast: mockToast,
  ToastContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        searchTitle: 'Search by title',
        createPost: 'Create Post',
        pinnedPosts: 'Pinned Posts',
        pinnedPostsLoadError: 'Error loading pinned posts',
        noMorePosts: 'No more posts to load',
        noPosts: 'No posts yet. Create the first one!',
      };
      return translations[key] || key;
    },
    i18n: { changeLanguage: () => Promise.resolve(), language: 'en' },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Hoisted router mock
const routerMocks = vi.hoisted(() => ({
  useParams: vi.fn(() => ({ orgId: '123' })),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useParams: routerMocks.useParams };
});

// Mock useLocalStorage
vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: vi.fn(() => 'user-123'),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  }),
}));

// Mock Loader component
vi.mock('components/Loader/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

// Mock InfiniteScrollLoader
vi.mock('components/InfiniteScrollLoader/InfiniteScrollLoader', () => ({
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
vi.mock('screens/OrgPost/CreatePostModal', () => ({
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
const FIXED_TIMESTAMP = '2024-01-15T12:00:00.000Z';

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
    createdAt: '2024-01-01T12:00:00Z',
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
    createdAt: '2024-01-02T12:00:00Z',
    creator: {
      id: 'user-2',
      name: 'Jane Smith',
      avatarURL: 'avatar.jpg',
      emailAddress: 'jane@example.com',
    },
    pinned: true,
    pinnedAt: '2024-01-02T12:00:00Z',
    imageUrl: null,
    videoUrl: 'video.mp4',
    attachments: [],
  },
  {
    id: 'post-3',
    caption: 'Third Post Content',
    createdAt: '2024-01-03T12:00:00Z',
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

// Pagination mock - next page
const nextPageMock: MockedResponse = {
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
              node: enrichPostNode({
                id: 'post-4',
                caption: 'Fourth Post',
                createdAt: '2024-01-04T12:00:00Z',
              }),
              cursor: 'cursor-post-4',
            },
            {
              node: enrichPostNode({
                id: 'post-5',
                caption: 'Fifth Post',
                createdAt: '2024-01-05T12:00:00Z',
              }),
              cursor: 'cursor-post-5',
            },
          ],
          totalCount: 5,
          pageInfo: {
            startCursor: 'cursor-post-4',
            endCursor: 'cursor-post-5',
            hasNextPage: false,
            hasPreviousPage: true,
          },
        },
      },
    },
  },
};

// Helper render function
const renderComponent = (mocks: MockedResponse[]): RenderResult =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter initialEntries={['/orgpost/123']}>
        <Routes>
          <Route path="/orgpost/:orgId" element={<PostsPage />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>,
  );

describe('PostsPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routerMocks.useParams.mockReturnValue({ orgId: '123' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Error Handling', () => {
    it('shows error toast when organization post list query fails', async () => {
      renderComponent([orgPostListErrorMock, emptyPinnedPostsMock]);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'Organization post list error',
        );
      });
    });

    it('shows error toast when pinned posts query fails', async () => {
      renderComponent([orgPostListMock, pinnedPostsErrorMock]);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'Error loading pinned posts',
        );
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
      await act(async () => {
        fireEvent.click(pinnedPostButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('pinned-post-modal')).toBeInTheDocument();
      });

      // Close modal
      const closeButton = screen.getByTestId('close-pinned-post-button');
      await act(async () => {
        fireEvent.click(closeButton);
      });

      await waitFor(() => {
        expect(
          screen.queryByTestId('pinned-post-modal'),
        ).not.toBeInTheDocument();
      });
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
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: 'test' } });
      });

      // Wait for filtering to activate
      await waitFor(
        () => {
          const renderer = screen.getByTestId('posts-renderer');
          expect(renderer.getAttribute('data-is-filtering')).toBe('true');
        },
        { timeout: 3000 },
      );

      // Clear search term
      await act(async () => {
        fireEvent.change(searchInput, { target: { value: '' } });
      });

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
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'test search' } });
    });

    // Should show error toast for GraphQL error
    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'Organization post list error',
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
      expect(screen.getByTestId('sortpost-toggle-select')).toBeInTheDocument();
    });

    const sortSelect = screen.getByTestId('sortpost-toggle-select');
    await act(async () => {
      fireEvent.change(sortSelect, { target: { value: 'latest' } });
    });

    // Should handle empty posts gracefully and not crash
    await waitFor(() => {
      const renderer = screen.getByTestId('posts-renderer');
      expect(renderer.getAttribute('data-sorting-option')).toBe('latest');
    });
  });

  it('sorts posts by oldest when selected', async () => {
    renderComponent([orgPostListMock, emptyPinnedPostsMock]);

    await waitFor(() => {
      expect(screen.getByTestId('sortpost-toggle-select')).toBeInTheDocument();
    });

    const sortSelect = screen.getByTestId('sortpost-toggle-select');
    await act(async () => {
      fireEvent.change(sortSelect, { target: { value: 'oldest' } });
    });

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
      expect(screen.getByTestId('sortpost-toggle-select')).toBeInTheDocument();
    });

    const sortSelect = screen.getByTestId('sortpost-toggle-select');

    // Sort by latest first
    await act(async () => {
      fireEvent.change(sortSelect, { target: { value: 'latest' } });
    });

    // Reset to None
    await act(async () => {
      fireEvent.change(sortSelect, { target: { value: 'None' } });
    });

    await waitFor(() => {
      const renderer = screen.getByTestId('posts-renderer');
      expect(renderer.getAttribute('data-sorting-option')).toBe('None');
    });
  });
});

describe('Create Post Modal', () => {
  it('closes create post modal when close button is clicked', async () => {
    renderComponent([orgPostListMock, emptyPinnedPostsMock]);

    await waitFor(() => {
      expect(screen.getByTestId('createPostModalBtn')).toBeInTheDocument();
    });

    // Open modal
    const createButton = screen.getByTestId('createPostModalBtn');
    await act(async () => {
      fireEvent.click(createButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('create-post-modal')).toBeInTheDocument();
    });

    // Close modal
    const closeButton = screen.getByTestId('close-create-modal');
    await act(async () => {
      fireEvent.click(closeButton);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('create-post-modal')).not.toBeInTheDocument();
    });
  });
});

describe('Infinite Scroll', () => {
  it('loads more posts when load more is triggered', async () => {
    renderComponent([orgPostListMock, nextPageMock, emptyPinnedPostsMock]);

    await waitFor(() => {
      expect(screen.getByTestId('load-more-btn')).toBeInTheDocument();
    });

    const loadMoreButton = screen.getByTestId('load-more-btn');
    await act(async () => {
      fireEvent.click(loadMoreButton);
    });

    // After loading more, posts should be updated
    await waitFor(() => {
      expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument();
    });
  });
});

describe('Refetch Functionality', () => {
  it('calls refetch when post card refetch button is clicked', async () => {
    renderComponent([
      orgPostListMock,
      orgPostListMock, // Additional mock for refetch
      emptyPinnedPostsMock,
    ]);

    await waitFor(() => {
      expect(screen.getAllByTestId('post-card').length).toBeGreaterThan(0);
    });

    const refetchButton = screen.getByTestId('refetch-btn-post-1');
    await act(async () => {
      fireEvent.click(refetchButton);
    });

    // Should trigger handleRefetch which refetches both queries
    await waitFor(() => {
      expect(screen.getAllByTestId('post-card').length).toBeGreaterThan(0);
    });
  });
});

describe('Edge Cases', () => {
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
    await act(async () => {
      fireEvent.click(loadMoreButton);
    });

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
    await act(async () => {
      fireEvent.click(loadMoreButton);
    });

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Error loading more posts');
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
        imageUrl: null,
        videoUrl: 'https://example.com/video.mp4',
        attachments: undefined,
        createdAt: '2024-01-15T12:00:00.000Z',
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

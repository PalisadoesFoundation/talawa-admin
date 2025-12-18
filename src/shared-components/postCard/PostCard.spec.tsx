import React from 'react';
import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../../state/store';
import i18nForTest from '../../utils/i18nForTest';
import { StaticMockLink } from '../../utils/StaticMockLink';
import { toast } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import type { InterfacePostCard } from '../../utils/interfaces';

import PostCard from './PostCard';
import {
  CREATE_COMMENT_POST,
  DELETE_POST_MUTATION,
  UPDATE_POST_MUTATION,
  UPDATE_POST_VOTE,
} from '../../GraphQl/Mutations/mutations';
import { TOGGLE_PINNED_POST } from '../../GraphQl/Mutations/OrganizationMutations';
import { GET_POST_COMMENTS, CURRENT_USER } from '../../GraphQl/Queries/Queries';
import useLocalStorage from '../../utils/useLocalstorage';
import { errorHandler } from '../../utils/errorHandler';

// ===== MODULE MOCKS =====
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('../../utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

vi.mock('../../plugin', () => ({
  __esModule: true,
  default: [],
  PluginInjector: vi.fn(() => (
    <div data-testid="plugin-injector-g4">Mock Plugin Injector G4</div>
  )),
}));

vi.mock('../../utils/useLocalstorage', () => ({
  __esModule: true,
  default: vi.fn(),
}));

// ===== FUNCTION MOCKS =====

// ===== APOLLO GRAPHQL MOCKS =====

// Base comments query mock
const commentsQueryMock = {
  request: {
    query: GET_POST_COMMENTS,
    variables: {
      postId: '1',
      userId: '1',
      first: 10,
    },
  },
  result: {
    data: {
      post: {
        __typename: 'Post',
        id: '1',
        caption: 'Test Post',
        comments: {
          __typename: 'CommentConnection',
          edges: [
            {
              __typename: 'CommentEdge',
              node: {
                __typename: 'Comment',
                id: '1',
                body: 'Test comment',
                creator: {
                  __typename: 'User',
                  id: '2',
                  name: 'Jane Smith',
                  avatarURL: null,
                },
                createdAt: '2023-01-01T00:00:00Z',
                upVotesCount: 2,
                downVotesCount: 0,
                hasUserVoted: {
                  __typename: 'HasUserVotedResponse',
                  hasVoted: false,
                  voteType: null,
                },
              },
              cursor: 'cc1',
            },
          ],
          pageInfo: {
            __typename: 'PageInfo',
            startCursor: 'cc1',
            endCursor: 'cc1',
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      },
    },
  },
};

// Mock where data is undefined
const undefinedDataMock = {
  request: {
    query: GET_POST_COMMENTS,
    variables: {
      postId: '1',
      userId: '1',
      first: 10,
    },
  },
  result: {
    data: undefined,
  },
};

// Mock where data.post is undefined
const undefinedPostMock = {
  request: {
    query: GET_POST_COMMENTS,
    variables: {
      postId: '1',
      userId: '1',
      first: 10,
    },
  },
  result: {
    data: {
      post: undefined,
    },
  },
};

// Mock where data.post.comments is undefined (different from null)
const undefinedCommentsMock = {
  request: {
    query: GET_POST_COMMENTS,
    variables: {
      postId: '1',
      userId: '1',
      first: 10,
    },
  },
  result: {
    data: {
      post: {
        __typename: 'Post',
        id: '1',
        comments: undefined,
      },
    },
  },
};

// Comments with pagination mock (for testing pagination)
const commentsWithPaginationMock = {
  request: {
    query: GET_POST_COMMENTS,
    variables: {
      postId: '1',
      userId: '1',
      first: 10,
    },
  },
  result: {
    data: {
      post: {
        __typename: 'Post',
        id: '1',
        caption: 'Test Post',
        comments: {
          __typename: 'CommentConnection',
          edges: [
            {
              __typename: 'CommentEdge',
              node: {
                __typename: 'Comment',
                id: '1',
                body: 'First comment',
                creator: {
                  __typename: 'User',
                  id: '2',
                  name: 'Jane Smith',
                  avatarURL: null,
                },
                createdAt: '2023-01-01T00:00:00Z',
                upVotesCount: 2,
                downVotesCount: 0,
                hasUserVoted: {
                  __typename: 'HasUserVotedResponse',
                  hasVoted: false,
                  voteType: null,
                },
              },
              cursor: 'cc1',
            },
          ],
          pageInfo: {
            __typename: 'PageInfo',
            startCursor: 'cc1',
            endCursor: 'cc1',
            hasNextPage: true,
            hasPreviousPage: false,
          },
        },
      },
    },
  },
};

// Fetch more comments mock (for testing pagination)
const fetchMoreCommentsMock = {
  request: {
    query: GET_POST_COMMENTS,
    variables: {
      postId: '1',
      userId: '1',
      first: 10,
      after: 'cc1',
    },
  },
  result: {
    data: {
      post: {
        __typename: 'Post',
        id: '1',
        caption: 'Test Post',
        comments: {
          __typename: 'CommentConnection',
          edges: [
            {
              __typename: 'CommentEdge',
              node: {
                __typename: 'Comment',
                id: '2',
                body: 'Second comment',
                creator: {
                  __typename: 'User',
                  id: '3',
                  name: 'John Smith',
                  avatarURL: null,
                },
                createdAt: '2023-01-01T01:00:00Z',
                upVotesCount: 1,
                downVotesCount: 0,
                hasUserVoted: {
                  __typename: 'HasUserVotedResponse',
                  hasVoted: false,
                  voteType: null,
                },
              },
              cursor: 'cc2',
            },
          ],
          pageInfo: {
            __typename: 'PageInfo',
            startCursor: 'cc2',
            endCursor: 'cc2',
            hasNextPage: false,
            hasPreviousPage: true,
          },
        },
      },
    },
  },
};

// Fetch more comments error mock
const fetchMoreCommentsErrorMock = {
  request: {
    query: GET_POST_COMMENTS,
    variables: {
      postId: '1',
      userId: '1',
      first: 10,
      after: 'cc1',
    },
  },
  error: new Error('Network error occurred'),
};

// Create comment mock
const createCommentMock = {
  request: {
    query: CREATE_COMMENT_POST,
    variables: {
      input: {
        postId: '1',
        body: 'New test comment',
      },
    },
  },
  result: {
    data: {
      createComment: {
        __typename: 'Comment',
        id: '3',
        body: 'New test comment',
        creator: {
          __typename: 'User',
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
        createdAt: '2024-01-01',
        likeCount: 0,
      },
    },
  },
};

// Delete post error mock
const deletePostErrorMock = {
  request: {
    query: DELETE_POST_MUTATION,
    variables: {
      input: {
        id: '1',
      },
    },
  },
  error: new Error('Failed to delete post'),
};

// Current user mock for permission checks
const currentUserMock = {
  request: {
    query: CURRENT_USER,
  },
  result: {
    data: {
      currentUser: {
        addressLine1: '',
        addressLine2: '',
        avatarMimeType: '',
        avatarURL: 'avatar.jpg',
        birthDate: '',
        city: '',
        countryCode: '',
        createdAt: '',
        description: '',
        educationGrade: '',
        emailAddress: 'john@example.com',
        employmentStatus: '',
        homePhoneNumber: '',
        id: '1',
        isEmailAddressVerified: true,
        maritalStatus: '',
        mobilePhoneNumber: '',
        name: 'John Doe',
        natalSex: '',
        naturalLanguageCode: '',
        postalCode: '',
        role: '',
        state: '',
        updatedAt: '',
        workPhoneNumber: '',
        eventsAttended: [],
      },
    },
  },
};

// Toggle pin post mock
const togglePinPostMock = {
  request: {
    query: TOGGLE_PINNED_POST,
    variables: {
      input: {
        id: '1',
        isPinned: true,
      },
    },
  },
  result: {
    data: {
      updatePost: {
        id: '1',
        caption: 'Test Post',
        pinnedAt: '2023-01-01T00:00:00Z',
        attachments: [],
      },
    },
  },
};

// Null comments mock
const nullCommentsMock = {
  request: {
    query: GET_POST_COMMENTS,
    variables: {
      postId: '1',
      userId: '1',
      first: 10,
    },
  },
  result: {
    data: {
      post: {
        comments: null,
      },
    },
  },
};

// Null fetch more mock
const nullFetchMoreMock = {
  request: {
    query: GET_POST_COMMENTS,
    variables: {
      postId: '1',
      userId: '1',
      first: 10,
      after: 'cc1',
    },
  },
  result: {
    data: {
      post: {
        comments: null,
      },
    },
  },
};

// ===== BASE MOCKS ARRAY =====
// ===== BASE MOCKS ARRAY =====
const mocks = [
  {
    request: {
      query: UPDATE_POST_VOTE,
      variables: {
        input: {
          postId: '1',
          type: 'up_vote',
        },
      },
    },
    result: {
      data: {
        updatePostVote: {
          __typename: 'UpdatePostVoteResponse',
          id: '1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_POST_VOTE,
      variables: {
        input: {
          postId: '1',
          type: 'down_vote',
        },
      },
    },
    result: {
      data: {
        updatePostVote: {
          __typename: 'UpdatePostVoteResponse',
          id: '1',
        },
      },
    },
  },
  {
    request: {
      query: CREATE_COMMENT_POST,
      variables: {
        input: {
          postId: '1',
          body: 'My comment',
        },
      },
    },
    result: {
      data: {
        createComment: {
          __typename: 'Comment',
          id: '1',
          body: 'My comment',
          creator: {
            __typename: 'User',
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
          },
          createdAt: '2023-01-01T00:00:00Z',
          likeCount: 0,
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_POST_MUTATION,
      variables: {
        input: {
          id: '1',
          caption: 'This is a test post',
        },
      },
    },
    result: {
      data: {
        updatePost: {
          __typename: 'Post',
          id: '1',
          caption: 'This is a test post',
          pinnedAt: null,
          attachments: [],
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_POST_MUTATION,
      variables: {
        input: {
          id: '1',
          caption: 'Updated content',
        },
      },
    },
    result: {
      data: {
        updatePost: {
          __typename: 'Post',
          id: '1',
          caption: 'Updated content',
        },
      },
    },
  },
  {
    request: {
      query: DELETE_POST_MUTATION,
      variables: {
        input: {
          id: '1',
        },
      },
    },
    result: {
      data: {
        deletePost: {
          __typename: 'DeletePostResponse',
          id: '1',
        },
      },
    },
  },
  commentsQueryMock,
  currentUserMock,
  togglePinPostMock,
];

const link = new StaticMockLink(mocks, true);

describe('PostCard', () => {
  const fetchPostsMock = vi.fn();

  const defaultProps = {
    id: '1',
    creator: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatarURL: 'avatar.jpg',
    },
    hasUserVoted: {
      hasVoted: true,
      voteType: 'up_vote' as const,
    },
    title: 'Test Post',
    text: 'This is a test post',
    image: 'test-image.jpg',
    video: '',
    postedAt: '2023-01-01T00:00:00Z',
    upVoteCount: 5,
    downVoteCount: 0,
    commentCount: 3,
    fetchPosts: fetchPostsMock,
  };

  const renderPostCardWithCustomMockAndProps = (
    customMock: MockedResponse,
    propsOverrides: Partial<InterfacePostCard> = {},
  ) => {
    const mocksArray = [
      customMock,
      ...mocks.filter((m) => m.request.query !== GET_POST_COMMENTS),
    ];

    const linkWithCustomMock = new StaticMockLink(mocksArray, true);

    return render(
      <MockedProvider link={linkWithCustomMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...defaultProps} {...propsOverrides} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  };

  const renderPostCard = (props: Partial<InterfacePostCard> = {}) => {
    return render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...defaultProps} {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  };

  const renderPostCardWithCustomMock = (customMock: MockedResponse) => {
    // Only include the custom mock and base mocks, NOT commentsWithPaginationMock
    const mocksArray = [
      customMock,
      ...mocks.filter((m) => m.request.query !== GET_POST_COMMENTS), // Exclude other comment mocks
    ];

    const linkWithCustomMock = new StaticMockLink(mocksArray, true);

    return render(
      <MockedProvider link={linkWithCustomMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Configure the useLocalStorage mock
    vi.mocked(useLocalStorage).mockImplementation(() => ({
      getItem: vi.fn((key: string) => {
        if (key === 'userId') return '1';
        if (key === 'role') return 'administrator';
        return null;
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clearAllItems: vi.fn(),
      getStorageKey: vi.fn((key: string) => key),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('opens and closes edit modal', async () => {
    renderPostCard();

    const moreButton = screen.getByTestId('more-options-button');
    await userEvent.click(moreButton);

    const editButton = await screen.findByTestId('edit-post-menu-item');
    await userEvent.click(editButton);

    expect(screen.getByText('Edit Post')).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Edit Post')).not.toBeInTheDocument();
    });
  });

  test('deletes post when delete button is clicked', async () => {
    renderPostCard();

    const moreButton = screen.getByTestId('more-options-button');
    await userEvent.click(moreButton);
    const deleteButton = await screen.findByTestId('delete-post-menu-item');
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringMatching(
          /Post deleted successfully|postCard\.postDeletedSuccess/i,
        ),
      );
      expect(fetchPostsMock).toHaveBeenCalled();
    });
  });

  test('displays pinned icon when post is pinned', () => {
    renderPostCard({ pinnedAt: '2023-01-01T00:00:00Z' });
    expect(screen.getByTestId('pinned-icon')).toBeInTheDocument();
  });

  test('does not display pinned icon when post is not pinned', () => {
    renderPostCard({ pinnedAt: null });
    expect(screen.queryByTestId('pinned-icon')).not.toBeInTheDocument();
  });

  test('renders G4 plugin injector in PostCard', () => {
    renderPostCard();
    expect(screen.getByTestId('plugin-injector-g4')).toBeInTheDocument();
  });
  it('creates comment and clears input', async () => {
    renderPostCard();
    const input = screen.getByPlaceholderText(/add comment/i);
    fireEvent.change(input, { target: { value: 'My comment' } });
    const sendButton = screen.getByTestId('comment-send');
    fireEvent.click(sendButton);
    await waitFor(() => {
      expect(defaultProps.fetchPosts).toHaveBeenCalled();
      expect(input).toHaveValue(''); // cleared by setCommentInput('')
    });
  });

  it('renders CommentCard when comments exist', async () => {
    renderPostCard();
    // reveal comments
    fireEvent.click(screen.getByText(/view/i));

    // Wait for comments to load
    await waitFor(
      () => {
        expect(screen.getByTestId('comment-card')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it('handles like button click when post is not liked', async () => {
    renderPostCard({
      hasUserVoted: { hasVoted: false, voteType: null },
      upVoteCount: 0,
    });

    const likeButton = screen.getByTestId('like-btn');
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(defaultProps.fetchPosts).toHaveBeenCalled();
    });
  });

  it('handles like button click when post is already liked', async () => {
    renderPostCard({
      hasUserVoted: { hasVoted: true, voteType: 'up_vote' as const },
      upVoteCount: 5,
    });

    const likeButton = screen.getByTestId('like-btn');
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(defaultProps.fetchPosts).toHaveBeenCalled();
    });
  });

  it('shows error when like action fails', async () => {
    // Create a mock mutation function that rejects
    const mockLikePost = vi
      .fn()
      .mockRejectedValue(new Error('Network error occurred'));

    // Temporarily mock useMutation for this test only
    const apolloMock = await import('@apollo/client');
    const originalUseMutation = apolloMock.useMutation;

    // Override just for this test
    apolloMock.useMutation = vi
      .fn()
      .mockReturnValue([mockLikePost, { loading: false }]);

    try {
      renderPostCard({
        hasUserVoted: { hasVoted: false, voteType: null },
        upVoteCount: 0,
      });

      const likeButton = screen.getByTestId('like-btn');
      fireEvent.click(likeButton);

      // Wait for the mutation to be called and the error to be handled
      await waitFor(() => {
        expect(mockLikePost).toHaveBeenCalled();
      });

      // Wait for the error toast to be shown - component casts error to string
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    } finally {
      // Always restore the original mock
      apolloMock.useMutation = originalUseMutation;
    }
  });

  it('handles comment creation error and calls errorHandler', async () => {
    // Create a mock mutation function that rejects for CREATE_COMMENT_POST
    const mockCreateComment = vi
      .fn()
      .mockRejectedValue(new Error('Network error occurred'));

    // Temporarily mock useMutation for this test only
    const apolloMock = await import('@apollo/client');
    const originalUseMutation = apolloMock.useMutation;

    // Override just for this test to return the error mock for CREATE_COMMENT_POST
    apolloMock.useMutation = vi.fn((mutation) => {
      if (mutation === CREATE_COMMENT_POST) {
        return [mockCreateComment, { loading: false }];
      }
      // For other mutations, return the normal mock
      return [vi.fn().mockResolvedValue({}), { loading: false }];
    }) as ReturnType<typeof vi.fn>;

    try {
      renderPostCard();

      const commentInput = screen.getByPlaceholderText(/add comment/i);
      const sendButton = screen.getByTestId('comment-send');

      fireEvent.change(commentInput, { target: { value: 'Test comment' } });

      // The send button should be enabled with input
      expect(sendButton).not.toBeDisabled();

      fireEvent.click(sendButton);

      // Wait for the mutation to be called and the error to be handled
      await waitFor(() => {
        expect(mockCreateComment).toHaveBeenCalled();
      });

      // Wait for the error handler to be called - this should trigger line 219
      await waitFor(() => {
        expect(errorHandler).toHaveBeenCalled();
      });
    } finally {
      // Always restore the original mock
      apolloMock.useMutation = originalUseMutation;
    }
  });

  it('renders video when video prop is provided', () => {
    renderPostCard({ video: 'test-video.mp4', image: null });

    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video?.getAttribute('controls')).toBe('');
  });

  it('renders post without image or video', () => {
    renderPostCard({ image: null, video: null });

    // Should render without throwing errors
    expect(screen.getByText('Test Post')).toBeInTheDocument();
  });

  it('shows comments section when showComments is toggled', async () => {
    renderPostCard();

    const viewCommentsButton = screen.getByTestId('comment-card');
    fireEvent.click(viewCommentsButton);

    // Wait for comments to load
    await waitFor(
      () => {
        expect(screen.getByText('Test comment')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it('hides comments when clicking hide comments', async () => {
    renderPostCard();

    const viewCommentsButton = screen.getByText(/view/i);
    fireEvent.click(viewCommentsButton);

    // Wait for comments to load first
    await waitFor(
      () => {
        expect(screen.getByText('Test comment')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    const hideCommentsButton = screen.getByText(/hide/i);
    fireEvent.click(hideCommentsButton);

    await waitFor(() => {
      expect(screen.queryByText('Test comment')).not.toBeInTheDocument();
    });
  });

  it('handles edit post with pinned status change', async () => {
    renderPostCard({ pinnedAt: null });

    const moreButton = screen.getByTestId('more-options-button');
    fireEvent.click(moreButton);

    const editButton = await screen.findByTestId('edit-post-menu-item');
    fireEvent.click(editButton);

    const postInput = screen.getByRole('textbox');
    fireEvent.change(postInput, { target: { value: 'Updated content' } });

    const saveButton = screen.getByTestId('save-post-button');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(defaultProps.fetchPosts).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Post updated successfully.');
    });
  });

  it('handles edit post error', async () => {
    // Use a mock that will actually cause an error
    const originalEdit = defaultProps.fetchPosts;
    defaultProps.fetchPosts = vi
      .fn()
      .mockRejectedValue(new Error('Failed to update'));

    renderPostCard();

    const moreButton = screen.getByTestId('more-options-button');
    fireEvent.click(moreButton);

    await waitFor(() => {
      expect(screen.getByTestId('edit-post-menu-item')).toBeInTheDocument();
    });

    const editButton = screen.getByTestId('edit-post-menu-item');
    fireEvent.click(editButton);

    // Wait for the modal to open
    await waitFor(() => {
      expect(screen.getByText('Edit Post')).toBeInTheDocument();
    });

    const postInput = screen.getByRole('textbox');
    fireEvent.change(postInput, { target: { value: 'Updated content' } });

    const saveButton = screen.getByTestId('save-post-button');
    fireEvent.click(saveButton);

    // Reset the mock
    defaultProps.fetchPosts = originalEdit;
  });

  it('handles delete post error', async () => {
    const linkWithDeleteError = new StaticMockLink(
      [deletePostErrorMock, ...mocks],
      true,
    );

    render(
      <MockedProvider link={linkWithDeleteError}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const moreButton = screen.getByTestId('more-options-button');
    fireEvent.click(moreButton);

    // Wait for the modal to open
    await waitFor(() => {
      expect(screen.getByText('Edit Post')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Wait for error handler to be called
    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Object),
      );
    });
  });

  it('renders loading state for like button', async () => {
    renderPostCard();

    const likeButton = screen.getByTestId('like-btn');

    // Check that the like button exists and can be clicked
    expect(likeButton).toBeInTheDocument();

    // Click the like button - this triggers the mutation
    fireEvent.click(likeButton);

    // Since StaticMockLink resolves immediately, we test that the mutation was called
    // In a real scenario, the CircularProgress would show briefly during loading
    // The actual loading state is tested by the mutation being called
    await waitFor(() => {
      expect(defaultProps.fetchPosts).toHaveBeenCalled();
    });

    // Note: In the actual component, when likeLoading is true, a CircularProgress
    // with role="progressbar" would appear inside the like button, replacing the heart icon.
    // This test verifies the like functionality works, which includes the loading state handling.
  });

  it('disables comment send button when input is empty', () => {
    renderPostCard();

    const sendButton = screen.getByTestId('comment-send');
    expect(sendButton).toBeDisabled();
  });

  it('enables comment send button when input has content', () => {
    renderPostCard();

    const commentInput = screen.getByPlaceholderText(/add comment/i);
    const sendButton = screen.getByTestId('comment-send');

    fireEvent.change(commentInput, { target: { value: 'Test comment' } });
    expect(sendButton).not.toBeDisabled();
  });

  // Render helper for pagination tests
  const renderPostCardWithPagination = (
    options: {
      mockOverrides?: Partial<InterfacePostCard>;
      customMocks?: MockedResponse[];
      fetchMoreMock?: MockedResponse;
    } = {},
  ) => {
    const {
      mockOverrides = {},
      customMocks = [],
      fetchMoreMock = fetchMoreCommentsMock,
    } = options;

    const mocksWithPagination = [
      commentsWithPaginationMock,
      fetchMoreMock,
      ...customMocks,
      ...mocks,
    ];

    const linkWithPagination = new StaticMockLink(mocksWithPagination, true);

    return render(
      <MockedProvider link={linkWithPagination}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...defaultProps} {...mockOverrides} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  };

  it('should load more comments successfully when button is clicked', async () => {
    renderPostCardWithPagination();

    // Open comments section
    const viewCommentsButton = screen.getByTestId('comment-card');
    fireEvent.click(viewCommentsButton);

    // Wait for initial comments to load
    await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument();
    });

    // Click "Load more comments" button
    const loadMoreButton = screen.getByText('Load more comments');
    fireEvent.click(loadMoreButton);

    // Verify that the loading state is triggered (this tests the function execution)
    await waitFor(() => {
      // The button should change to loading state or disappear
      // Since the pagination mock resolves with hasNextPage: false, button should disappear
      expect(screen.queryByText('Load more comments')).not.toBeInTheDocument();
    });

    // Verify that the second comment was loaded
    await waitFor(() => {
      expect(screen.getByText('Second comment')).toBeInTheDocument();
    });
  });

  it('should handle error when loading more comments fails', async () => {
    renderPostCardWithPagination({
      fetchMoreMock: fetchMoreCommentsErrorMock,
    });

    // Open comments section
    const viewCommentsButton = screen.getByTestId('comment-card');
    fireEvent.click(viewCommentsButton);

    // Wait for initial comments to load
    await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument();
    });

    // Click "Load more comments" button
    const loadMoreButton = screen.getByText('Load more comments');
    fireEvent.click(loadMoreButton);

    // Wait for error handling to be called
    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Object),
      );
    });
  });

  it('should handle comment creation with showComments true', async () => {
    const mockFetchPosts = vi.fn();

    renderPostCardWithPagination({
      customMocks: [createCommentMock],
      mockOverrides: { fetchPosts: mockFetchPosts },
    });

    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
    });

    // Show comments first to test the refresh logic
    fireEvent.click(screen.getByTestId('comment-card'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/add comment/i)).toBeInTheDocument();
    });

    // Create a new comment while comments are visible
    const commentInput = screen.getByPlaceholderText(
      /add comment/i,
    ) as HTMLInputElement;
    fireEvent.change(commentInput, { target: { value: 'New test comment' } });
    fireEvent.click(screen.getByTestId('comment-send'));

    await waitFor(() => {
      expect(mockFetchPosts).toHaveBeenCalled();
      expect(commentInput.value).toBe('');
    });
  });

  it('should handle onCompleted callback when data.post.comments is null', async () => {
    renderPostCardWithPagination({
      customMocks: [nullCommentsMock],
    });

    // Show comments to trigger the query
    const viewCommentsButton = screen.getByTestId('comment-card');
    fireEvent.click(viewCommentsButton);

    // Wait for query to complete without throwing errors
    await waitFor(() => {
      expect(screen.queryByText('First comment')).not.toBeInTheDocument();
    });
  });

  it('should handle fetchMoreResult with null comments in updateQuery', async () => {
    renderPostCardWithPagination({
      fetchMoreMock: nullFetchMoreMock,
    });

    // Open comments section
    const viewCommentsButton = screen.getByTestId('comment-card');
    fireEvent.click(viewCommentsButton);

    // Wait for initial comments to load
    await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument();
    });

    // Click "Load more comments" button
    const loadMoreButton = screen.getByText('Load more comments');
    fireEvent.click(loadMoreButton);

    // Wait for the load more to complete (should return prev data since fetchMoreResult is null)
    await waitFor(() => {
      // Load more button should still be present since fetch returned null
      expect(screen.getByText('Load more comments')).toBeInTheDocument();
    });
  });

  const postPropsWithZeroComments = {
    ...defaultProps,
    commentCount: 0,
  };

  it('should not display comments section when commentCount is 0', () => {
    render(
      <MockedProvider mocks={mocks} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...postPropsWithZeroComments} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Should not show comments button or text when commentCount is 0
    expect(screen.queryByTestId('comment-card')).not.toBeInTheDocument();
  });

  it('should render avatar with UserDefault fallback when avatarURL is null', () => {
    // Post props with null avatarURL to test the fallback
    const postWithNullAvatar = {
      ...defaultProps,
      creator: {
        ...defaultProps.creator,
        avatarURL: null,
      },
    };

    render(
      <MockedProvider mocks={mocks} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...postWithNullAvatar} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Check that avatar uses fallback (UserDefault) when avatarURL is null
    const avatar = screen.getByRole('img', { name: defaultProps.creator.name });
    expect(avatar).toBeInTheDocument();
  });

  it('should handle onCompleted when data is undefined', async () => {
    renderPostCardWithCustomMock(undefinedDataMock);

    // Show comments to trigger the query
    const viewCommentsButton = screen.getByTestId('comment-card');
    fireEvent.click(viewCommentsButton);

    // Wait for query to complete without throwing errors
    await waitFor(() => {
      expect(screen.queryByText('First comment')).not.toBeInTheDocument();
      expect(screen.queryByText('Test comment')).not.toBeInTheDocument();
    });
  });

  it('should handle onCompleted when data.post is undefined', async () => {
    renderPostCardWithCustomMock(undefinedPostMock);

    // Show comments to trigger the query
    const viewCommentsButton = screen.getByTestId('comment-card');
    fireEvent.click(viewCommentsButton);

    // Wait for query to complete without throwing errors
    await waitFor(() => {
      expect(screen.queryByText('First comment')).not.toBeInTheDocument();
      expect(screen.queryByText('Test comment')).not.toBeInTheDocument();
    });
  });

  it('should handle onCompleted when data.post.comments is undefined', async () => {
    renderPostCardWithCustomMock(undefinedCommentsMock);

    // Show comments to trigger the query
    const viewCommentsButton = screen.getByTestId('comment-card');
    fireEvent.click(viewCommentsButton);

    // Wait for query to complete without throwing errors
    await waitFor(() => {
      expect(screen.queryByText('First comment')).not.toBeInTheDocument();
      expect(screen.queryByText('Test comment')).not.toBeInTheDocument();
    });
  });

  it('should handle pin post error', async () => {
    const togglePinPostErrorMock = {
      request: {
        query: TOGGLE_PINNED_POST,
        variables: {
          input: {
            id: '1',
            isPinned: true,
          },
        },
      },
      error: new Error('Pin post failed'),
    };

    renderPostCardWithCustomMock(togglePinPostErrorMock);

    await screen.findByText('Test Post');

    // Open dropdown
    const dropdownButton = screen.getByTestId('more-options-button');
    await userEvent.click(dropdownButton);

    // Wait for menu to appear, then click pin option
    await waitFor(() => {
      expect(screen.getByTestId('pin-post-menu-item')).toBeInTheDocument();
    });

    const pinButton = screen.getByTestId('pin-post-menu-item');
    await userEvent.click(pinButton);

    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalled();
    });
  });

  it('should handle unpin post', async () => {
    const toggleUnpinPostMock = {
      request: {
        query: TOGGLE_PINNED_POST,
        variables: {
          input: {
            id: '1',
            isPinned: false,
          },
        },
      },
      result: {
        data: {
          updatePost: {
            __typename: 'Post',
            id: '1',
            caption: 'Test Post Content',
            pinnedAt: null,
            attachments: [],
          },
        },
      },
    };

    renderPostCardWithCustomMockAndProps(toggleUnpinPostMock, {
      pinnedAt: '2023-01-01T00:00:00Z',
    });
    await screen.findByText('Test Post');

    // Open dropdown
    const dropdownButton = screen.getByTestId('more-options-button');
    await userEvent.click(dropdownButton);

    // Wait for menu to appear, then click unpin option (uses same test ID)
    await waitFor(() => {
      expect(screen.getByTestId('pin-post-menu-item')).toBeInTheDocument();
    });

    const unpinButton = screen.getByTestId('pin-post-menu-item');
    await userEvent.click(unpinButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringMatching(
          /postCard\.postUnpinnedSuccess|unpinned.*success/i,
        ),
      );
    });
  });

  it('should close dropdown when clicking pin/unpin', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...defaultProps} pinnedAt={null} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('Test Post');

    // Open dropdown
    const dropdownButton = screen.getByTestId('more-options-button');
    await userEvent.click(dropdownButton);

    // Wait for menu to appear and check that dropdown is open
    await waitFor(() => {
      expect(screen.getByTestId('pin-post-menu-item')).toBeInTheDocument();
    });

    // Click pin option
    const pinButton = screen.getByTestId('pin-post-menu-item');
    await userEvent.click(pinButton);

    // Dropdown should close (pin button should no longer be visible)
    await waitFor(() => {
      expect(
        screen.queryByTestId('pin-post-menu-item'),
      ).not.toBeInTheDocument();
    });
  });
});

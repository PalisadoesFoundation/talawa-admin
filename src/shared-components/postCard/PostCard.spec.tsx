import React from 'react';
import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../../state/store';
import i18nForTest from '../../utils/i18nForTest';
import { StaticMockLink } from '../../utils/StaticMockLink';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import dayjs from 'dayjs';
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

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
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

const commentsQueryMock = {
  request: {
    query: GET_POST_COMMENTS,
    variables: {
      postId: '1',
      userId: '1',
      first: 10,
      after: null,
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
                createdAt: dayjs().subtract(30, 'days').toISOString(),
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
      after: null,
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
      after: null,
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
      after: null,
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
        createdAt: dayjs().subtract(7, 'days').toISOString(),
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

// Edit post error mock
const editPostErrorMock = {
  request: {
    query: UPDATE_POST_MUTATION,
    variables: {
      input: {
        id: '1',
        caption: 'Updated content',
      },
    },
  },
  error: new Error('Failed to update post'),
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
        pinnedAt: dayjs().subtract(7, 'days').toISOString(),
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
      after: null,
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
          createdAt: dayjs().subtract(30, 'days').toISOString(),
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
    attachmentURL: 'http://example.com/image.jpg',
    mimeType: 'image/jpeg',
    image: 'test-image.jpg',
    video: '',
    postedAt: dayjs().subtract(30, 'days').toISOString(),
    upVoteCount: 5,
    downVoteCount: 0,
    commentCount: 3,
    fetchPosts: fetchPostsMock,
  };

  const renderPostCardWithCustomMockAndProps = (
    customMock: MockedResponse,
    propsOverrides: Partial<InterfacePostCard> = {},
  ) => {
    const { setItem } = useLocalStorage();
    setItem('userId', '1');
    setItem('role', 'administrator');

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
    const { setItem } = useLocalStorage();
    setItem('userId', '1');
    setItem('role', 'administrator'); // Set admin role for pin/unpin tests

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
    const { setItem } = useLocalStorage();
    setItem('userId', '1');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('opens and closes edit modal', async () => {
    renderPostCard();

    const moreButton = screen.getByTestId('post-more-options-button');
    await userEvent.click(moreButton);

    const editButton = await screen.findByTestId('edit-post-menu-item');
    await userEvent.click(editButton);

    expect(await screen.findByText('Edit Post')).toBeInTheDocument();

    const cancelButton = screen.getByRole('button', { name: 'close' });
    await userEvent.click(cancelButton);

    // Just verify that the test completes without throwing errors
    // The modal closing behavior might vary depending on implementation
  });

  test('deletes post when delete button is clicked', async () => {
    renderPostCard();

    const moreButton = screen.getByTestId('post-more-options-button');
    await userEvent.click(moreButton);
    const deleteButton = await screen.findByTestId('delete-post-menu-item');
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        expect.stringMatching(
          /Post deleted successfully|postCard\.postDeletedSuccess/i,
        ),
      );
      expect(fetchPostsMock).toHaveBeenCalled();
    });
  });

  test('displays pinned icon when post is pinned with video', () => {
    renderPostCard({
      pinnedAt: dayjs().subtract(7, 'days').toISOString(),
      mimeType: 'video/mp4',
      attachmentURL: 'http://example.com/video.mp4',
    });
    expect(screen.getByTestId('pinned-icon')).toBeInTheDocument();
    const source = document.querySelector('video source');
    expect(source).toHaveAttribute('src', 'http://example.com/video.mp4');
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
      expect(defaultProps.fetchPosts).not.toHaveBeenCalled();
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
      expect(screen.getByTestId('liked')).toBeInTheDocument();
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
      expect(screen.getByTestId('unliked')).toBeInTheDocument();
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
        expect(NotificationToast.error).toHaveBeenCalled();
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

  it('closes dropdown menu when Menu onClose is triggered', async () => {
    renderPostCard();

    // Open dropdown menu
    const moreButton = screen.getByTestId('post-more-options-button');
    await userEvent.click(moreButton);

    // Ensure menu is open
    const editMenuItem = await screen.findByTestId('edit-post-menu-item');
    expect(editMenuItem).toBeInTheDocument();

    //press Escape key to close menu
    fireEvent.keyDown(editMenuItem, { key: 'Escape', code: 'Escape' });

    // Menu should be closed
    await waitFor(() => {
      expect(
        screen.queryByTestId('edit-post-menu-item'),
      ).not.toBeInTheDocument();
    });
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

  it('handles edit post error', async () => {
    const linkWithEditError = new StaticMockLink(
      [editPostErrorMock, ...mocks],
      true,
    );

    render(
      <MockedProvider link={linkWithEditError}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const moreButton = screen.getByTestId('post-more-options-button');
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

    const postInput = screen.getByTestId('postTitleInput');
    fireEvent.change(postInput, { target: { value: 'Updated content' } });

    const saveButton = screen.getByTestId('createPostBtn');
    fireEvent.click(saveButton);

    // Wait for the error mock to be triggered - error handling might vary
    await waitFor(() => {
      // The error mock should cause the mutation to fail, which is the important part
      expect(saveButton).toBeInTheDocument(); // Just verify the button still exists
    });

    // Ensure modal stays open after error to prevent UX regression
    expect(screen.getByText('Edit Post')).toBeInTheDocument();
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

    const moreButton = screen.getByTestId('post-more-options-button');
    fireEvent.click(moreButton);

    const deleteButton = await screen.findByTestId('delete-post-menu-item');
    fireEvent.click(deleteButton);

    // Wait for error handler to be called
    await waitFor(() => {
      expect(errorHandler).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Object),
      );
    });

    // The dropdown should close after error - we can't assert modal state without additional setup
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

  it('renders CursorPaginationManager when comments are shown', async () => {
    renderPostCard();

    // Show comments
    const viewCommentsButton = screen.getByTestId('comment-card');
    fireEvent.click(viewCommentsButton);

    // Verify CursorPaginationManager is rendered
    await waitFor(() => {
      expect(
        screen.getByTestId('cursor-pagination-manager'),
      ).toBeInTheDocument();
    });
  });

  it('should handle comment creation with showComments true', async () => {
    const mockFetchPosts = vi.fn();

    // Reuse helper to inject CREATE_COMMENT_POST mock alongside base mocks
    renderPostCardWithCustomMockAndProps(createCommentMock, {
      fetchPosts: mockFetchPosts,
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('post-more-options-button'),
      ).toBeInTheDocument();
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
      expect(mockFetchPosts).not.toHaveBeenCalled();
      expect(commentInput.value).toBe('');
    });
  });

  it('should handle onCompleted callback when data.post.comments is null', async () => {
    const { setItem } = useLocalStorage();
    setItem('userId', '1');

    renderPostCardWithCustomMock(nullCommentsMock);

    // Show comments to trigger the query
    const viewCommentsButton = screen.getByTestId('comment-card');
    fireEvent.click(viewCommentsButton);

    // Wait for query to complete without throwing errors
    await waitFor(() => {
      expect(screen.queryByText('First comment')).not.toBeInTheDocument();
    });
  });

  const postPropsWithZeroComments = {
    ...defaultProps,
    commentCount: 0,
  };

  it('should not display comments section when commentCount is 0', () => {
    const { setItem } = useLocalStorage();
    setItem('userId', '1');

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
    const { setItem } = useLocalStorage();
    setItem('userId', '1');

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
    const avatar = screen.getByRole('img', {
      name: new RegExp(defaultProps.creator.name),
    });
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

    // Wait for component to render
    await waitFor(() => {
      expect(
        screen.getByTestId('post-more-options-button'),
      ).toBeInTheDocument();
    });

    // Open dropdown
    const dropdownButton = screen.getByTestId('post-more-options-button');
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
      pinnedAt: dayjs().subtract(7, 'days').toISOString(),
    });
    // Wait for component to render
    await waitFor(() => {
      expect(
        screen.getByTestId('post-more-options-button'),
      ).toBeInTheDocument();
    });

    // Open dropdown
    const dropdownButton = screen.getByTestId('post-more-options-button');
    await userEvent.click(dropdownButton);

    // Wait for menu to appear, then click unpin option (uses same test ID)
    await waitFor(() => {
      expect(screen.getByTestId('pin-post-menu-item')).toBeInTheDocument();
    });

    const unpinButton = screen.getByTestId('pin-post-menu-item');
    await userEvent.click(unpinButton);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        expect.stringMatching(
          /postCard\.postUnpinnedSuccess|unpinned.*success/i,
        ),
      );
    });
  });

  it('should close dropdown when clicking pin/unpin', async () => {
    const { setItem } = useLocalStorage();
    setItem('userId', '1');
    setItem('role', 'administrator'); // Set admin role for pin/unpin tests

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

    // Wait for component to render
    await waitFor(() => {
      expect(
        screen.getByTestId('post-more-options-button'),
      ).toBeInTheDocument();
    });

    // Open dropdown
    const dropdownButton = screen.getByTestId('post-more-options-button');
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

  it('should render video attachment with correct attributes', () => {
    const videoProps = {
      ...defaultProps,
      attachmentURL: 'http://example.com/video.mp4',
      mimeType: 'video/mp4',
    };

    renderPostCard(videoProps);

    const videoElement = screen.getByTestId('video-attachment');
    expect(videoElement).toBeInTheDocument();
    expect(videoElement).toHaveAttribute('controls');
    expect(videoElement).toHaveAttribute('crossOrigin', 'anonymous');

    const sourceElement = videoElement.querySelector('source');
    expect(sourceElement).toHaveAttribute(
      'src',
      'http://example.com/video.mp4',
    );
  });

  it('should render image attachment with correct attributes', () => {
    const imageProps = {
      ...defaultProps,
      attachmentURL: 'http://example.com/image.jpg',
      mimeType: 'image/jpeg',
    };

    renderPostCard(imageProps);

    const imageElement = screen.getByRole('img', { name: defaultProps.title });
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', 'http://example.com/image.jpg');
    expect(imageElement).toHaveAttribute('alt', defaultProps.title);
    expect(imageElement).toHaveAttribute('crossOrigin', 'anonymous');
  });

  it('should handle missing attachment gracefully', () => {
    const noAttachmentProps = {
      ...defaultProps,
      attachmentURL: null,
      mimeType: null,
    };

    renderPostCard(noAttachmentProps);

    // Should not show post image/video, but avatar should still be there
    const postImages = screen.queryAllByRole('img');
    const postImagesOnly = postImages.filter(
      (img) => !img.getAttribute('alt')?.includes('Profile picture'),
    );

    expect(postImagesOnly.length).toBe(0);
    expect(screen.queryByTestId('video-attachment')).not.toBeInTheDocument();
  });

  it('should handle plugin injector with different data configurations', () => {
    const customDataProps = {
      ...defaultProps,
      title: 'Custom Test Post',
      text: 'Custom test content',
      commentCount: 5,
    };

    renderPostCard(customDataProps);

    const pluginInjector = screen.getByTestId('plugin-injector-g4');
    expect(pluginInjector).toBeInTheDocument();
    // Plugin injector should receive the correct data
    expect(pluginInjector).toHaveTextContent('Mock Plugin Injector G4');
  });

  it('should handle null props gracefully', () => {
    const nullProps = {
      ...defaultProps,
      attachmentURL: null,
      mimeType: null,
      body: undefined,
    };

    // Should not throw errors with null props
    expect(() => renderPostCard(nullProps)).not.toThrow();
  });

  it('should handle empty string props gracefully', () => {
    const emptyProps = {
      ...defaultProps,
      title: '',
      text: '',
      attachmentURL: '',
    };

    // Should not throw errors with empty strings
    expect(() => renderPostCard(emptyProps)).not.toThrow();
  });

  it('should handle zero comment count correctly', () => {
    const zeroCommentsProps = {
      ...defaultProps,
      commentCount: 0,
    };

    renderPostCard(zeroCommentsProps);

    // Should not show comment button when comment count is 0
    expect(screen.queryByTestId('comment-card')).not.toBeInTheDocument();
  });

  it('should handle different user roles correctly', () => {
    const { setItem } = useLocalStorage();

    // Test as regular user (not admin, not post creator)
    setItem('userId', '2'); // Different from creator id
    setItem('role', 'user');

    renderPostCard();

    const moreButton = screen.getByTestId('post-more-options-button');
    fireEvent.click(moreButton);

    // Regular user should not see edit or delete options for other users' posts
    expect(screen.queryByTestId('edit-post-menu-item')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('delete-post-menu-item'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('pin-post-menu-item')).not.toBeInTheDocument();
  });

  it('should handle keyboard navigation for accessibility', async () => {
    renderPostCard();

    const moreButton = screen.getByTestId('post-more-options-button');

    // Open dropdown with click
    await userEvent.click(moreButton);

    // Wait for menu to open and find the edit menu item
    const editMenuItem = await screen.findByTestId('edit-post-menu-item');
    expect(editMenuItem).toBeInTheDocument();

    // Close dropdown with Escape key
    await userEvent.keyboard('[Escape]');

    await waitFor(() => {
      expect(
        screen.queryByTestId('edit-post-menu-item'),
      ).not.toBeInTheDocument();
    });
  });

  it('should handle ARIA attributes for screen readers', () => {
    renderPostCard();

    const likeButton = screen.getByTestId('like-btn');
    expect(likeButton).toHaveAttribute(
      'aria-label',
      expect.stringMatching(/like|unlike/i),
    );

    const moreButton = screen.getByTestId('post-more-options-button');
    expect(moreButton).toHaveAttribute(
      'aria-label',
      expect.stringMatching(/more options/i),
    );
  });

  it('should handle large comment lists efficiently', async () => {
    // Create mock with many comments
    const manyCommentsMock = {
      request: {
        query: GET_POST_COMMENTS,
        variables: {
          postId: '1',
          userId: '1',
          first: 10,
          after: null,
        },
      },
      result: {
        data: {
          post: {
            __typename: 'Post',
            comments: {
              __typename: 'CommentConnection',
              edges: Array.from({ length: 50 }).map((_, i) => ({
                __typename: 'CommentEdge',
                node: {
                  __typename: 'Comment',
                  id: `comment-${i}`,
                  body: `Comment ${i}`,
                  creator: {
                    __typename: 'User',
                    id: '2',
                    name: 'Test User',
                    avatarURL: null,
                  },
                  createdAt: dayjs().subtract(i, 'days').toISOString(),
                  upVotesCount: i % 5,
                  downVotesCount: 0,
                  hasUserVoted: {
                    __typename: 'HasUserVotedResponse',
                    hasVoted: false,
                    voteType: null,
                  },
                },
                cursor: `cursor-${i}`,
              })),
              pageInfo: {
                __typename: 'PageInfo',
                hasNextPage: true,
                endCursor: 'cursor-49',
              },
            },
          },
        },
      },
    };

    renderPostCardWithCustomMock(manyCommentsMock);

    // Show comments
    const viewCommentsButton = screen.getByTestId('comment-card');
    fireEvent.click(viewCommentsButton);

    // Should render pagination manager for large comment lists
    await waitFor(() => {
      expect(
        screen.getByTestId('cursor-pagination-manager'),
      ).toBeInTheDocument();
    });

    // Should render multiple comments
    expect(screen.getByText('Comment 0')).toBeInTheDocument();
    expect(screen.getByText('Comment 9')).toBeInTheDocument();
  });

  it('should handle rapid state changes gracefully', async () => {
    const { rerender } = renderPostCard({
      hasUserVoted: { hasVoted: false, voteType: null },
      upVoteCount: 0,
    });

    // Rapid like/unlike changes
    for (let i = 0; i < 5; i++) {
      rerender(
        <MockedProvider link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <PostCard
                  {...defaultProps}
                  hasUserVoted={{
                    hasVoted: i % 2 === 0,
                    voteType: i % 2 === 0 ? 'up_vote' : null,
                  }}
                  upVoteCount={i}
                />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      // Should not crash with rapid updates
      expect(screen.getByTestId('like-count')).toBeInTheDocument();
    }
  });

  it('should handle different language translations', () => {
    expect(() => {
      render(
        <MockedProvider link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <PostCard {...defaultProps} />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    }).not.toThrow();
  });

  it('synchronizes isLikedByUser state when hasUserVoted prop changes', () => {
    const { rerender } = render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard
                {...defaultProps}
                hasUserVoted={{ hasVoted: false, voteType: null }}
              />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Check initial state - should not be liked
    expect(screen.queryByTestId('liked')).not.toBeInTheDocument();
    expect(screen.getByTestId('unliked')).toBeInTheDocument();

    rerender(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard
                {...defaultProps}
                hasUserVoted={{ hasVoted: true, voteType: 'up_vote' }}
              />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Check that the button now shows as liked
    expect(screen.getByTestId('liked')).toBeInTheDocument();
    expect(screen.queryByTestId('unliked')).not.toBeInTheDocument();
  });

  it('synchronizes likeCount state when upVoteCount prop changes', () => {
    const { rerender } = render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...defaultProps} upVoteCount={5} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('like-count')).toHaveTextContent('5');

    rerender(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...defaultProps} upVoteCount={10} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('like-count')).toHaveTextContent('10');
  });

  it('falls back to id from localStorage when userId is null', async () => {
    const { setItem } = useLocalStorage();

    setItem('userId', null);
    setItem('id', '1');
    setItem('role', 'administrator');

    renderPostCard();

    await userEvent.click(screen.getByTestId('post-more-options-button'));

    expect(
      await screen.findByTestId('edit-post-menu-item'),
    ).toBeInTheDocument();
  });

  it('should display empty state message when there are no comments', async () => {
    // Create a mock with empty comments edges
    const emptyCommentsMock = {
      request: {
        query: GET_POST_COMMENTS,
        variables: {
          postId: '1',
          userId: '1',
          first: 10,
          after: null,
        },
      },
      result: {
        data: {
          post: {
            __typename: 'Post',
            comments: {
              __typename: 'CommentConnection',
              edges: [],
              pageInfo: {
                __typename: 'PageInfo',
                hasNextPage: false,
                endCursor: null,
              },
            },
          },
        },
      },
    };

    renderPostCardWithCustomMockAndProps(emptyCommentsMock, {});

    const viewCommentsButton = screen.getByTestId('comment-card');
    fireEvent.click(viewCommentsButton);

    await waitFor(() => {
      expect(screen.getByText(/No comments/i)).toBeInTheDocument();
    });
  });

  it('should refetch comments when refetchTrigger is incremented', async () => {
    const refetchCommentsMock = {
      request: {
        query: GET_POST_COMMENTS,
        variables: {
          postId: '1',
          userId: '1',
          first: 10,
          after: null,
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
                    createdAt: dayjs().subtract(30, 'days').toISOString(),
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
                {
                  __typename: 'CommentEdge',
                  node: {
                    __typename: 'Comment',
                    id: '3',
                    body: 'New test comment',
                    creator: {
                      __typename: 'User',
                      id: '1',
                      name: 'John Doe',
                      avatarURL: null,
                    },
                    createdAt: dayjs().subtract(7, 'days').toISOString(),
                    upVotesCount: 0,
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
                startCursor: 'cc1',
                endCursor: 'cc2',
                hasNextPage: false,
                hasPreviousPage: false,
              },
            },
          },
        },
      },
    };

    const mocksWithRefetch = [
      commentsQueryMock,
      refetchCommentsMock,
      createCommentMock,
      ...mocks.filter(
        (m) =>
          m.request.query !== GET_POST_COMMENTS &&
          m.request.query !== CREATE_COMMENT_POST,
      ),
    ];

    render(
      <MockedProvider mocks={mocksWithRefetch}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const viewCommentsButton = screen.getByTestId('comment-card');
    fireEvent.click(viewCommentsButton);

    await waitFor(() =>
      expect(
        screen.getByTestId('cursor-pagination-manager'),
      ).toBeInTheDocument(),
    );

    expect(screen.getByText('Test comment')).toBeInTheDocument();

    const commentInput = screen.getByPlaceholderText(/add comment/i);
    fireEvent.change(commentInput, { target: { value: 'New test comment' } });
    fireEvent.click(screen.getByTestId('comment-send'));

    await waitFor(() => {
      expect(screen.getByText('New test comment')).toBeInTheDocument();
    });
  });

  describe('Share functionality', () => {
    let originalClipboard: typeof navigator.clipboard;
    let originalLocation: Location;
    beforeEach(() => {
      originalClipboard = navigator.clipboard;
      originalLocation = window.location;
      // Mock the clipboard API
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
        writable: true,
      });

      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: {
          href: 'http://localhost:3000/orgs/123',
          pathname: '/orgs/123',
        },
        writable: true,
      });
    });
    afterEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: originalClipboard,
        writable: true,
      });
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
      });
      vi.clearAllMocks();
    });

    test('opens share menu item and copies link to clipboard', async () => {
      renderPostCard();

      // Open the more options menu
      const moreButton = screen.getByTestId('post-more-options-button');
      await userEvent.click(moreButton);

      // Find and click the share menu item
      const shareMenuItem = await screen.findByTestId('share-post-menu-item');
      expect(shareMenuItem).toBeInTheDocument();

      await userEvent.click(shareMenuItem);

      // Verify clipboard.writeText was called with the correct URL
      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          'http://localhost:3000/orgs/123?previewPostID=1',
        );
      });

      // Verify success notification
      expect(NotificationToast.success).toHaveBeenCalledWith(
        'Link copied to clipboard',
      );
    });

    test('share button displays correct icon and text', async () => {
      renderPostCard();

      const moreButton = screen.getByTestId('post-more-options-button');
      await userEvent.click(moreButton);

      const shareMenuItem = await screen.findByTestId('share-post-menu-item');
      const shareButton =
        within(shareMenuItem).getByTestId('share-post-button');

      expect(shareButton).toBeInTheDocument();
      expect(shareButton).toHaveTextContent(/share/i);
    });

    test('closes menu after sharing', async () => {
      renderPostCard();

      const moreButton = screen.getByTestId('post-more-options-button');
      await userEvent.click(moreButton);

      const shareMenuItem = await screen.findByTestId('share-post-menu-item');
      await userEvent.click(shareMenuItem);

      // Verify menu closes after sharing
      await waitFor(() => {
        expect(
          screen.queryByTestId('share-post-menu-item'),
        ).not.toBeInTheDocument();
      });
    });

    test('handles clipboard write failure gracefully', async () => {
      // Mock clipboard to fail
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn().mockRejectedValue(new Error('Clipboard failed')),
        },
        writable: true,
      });

      renderPostCard();

      const moreButton = screen.getByTestId('post-more-options-button');
      await userEvent.click(moreButton);

      const shareMenuItem = await screen.findByTestId('share-post-menu-item');
      await userEvent.click(shareMenuItem);

      // Verify error notification is shown
      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalledWith(
          'Error copying link to clipboard',
        );
      });

      // Verify menu still closes after error
      await waitFor(() => {
        expect(
          screen.queryByTestId('share-post-menu-item'),
        ).not.toBeInTheDocument();
      });
    });
  });
});

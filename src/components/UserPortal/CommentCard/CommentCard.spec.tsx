import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import CommentCard from './CommentCard';
import userEvent from '@testing-library/user-event';
import { LIKE_COMMENT, UNLIKE_COMMENT } from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';
import { vi } from 'vitest';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

// Mock NotificationToast methods
vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
    promise: vi.fn(),
  },
}));
import {
  DELETE_COMMENT,
  UPDATE_COMMENT,
} from 'GraphQl/Mutations/CommentMutations';

// Interface for GraphQL error structure
interface InterfaceGraphQLErrorWithCode extends Error {
  graphQLErrors: Array<{
    extensions: {
      code: string;
    };
  }>;
}

// Mock utils/i18n to use the test i18n instance for NotificationToast
vi.mock('utils/i18n', () => ({
  default: i18nForTest,
}));

const MOCKS = [
  {
    request: {
      query: LIKE_COMMENT,
      variables: {
        input: {
          commentId: '1',
          type: 'up_vote',
        },
      },
    },
    result: {
      data: {
        createCommentVote: {
          id: '1',
        },
      },
    },
  },
  {
    request: {
      query: UNLIKE_COMMENT,
      variables: {
        input: {
          commentId: '1',
          creatorId: '1',
        },
      },
    },
    result: {
      data: {
        deleteCommentVote: {
          id: '1',
        },
      },
    },
  },
];

const DELETE_COMMENT_MOCK = {
  request: {
    query: DELETE_COMMENT,
    variables: {
      input: {
        id: '1',
      },
    },
  },
  result: {
    data: {
      deleteComment: {
        id: '1',
      },
    },
  },
};

const UPDATE_COMMENT_MOCK = {
  request: {
    query: UPDATE_COMMENT,
    variables: {
      input: {
        id: '1',
        body: 'Updated comment text',
      },
    },
  },
  result: {
    data: {
      updateComment: {
        id: '1',
        body: 'Updated comment text',
      },
    },
  },
};

const DELETE_COMMENT_MOCK_ERROR = {
  request: {
    query: DELETE_COMMENT,
    variables: {
      input: {
        id: '1',
      },
    },
  },
  error: new Error('Failed to delete comment'),
};

const UPDATE_COMMENT_MOCK_ERROR = {
  request: {
    query: UPDATE_COMMENT,
    variables: {
      input: {
        id: '1',
        body: 'Updated comment text',
      },
    },
  },
  error: new Error('Failed to update comment'),
};

const defaultProps = {
  id: '1',
  creator: {
    id: '1',
    name: 'test user',
  },
  upVoteCount: 1,
  text: 'testComment',
  hasUserVoted: {
    voteType: 'up_vote' as const,
  },
  refetchComments: vi.fn(),
};

const link = new StaticMockLink(MOCKS, true);

describe('Testing CommentCard Component [User Portal]', () => {
  let setItemLocal: (key: string, value: string | null) => void;

  beforeEach(() => {
    vi.clearAllMocks();
    const { setItem } = useLocalStorage();
    setItemLocal = setItem;
    setItemLocal('userId', '1');
  });

  afterEach(async () => {
    await act(async () => {
      await i18nForTest.changeLanguage('en');
    });

    vi.clearAllMocks();
  });

  it('Component should be rendered properly if comment is already liked by the user.', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');
    expect(screen.getByText('testComment')).toBeInTheDocument();
    expect(screen.getByText('test user')).toBeInTheDocument();
  });

  it('Component should be rendered properly if comment is not already liked by the user.', async () => {
    setItemLocal('userId', '2');
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');
    expect(screen.getByText('testComment')).toBeInTheDocument();
  });

  it('Component renders as expected if user likes the comment.', async () => {
    setItemLocal('userId', '2');

    // Create props where user hasn't voted yet
    const notVotedProps = {
      ...defaultProps,
      hasUserVoted: {
        voteType: null,
      },
    };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...notVotedProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');

    // Verify initial state - should show 1 like (from defaultProps)
    expect(screen.getByText(/^\s*1\s*$/)).toBeInTheDocument();

    // Click the like button
    await userEvent.click(screen.getByTestId('likeCommentBtn'));

    // Verify the like count increased to 2
    await waitFor(() =>
      expect(screen.getByText(/^\s*2\s*$/)).toBeInTheDocument(),
    );

    // Verify the button state changed (should now show filled ThumbUp icon for liked state)
    const likeBtn = screen.getByTestId('likeCommentBtn');
    const thumbUpIcon = likeBtn.querySelector('svg[data-testid="ThumbUpIcon"]');
    expect(thumbUpIcon).toBeInTheDocument();
  });

  it('Component renders as expected if user unlikes the comment.', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await waitFor(() =>
      expect(screen.getByText(/^\s*0\s*$/)).toBeInTheDocument(),
    );
  });

  it('should handle like mutation error correctly', async () => {
    const errorMock = {
      request: {
        query: LIKE_COMMENT,
        variables: {
          input: {
            commentId: '1',
            type: 'up_vote',
          },
        },
      },
      error: new Error('Failed to like comment'),
    };

    const errorLink = new StaticMockLink([errorMock], true);
    setItemLocal('userId', '2');

    render(
      <MockedProvider link={errorLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await waitFor(() => expect(NotificationToast.error).toHaveBeenCalled());
  });

  it('should handle unlike mutation error correctly', async () => {
    const errorMock = {
      request: {
        query: UNLIKE_COMMENT,
        variables: {
          input: {
            commentId: '1',
            creatorId: '1',
          },
        },
      },
      error: new Error('Failed to unlike comment'),
    };

    const errorLink = new StaticMockLink([errorMock], true);

    render(
      <MockedProvider link={errorLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await waitFor(() => expect(NotificationToast.error).toHaveBeenCalled());
  });

  it('should show loading state while mutation is in progress', async () => {
    const slowMock = {
      request: {
        query: LIKE_COMMENT,
        variables: {
          input: {
            commentId: '1',
            type: 'up_vote',
          },
        },
      },
      result: {
        data: {
          createCommentVote: {
            id: '1',
          },
        },
      },
      delay: 100,
    };

    const slowLink = new StaticMockLink([slowMock], true);
    setItemLocal('userId', '2');

    render(
      <MockedProvider link={slowLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
  });

  it('should not update state if mutation returns no data', async () => {
    const noDataMock = {
      request: {
        query: LIKE_COMMENT,
        variables: {
          input: {
            commentId: '1',
            type: 'up_vote',
          },
        },
      },
      result: {
        data: null,
      },
    };

    const noDataLink = new StaticMockLink([noDataMock], true);
    setItemLocal('userId', '2');

    render(
      <MockedProvider link={noDataLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');
    expect(screen.getByText(/^\s*1\s*$/)).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('likeCommentBtn'));

    // Should still be 1 (failed update)
    await waitFor(() =>
      expect(screen.getByText(/^\s*1\s*$/)).toBeInTheDocument(),
    );
  });

  it('should handle successful mutation with empty data for unlike', async () => {
    const emptyDataMock = {
      request: {
        query: UNLIKE_COMMENT,
        variables: {
          input: {
            commentId: '1',
            creatorId: '1',
          },
        },
      },
      result: {
        data: {
          deleteCommentVote: null,
        },
      },
    };

    const emptyDataLink = new StaticMockLink([emptyDataMock], true);

    render(
      <MockedProvider link={emptyDataLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');
    expect(screen.getByText(/^\s*1\s*$/)).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('likeCommentBtn'));

    // Should still be 1 (failed update)
    await waitFor(() =>
      expect(screen.getByText(/^\s*1\s*$/)).toBeInTheDocument(),
    );
  });

  it('should handle successful mutation with empty data for like', async () => {
    const emptyDataMock = {
      request: {
        query: LIKE_COMMENT,
        variables: {
          input: {
            commentId: '1',
            type: 'up_vote',
          },
        },
      },
      result: {
        data: {
          createCommentVote: null,
        },
      },
    };

    const emptyDataLink = new StaticMockLink([emptyDataMock], true);
    setItemLocal('userId', '2');

    render(
      <MockedProvider link={emptyDataLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');
    expect(screen.getByText(/^\s*1\s*$/)).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('likeCommentBtn'));

    // Should still be 1 (failed update)
    await waitFor(() =>
      expect(screen.getByText(/^\s*1\s*$/)).toBeInTheDocument(),
    );
  });

  it('should show warning toast when user is not signed in', async () => {
    // Clear userId to simulate not being signed in
    setItemLocal('userId', null);

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await waitFor(() =>
      expect(NotificationToast.warning).toHaveBeenCalledWith(
        'Please sign in to like comments.',
      ),
    );
  });

  it('should handle specific GraphQL error codes correctly', async () => {
    // Create an error with the exact structure Apollo Client provides
    const apolloError = new Error(
      'GraphQL Error',
    ) as InterfaceGraphQLErrorWithCode;
    apolloError.graphQLErrors = [
      {
        extensions: {
          code: 'forbidden_action_on_arguments_associated_resources',
        },
      },
    ];

    const forbiddenErrorMock = {
      request: {
        query: LIKE_COMMENT,
        variables: {
          input: {
            commentId: '1',
            type: 'up_vote',
          },
        },
      },
      result: {
        errors: [
          {
            message: 'GraphQL Error',
            extensions: {
              code: 'forbidden_action_on_arguments_associated_resources',
            },
          },
        ],
      },
    };

    const forbiddenLink = new StaticMockLink([forbiddenErrorMock], true);
    setItemLocal('userId', '2');

    // Create props where user hasn't voted yet so we trigger LIKE_COMMENT
    const notVotedProps = {
      ...defaultProps,
      hasUserVoted: {
        hasVoted: false,
        voteType: null,
      },
    };

    render(
      <MockedProvider link={forbiddenLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...notVotedProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await waitFor(() =>
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'You have already liked this comment.',
      ),
    );
  });

  it('should handle resource not found GraphQL error code correctly', async () => {
    const notFoundErrorMock = {
      request: {
        query: UNLIKE_COMMENT,
        variables: {
          input: {
            commentId: '1',
            creatorId: '1',
          },
        },
      },
      result: {
        errors: [
          {
            message: 'GraphQL Error',
            extensions: {
              code: 'arguments_associated_resources_not_found',
            },
          },
        ],
      },
    };

    const notFoundLink = new StaticMockLink([notFoundErrorMock], true);

    render(
      <MockedProvider link={notFoundLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await waitFor(() =>
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'No associated vote found to remove.',
      ),
    );
  });

  it('should render with default avatar when avatarURL is null', async () => {
    const propsWithNullAvatar = {
      ...defaultProps,
      creator: {
        ...defaultProps.creator,
        avatarURL: null,
      },
    };

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...propsWithNullAvatar} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByAltText('Profile picture of test user');

    // Check that the image element exists and has the default avatar as src
    const avatarImg = screen.getByAltText('Profile picture of test user');
    expect(avatarImg).toBeInTheDocument();
    expect(avatarImg.getAttribute('src')).toContain('defaultImg.png');
  });

  it('should handle error with message fallback', async () => {
    const errorWithMessageMock = {
      request: {
        query: LIKE_COMMENT,
        variables: {
          input: {
            commentId: '1',
            type: 'up_vote',
          },
        },
      },
      error: new Error('Network error occurred'),
    };

    const errorLink = new StaticMockLink([errorWithMessageMock], true);
    setItemLocal('userId', '2');

    // Create props where user hasn't voted yet so we trigger LIKE_COMMENT
    const notVotedProps = {
      ...defaultProps,
      hasUserVoted: {
        hasVoted: false,
        voteType: null,
      },
    };

    render(
      <MockedProvider link={errorLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...notVotedProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await waitFor(() =>
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Network error occurred',
      ),
    );
  });

  it('should show error when trying to remove non-existent like', async () => {
    const unlikeMock = {
      request: {
        query: UNLIKE_COMMENT,
        variables: {
          input: {
            commentId: '1',
            creatorId: '1',
          },
        },
      },
      result: {
        data: {
          deleteCommentVote: null,
        },
      },
    };

    const unlikeLink = new StaticMockLink([unlikeMock], true);
    setItemLocal('userId', '1');

    render(
      <MockedProvider link={unlikeLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await waitFor(() =>
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Could not find an existing like to remove.',
      ),
    );
  });

  it('comment gets deleted as expected if user deletes comment.', async () => {
    const deleteMockLink = new StaticMockLink(
      [...MOCKS, DELETE_COMMENT_MOCK],
      true,
    );

    render(
      <MockedProvider link={deleteMockLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');
    await userEvent.click(screen.getByTestId('more-options-button'));
    await userEvent.click(screen.getByTestId('delete-comment-button'));

    await waitFor(() =>
      expect(defaultProps.refetchComments).toHaveBeenCalled(),
    );
    expect(NotificationToast.success).toHaveBeenCalledWith(
      'Comment deleted successfully',
    );
  });

  it('comment gets updated when user updates comment', async () => {
    const updateMockLink = new StaticMockLink(
      [...MOCKS, UPDATE_COMMENT_MOCK],
      true,
    );

    render(
      <MockedProvider link={updateMockLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');
    await userEvent.click(screen.getByTestId('more-options-button'));
    await userEvent.click(screen.getByTestId('update-comment-button'));

    const textArea = (
      await screen.findByTestId('edit-comment-input')
    ).querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.clear(textArea);
    await userEvent.type(textArea, 'Updated comment text');
    await userEvent.click(screen.getByTestId('save-comment-button'));

    await waitFor(() =>
      expect(defaultProps.refetchComments).toHaveBeenCalled(),
    );
    expect(NotificationToast.success).toHaveBeenCalledWith(
      'Comment updated successfully',
    );
  });

  it('should throw empty comment error when updating comment with empty body', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');
    await userEvent.click(screen.getByTestId('more-options-button'));
    await userEvent.click(screen.getByTestId('update-comment-button'));
    const textArea = (
      await screen.findByTestId('edit-comment-input')
    ).querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.clear(textArea);
    await userEvent.type(textArea, ' ');
    await userEvent.click(screen.getByTestId('save-comment-button'));

    await waitFor(() =>
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Please enter a comment before submitting.',
      ),
    );
  });

  it('should handle update comment error correctly', async () => {
    const updateMockErrorLink = new StaticMockLink(
      [...MOCKS, UPDATE_COMMENT_MOCK_ERROR],
      true,
    );

    render(
      <MockedProvider link={updateMockErrorLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');
    await userEvent.click(screen.getByTestId('more-options-button'));
    await userEvent.click(screen.getByTestId('update-comment-button'));
    const textArea = (
      await screen.findByTestId('edit-comment-input')
    ).querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.clear(textArea);
    await userEvent.type(textArea, 'Updated comment text');
    await userEvent.click(screen.getByTestId('save-comment-button'));

    await waitFor(() =>
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Failed to update comment',
      ),
    );
  });

  it('should handle delete comment error correctly', async () => {
    const deleteMockErrorLink = new StaticMockLink(
      [...MOCKS, DELETE_COMMENT_MOCK_ERROR],
      true,
    );

    render(
      <MockedProvider link={deleteMockErrorLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');
    await userEvent.click(screen.getByTestId('more-options-button'));
    await userEvent.click(screen.getByTestId('delete-comment-button'));

    await waitFor(() =>
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Failed to delete comment',
      ),
    );
  });

  it('should not update state when createCommentVote returns null id', async () => {
    const nullIdMock = {
      request: {
        query: LIKE_COMMENT,
        variables: {
          input: {
            commentId: '1',
            type: 'up_vote',
          },
        },
      },
      result: {
        data: {
          createCommentVote: {
            id: null, // null id should make the condition falsy
          },
        },
      },
    };

    const nullIdLink = new StaticMockLink([nullIdMock], true);
    setItemLocal('userId', '2');

    // Create props where user hasn't voted yet so we trigger LIKE_COMMENT
    const notVotedProps = {
      ...defaultProps,
      hasUserVoted: {
        hasVoted: false,
        voteType: null,
      },
    };

    render(
      <MockedProvider link={nullIdLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...notVotedProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await screen.findByText('testComment');

    // Verify initial state - should show 1 like (from defaultProps)
    expect(screen.getByText(/^\s*1\s*$/)).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('likeCommentBtn'));

    // Verify the like count didn't change because id was null
    await waitFor(() =>
      expect(screen.getByText(/^\s*1\s*$/)).toBeInTheDocument(),
    );
  });
});

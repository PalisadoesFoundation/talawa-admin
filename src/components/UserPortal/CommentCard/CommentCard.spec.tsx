import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
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
import { toast } from 'react-toastify';

// Interface for GraphQL error structure
interface InterfaceGraphQLErrorWithCode extends Error {
  graphQLErrors: Array<{
    extensions: {
      code: string;
    };
  }>;
}

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

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

const defaultProps = {
  id: '1',
  creator: {
    id: '1',
    name: 'test user',
  },
  upVoteCount: 1,
  downVoteCount: 0,
  text: 'testComment',
  hasUserVoted: {
    hasVoted: true,
    voteType: 'up_vote' as const,
  },
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
  });

  it('Component should be rendered properly if comment is already liked by the user.', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    expect(screen.getByText('testComment')).toBeInTheDocument();
    expect(screen.getByText('test user')).toBeInTheDocument();
  });

  it('Component should be rendered properly if comment is not already liked by the user.', async () => {
    setItemLocal('userId', '2');
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    expect(screen.getByText('testComment')).toBeInTheDocument();
  });

  it('Component renders as expected if user likes the comment.', async () => {
    setItemLocal('userId', '2');

    // Create props where user hasn't voted yet
    const notVotedProps = {
      ...defaultProps,
      hasUserVoted: {
        hasVoted: false,
        voteType: null,
      },
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...notVotedProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Verify initial state - should show 1 like (from defaultProps)
    expect(screen.getByText(/^\s*1\s*$/)).toBeInTheDocument();

    // Click the like button
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await wait();

    // Verify the like count increased to 2
    expect(screen.getByText(/^\s*2\s*$/)).toBeInTheDocument();

    // Verify the button state changed (should now show filled ThumbUp icon for liked state)
    const likeBtn = screen.getByTestId('likeCommentBtn');
    const thumbUpIcon = likeBtn.querySelector('svg[data-testid="ThumbUpIcon"]');
    expect(thumbUpIcon).toBeInTheDocument();
  });

  it('Component renders as expected if user unlikes the comment.', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await wait();
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
      <MockedProvider addTypename={false} link={errorLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await wait();

    expect(toast.error).toHaveBeenCalled();
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
      <MockedProvider addTypename={false} link={errorLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await wait();

    expect(toast.error).toHaveBeenCalled();
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
      <MockedProvider addTypename={false} link={slowLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
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

    const { container } = render(
      <MockedProvider addTypename={false} link={noDataLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const initialLikes = container.textContent?.match(/\d+ Likes/)?.[0];
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await wait();

    const updatedLikes = container.textContent?.match(/\d+ Likes/)?.[0];
    expect(updatedLikes).toBe(initialLikes);
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

    const { container } = render(
      <MockedProvider addTypename={false} link={emptyDataLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const initialLikes = container.textContent?.match(/\d+ Likes/)?.[0];
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await wait();

    const updatedLikes = container.textContent?.match(/\d+ Likes/)?.[0];
    expect(updatedLikes).toBe(initialLikes);
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

    const { container } = render(
      <MockedProvider addTypename={false} link={emptyDataLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const initialLikes = container.textContent?.match(/\d+ Likes/)?.[0];
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await wait();

    const updatedLikes = container.textContent?.match(/\d+ Likes/)?.[0];
    expect(updatedLikes).toBe(initialLikes);
  });

  it('should show warning toast when user is not signed in', async () => {
    // Clear userId to simulate not being signed in
    setItemLocal('userId', null);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await wait();

    expect(toast.warn).toHaveBeenCalledWith('Please sign in to like comments.');
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
      <MockedProvider addTypename={false} link={forbiddenLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...notVotedProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await wait();

    expect(toast.error).toHaveBeenCalledWith(
      'You have already liked this comment.',
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
      <MockedProvider addTypename={false} link={notFoundLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await wait();

    expect(toast.error).toHaveBeenCalledWith(
      'No associated vote found to remove.',
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
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...propsWithNullAvatar} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Check that the image element exists and has the default avatar as src
    const avatarImg = screen.getByAltText('test user');
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
      <MockedProvider addTypename={false} link={errorLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...notVotedProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await wait();

    expect(toast.error).toHaveBeenCalledWith('Network error occurred');
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
      <MockedProvider addTypename={false} link={unlikeLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...defaultProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    await userEvent.click(screen.getByTestId('likeCommentBtn'));
    await wait();

    expect(toast.error).toHaveBeenCalledWith(
      'Could not find an existing like to remove.',
    );
  });
});

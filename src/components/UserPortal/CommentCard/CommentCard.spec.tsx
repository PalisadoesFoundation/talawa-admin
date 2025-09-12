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

const { getItem, setItem } = useLocalStorage();

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
  upVoters: {
    edges: [
      {
        id: '1',
        node: {
          id: '1',
        },
      },
    ],
  },
  text: 'testComment',
  hasUserVoted: {
    hasVoted: true,
    voteType: 'up_vote' as 'up_vote',
  },
};

const link = new StaticMockLink(MOCKS, true);

describe('Testing CommentCard Component [User Portal]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setItem('userId', '1');
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
    setItem('userId', '2');
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
    setItem('userId', '2');
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
    setItem('userId', '2');

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
    setItem('userId', '2');

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
    setItem('userId', '2');

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
    setItem('userId', '2');

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
});

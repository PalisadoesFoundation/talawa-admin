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

/**
 * Unit tests for the CommentCard component.
 *
 * These tests ensure the CommentCard component renders and behaves as expected
 * under different scenarios. They cover various functionalities like:
 *  - Initial rendering with comment liked/not liked by user
 *  - User liking a comment
 *  - User unliking a comment
 * Mocked dependencies like `useLocalStorage` and Apollo Client mocks are used
 * to isolate the component and test its behavior independently.
 */
const { getItem, setItem } = useLocalStorage();

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
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
        commentId: '1',
      },
      result: {
        data: {
          likeComment: {
            _id: '1',
          },
        },
      },
    },
  },
  {
    request: {
      query: UNLIKE_COMMENT,
      variables: {
        commentId: '1',
      },
      result: {
        data: {
          unlikeComment: {
            _id: '1',
          },
        },
      },
    },
  },
];

const defaultProps = {
  id: '1',
  creator: {
    id: '1',
    firstName: 'test',
    lastName: 'user',
    email: 'test@user.com',
  },
  likeCount: 1,
  likedBy: [{ id: '1' }],
  text: 'testComment',
  handleLikeComment: vi.fn(),
  handleDislikeComment: vi.fn(),
};

const handleLikeComment = vi.fn();
const handleDislikeComment = vi.fn();
const link = new StaticMockLink(MOCKS, true);

describe('Testing CommentCard Component [User Portal]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await act(async () => {
      await i18nForTest.changeLanguage('en');
    });
  });

  it('Component should be rendered properly if comment is already liked by the user.', async () => {
    const cardProps = {
      id: '1',
      creator: {
        id: '1',
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
      },
      likeCount: 1,
      likedBy: [
        {
          id: '1',
        },
      ],
      text: 'testComment',
      handleLikeComment: handleLikeComment,
      handleDislikeComment: handleDislikeComment,
    };

    const beforeUserId = getItem('userId');
    setItem('userId', '2');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  it('Component should be rendered properly if comment is not already liked by the user.', async () => {
    const cardProps = {
      id: '1',
      creator: {
        id: '1',
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
      },
      likeCount: 1,
      likedBy: [
        {
          id: '1',
        },
      ],
      text: 'testComment',
      handleLikeComment: handleLikeComment,
      handleDislikeComment: handleDislikeComment,
    };

    const beforeUserId = getItem('userId');
    setItem('userId', '1');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  it('Component renders as expected if user likes the comment.', async () => {
    const cardProps = {
      id: '1',
      creator: {
        id: '1',
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
      },
      likeCount: 1,
      likedBy: [
        {
          id: '1',
        },
      ],
      text: 'testComment',
      handleLikeComment: handleLikeComment,
      handleDislikeComment: handleDislikeComment,
    };

    const beforeUserId = getItem('userId');
    setItem('userId', '2');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('likeCommentBtn'));

    await wait();

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  it('Component renders as expected if user unlikes the comment.', async () => {
    const cardProps = {
      id: '1',
      creator: {
        id: '1',
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
      },
      likeCount: 1,
      likedBy: [
        {
          id: '1',
        },
      ],
      text: 'testComment',
      handleLikeComment: handleLikeComment,
      handleDislikeComment: handleDislikeComment,
    };

    const beforeUserId = getItem('userId');
    setItem('userId', '1');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <CommentCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('likeCommentBtn'));

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  it('should handle like mutation error correctly', async () => {
    const errorMock = {
      request: {
        query: LIKE_COMMENT,
        variables: { commentId: '1' },
      },
      error: new Error('Failed to like comment'),
    };

    const link = new StaticMockLink([errorMock], true);
    setItem('userId', '2'); // Set user as not having liked the comment

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

    userEvent.click(screen.getByTestId('likeCommentBtn'));
    await wait();

    expect(toast.error).toHaveBeenCalled();
    expect(defaultProps.handleLikeComment).not.toHaveBeenCalled();
  });

  it('should handle unlike mutation error correctly', async () => {
    const errorMock = {
      request: {
        query: UNLIKE_COMMENT,
        variables: { commentId: '1' },
      },
      error: new Error('Failed to unlike comment'),
    };

    const link = new StaticMockLink([errorMock], true);
    setItem('userId', '1'); // Set user as having liked the comment

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

    userEvent.click(screen.getByTestId('likeCommentBtn'));
    await wait();

    expect(toast.error).toHaveBeenCalled();
    expect(defaultProps.handleDislikeComment).not.toHaveBeenCalled();
  });

  it('should successfully like a comment and update UI', async () => {
    const successMock = {
      request: {
        query: LIKE_COMMENT,
        variables: { commentId: '1' },
      },
      result: {
        data: {
          likeComment: {
            _id: '1',
          },
        },
      },
    };

    const link = new StaticMockLink([successMock], true);
    setItem('userId', '2'); // Set user as not having liked the comment

    const { container } = render(
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

    const initialLikes = container.textContent?.match(/\d+ Likes/)?.[0];
    userEvent.click(screen.getByTestId('likeCommentBtn'));
    await wait();

    const updatedLikes = container.textContent?.match(/\d+ Likes/)?.[0];
    expect(updatedLikes).not.toBe(initialLikes);
    expect(defaultProps.handleLikeComment).toHaveBeenCalledWith('1');
  });

  it('should successfully unlike a comment and update UI', async () => {
    const successMock = {
      request: {
        query: UNLIKE_COMMENT,
        variables: { commentId: '1' },
      },
      result: {
        data: {
          unlikeComment: {
            _id: '1',
          },
        },
      },
    };

    const link = new StaticMockLink([successMock], true);
    setItem('userId', '1'); // Set user as having liked the comment

    const { container } = render(
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

    const initialLikes = container.textContent?.match(/\d+ Likes/)?.[0];
    userEvent.click(screen.getByTestId('likeCommentBtn'));
    await wait();

    const updatedLikes = container.textContent?.match(/\d+ Likes/)?.[0];
    expect(updatedLikes).not.toBe(initialLikes);
    expect(defaultProps.handleDislikeComment).toHaveBeenCalledWith('1');
  });

  it('should show loading state while mutation is in progress', async () => {
    const slowMock = {
      request: {
        query: LIKE_COMMENT,
        variables: { commentId: '1' },
      },
      result: {
        data: {
          likeComment: {
            _id: '1',
          },
        },
      },
      delay: 100,
    };

    const link = new StaticMockLink([slowMock], true);
    setItem('userId', '2'); // Set user as not having liked the comment

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

    userEvent.click(screen.getByTestId('likeCommentBtn'));

    // HourglassBottomIcon should be visible during loading
    expect(
      document.querySelector('[data-testid="HourglassBottomIcon"]'),
    ).toBeInTheDocument();

    await wait(150);

    // After loading, ThumbUpIcon should be visible
    expect(
      document.querySelector('[data-testid="ThumbUpIcon"]'),
    ).toBeInTheDocument();
  });

  it('should not update state if mutation returns no data', async () => {
    const noDataMock = {
      request: {
        query: LIKE_COMMENT,
        variables: { commentId: '1' },
      },
      result: {
        data: null,
      },
    };

    const link = new StaticMockLink([noDataMock], true);
    setItem('userId', '2'); // Set user as not having liked the comment

    const { container } = render(
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

    const initialLikes = container.textContent?.match(/\d+ Likes/)?.[0];
    userEvent.click(screen.getByTestId('likeCommentBtn'));
    await wait();

    const updatedLikes = container.textContent?.match(/\d+ Likes/)?.[0];
    expect(updatedLikes).toBe(initialLikes);
    expect(defaultProps.handleLikeComment).not.toHaveBeenCalled();
  });

  it('should handle successful mutation with empty data for unlike', async () => {
    const emptyDataMock = {
      request: {
        query: UNLIKE_COMMENT,
        variables: { commentId: '1' },
      },
      result: {
        data: {
          unlikeComment: null,
        },
      },
    };

    const link = new StaticMockLink([emptyDataMock], true);
    setItem('userId', '1'); // Set user as having liked the comment

    const { container } = render(
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

    const initialLikes = container.textContent?.match(/\d+ Likes/)?.[0];

    await wait();

    userEvent.click(screen.getByTestId('likeCommentBtn'));
    await wait();

    // Verify that the likes count hasn't changed
    const updatedLikes = container.textContent?.match(/\d+ Likes/)?.[0];
    expect(updatedLikes).toBe(initialLikes);

    // Verify that the callback wasn't called
    expect(defaultProps.handleDislikeComment).not.toHaveBeenCalled();
  });

  it('should handle successful mutation with empty data for like', async () => {
    const emptyDataMock = {
      request: {
        query: LIKE_COMMENT,
        variables: { commentId: '1' },
      },
      result: {
        data: {
          likeComment: null,
        },
      },
    };

    const link = new StaticMockLink([emptyDataMock], true);
    setItem('userId', '2'); // Set user as not having liked the comment

    const { container } = render(
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

    const initialLikes = container.textContent?.match(/\d+ Likes/)?.[0];

    await wait();

    userEvent.click(screen.getByTestId('likeCommentBtn'));
    await wait();

    // Verify that the likes count hasn't changed
    const updatedLikes = container.textContent?.match(/\d+ Likes/)?.[0];
    expect(updatedLikes).toBe(initialLikes);

    // Verify that the callback wasn't called
    expect(defaultProps.handleLikeComment).not.toHaveBeenCalled();
  });
});

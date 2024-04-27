import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen } from '@testing-library/react';
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

const { getItem, setItem } = useLocalStorage();

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

const handleLikeComment = jest.fn();
const handleDislikeComment = jest.fn();
const link = new StaticMockLink(MOCKS, true);

describe('Testing CommentCard Component [User Portal]', () => {
  afterEach(async () => {
    await act(async () => {
      await i18nForTest.changeLanguage('en');
    });
  });

  test('Component should be rendered properly if comment is already liked by the user.', async () => {
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

  test('Component should be rendered properly if comment is not already liked by the user.', async () => {
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

  test('Component renders as expected if user likes the comment.', async () => {
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

  test('Component renders as expected if user unlikes the comment.', async () => {
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
});

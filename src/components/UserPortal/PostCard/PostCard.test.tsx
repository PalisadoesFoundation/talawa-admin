import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';

import PostCard from './PostCard';
import userEvent from '@testing-library/user-event';
import {
  CREATE_COMMENT_POST,
  LIKE_POST,
  UNLIKE_POST,
} from 'GraphQl/Mutations/mutations';

const MOCKS = [
  {
    request: {
      query: LIKE_POST,
      variables: {
        postId: '',
      },
      result: {
        data: {
          likePost: {
            _id: '',
          },
        },
      },
    },
  },
  {
    request: {
      query: UNLIKE_POST,
      variables: {
        post: '',
      },
      result: {
        data: {
          unlikePost: {
            _id: '',
          },
        },
      },
    },
  },
  {
    request: {
      query: CREATE_COMMENT_POST,
      variables: {
        postId: '1',
        comment: 'testComment',
      },
      result: {
        data: {
          createComment: {
            _id: '64ef885bca85de60ebe0f304',
            creator: {
              _id: '63d6064458fce20ee25c3bf7',
              firstName: 'Noble',
              lastName: 'Mittal',
              email: 'test@gmail.com',
              __typename: 'User',
            },
            likeCount: 0,
            likedBy: [],
            text: 'testComment',
            __typename: 'Comment',
          },
        },
      },
    },
  },
];

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const link = new StaticMockLink(MOCKS, true);

describe('Testing PostCard Component [User Portal]', () => {
  test('Component should be rendered properly', async () => {
    const cardProps = {
      id: '',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
      },
      image: '',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      likeCount: 1,
      commentCount: 1,
      comments: [
        {
          _id: '64eb13beca85de60ebe0ed0e',
          creator: {
            _id: '63d6064458fce20ee25c3bf7',
            firstName: 'Noble',
            lastName: 'Mittal',
            email: 'test@gmail.com',
            __typename: 'User',
          },
          likeCount: 0,
          likedBy: [],
          text: 'First comment from Talawa user portal.',
          __typename: 'Comment',
        },
      ],
      likedBy: [
        {
          firstName: '',
          lastName: '',
          id: '2',
        },
      ],
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
  });

  test('Component should be rendered properly if user has liked the post', async () => {
    const beforeUserId = localStorage.getItem('userId');
    localStorage.setItem('userId', '2');

    const cardProps = {
      id: '',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
      },
      image: '',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      likeCount: 1,
      commentCount: 0,
      comments: [],
      likedBy: [
        {
          firstName: 'test',
          lastName: 'user',
          id: '2',
        },
      ],
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    if (beforeUserId) {
      localStorage.setItem('userId', beforeUserId);
    }
  });

  test('Component should be rendered properly if user unlikes a post', async () => {
    const beforeUserId = localStorage.getItem('userId');
    localStorage.setItem('userId', '2');

    const cardProps = {
      id: '',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
      },
      image: '',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      likeCount: 1,
      commentCount: 0,
      comments: [],
      likedBy: [
        {
          firstName: 'test',
          lastName: 'user',
          id: '2',
        },
      ],
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('likePostBtn'));

    if (beforeUserId) {
      localStorage.setItem('userId', beforeUserId);
    }
  });

  test('Component should be rendered properly if user likes a post', async () => {
    const beforeUserId = localStorage.getItem('userId');
    localStorage.setItem('userId', '2');

    const cardProps = {
      id: '',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
      },
      image: '',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      likeCount: 1,
      commentCount: 0,
      comments: [],
      likedBy: [
        {
          firstName: 'test',
          lastName: 'user',
          id: '1',
        },
      ],
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('likePostBtn'));

    if (beforeUserId) {
      localStorage.setItem('userId', beforeUserId);
    }
  });

  test('Component should be rendered properly if post image is defined', async () => {
    const cardProps = {
      id: '',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'testImage',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      likeCount: 1,
      commentCount: 0,
      comments: [],
      likedBy: [
        {
          firstName: 'test',
          lastName: 'user',
          id: '1',
        },
      ],
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();
  });

  test('Comment is created successfully after create comment button is clicked.', async () => {
    const cardProps = {
      id: '1',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'testImage',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      likeCount: 1,
      commentCount: 0,
      comments: [],
      likedBy: [
        {
          firstName: 'test',
          lastName: 'user',
          id: '1',
        },
      ],
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    const randomComment = 'testComment';

    userEvent.click(screen.getByTestId('showCommentsBtn'));

    userEvent.type(screen.getByTestId('commentInput'), randomComment);
    userEvent.click(screen.getByTestId('createCommentBtn'));

    await wait();
  });

  test('Comment modal pops when show comments button is clicked.', async () => {
    const cardProps = {
      id: '',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'testImage',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      likeCount: 1,
      commentCount: 0,
      comments: [],
      likedBy: [
        {
          firstName: 'test',
          lastName: 'user',
          id: '1',
        },
      ],
    };

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    await wait();

    userEvent.click(screen.getByTestId('showCommentsBtn'));
    expect(screen.findAllByText('Comments')).not.toBeNull();
  });
});

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
  LIKE_COMMENT,
  UNLIKE_COMMENT,
} from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem, getItem } = useLocalStorage();

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
  {
    request: {
      query: LIKE_COMMENT,
      variables: {
        commentId: '1',
      },
    },
    result: {
      data: {
        likeComment: {
          _id: '1',
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
    },
    result: {
      data: {
        unlikeComment: {
          _id: '1',
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
          id: '64eb13beca85de60ebe0ed0e',
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
      </MockedProvider>,
    );

    await wait();
  });

  test('Component should be rendered properly if user has liked the post', async () => {
    const beforeUserId = getItem('userId');
    setItem('userId', '2');

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
      </MockedProvider>,
    );

    await wait();

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('Component should be rendered properly if user unlikes a post', async () => {
    const beforeUserId = getItem('userId');
    setItem('userId', '2');

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
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('likePostBtn'));

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('Component should be rendered properly if user likes a post', async () => {
    const beforeUserId = getItem('userId');
    setItem('userId', '2');

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
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('likePostBtn'));

    if (beforeUserId) {
      setItem('userId', beforeUserId);
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
      </MockedProvider>,
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
      </MockedProvider>,
    );

    const randomComment = 'testComment';

    userEvent.click(screen.getByTestId('showCommentsBtn'));

    userEvent.type(screen.getByTestId('commentInput'), randomComment);
    userEvent.click(screen.getByTestId('createCommentBtn'));

    await wait();
  });

  test(`Comment should be liked when like button is clicked`, async () => {
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
      commentCount: 1,
      comments: [
        {
          id: '1',
          creator: {
            _id: '1',
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
        },
      ],
      likedBy: [
        {
          firstName: 'test',
          lastName: 'user',
          id: '1',
        },
      ],
    };
    const beforeUserId = getItem('userId');
    setItem('userId', '2');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const showCommentsButton = screen.getByTestId('showCommentsBtn');

    userEvent.click(showCommentsButton);

    userEvent.click(screen.getByTestId('likeCommentBtn'));

    await wait();

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test(`Comment should be unliked when like button is clicked, if already liked`, async () => {
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
      commentCount: 1,
      comments: [
        {
          id: '1',
          creator: {
            _id: '1',
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
        },
      ],
      likedBy: [
        {
          firstName: 'test',
          lastName: 'user',
          id: '1',
        },
      ],
    };
    const beforeUserId = getItem('userId');
    setItem('userId', '1');

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const showCommentsButton = screen.getByTestId('showCommentsBtn');

    userEvent.click(showCommentsButton);

    userEvent.click(screen.getByTestId('likeCommentBtn'));

    await wait();

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
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
      </MockedProvider>,
    );

    await wait();

    userEvent.click(screen.getByTestId('showCommentsBtn'));
    expect(screen.findAllByText('Comments')).not.toBeNull();
  });
});

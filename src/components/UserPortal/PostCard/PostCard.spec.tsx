import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';

import PostCard from './PostCard';
import userEvent from '@testing-library/user-event';
import {
  CREATE_COMMENT_POST,
  LIKE_POST,
  UNLIKE_POST,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
  DELETE_POST_MUTATION,
  UPDATE_POST_MUTATION,
} from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';
import { vi } from 'vitest';

/**
 * Unit tests for the PostCard component in the User Portal.
 *
 * These tests ensure the PostCard component behaves as expected:
 *
 * 1. **Component rendering**: Verifies correct rendering with props like title, text, and creator info.
 * 2. **Dropdown functionality**: Tests the dropdown for editing and deleting posts.
 * 3. **Edit post**: Ensures the post can be edited with a success message.
 * 4. **Delete post**: Verifies post deletion works with a success message.
 * 5. **Like/unlike post**: Ensures the UI updates when a user likes or unlikes a post.
 * 6. **Post image**: Verifies post image rendering.
 * 7. **Create comment**: Ensures a comment is created successfully.
 * 8. **Like/unlike comment**: Tests liking/unliking comments.
 * 9. **Comment modal**: Verifies the comment modal appears when clicked.
 *
 * Mocked GraphQL data is used for simulating backend behavior.
 */

const { setItem, getItem } = useLocalStorage();

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

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
  {
    request: {
      query: UPDATE_POST_MUTATION,
      variables: {
        id: 'postId',
        text: 'Edited Post',
      },
    },
    result: {
      data: {
        updatePost: {
          _id: '',
        },
      },
    },
  },
  {
    request: {
      query: DELETE_POST_MUTATION,
      variables: {
        id: 'postId',
      },
    },
    result: {
      data: {
        removePost: {
          _id: '',
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
  it('Component should be rendered properly', async () => {
    const cardProps = {
      id: 'postId',
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
      },
      postedAt: '',
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
            id: '63d6064458fce20ee25c3bf7',
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
        {
          id: '64eb13beca85de60ebe0ed0b',
          creator: {
            id: '63d6064458fce20ee25c3bf8',
            firstName: 'Priyanshu',
            lastName: 'Bartwal',
            email: 'test1@gmail.com',
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
      fetchPosts: vi.fn(),
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

  it('Dropdown component should be rendered properly', async () => {
    setItem('userId', '2');

    const cardProps = {
      id: '',
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
      },
      postedAt: '',
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
      fetchPosts: vi.fn(),
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

    userEvent.click(screen.getByTestId('dropdown'));
    await wait();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('Edit post should work properly', async () => {
    setItem('userId', '2');

    const cardProps = {
      id: 'postId',
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
      },
      postedAt: '',
      image: '',
      video: '',
      text: 'test Post',
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
      fetchPosts: vi.fn(),
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

    userEvent.click(screen.getByTestId('dropdown'));
    userEvent.click(screen.getByTestId('editPost'));
    await wait();

    expect(screen.getByTestId('editPostModalTitle')).toBeInTheDocument();
    userEvent.clear(screen.getByTestId('postInput'));
    userEvent.type(screen.getByTestId('postInput'), 'Edited Post');
    userEvent.click(screen.getByTestId('editPostBtn'));
    await wait();

    expect(toast.success).toHaveBeenCalledWith('Post updated Successfully');
  });

  it('Delete post should work properly', async () => {
    setItem('userId', '2');

    const cardProps = {
      id: 'postId',
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
      },
      postedAt: '',
      image: '',
      video: '',
      text: 'test Post',
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
      fetchPosts: vi.fn(),
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

    userEvent.click(screen.getByTestId('dropdown'));
    userEvent.click(screen.getByTestId('deletePost'));
    await wait();

    expect(toast.success).toHaveBeenCalledWith(
      'Successfully deleted the Post.',
    );
  });

  it('Component should be rendered properly if user has liked the post', async () => {
    const beforeUserId = getItem('userId');
    setItem('userId', '2');

    const cardProps = {
      id: '',
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
      },
      postedAt: '',
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
      fetchPosts: vi.fn(),
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

  it('Component should be rendered properly if user unlikes a post', async () => {
    const beforeUserId = getItem('userId');
    setItem('userId', '2');

    const cardProps = {
      id: '',
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
      },
      postedAt: '',
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
      fetchPosts: vi.fn(),
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

    userEvent.click(screen.getByTestId('viewPostBtn'));
    userEvent.click(screen.getByTestId('likePostBtn'));

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  it('Component should be rendered properly if user likes a post', async () => {
    const beforeUserId = getItem('userId');
    setItem('userId', '2');

    const cardProps = {
      id: '',
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
      },
      postedAt: '',
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
      fetchPosts: vi.fn(),
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

    userEvent.click(screen.getByTestId('viewPostBtn'));
    userEvent.click(screen.getByTestId('likePostBtn'));

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  it('Component should be rendered properly if post image is defined', async () => {
    const cardProps = {
      id: '',
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
      },
      postedAt: '',
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
      fetchPosts: vi.fn(),
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

  it('Comment is created successfully after create comment button is clicked.', async () => {
    const cardProps = {
      id: '1',
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
      },
      postedAt: '',
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
      fetchPosts: vi.fn(),
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

    userEvent.click(screen.getByTestId('viewPostBtn'));

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
      postedAt: '',
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
        {
          id: '2',
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
              id: '2',
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
      fetchPosts: vi.fn(),
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

    userEvent.click(screen.getByTestId('viewPostBtn'));

    userEvent.click(screen.getAllByTestId('likeCommentBtn')[0]);

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
      postedAt: '',
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
        {
          id: '2',
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
              id: '2',
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
      fetchPosts: vi.fn(),
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

    userEvent.click(screen.getByTestId('viewPostBtn'));

    userEvent.click(screen.getAllByTestId('likeCommentBtn')[0]);

    await wait();

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });
  it('Comment modal pops when show comments button is clicked.', async () => {
    const cardProps = {
      id: '',
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
      },
      postedAt: '',
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
      fetchPosts: vi.fn(),
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

    userEvent.click(screen.getByTestId('viewPostBtn'));
    expect(screen.findAllByText('Comments')).not.toBeNull();
  });
});

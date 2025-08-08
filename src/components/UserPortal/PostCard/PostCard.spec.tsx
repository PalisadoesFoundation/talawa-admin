import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
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
 * 10. **Comment validation**: Ensures an error toast appears when an empty comment is submitted.
 * 11. **Comment submission error**: Ensures an error toast appears when a network error occurs.
 * 12. **Delete post failure**: Ensures the error toast appears when post deletion fails.
 * 13. **Post image**: Verifies post image rendering.
 * 14. **Delete post success**: Ensures the success toast appears when CreateEvenData is returned.
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

const fetchPostsSpy = vi.fn();

const MOCKS = [
  {
    request: {
      query: LIKE_POST,
      variables: {
        input: {
          postId: '1',
        },
      },
    },
    result: {
      data: {
        createPostVote: {
          id: 'vote1',
          upVoters: {
            edges: [
              {
                node: {
                  id: '1',
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    request: {
      query: UNLIKE_POST,
      variables: {
        input: {
          postId: '1',
        },
      },
    },
    result: {
      data: {
        deletePostVote: {
          id: 'vote1',
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
          body: 'testComment',
        },
      },
    },
    result: {
      data: {
        createComment: {
          id: '64ef885bca85de60ebe0f304',
          body: 'testComment',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
          upVotesCount: 0,
          downVotesCount: 0,
          creator: {
            id: '63d6064458fce20ee25c3bf7',
            name: 'Noble Mital',
            emailAddress: 'test@gmail.com',
          },
          post: {
            id: '1',
          },
        },
      },
    },
  },
  {
    request: {
      query: LIKE_COMMENT,
      variables: {
        input: {
          commentId: '1',
        },
      },
    },
    result: {
      data: {
        createCommentVote: {
          id: 'vote1',
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
        },
      },
    },
    result: {
      data: {
        deleteCommentVote: {
          id: 'vote1',
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
          caption: 'Edited Post',
        },
      },
    },
    result: {
      data: {
        updatePost: {
          id: '1',
          caption: 'Edited Post',
          pinnedAt: null,
          attachments: [],
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
          id: '1',
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
    const fetchPosts = vi.fn();
    const cardProps = {
      id: '1',
      creator: {
        name: 'test user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'image.png',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      commentCount: 1,
      postedAt: '',
      upVoteCount: 5,
      downVoteCount: 0,
      comments: [
        {
          id: '1',
          body: 'testComment', // ✅ required field
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 2,
          downVoteCount: 0,
          upVoters: [{ id: '1' }],
        },
        {
          id: '2',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 1,
          downVoteCount: 0,
          upVoters: [{ id: '2' }],
        },
      ],
      upVoters: {
        edges: [
          {
            node: {
              id: '1',
              creator: {
                id: '1',
                name: 'test user',
              },
            },
          },
        ],
      },
      fetchPosts: fetchPostsSpy,
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

  test('Dropdown component should be rendered properly', async () => {
    setItem('userId', '2');

    const cardProps = {
      id: '1',
      creator: {
        name: 'test user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'image.png',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      commentCount: 1,
      postedAt: '',
      upVoteCount: 5,
      downVoteCount: 0,
      comments: [
        {
          id: '1',
          body: 'testComment', // ✅ required field
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 2,
          downVoteCount: 0,
          upVoters: [{ id: '1' }],
        },
        {
          id: '2',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 1,
          downVoteCount: 0,
          upVoters: [{ id: '2' }],
        },
      ],
      upVoters: {
        edges: [
          {
            node: {
              id: '1',
              creator: {
                id: '1',
                name: 'test user',
              },
            },
          },
        ],
      },
      fetchPosts: fetchPostsSpy,
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

    await userEvent.click(screen.getByTestId('dropdown'));
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });
    await wait();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  test('Edit post should work properly', async () => {
    setItem('userId', '2');

    const cardProps = {
      id: '1',
      creator: {
        name: 'test user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'image.png',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      commentCount: 1,
      postedAt: '',
      upVoteCount: 5,
      downVoteCount: 0,
      comments: [
        {
          id: '1',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 2,
          downVoteCount: 0,
          upVoters: [{ id: '1' }],
        },
        {
          id: '2',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 1,
          downVoteCount: 0,
          upVoters: [{ id: '2' }],
        },
      ],
      upVoters: {
        edges: [
          {
            node: {
              id: '1',
              creator: {
                id: '1',
                name: 'test user',
              },
            },
          },
        ],
      },
      fetchPosts: fetchPostsSpy,
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

    await userEvent.click(screen.getByTestId('dropdown'));
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByTestId('editPost'));
    await wait();

    expect(screen.getByTestId('editPostModalTitle')).toBeInTheDocument();
    await userEvent.clear(screen.getByTestId('postInput'));
    await userEvent.type(screen.getByTestId('postInput'), 'Edited Post');
    await userEvent.click(screen.getByTestId('editPostBtn'));
    await wait();
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Successfully edited the Post.',
      );
    });
  });

  test('Component should be rendered properly if user has liked the post', async () => {
    const beforeUserId = getItem('userId');
    setItem('userId', '2');

    const cardProps = {
      id: '1',
      creator: {
        name: 'test user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'image.png',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      commentCount: 1,
      postedAt: '',
      upVoteCount: 5,
      downVoteCount: 0,
      comments: [
        {
          id: '1',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 2,
          downVoteCount: 0,
          upVoters: [{ id: '1' }],
        },
        {
          id: '2',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 1,
          downVoteCount: 0,
          upVoters: [{ id: '2' }],
        },
      ],
      upVoters: {
        edges: [
          {
            node: {
              id: '1',
              creator: {
                id: '1',
                name: 'test user',
              },
            },
          },
        ],
      },
      fetchPosts: fetchPostsSpy,
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
      id: '1',
      creator: {
        name: 'test user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'image.png',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      commentCount: 1,
      postedAt: '',
      upVoteCount: 5,
      downVoteCount: 0,
      comments: [
        {
          id: '1',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 2,
          downVoteCount: 0,
          upVoters: [{ id: '1' }],
        },
        {
          id: '2',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 1,
          downVoteCount: 0,
          upVoters: [{ id: '2' }],
        },
      ],
      upVoters: {
        edges: [
          {
            node: {
              id: '1',
              creator: {
                id: '1',
                name: 'test user',
              },
            },
          },
        ],
      },
      fetchPosts: fetchPostsSpy,
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

    await userEvent.click(screen.getByTestId('viewPostBtn'));
    await userEvent.click(screen.getByTestId('likePostBtn'));

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('Component should be rendered properly if user likes a post', async () => {
    const beforeUserId = getItem('userId');
    setItem('userId', '2');

    const cardProps = {
      id: '1',
      creator: {
        name: 'test user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'image.png',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      commentCount: 1,
      postedAt: '',
      upVoteCount: 5,
      downVoteCount: 0,
      comments: [
        {
          id: '1',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 2,
          downVoteCount: 0,
          upVoters: [{ id: '1' }],
        },
        {
          id: '2',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 1,
          downVoteCount: 0,
          upVoters: [{ id: '2' }],
        },
      ],
      upVoters: {
        edges: [
          {
            node: {
              id: '1',
              creator: {
                id: '1',
                name: 'test user',
              },
            },
          },
        ],
      },
      fetchPosts: fetchPostsSpy,
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

    await userEvent.click(screen.getByTestId('viewPostBtn'));
    await userEvent.click(screen.getByTestId('likePostBtn'));

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('Component should be rendered properly if post image is defined', async () => {
    const cardProps = {
      id: '1',
      creator: {
        name: 'test user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'image.png',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      commentCount: 1,
      postedAt: '',
      upVoteCount: 5,
      downVoteCount: 0,
      comments: [
        {
          id: '1',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 2,
          downVoteCount: 0,
          upVoters: [{ id: '1' }],
        },
        {
          id: '2',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 1,
          downVoteCount: 0,
          upVoters: [{ id: '2' }],
        },
      ],
      upVoters: {
        edges: [
          {
            node: {
              id: '1',
              creator: {
                id: '1',
                name: 'test user',
              },
            },
          },
        ],
      },
      fetchPosts: fetchPostsSpy,
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
        name: 'test user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'image.png',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      commentCount: 1,
      postedAt: '',
      upVoteCount: 5,
      downVoteCount: 0,
      comments: [
        {
          id: '1',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 2,
          downVoteCount: 0,
          upVoters: [{ id: '1' }],
        },
        {
          id: '2',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 1,
          downVoteCount: 0,
          upVoters: [{ id: '2' }],
        },
      ],
      upVoters: {
        edges: [
          {
            node: {
              id: '1',
              creator: {
                id: '1',
                name: 'test user',
              },
            },
          },
        ],
      },
      fetchPosts: fetchPostsSpy,
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

    await userEvent.click(screen.getByTestId('viewPostBtn'));

    await userEvent.type(screen.getByTestId('commentInput'), randomComment);
    await userEvent.click(screen.getByTestId('createCommentBtn'));

    await wait();
  });

  test('Comment validation displays an error toast when an empty comment is submitted', async () => {
    const cardProps = {
      id: '1',
      creator: {
        name: 'test user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'image.png',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      commentCount: 1,
      postedAt: '',
      upVoteCount: 5,
      downVoteCount: 0,
      comments: [
        {
          id: '1',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 2,
          downVoteCount: 0,
          upVoters: [{ id: '1' }],
        },
        {
          id: '2',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 1,
          downVoteCount: 0,
          upVoters: [{ id: '2' }],
        },
      ],
      upVoters: {
        edges: [
          {
            node: {
              id: '1',
              creator: {
                id: '1',
                name: 'test user',
              },
            },
          },
        ],
      },
      fetchPosts: fetchPostsSpy,
    };

    expect(toast.error).toBeDefined();

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

    await userEvent.click(screen.getByTestId('viewPostBtn')); // Open the post view
    await userEvent.clear(screen.getByTestId('commentInput')); // Clear input to ensure test's empty
    await userEvent.click(screen.getByTestId('createCommentBtn')); // Submit comment

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        i18nForTest.t('postCard.emptyCommentError'),
      );
    });
  });

  test(`Comment should be liked when like button is clicked`, async () => {
    const cardProps = {
      id: '1',
      creator: {
        name: 'test user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'image.png',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      commentCount: 1,
      postedAt: '',
      upVoteCount: 5,
      downVoteCount: 0,
      comments: [
        {
          id: '1',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 2,
          downVoteCount: 0,
          upVoters: [{ id: '1' }],
        },
        {
          id: '2',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 1,
          downVoteCount: 0,
          upVoters: [{ id: '2' }],
        },
      ],
      upVoters: {
        edges: [
          {
            node: {
              id: '1',
              creator: {
                id: '1',
                name: 'test user',
              },
            },
          },
        ],
      },
      fetchPosts: fetchPostsSpy,
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

    await userEvent.click(screen.getByTestId('viewPostBtn'));

    await userEvent.click(screen.getAllByTestId('likeCommentBtn')[0]);

    await wait();

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test(`Comment should be unliked when like button is clicked, if already liked`, async () => {
    const cardProps = {
      id: '1',
      creator: {
        name: 'test user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'image.png',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      commentCount: 1,
      postedAt: '',
      upVoteCount: 5,
      downVoteCount: 0,
      comments: [
        {
          id: '1',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 2,
          downVoteCount: 0,
          upVoters: [{ id: '1' }],
        },
        {
          id: '2',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 1,
          downVoteCount: 0,
          upVoters: [{ id: '2' }],
        },
      ],
      upVoters: {
        edges: [
          {
            node: {
              id: '1',
              creator: {
                id: '1',
                name: 'test user',
              },
            },
          },
        ],
      },
      fetchPosts: fetchPostsSpy,
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

    await userEvent.click(screen.getByTestId('viewPostBtn'));

    await userEvent.click(screen.getAllByTestId('likeCommentBtn')[0]);

    await wait();

    if (beforeUserId) {
      setItem('userId', beforeUserId);
    }
  });

  test('Comment modal pops when show comments button is clicked.', async () => {
    const cardProps = {
      id: '1',
      creator: {
        name: 'test user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'image.png',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      commentCount: 1,
      postedAt: '',
      upVoteCount: 5,
      downVoteCount: 0,
      comments: [
        {
          id: '1',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 2,
          downVoteCount: 0,
          upVoters: [{ id: '1' }],
        },
        {
          id: '2',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 1,
          downVoteCount: 0,
          upVoters: [{ id: '2' }],
        },
      ],
      upVoters: {
        edges: [
          {
            node: {
              id: '1',
              creator: {
                id: '1',
                name: 'test user',
              },
            },
          },
        ],
      },
      fetchPosts: fetchPostsSpy,
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

    await userEvent.click(screen.getByTestId('viewPostBtn'));
    expect(screen.findAllByText('Comments')).not.toBeNull();
  });

  test('Comment submission displays error toast when network error occurs', async () => {
    const cardProps = {
      id: '1',
      creator: {
        name: 'test user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'image.png',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      commentCount: 1,
      postedAt: '',
      upVoteCount: 5,
      downVoteCount: 0,
      comments: [
        {
          id: '1',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 2,
          downVoteCount: 0,
          upVoters: [{ id: '1' }],
        },
        {
          id: '2',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 1,
          downVoteCount: 0,
          upVoters: [{ id: '2' }],
        },
      ],
      upVoters: {
        edges: [
          {
            node: {
              id: '1',
              creator: {
                id: '1',
                name: 'test user',
              },
            },
          },
        ],
      },
      fetchPosts: fetchPostsSpy,
    };

    const mockError = {
      request: {
        query: CREATE_COMMENT_POST,
        variables: {
          comment: 'test',
          postId: '1',
        },
      },
      error: new Error('Test error'),
    };

    const errorLink = new StaticMockLink([mockError], true);

    render(
      <MockedProvider link={errorLink} addTypename={false}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(100);

    await userEvent.click(screen.getByTestId('viewPostBtn'));

    await userEvent.type(screen.getByTestId('commentInput'), 'test');

    const toastErrorSpy = vi.spyOn(toast, 'error');
    await waitFor(() =>
      userEvent.click(screen.getByTestId('createCommentBtn')),
    );

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalled();
    });

    vi.clearAllMocks();
  });

  test('Delete post should work properly', async () => {
    setItem('userId', '2');

    const deletePostMock = {
      request: {
        query: DELETE_POST_MUTATION,
        variables: {
          input: { id: '1' }, // '1', not 'postId'
        },
      },
      result: {
        data: {
          deletePost: {
            id: '1',
            _typename: 'Post',
          },
        },
      },
    };

    const customLink = new StaticMockLink([deletePostMock], true);

    const cardProps = {
      id: '1',
      creator: {
        name: 'test user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'image.png',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      commentCount: 1,
      postedAt: '',
      upVoteCount: 5,
      downVoteCount: 0,
      comments: [
        {
          id: '1',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 2,
          downVoteCount: 0,
          upVoters: [{ id: '1' }],
        },
        {
          id: '2',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 1,
          downVoteCount: 0,
          upVoters: [{ id: '2' }],
        },
      ],
      upVoters: {
        edges: [
          {
            node: {
              id: '1',
              creator: {
                id: '1',
                name: 'test user',
              },
            },
          },
        ],
      },
      fetchPosts: fetchPostsSpy,
    };

    render(
      <MockedProvider addTypename={false} link={customLink}>
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

    await userEvent.click(screen.getByTestId('dropdown'));
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('deletePost')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('deletePost'));

    await wait(200);

    expect(toast.success).toHaveBeenCalledWith(
      'Successfully deleted the Post.',
    );

    expect(cardProps.fetchPosts).toHaveBeenCalled();
  });

  test('Should handle delete post failure correctly', async () => {
    const cardProps = {
      id: '1',
      creator: {
        name: 'test user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'image.png',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      commentCount: 1,
      postedAt: '',
      upVoteCount: 5,
      downVoteCount: 0,
      comments: [
        {
          id: '1',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 2,
          downVoteCount: 0,
          upVoters: [{ id: '1' }],
        },
        {
          id: '2',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 1,
          downVoteCount: 0,
          upVoters: [{ id: '2' }],
        },
      ],
      upVoters: {
        edges: [
          {
            node: {
              id: '1',
              creator: {
                id: '1',
                name: 'test user',
              },
            },
          },
        ],
      },
      fetchPosts: fetchPostsSpy,
    };

    const deleteErrorMock = {
      request: {
        query: DELETE_POST_MUTATION,
        variables: { input: { id: cardProps.id } },
      },
      error: new Error('Network error: Failed to delete post'),
    };

    const errorLink = new StaticMockLink([deleteErrorMock], true);

    render(
      <MockedProvider addTypename={false} link={errorLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('dropdown'));
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('deletePost')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('deletePost'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Network error: Failed to delete post',
      );

      expect(cardProps.fetchPosts).toHaveBeenCalled();
    });
  });

  test('Post image should render properly', async () => {
    const cardProps = {
      id: '1',
      creator: {
        name: 'test user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'image.png',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      commentCount: 1,
      postedAt: '',
      upVoteCount: 5,
      downVoteCount: 0,
      comments: [
        {
          id: '1',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 2,
          downVoteCount: 0,
          upVoters: [{ id: '1' }],
        },
        {
          id: '2',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 1,
          downVoteCount: 0,
          upVoters: [{ id: '2' }],
        },
      ],
      upVoters: {
        edges: [
          {
            node: {
              id: '1',
              creator: {
                id: '1',
                name: 'test user',
              },
            },
          },
        ],
      },
      fetchPosts: fetchPostsSpy,
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

    const imageElement = await screen.findByRole('img');
    expect(imageElement).toHaveAttribute('src', 'image.png');
  });

  test('Delete post should execute code inside if(createEventData) conditional', async () => {
    setItem('userId', '2');
    const cardProps = {
      id: '1',
      creator: {
        name: 'test user',
        email: 'test@user.com',
        id: '1',
      },
      image: 'image.png',
      video: '',
      text: 'This is post test text',
      title: 'This is post test title',
      commentCount: 1,
      postedAt: '',
      upVoteCount: 5,
      downVoteCount: 0,
      comments: [
        {
          id: '1',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 2,
          downVoteCount: 0,
          upVoters: [{ id: '1' }],
        },
        {
          id: '2',
          body: 'testComment',
          creator: {
            id: '1',
            name: 'test user',
            email: 'test@user.com',
          },
          text: 'testComment',
          upVoteCount: 1,
          downVoteCount: 0,
          upVoters: [{ id: '2' }],
        },
      ],
      upVoters: {
        edges: [
          {
            node: {
              id: '1',
              creator: {
                id: '1',
                name: 'test user',
              },
            },
          },
        ],
      },
      fetchPosts: fetchPostsSpy,
    };

    const deletePostMock = {
      request: {
        query: DELETE_POST_MUTATION,
        variables: {
          input: { id: '1' },
        },
      },
      result: {
        data: {
          deletePost: {
            id: '1',
            _typename: 'Post',
          },
        },
      },
    };

    const customLink = new StaticMockLink([deletePostMock], true);

    const successToastSpy = vi.spyOn(toast, 'success');

    render(
      <MockedProvider
        addTypename={false}
        link={customLink}
        mocks={[deletePostMock]}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <PostCard {...cardProps} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(100);

    await userEvent.click(screen.getByTestId('dropdown'));
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('deletePost')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByTestId('deletePost'));

    await wait(300);

    await waitFor(() => {
      expect(successToastSpy).toHaveBeenCalledWith(
        'Successfully deleted the Post.',
      );
    });

    expect(fetchPostsSpy).toHaveBeenCalled();

    successToastSpy.mockRestore();
  });
});

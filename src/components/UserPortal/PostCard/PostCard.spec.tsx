import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { toast } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import type { InterfacePostCard } from 'utils/interfaces';

import PostCard from './PostCard';
import {
  CREATE_COMMENT_POST,
  DELETE_POST_MUTATION,
  UPDATE_POST_MUTATION,
  UPDATE_POST_VOTE,
} from 'GraphQl/Mutations/mutations';
import useLocalStorage from 'utils/useLocalstorage';
import UserDefault from '../../../assets/images/defaultImg.png';

const { setItem } = useLocalStorage();

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const fetchPostsMock = vi.fn();

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
          body: 'Test comment',
        },
      },
    },
    result: {
      data: {
        createComment: {
          id: '1',
          body: 'Test comment',
          creator: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
          },
          createdAt: '2023-01-01T00:00:00Z',
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
          caption: 'Updated post content',
        },
      },
    },
    result: {
      data: {
        updatePost: {
          id: '1',
          caption: 'Updated post content',
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

const link = new StaticMockLink(mocks, true);

const defaultProps = {
  id: '1',
  creator: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatarURL: 'avatar.jpg',
  },
  title: 'Test Post',
  text: 'This is a test post',
  image: 'test-image.jpg',
  video: '',
  postedAt: '2023-01-01T00:00:00Z',
  upVoteCount: 5,
  downVoteCount: 0,
  commentCount: 3,
  comments: [
    {
      id: '1',
      body: 'Test comment',
      creator: {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
      },
      upVoteCount: 2,
      downVoteCount: 0,
      upVoters: [{ id: '1' }],
      text: 'Test comment',
    },
  ],
  upVoters: {
    edges: [
      {
        node: {
          id: '1',
          creator: {
            id: '1',
            name: 'John Doe',
          },
        },
      },
    ],
  },
  fetchPosts: fetchPostsMock,
};

const renderPostCard = (props: Partial<InterfacePostCard> = {}) => {
  return render(
    <MockedProvider addTypename={false} link={link}>
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

describe('PostCard Component', () => {
  beforeEach(() => {
    setItem('userId', '1');
    fetchPostsMock.mockClear();
  });

  // Update all test cases that use the more button
  test('opens and closes edit modal', async () => {
    renderPostCard();

    const moreButton = screen.getByTestId('more-options-button');
    await userEvent.click(moreButton);

    const editButton = await screen.findByTestId('edit-post-button');
    await userEvent.click(editButton);

    expect(screen.getByText('Edit Post')).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Edit Post')).not.toBeInTheDocument();
    });
  });

  test('updates post when edit form is submitted', async () => {
    renderPostCard();

    const moreButton = screen.getByTestId('more-options-button');
    await userEvent.click(moreButton);
    const editButton = await screen.findByTestId('edit-post-button');
    await userEvent.click(editButton);

    const postInput = screen.getByRole('textbox');
    await userEvent.clear(postInput);
    await userEvent.type(postInput, 'Updated post content');

    const saveButton = await screen.findByTestId('save-post-button');
    await userEvent.click(saveButton);
  });

  test('deletes post when delete button is clicked', async () => {
    renderPostCard();

    const moreButton = screen.getByTestId('more-options-button');
    await userEvent.click(moreButton);
    const deleteButton = screen.getByText('Delete');
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Successfully deleted the Post.',
      );
      expect(fetchPostsMock).toHaveBeenCalled();
    });
  });

  test('displays pinned icon when post is pinned', () => {
    renderPostCard({ pinnedAt: '2023-01-01T00:00:00Z' });
    expect(screen.getByTestId('pinned-icon')).toBeInTheDocument();
  });

  test('does not display pinned icon when post is not pinned', () => {
    renderPostCard({ pinnedAt: null });
    expect(screen.queryByTestId('pinned-icon')).not.toBeInTheDocument();
  });
});

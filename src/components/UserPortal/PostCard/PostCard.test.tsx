import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

const { setItem, getItem } = useLocalStorage();

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    info: jest.fn(),
    success: jest.fn(),
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
  test('Component should be rendered properly', async () => {
    const cardProps = {
      id: 'postId',
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
        image: 'https://test-image.com',
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
            image: 'https://test-image.com',
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
            image: 'https://test-image.com',
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
      fetchPosts: jest.fn(),
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
      id: '',
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
        image: 'https://test-image.com',
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
      fetchPosts: jest.fn(),
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

  test('Edit post should work properly', async () => {
    // Setup local storage
    setItem('userId', '2');
    setItem('token', 'dummy-token');

    const cardProps = {
      id: 'postId',
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
        image: 'https://test-image.com',
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
      fetchPosts: jest.fn(),
    };

    // Mock successful fetch response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Post updated successfully' }),
      }),
    );

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

    // Open edit modal
    await waitFor(() => {
      userEvent.click(screen.getByTestId('dropdown'));
    });
    userEvent.click(screen.getByTestId('editPost'));

    // Verify modal is open
    await waitFor(() => {
      expect(screen.getByTestId('editPostModalTitle')).toBeInTheDocument();
    });

    // Edit post content
    userEvent.clear(screen.getByTestId('postInput'));
    userEvent.type(screen.getByTestId('postInput'), 'Edited Post');

    // Submit edit
    userEvent.click(screen.getByTestId('editPostBtn'));

    // Verify fetch was called with correct arguments
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_TALAWA_REST_URL}/update-post/postId`,
        {
          method: 'POST',
          body: expect.any(FormData),
          headers: { Authorization: 'Bearer dummy-token' },
        },
      );
    });

    // Verify FormData content
    const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
    const formData = fetchCall[1].body;
    expect(formData.get('id')).toBe('postId');
    expect(formData.get('text')).toBe('Edited Post');

    // Verify fetchPosts was called to refresh the posts
    expect(cardProps.fetchPosts).toHaveBeenCalled();
  });

  test('Delete post should work properly', async () => {
    setItem('userId', '2');

    const cardProps = {
      id: 'postId',
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
        image: 'https://test-image.com',
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
      fetchPosts: jest.fn(),
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
      'Successfully deleted the post.',
    );
  });

  test('Component should be rendered properly if user has liked the post', async () => {
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
        image: 'https://test-image.com',
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
      fetchPosts: jest.fn(),
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
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
        image: 'https://test-image.com',
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
      fetchPosts: jest.fn(),
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

  test('Component should be rendered properly if user likes a post', async () => {
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
        image: 'https://test-image.com',
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
      fetchPosts: jest.fn(),
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

  test('Change Media button should trigger file input click and show correct icon', async () => {
    // Mock URL.createObjectURL
    const mockCreateObjectURL = jest.fn(() => 'mock-url');
    global.URL.createObjectURL = mockCreateObjectURL;

    const cardProps = {
      id: 'postId',
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
        image: 'https://test-image.com',
      },
      postedAt: '',
      image: '',
      video: '',
      text: 'test Post',
      title: 'This is post test title',
      likeCount: 1,
      commentCount: 0,
      comments: [],
      likedBy: [],
      fetchPosts: jest.fn(),
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

    // Open edit modal
    userEvent.click(screen.getByTestId('dropdown'));
    userEvent.click(screen.getByTestId('editPost'));
    await wait();

    // Get file input and spy on click
    const fileInput = screen.getByTestId('file-input');
    const clickSpy = jest.spyOn(fileInput, 'click');

    // Click the Change Media button
    const changeMediaBtn = screen.getByText('Change Media');
    userEvent.click(changeMediaBtn);

    // Verify file input was clicked
    expect(clickSpy).toHaveBeenCalled();

    // Initially should show photo icon
    expect(screen.getByTestId('AddPhotoAlternateIcon')).toBeInTheDocument();

    // Simulate video file upload
    const videoFile = new File(['dummy content'], 'test.mp4', {
      type: 'video/mp4',
    });
    fireEvent.change(fileInput, {
      target: {
        files: [videoFile],
        type: 'file',
      },
    });
    await wait();

    // Should now show video icon
    expect(screen.getByTestId('VideocamIcon')).toBeInTheDocument();

    // Simulate image file upload
    const imageFile = new File(['dummy content'], 'test.jpg', {
      type: 'image/jpeg',
    });
    fireEvent.change(fileInput, {
      target: {
        files: [imageFile],
        type: 'file',
      },
    });
    await wait();

    // Should show photo icon again
    expect(screen.getByTestId('AddPhotoAlternateIcon')).toBeInTheDocument();

    // Clean up mock
    if (global.URL && global.URL.createObjectURL) {
      global.URL.createObjectURL = jest.fn();
    }
  });
  test('handleEditPost handles API response correctly for both success and failure cases', async () => {
    // Mock fetch globally
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'mock-url');

    const cardProps = {
      id: 'postId',
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
        image: 'https://test-image.com',
      },
      postedAt: '',
      image: '',
      video: '',
      text: 'test Post',
      title: 'This is post test title',
      likeCount: 1,
      commentCount: 0,
      comments: [],
      likedBy: [],
      fetchPosts: jest.fn(),
    };

    // Render component
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

    // Open edit modal
    userEvent.click(screen.getByTestId('dropdown'));
    userEvent.click(screen.getByTestId('editPost'));
    await wait();

    // Test Case 1: Successful update
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Success' }),
      }),
    );

    // Edit post and submit
    userEvent.clear(screen.getByTestId('postInput'));
    userEvent.type(screen.getByTestId('postInput'), 'Updated post content');
    userEvent.click(screen.getByTestId('editPostBtn'));

    await wait();

    // Verify success case
    expect(cardProps.fetchPosts).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Post updated Successfully');

    // Reset mocks
    jest.clearAllMocks();

    // Test Case 2: Failed update
    // Open edit modal again
    userEvent.click(screen.getByTestId('dropdown'));
    userEvent.click(screen.getByTestId('editPost'));
    await wait();

    // Mock fetch to return error
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({
            error: 'Update failed',
          }),
      }),
    );

    // Try to edit post
    userEvent.clear(screen.getByTestId('postInput'));
    userEvent.type(screen.getByTestId('postInput'), 'Failed update attempt');
    userEvent.click(screen.getByTestId('editPostBtn'));

    await wait();

    // Verify error case
    expect(toast.error).toHaveBeenCalledWith('Update failed');
    expect(screen.getByTestId('editPostModalTitle')).toBeInTheDocument(); // Modal should stay open
    expect(cardProps.fetchPosts).not.toHaveBeenCalled();

    // Test Case 3: Failed update with no error message
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      }),
    );

    // Try to edit post again
    userEvent.clear(screen.getByTestId('postInput'));
    userEvent.type(screen.getByTestId('postInput'), 'Another failed update');
    userEvent.click(screen.getByTestId('editPostBtn'));

    await wait();

    // Verify default error message
    expect(toast.error).toHaveBeenCalledWith('Update failed'); // Updated expectation
    expect(screen.getByTestId('editPostModalTitle')).toBeInTheDocument();
  });
  test('handleMediaChange validates file type and shows error for invalid media', async () => {
    // Clear all mocks at the start
    jest.clearAllMocks();

    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'mock-url');

    const cardProps = {
      id: 'postId',
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
        image: 'https://test-image.com',
      },
      postedAt: '',
      image: '',
      video: '',
      text: 'test Post',
      title: 'This is post test title',
      likeCount: 1,
      commentCount: 0,
      comments: [],
      likedBy: [],
      fetchPosts: jest.fn(),
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

    // Clear mock again before starting test cases
    jest.clearAllMocks();

    // Open edit modal
    userEvent.click(screen.getByTestId('dropdown'));
    userEvent.click(screen.getByTestId('editPost'));
    await wait();

    const fileInput = screen.getByTestId('file-input');

    // Test Case 1: Valid image file
    const imageFile = new File(['dummy content'], 'test.jpg', {
      type: 'image/jpeg',
    });
    fireEvent.change(fileInput, {
      target: {
        files: [imageFile],
      },
    });
    await wait();

    expect(toast.error).toHaveBeenCalledTimes(0);
    expect(screen.getByTestId('AddPhotoAlternateIcon')).toBeInTheDocument();

    // Clear mock before next test case
    jest.clearAllMocks();

    // Test Case 2: Valid video file
    const videoFile = new File(['dummy content'], 'test.mp4', {
      type: 'video/mp4',
    });
    fireEvent.change(fileInput, {
      target: {
        files: [videoFile],
      },
    });
    await wait();

    expect(toast.error).toHaveBeenCalledTimes(0);
    expect(screen.getByTestId('VideocamIcon')).toBeInTheDocument();

    // Clear mock before next test case
    jest.clearAllMocks();

    // Test Case 3: Invalid file type (PDF)
    const pdfFile = new File(['dummy content'], 'test.pdf', {
      type: 'application/pdf',
    });
    fireEvent.change(fileInput, {
      target: {
        files: [pdfFile],
      },
    });
    await wait();

    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(
      'Please select and image or video file.',
    );
    // Icons should remain unchanged after invalid file
    expect(screen.getByTestId('VideocamIcon')).toBeInTheDocument();

    // Clear mock before next test case
    jest.clearAllMocks();

    // Test Case 4: Invalid file type (text)
    const textFile = new File(['dummy content'], 'test.txt', {
      type: 'text/plain',
    });
    fireEvent.change(fileInput, {
      target: {
        files: [textFile],
      },
    });
    await wait();

    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(
      'Please select and image or video file.',
    );

    // Cleanup
    if (global.URL && global.URL.createObjectURL) {
      global.URL.createObjectURL = jest.fn();
    }
  });
  test('Component should be rendered properly if post image is defined', async () => {
    const cardProps = {
      id: '',
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
        image: 'https://test-image.com',
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
      fetchPosts: jest.fn(),
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
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
        image: 'https://test-image.com',
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
      fetchPosts: jest.fn(),
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
        image: 'https://test-image.com',
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
            image: 'https://test-image.com',
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
            image: 'https://test-image.com',
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
      fetchPosts: jest.fn(),
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
        image: 'https://test-image.com',
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
            image: 'https://test-image.com',
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
            image: 'https://test-image.com',
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
      fetchPosts: jest.fn(),
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
  test('Comment modal pops when show comments button is clicked.', async () => {
    const cardProps = {
      id: '',
      userImage: 'image.png',
      creator: {
        firstName: 'test',
        lastName: 'user',
        email: 'test@user.com',
        id: '1',
        image: 'https://test-image.com',
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
      fetchPosts: jest.fn(),
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

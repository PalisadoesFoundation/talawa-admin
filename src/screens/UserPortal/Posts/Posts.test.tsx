import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import userEvent from '@testing-library/user-event';
import {
  ORGANIZATION_ADVERTISEMENT_LIST,
  ORGANIZATION_POST_LIST,
  USER_DETAILS,
} from 'GraphQl/Queries/Queries';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import Home from './Posts';
import useLocalStorage from 'utils/useLocalstorage';

const { setItem } = useLocalStorage();

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    info: jest.fn(),
    success: jest.fn(),
  },
}));

const mockPostData = {
  edges: [
    {
      node: {
        _id: '6411e53835d7ba2344a78e21',
        title: 'post one',
        text: 'This is the first post',
        file: {
          _id: 'file1',
          fileName: 'test.jpg',
          mimeType: 'image/jpeg',
          size: 1024,
          hash: {
            value: 'hash123',
            algorithm: 'SHA-256',
          },
          uri: 'https://example.com/test.jpg',
          metadata: {
            objectKey: 'test-key',
          },
          visibility: 'PUBLIC',
          status: 'ACTIVE',
        },
        creator: {
          _id: '640d98d9eb6a743d75341067',
          firstName: 'Glen',
          lastName: 'Dsza',
          email: 'glendsza@gmail.com',
          image: 'profile.jpg',
        },
        createdAt: '2024-03-03T09:26:56.524Z',
        likeCount: 0,
        likedBy: [],
        commentCount: 0,
        comments: [],
        pinned: true,
      },
      cursor: '6411e53835d7ba2344a78e21',
    },
    {
      node: {
        _id: '6411e54835d7ba2344a78e29',
        title: 'post two',
        text: 'This is the post two',
        file: null,
        creator: {
          _id: '640d98d9eb6a743d75341067',
          firstName: 'Glen',
          lastName: 'Dsza',
          email: 'glendsza@gmail.com',
          image: 'profile.jpg',
        },
        createdAt: '2024-03-03T09:26:56.524Z',
        likeCount: 2,
        likedBy: [
          {
            _id: '640d98d9eb6a743d75341067',
            firstName: 'Glen',
            lastName: 'Dsza',
          },
          {
            _id: '640d98d9eb6a743d75341068',
            firstName: 'Glen2',
            lastName: 'Dsza2',
          },
        ],
        commentCount: 1,
        comments: [
          {
            _id: '6411e54835d7ba2344a78e29',
            text: 'This is a comment',
            creator: {
              _id: '640d98d9eb6a743d75341067',
              firstName: 'Glen',
              lastName: 'Dsza',
              image: 'profile.jpg',
            },
            createdAt: '2024-03-03T09:26:56.524Z',
            likeCount: 2,
            likedBy: [
              {
                _id: '640d98d9eb6a743d75341067',
              },
              {
                _id: '640d98d9eb6a743d75341068',
              },
            ],
          },
        ],
        pinned: false,
      },
      cursor: '6411e54835d7ba2344a78e29',
    },
  ],
  pageInfo: {
    startCursor: '6411e53835d7ba2344a78e21',
    endCursor: '6411e54835d7ba2344a78e29',
    hasNextPage: false,
    hasPreviousPage: false,
  },
  totalCount: 2,
};

const mockAdvertisementData = {
  edges: [
    {
      node: {
        _id: 'ad1',
        name: 'Test Ad',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        mediaUrl: 'ad.jpg',
      },
      cursor: 'ad1',
    },
  ],
  pageInfo: {
    startCursor: 'ad1',
    endCursor: 'ad1',
    hasNextPage: false,
    hasPreviousPage: false,
  },
  totalCount: 1,
};

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        id: 'orgId',
        first: 10,
      },
    },
    result: {
      data: {
        organizations: [
          {
            posts: mockPostData,
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: {
        id: 'orgId',
        first: 6,
        after: undefined,
        before: undefined,
        last: undefined,
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'orgId',
            advertisements: mockAdvertisementData,
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_DETAILS,
      variables: { id: '640d98d9eb6a743d75341067' },
    },
    result: {
      data: {
        user: {
          _id: '640d98d9eb6a743d75341067',
          firstName: 'Glen',
          lastName: 'Dsza',
          email: 'glendsza@gmail.com',
          image: 'profile.jpg',
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const renderHomeScreen = (): RenderResult =>
  render(
    <MockedProvider addTypename={false} link={link}>
      <MemoryRouter initialEntries={['/user/organization/orgId']}>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route path="/user/organization/:orgId" element={<Home />} />
              <Route path="/user" element={<div data-testid="homeEl" />} />
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );

describe('Testing Home Screen: User Portal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    setItem('userId', '640d98d9eb6a743d75341067');
  });

  test('Check if HomeScreen renders properly', async () => {
    renderHomeScreen();

    // Wait for initial loading
    await waitFor(
      () => {
        expect(
          screen.getByText(/Start a post, with text or media/i),
        ).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    // Check basic structure
    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('Your Feed')).toBeInTheDocument();
  });

  test('StartPostModal should render on click of StartPost btn', async () => {
    renderHomeScreen();

    // Wait for button to be available
    const startPostBtn = await screen.findByText(
      /Start a post, with text or media/i,
    );
    expect(startPostBtn).toBeInTheDocument();

    // Click the button
    userEvent.click(startPostBtn);

    // Check if modal appears
    await waitFor(() => {
      expect(screen.getByTestId('startPostModal')).toBeInTheDocument();
    });
  });

  test('StartPostModal should close on clicking the close button', async () => {
    renderHomeScreen();

    // Open modal
    const startPostBtn = await screen.findByText(
      /Start a post, with text or media/i,
    );
    userEvent.click(startPostBtn);

    await waitFor(() => {
      expect(screen.getByTestId('startPostModal')).toBeInTheDocument();
    });

    // Add post content
    const postInput = screen.getByTestId('postInput');
    userEvent.type(postInput, 'Test post content');

    // Close modal
    const closeButton = screen.getByRole('button', { name: /close/i });
    userEvent.click(closeButton);

    // Verify modal is closed
    await waitFor(() => {
      expect(screen.queryByTestId('startPostModal')).not.toBeInTheDocument();
    });
  });

  test('Check whether Posts render in PostCard', async () => {
    renderHomeScreen();

    // Wait for loading state to finish
    await waitFor(
      () => {
        expect(
          screen.queryByTestId('loading-indicator'),
        ).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    // Check for both posts
    const postTitles = await screen.findAllByText(/post one/i);
    expect(postTitles).toHaveLength(1);

    // Check post contents
    expect(screen.getByText('This is the first post')).toBeInTheDocument();
    expect(screen.getByText('This is the post two')).toBeInTheDocument();

    // Check creator info
    expect(screen.getAllByText('Glen Dsza')).toHaveLength(2);
  });

  test('Renders promoted posts correctly', async () => {
    renderHomeScreen();

    // Wait for loading to finish
    await waitFor(
      () => {
        expect(
          screen.queryByTestId('loading-indicator'),
        ).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    // Get the promoted posts container
    const promotedPostsContainer = await screen.findByTestId(
      'promoted-posts-container',
    );
    expect(promotedPostsContainer).toBeInTheDocument();

    // Get all promoted posts
    const promotedPosts = await screen.findAllByTestId('promoted-post');
    expect(promotedPosts).toHaveLength(1); // We expect one ad from our mock

    // Check the content of the first promoted post
    const firstPromotedPost = promotedPosts[0];

    // Use within to scope our queries to just this promoted post
    const adTitle = within(firstPromotedPost).getAllByText('Test Ad');
    expect(adTitle).toHaveLength(2);

    // Check the image
    const adImage = within(firstPromotedPost).getByRole('img');
    expect(adImage).toHaveAttribute('src', 'ad.jpg');
  });

  test('Pinned posts appear in carousel', async () => {
    renderHomeScreen();

    await waitFor(
      () => {
        expect(
          screen.queryByTestId('loading-indicator'),
        ).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    const pinnedPostsContainer = await screen.findByTestId(
      'pinned-posts-carousel',
    );
    expect(pinnedPostsContainer).toBeInTheDocument();

    // Check for pinned post
    const pinnedPost = await screen.findByText('post one');
    expect(pinnedPost).toBeInTheDocument();
  });

  test('Shows loading state', async () => {
    renderHomeScreen();

    // Check for loading indicator
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for loading to finish
    await waitFor(
      () => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });

  test('Handles redirect when no orgId present', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <MemoryRouter initialEntries={['/user/organization/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route path="/user/organization/" element={<Home />} />
                <Route path="/user" element={<div data-testid="homeEl" />} />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('homeEl')).toBeInTheDocument();
    });
  });
});

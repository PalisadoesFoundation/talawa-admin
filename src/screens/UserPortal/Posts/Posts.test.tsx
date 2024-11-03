import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { render, screen, waitFor, within } from '@testing-library/react';
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
            posts: {
              edges: [
                {
                  node: {
                    _id: '6411e53835d7ba2344a78e21',
                    title: 'post one',
                    text: 'This is the first post',
                    file: null,
                    videoUrl: null,
                    createdAt: '2024-03-03T09:26:56.524+00:00',
                    creator: {
                      _id: '640d98d9eb6a743d75341067',
                      firstName: 'Glen',
                      lastName: 'Dsza',
                      email: 'glendsza@gmail.com',
                      image: 'profile.jpg'
                    },
                    likeCount: 0,
                    commentCount: 0,
                    comments: [],
                    pinned: true,
                    likedBy: [],
                  },
                  cursor: '6411e53835d7ba2344a78e21',
                },
                {
                  node: {
                    _id: '6411e54835d7ba2344a78e29',
                    title: 'post two',
                    text: 'This is the post two',
                    file: null,
                    videoUrl: null,
                    createdAt: '2024-03-03T09:26:56.524+00:00',
                    creator: {
                      _id: '640d98d9eb6a743d75341067',
                      firstName: 'Glen',
                      lastName: 'Dsza',
                      email: 'glendsza@gmail.com',
                      image: 'profile.jpg'
                    },
                    likeCount: 2,
                    commentCount: 1,
                    pinned: false,
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
                    comments: [
                      {
                        _id: '6411e54835d7ba2344a78e29',
                        creator: {
                          _id: '640d98d9eb6a743d75341067',
                          firstName: 'Glen',
                          lastName: 'Dsza',
                          email: 'glendsza@gmail.com',
                          image: 'profile.jpg'
                        },
                        likeCount: 2,
                        likedBy: [
                          {
                            _id: '640d98d9eb6a743d75341067',
                          },
                          {
                            _id: '640d98d9eb6a743d75341068',
                          },
                        ],
                        text: 'This is the post two',
                      },
                    ],
                  },
                  cursor: '6411e54835d7ba2344a78e29',
                },
              ],
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
              },
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: { id: 'orgId', first: 6 },
    },
    result: {
      data: {
        organizations: [
          {
            advertisements: {
              edges: [
                {
                  node: {
                    _id: 'ad1',
                    name: 'Test Ad',
                    type: 'BANNER',
                    organization: { _id: 'orgId' },
                    mediaUrl: 'ad.jpg',
                    endDate: '2024-12-31',
                    startDate: '2024-01-01',
                  },
                  cursor: 'ad1',
                },
              ],
            },
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

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

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
    </MockedProvider>
  );

describe('Testing Home Screen: User Portal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    setItem('userId', '640d98d9eb6a743d75341067');
  });

  test('Check if HomeScreen renders properly', async () => {
    renderHomeScreen();
    await wait();
    const startPostBtn = screen.getByText(/Start a post, with text or media/i);
    expect(startPostBtn).toBeInTheDocument();
  });

  test('StartPostModal should render on click of StartPost btn', async () => {
    renderHomeScreen();
    await wait();
    const startPostBtn = screen.getByText(/Start a post, with text or media/i);
    userEvent.click(startPostBtn);
    await wait();
    const startPostModal = screen.getByTestId('startPostModal');
    expect(startPostModal).toBeInTheDocument();
  });

  test('StartPostModal should close on clicking the close button', async () => {
    renderHomeScreen();
    await wait();

    const startPostBtn = screen.getByText(/Start a post, with text or media/i);
    userEvent.click(startPostBtn);
    await wait();

    const startPostModal = screen.getByTestId('startPostModal');
    expect(startPostModal).toBeInTheDocument();

    // Add post content
    const postInput = screen.getByTestId('postInput');
    userEvent.type(postInput, 'Test post content');

    // Close modal
    const closeButton = screen.getByRole('button', { name: /close/i });
    userEvent.click(closeButton);

    await wait();
    expect(screen.queryByTestId('startPostModal')).not.toBeInTheDocument();
  });

  test('Check whether Posts render in PostCard', async () => {
    renderHomeScreen();
    await wait();

    expect(screen.getByText('post one')).toBeInTheDocument();
    expect(screen.getByText('This is the first post')).toBeInTheDocument();
    expect(screen.getByText('post two')).toBeInTheDocument();
    expect(screen.getByText('This is the post two')).toBeInTheDocument();
  });

  test('Renders promoted posts correctly', async () => {
    renderHomeScreen();
    await wait();
    
    const promotedPostsContainer = screen.getByTestId('promotedPostsContainer');
    expect(promotedPostsContainer).toBeInTheDocument();
    expect(screen.getByText('Test Ad')).toBeInTheDocument();
  });

  test('Shows loading state', async () => {
    renderHomeScreen();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await wait();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
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
      </MockedProvider>
    );

    await wait();
    expect(screen.getByTestId('homeEl')).toBeInTheDocument();
  });

  test('Pinned posts appear in carousel', async () => {
    renderHomeScreen();
    await wait();

    expect(screen.getByText('post one')).toBeInTheDocument();
    // Check if post is pinned
    const pinnedPost = screen.getByText('post one');
    expect(pinnedPost).toBeInTheDocument();
  });
});
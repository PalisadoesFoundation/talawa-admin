import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import userEvent from '@testing-library/user-event';
import {
  ADVERTISEMENTS_GET,
  ORGANIZATION_POST_LIST,
} from 'GraphQl/Queries/Queries';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import Home from './Home';
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
                    imageUrl: null,
                    videoUrl: null,
                    createdAt: '2024-03-03T09:26:56.524+00:00',
                    creator: {
                      _id: '640d98d9eb6a743d75341067',
                      firstName: 'Glen',
                      lastName: 'Dsza',
                      email: 'glendsza@gmail.com',
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
                    imageUrl: null,
                    videoUrl: null,
                    createdAt: '2024-03-03T09:26:56.524+00:00',
                    creator: {
                      _id: '640d98d9eb6a743d75341067',
                      firstName: 'Glen',
                      lastName: 'Dsza',
                      email: 'glendsza@gmail.com',
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
                        },
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
                        text: 'This is the post two',
                        createdAt: '2024-03-03T09:26:56.524+00:00',
                      },
                    ],
                  },
                  cursor: '6411e54835d7ba2344a78e29',
                },
              ],
              pageInfo: {
                startCursor: '6411e53835d7ba2344a78e21',
                endCursor: '6411e54835d7ba2344a78e31',
                hasNextPage: false,
                hasPreviousPage: false,
              },
              totalCount: 2,
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: ADVERTISEMENTS_GET,
      variables: {},
    },
    result: {
      data: {
        advertisementsConnection: {
          edges: [
            {
              node: {
                _id: '1234',
                name: 'Ad 1',
                type: 'Type 1',
                organization: {
                  _id: 'orgId',
                },
                mediaUrl: 'Link 1',
                endDate: '2024-12-31',
                startDate: '2022-01-01',
              },
            },
            {
              node: {
                _id: '2345',
                name: 'Ad 2',
                type: 'Type 1',
                organization: {
                  _id: 'orgId',
                },
                mediaUrl: 'Link 2',
                endDate: '2024-09-31',
                startDate: '2023-04-01',
              },
            },
            {
              node: {
                _id: '3456',
                name: 'name3',
                type: 'Type 2',
                organization: {
                  _id: 'orgId',
                },
                mediaUrl: 'link3',
                startDate: '2023-01-30',
                endDate: '2023-12-31',
              },
            },
            {
              node: {
                _id: '4567',
                name: 'name4',
                type: 'Type 2',
                organization: {
                  _id: 'orgId1',
                },
                mediaUrl: 'link4',
                startDate: '2023-01-30',
                endDate: '2023-12-01',
              },
            },
          ],
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

afterEach(() => {
  localStorage.clear();
});

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
            </Routes>
          </I18nextProvider>
        </Provider>
      </MemoryRouter>
    </MockedProvider>,
  );

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Testing Home Screen: User Portal', () => {
  beforeAll(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ orgId: 'orgId' }),
    }));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('Check if HomeScreen renders properly', async () => {
    renderHomeScreen();

    await wait();
    const startPostBtn = await screen.findByTestId('startPostBtn');
    expect(startPostBtn).toBeInTheDocument();
  });

  test('StartPostModal should render on click of StartPost btn', async () => {
    renderHomeScreen();

    await wait();
    const startPostBtn = await screen.findByTestId('startPostBtn');
    expect(startPostBtn).toBeInTheDocument();

    userEvent.click(startPostBtn);
    const startPostModal = screen.getByTestId('startPostModal');
    expect(startPostModal).toBeInTheDocument();
  });

  test('StartPostModal should close on clicking the close button', async () => {
    renderHomeScreen();

    await wait();
    const startPostBtn = await screen.findByTestId('startPostBtn');
    expect(startPostBtn).toBeInTheDocument();

    userEvent.click(startPostBtn);
    const startPostModal = screen.getByTestId('startPostModal');
    expect(startPostModal).toBeInTheDocument();

    userEvent.type(screen.getByTestId('postInput'), 'some content');
    userEvent.upload(
      screen.getByTestId('postImageInput'),
      new File(['image content'], 'image.png', { type: 'image/png' }),
    );

    // Check that the content and image have been added
    expect(screen.getByTestId('postInput')).toHaveValue('some content');
    await screen.findByAltText('Post Image Preview');
    expect(screen.getByAltText('Post Image Preview')).toBeInTheDocument();

    const closeButton = within(startPostModal).getByRole('button', {
      name: /close/i,
    });
    userEvent.click(closeButton);

    const closedModalText = screen.queryByText(/somethingOnYourMind/i);
    expect(closedModalText).not.toBeInTheDocument();

    expect(screen.getByTestId('postInput')).toHaveValue('');
    expect(screen.getByTestId('postImageInput')).toHaveValue('');
  });

  test('Check whether Posts render in PostCard', async () => {
    setItem('userId', '640d98d9eb6a743d75341067');
    renderHomeScreen();
    await wait();

    const postCardContainers = screen.findAllByTestId('postCardContainer');
    expect(postCardContainers).not.toBeNull();

    expect(screen.queryByText('post one')).toBeInTheDocument();
    expect(screen.queryByText('This is the first post')).toBeInTheDocument();

    expect(screen.queryByText('post two')).toBeInTheDocument();
    expect(screen.queryByText('This is the post two')).toBeInTheDocument();
  });
});

describe('HomeScreen with invalid orgId', () => {
  test('Redirect to /user when organizationId is falsy', async () => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ orgId: undefined }),
    }));
    render(
      <MockedProvider addTypename={false} link={link}>
        <MemoryRouter initialEntries={['/user/organization/']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route path="/user/organization/" element={<Home />} />
                <Route
                  path="/user"
                  element={<div data-testid="homeEl"></div>}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for the navigation to occur
    await waitFor(() => {
      const homeEl = screen.getByTestId('homeEl');
      expect(homeEl).toBeInTheDocument();
    });
  });
});

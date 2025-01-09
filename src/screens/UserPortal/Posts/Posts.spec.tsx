import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { render, screen, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import userEvent from '@testing-library/user-event';
import {
  ORGANIZATION_ADVERTISEMENT_LIST,
  ORGANIZATION_POST_LIST,
} from 'GraphQl/Queries/Queries';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import Home from './Posts';
import useLocalStorage from 'utils/useLocalstorage';
import { DELETE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { expect, describe, it, vi } from 'vitest';

const { setItem } = useLocalStorage();

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

const mockUseParams = vi.fn().mockReturnValue({ orgId: 'orgId' });

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => mockUseParams(),
    useNavigate: () => vi.fn(),
  };
});

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
      query: ORGANIZATION_ADVERTISEMENT_LIST,
      variables: { id: 'orgId', first: 6 },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'orgId',
            advertisements: {
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
                  cursor: '1234',
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
                  cursor: '1234',
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
                  cursor: '1234',
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
                  cursor: '1234',
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
      query: DELETE_POST_MUTATION,
      variables: { id: '6411e54835d7ba2344a78e29' },
    },
    result: {
      data: {
        removePost: { _id: '6411e54835d7ba2344a78e29' },
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
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('Testing Home Screen: User Portal', () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ orgId: 'orgId' });
  });
  afterAll(() => {
    vi.clearAllMocks();
  });

  it('Check if HomeScreen renders properly', async () => {
    renderHomeScreen();

    await wait();
    const startPostBtn = await screen.findByTestId('postBtn');
    expect(startPostBtn).toBeInTheDocument();
  });

  it('StartPostModal should render on click of StartPost btn', async () => {
    renderHomeScreen();

    await wait();
    const startPostBtn = await screen.findByTestId('postBtn');
    expect(startPostBtn).toBeInTheDocument();

    userEvent.click(startPostBtn);
    const startPostModal = screen.getByTestId('startPostModal');
    expect(startPostModal).toBeInTheDocument();
  });

  it('StartPostModal should close on clicking the close button', async () => {
    renderHomeScreen();

    await wait();
    userEvent.upload(
      screen.getByTestId('postImageInput'),
      new File(['image content'], 'image.png', { type: 'image/png' }),
    );
    await wait();

    const startPostBtn = await screen.findByTestId('postBtn');
    expect(startPostBtn).toBeInTheDocument();

    userEvent.click(startPostBtn);
    const startPostModal = screen.getByTestId('startPostModal');
    expect(startPostModal).toBeInTheDocument();

    userEvent.type(screen.getByTestId('postInput'), 'some content');

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

  it('Check whether Posts render in PostCard', async () => {
    setItem('userId', '640d98d9eb6a743d75341067');
    renderHomeScreen();
    await wait();

    const postCardContainers = screen.findAllByTestId('postCardContainer');
    expect(postCardContainers).not.toBeNull();

    expect(screen.queryAllByText('post one')[0]).toBeInTheDocument();
    expect(
      screen.queryAllByText('This is the first post')[0],
    ).toBeInTheDocument();

    expect(screen.queryByText('post two')).toBeInTheDocument();
    expect(screen.queryByText('This is the post two')).toBeInTheDocument();
  });

  it('Checking if refetch works after deleting this post', async () => {
    setItem('userId', '640d98d9eb6a743d75341067');
    renderHomeScreen();
    expect(screen.queryAllByTestId('dropdown')).not.toBeNull();
    const dropdowns = await screen.findAllByTestId('dropdown');
    userEvent.click(dropdowns[1]);
    const deleteButton = await screen.findByTestId('deletePost');
    userEvent.click(deleteButton);
  });
});

describe('HomeScreen with invalid orgId', () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ orgId: undefined });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Redirect to /user when organizationId is falsy', async () => {
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
    const homeEl = await screen.findByTestId('homeEl');
    expect(homeEl).toBeInTheDocument();

    const postCardContainers = screen.queryAllByTestId('postCardContainer');
    expect(postCardContainers).toHaveLength(0);
  });
});

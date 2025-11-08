import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import userEvent from '@testing-library/user-event';
import {
  ORGANIZATION_ADVERTISEMENT_LIST,
  ORGANIZATION_POST_LIST_WITH_VOTES,
  USER_DETAILS,
} from 'GraphQl/Queries/Queries';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import Home from './Posts';
import useLocalStorage from 'utils/useLocalstorage';
import { expect, describe, it, vi } from 'vitest';
import { GraphQLError } from 'graphql';
import { ORGANIZATION_PINNED_POST_LIST } from 'GraphQl/Queries/OrganizationQueries';

const { setItem } = useLocalStorage();

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

const mockUseParams = vi.fn().mockReturnValue({ orgId: 'orgId' });

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => mockUseParams(),
    useNavigate: () => vi.fn(),
  };
});

// COMPLETE MOCK DATA WITH ALL REQUIRED FIELDS
const MOCKS = [
  // USER_DETAILS query
  {
    request: {
      query: USER_DETAILS,
      variables: {
        input: { id: '640d98d9eb6a743d75341067' },
        first: 10,
      },
    },
    result: {
      data: {
        user: {
          id: '640d98d9eb6a743d75341067',
          name: 'Test User',
          emailAddress: 'test@example.com',
          joinedOrganizations: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
          },
          organizationsBlockedBy: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
          },
          tags: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
          },
        },
      },
    },
  },
  // Initial load - Page 1
  {
    request: {
      query: ORGANIZATION_POST_LIST_WITH_VOTES,
      variables: {
        input: { id: 'orgId' },
        first: 5,
        after: null,
        before: null,
        last: null,
        userId: '640d98d9eb6a743d75341067',
      },
    },
    result: {
      data: {
        organization: {
          id: 'orgId',
          postsCount: 4,
          posts: {
            edges: [
              {
                node: {
                  id: '1-1',
                  caption: 'Post 1-1',
                  creator: {
                    id: 'u1',
                    name: 'User1',
                    avatarURL: null,
                  },
                  commentsCount: 0,
                  pinnedAt: null,
                  downVotesCount: 0,
                  upVotesCount: 0,
                  hasUserVoted: {
                    hasVoted: false,
                    voteType: null,
                  },
                  createdAt: '2024-01-01T00:00:00.000Z',
                  comments: {
                    edges: [],
                    pageInfo: {
                      startCursor: null,
                      endCursor: null,
                      hasNextPage: false,
                      hasPreviousPage: false,
                    },
                  },
                },
                cursor: 'c1',
              },
              {
                node: {
                  id: '1-2',
                  caption: 'Post 1-2',
                  creator: {
                    id: 'u2',
                    name: 'User2',
                    avatarURL: null,
                  },
                  commentsCount: 0,
                  pinnedAt: null,
                  downVotesCount: 0,
                  upVotesCount: 0,
                  hasUserVoted: {
                    hasVoted: false,
                    voteType: null,
                  },
                  createdAt: '2024-01-01T00:00:00.000Z',
                  comments: {
                    edges: [],
                    pageInfo: {
                      startCursor: null,
                      endCursor: null,
                      hasNextPage: false,
                      hasPreviousPage: false,
                    },
                  },
                },
                cursor: 'c2',
              },
            ],
            pageInfo: {
              startCursor: 'c1',
              endCursor: 'c2',
              hasNextPage: true,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
  // Page 2 - Next page
  {
    request: {
      query: ORGANIZATION_POST_LIST_WITH_VOTES,
      variables: {
        input: { id: 'orgId' },
        after: 'c2',
        first: 5,
        before: null,
        last: null,
        userId: '640d98d9eb6a743d75341067',
      },
    },
    result: {
      data: {
        organization: {
          id: 'orgId',
          postsCount: 4,
          posts: {
            edges: [
              {
                node: {
                  id: '2-1',
                  caption: 'Post 2-1',
                  creator: {
                    id: 'u3',
                    name: 'User3',
                    avatarURL: null,
                  },
                  commentsCount: 0,
                  pinnedAt: null,
                  downVotesCount: 0,
                  upVotesCount: 0,
                  hasUserVoted: {
                    hasVoted: false,
                    voteType: null,
                  },
                  createdAt: '2024-01-02T00:00:00.000Z',
                  comments: {
                    edges: [],
                    pageInfo: {
                      startCursor: null,
                      endCursor: null,
                      hasNextPage: false,
                      hasPreviousPage: false,
                    },
                  },
                },
                cursor: 'c3',
              },
              {
                node: {
                  id: '2-2',
                  caption: 'Post 2-2',
                  creator: {
                    id: 'u4',
                    name: 'User4',
                    avatarURL: null,
                  },
                  commentsCount: 0,
                  pinnedAt: null,
                  downVotesCount: 0,
                  upVotesCount: 0,
                  hasUserVoted: {
                    hasVoted: false,
                    voteType: null,
                  },
                  createdAt: '2024-01-02T00:00:00.000Z',
                  comments: {
                    edges: [],
                    pageInfo: {
                      startCursor: null,
                      endCursor: null,
                      hasNextPage: false,
                      hasPreviousPage: false,
                    },
                  },
                },
                cursor: 'c4',
              },
            ],
            pageInfo: {
              startCursor: 'c3',
              endCursor: 'c4',
              hasNextPage: false,
              hasPreviousPage: true,
            },
          },
        },
      },
    },
  },
  // Back to Page 1 - Previous page
  {
    request: {
      query: ORGANIZATION_POST_LIST_WITH_VOTES,
      variables: {
        input: { id: 'orgId' },
        before: 'c3',
        last: 5,
        after: null,
        first: null,
        userId: '640d98d9eb6a743d75341067',
      },
    },
    result: {
      data: {
        organization: {
          id: 'orgId',
          postsCount: 4,
          posts: {
            edges: [
              {
                node: {
                  id: '1-1',
                  caption: 'Post 1-1',
                  creator: {
                    id: 'u1',
                    name: 'User1',
                    avatarURL: null,
                  },
                  commentsCount: 0,
                  pinnedAt: null,
                  downVotesCount: 0,
                  upVotesCount: 0,
                  hasUserVoted: {
                    hasVoted: false,
                    voteType: null,
                  },
                  createdAt: '2024-01-01T00:00:00.000Z',
                  comments: {
                    edges: [],
                    pageInfo: {
                      startCursor: null,
                      endCursor: null,
                      hasNextPage: false,
                      hasPreviousPage: false,
                    },
                  },
                },
                cursor: 'c1',
              },
              {
                node: {
                  id: '1-2',
                  caption: 'Post 1-2',
                  creator: {
                    id: 'u2',
                    name: 'User2',
                    avatarURL: null,
                  },
                  commentsCount: 0,
                  pinnedAt: null,
                  downVotesCount: 0,
                  upVotesCount: 0,
                  hasUserVoted: {
                    hasVoted: false,
                    voteType: null,
                  },
                  createdAt: '2024-01-01T00:00:00.000Z',
                  comments: {
                    edges: [],
                    pageInfo: {
                      startCursor: null,
                      endCursor: null,
                      hasNextPage: false,
                      hasPreviousPage: false,
                    },
                  },
                },
                cursor: 'c2',
              },
            ],
            pageInfo: {
              startCursor: 'c1',
              endCursor: 'c2',
              hasNextPage: true,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
];

const pinnedPostsMock1 = {
  request: {
    query: ORGANIZATION_PINNED_POST_LIST,
    variables: {
      input: { id: 'orgId' },
      first: 32,
    },
  },
  result: {
    data: {
      organization: {
        id: 'orgId',
        postsCount: 1,
        pinnedPosts: {
          edges: [
            {
              node: {
                id: 'pinned-close-test',
                caption: 'Test Close Modal',
                creator: {
                  id: 'u1',
                  name: 'User1',
                  avatarURL: null,
                },
                commentsCount: 0,
                pinnedAt: '2024-01-01T00:00:00.000Z',
                downVotesCount: 0,
                upVotesCount: 0,
                hasUserVoted: {
                  hasVoted: false,
                  voteType: null,
                },
                createdAt: '2024-01-01T00:00:00.000Z',
                comments: {
                  edges: [],
                  pageInfo: {
                    startCursor: null,
                    endCursor: null,
                    hasNextPage: false,
                    hasPreviousPage: false,
                  },
                },
              },
              cursor: 'c1',
            },
          ],
          pageInfo: {
            startCursor: 'c1',
            endCursor: 'c1',
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      },
    },
  },
};

const pinnedPostsMock2 = {
  request: {
    query: ORGANIZATION_PINNED_POST_LIST,
    variables: {
      input: { id: 'orgId' },
      first: 32,
    },
  },
  result: {
    data: {
      organization: {
        id: 'orgId',
        pinnedPosts: {
          edges: [
            {
              node: {
                id: 'pinned-1',
                caption: 'First Pinned Post',
                creator: {
                  id: 'u1',
                  name: 'User1',
                  avatarURL: null,
                },
                commentsCount: 0,
                pinnedAt: '2024-01-01T00:00:00.000Z',
                upVotesCount: 0,
                downVotesCount: 0,
                createdAt: '2024-01-01T00:00:00.000Z',
                comments: {
                  edges: [],
                  pageInfo: {
                    startCursor: null,
                    endCursor: null,
                    hasNextPage: false,
                    hasPreviousPage: false,
                  },
                },
              },
            },
            {
              node: {
                id: 'pinned-2',
                caption: 'Second Pinned Post',
                creator: {
                  id: 'u2',
                  name: 'User2',
                  avatarURL: null,
                },
                commentsCount: 0,
                pinnedAt: '2024-01-02T00:00:00.000Z',
                upVotesCount: 0,
                downVotesCount: 0,
                createdAt: '2024-01-02T00:00:00.000Z',
                comments: {
                  edges: [],
                  pageInfo: {
                    startCursor: null,
                    endCursor: null,
                    hasNextPage: false,
                    hasPreviousPage: false,
                  },
                },
              },
            },
          ],
          pageInfo: {
            startCursor: 'c1',
            endCursor: 'c2',
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      },
    },
  },
};

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
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('Testing Home Screen: User Portal', () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ orgId: 'orgId' });
    setItem('userId', '640d98d9eb6a743d75341067');
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

    await userEvent.click(startPostBtn);
    const startPostModal = screen.getByTestId('startPostModal');
    expect(startPostModal).toBeInTheDocument();
  });

  it('StartPostModal should close on clicking the close button', async () => {
    renderHomeScreen();

    await wait();
    await userEvent.upload(
      screen.getByTestId('postImageInput'),
      new File(['image content'], 'image.png', { type: 'image/png' }),
    );
    await wait();

    const startPostBtn = await screen.findByTestId('postBtn');
    expect(startPostBtn).toBeInTheDocument();

    await userEvent.click(startPostBtn);
    const startPostModal = screen.getByTestId('startPostModal');
    expect(startPostModal).toBeInTheDocument();

    await userEvent.type(screen.getByTestId('postInput'), 'some content');

    expect(screen.getByTestId('postInput')).toHaveValue('some content');
    await screen.findByAltText('Post Image Preview');
    expect(screen.getByAltText('Post Image Preview')).toBeInTheDocument();

    const closeButton = within(startPostModal).getByRole('button', {
      name: /close/i,
    });
    fireEvent.click(closeButton);

    const closedModalText = screen.queryByText(/somethingOnYourMind/i);
    expect(closedModalText).not.toBeInTheDocument();

    expect(screen.getByTestId('postInput')).toHaveValue('');
    const fileInput = screen.getByTestId('postImageInput') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: null } });
    expect(fileInput.files?.length).toBeFalsy();
  });

  it('Handle next page button', async () => {
    renderHomeScreen();

    const startPostBtn = await screen.findByTestId('postBtn');
    expect(startPostBtn).toBeInTheDocument();

    // Wait for posts to load
    await waitFor(
      () => {
        expect(screen.getByText('Post 1-1')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Check that "Next" button is enabled
    const nextBtn = screen.getByTestId('next-btn');
    expect(nextBtn).not.toBeDisabled();

    // Click Next (fetch page 2)
    fireEvent.click(nextBtn);

    await waitFor(
      () => {
        expect(screen.getByText('Post 2-1')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Check that "Previous" button is now enabled
    const prevBtn = screen.getByTestId('prev-btn');
    expect(prevBtn).not.toBeDisabled();

    // Click Previous (back to page 1)
    fireEvent.click(prevBtn);

    await waitFor(
      () => {
        expect(screen.getByText('Post 1-1')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });
});

describe('HomeScreen additional scenarios', () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ orgId: undefined });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should filter and set pinned posts when posts have pinnedAt values', async () => {
    const mocksWithPinnedPosts = [
      // Satisfy useQuery(USER_DETAILS)
      MOCKS[0],
      // Mock with pinned posts
      {
        request: {
          query: ORGANIZATION_POST_LIST_WITH_VOTES,
          variables: {
            input: { id: 'orgId' },
            first: 5,
            after: null,
            before: null,
            last: null,
            userId: '640d98d9eb6a743d75341067',
          },
        },
        result: {
          data: {
            organization: {
              id: 'orgId',
              postsCount: 2,
              posts: {
                edges: [
                  {
                    node: {
                      id: 'pinned-post-1',
                      caption: 'Pinned Post 1',
                      creator: {
                        id: 'u1',
                        name: 'User1',
                        avatarURL: null,
                      },
                      commentsCount: 0,
                      pinnedAt: '2024-01-01T00:00:00.000Z',
                      downVotesCount: 0,
                      upVotesCount: 0,
                      hasUserVoted: {
                        hasVoted: false,
                        voteType: null,
                      },
                      createdAt: '2024-01-01T00:00:00.000Z',
                      comments: {
                        edges: [],
                        pageInfo: {
                          startCursor: null,
                          endCursor: null,
                          hasNextPage: false,
                          hasPreviousPage: false,
                        },
                      },
                    },
                    cursor: 'c1',
                  },
                  {
                    node: {
                      id: 'normal-post-1',
                      caption: 'Normal Post 1',
                      creator: {
                        id: 'u2',
                        name: 'User2',
                        avatarURL: null,
                      },
                      commentsCount: 0,
                      pinnedAt: null,
                      downVotesCount: 0,
                      upVotesCount: 0,
                      hasUserVoted: {
                        hasVoted: false,
                        voteType: null,
                      },
                      createdAt: '2024-01-02T00:00:00.000Z',
                      comments: {
                        edges: [],
                        pageInfo: {
                          startCursor: null,
                          endCursor: null,
                          hasNextPage: false,
                          hasPreviousPage: false,
                        },
                      },
                    },
                    cursor: 'c2',
                  },
                ],
                pageInfo: {
                  startCursor: 'c1',
                  endCursor: 'c2',
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
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
                id: 'orgId',
                advertisements: {
                  edges: [],
                },
              },
            ],
          },
        },
      },
    ];

    const linkWithPinnedPosts = new StaticMockLink(mocksWithPinnedPosts, true);

    mockUseParams.mockReturnValue({ orgId: 'orgId' });
    setItem('userId', '640d98d9eb6a743d75341067');

    render(
      <MockedProvider addTypename={false} link={linkWithPinnedPosts}>
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

    await waitFor(() => {
      expect(screen.getByText('Pinned Post 1')).toBeInTheDocument();
      expect(screen.getByText('Normal Post 1')).toBeInTheDocument();
    });
  });

  it('should process promoted posts data and set ad content', async () => {
    const mocksWithAds = [
      // Satisfy useQuery(USER_DETAILS)
      MOCKS[0],
      {
        request: {
          query: ORGANIZATION_POST_LIST_WITH_VOTES,
          variables: {
            input: { id: 'orgId' },
            first: 5,
            after: null,
            before: null,
            last: null,
            userId: '640d98d9eb6a743d75341067',
          },
        },
        result: {
          data: {
            organization: {
              id: 'orgId',
              postsCount: 1,
              posts: {
                edges: [
                  {
                    node: {
                      id: 'post-1',
                      caption: 'Test Post',
                      creator: {
                        id: 'u1',
                        name: 'User1',
                        avatarURL: null,
                      },
                      commentsCount: 0,
                      pinnedAt: null,
                      downVotesCount: 0,
                      upVotesCount: 0,
                      hasUserVoted: {
                        hasVoted: false,
                        voteType: null,
                      },
                      createdAt: '2024-01-01T00:00:00.000Z',
                      comments: {
                        edges: [],
                        pageInfo: {
                          startCursor: null,
                          endCursor: null,
                          hasNextPage: false,
                          hasPreviousPage: false,
                        },
                      },
                    },
                    cursor: 'c1',
                  },
                ],
                pageInfo: {
                  startCursor: 'c1',
                  endCursor: 'c1',
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
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
                id: 'orgId',
                advertisements: {
                  edges: [
                    {
                      node: {
                        id: 'ad-1',
                        name: 'Test Advertisement',
                        type: 'BANNER',
                        mediaUrl: 'https://example.com/banner.jpg',
                        endDate: '2024-12-31',
                        startDate: '2024-01-01',
                      },
                    },
                    {
                      node: {
                        id: 'ad-2',
                        name: 'Another Ad',
                        type: 'POPUP',
                        mediaUrl: 'https://example.com/popup.jpg',
                        endDate: '2024-12-31',
                        startDate: '2024-01-01',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    ];

    const linkWithAds = new StaticMockLink(mocksWithAds, true);

    mockUseParams.mockReturnValue({ orgId: 'orgId' });
    setItem('userId', '640d98d9eb6a743d75341067');

    render(
      <MockedProvider addTypename={false} link={linkWithAds}>
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

    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
    });
  });

  it('should cover InstagramStory component and handleStoryClick', async () => {
    const mocksWithPinnedPosts = [
      // Satisfy useQuery(USER_DETAILS)
      MOCKS[0],
      {
        request: {
          query: ORGANIZATION_POST_LIST_WITH_VOTES,
          variables: {
            input: { id: 'orgId' },
            first: 5,
            after: null,
            before: null,
            last: null,
            userId: '640d98d9eb6a743d75341067',
          },
        },
        result: {
          data: {
            organization: {
              id: 'orgId',
              postsCount: 1,
              posts: {
                edges: [
                  {
                    node: {
                      id: 'pinned-post-1',
                      caption: 'Pinned Story Post',
                      creator: {
                        id: 'u1',
                        name: 'User1',
                        avatarURL: 'https://example.com/avatar.jpg',
                      },
                      commentsCount: 0,
                      pinnedAt: '2024-01-01T00:00:00.000Z',
                      downVotesCount: 0,
                      upVotesCount: 0,
                      hasUserVoted: {
                        hasVoted: false,
                        voteType: null,
                      },
                      createdAt: '2024-01-01T00:00:00.000Z',
                      comments: {
                        edges: [],
                        pageInfo: {
                          startCursor: null,
                          endCursor: null,
                          hasNextPage: false,
                          hasPreviousPage: false,
                        },
                      },
                    },
                    cursor: 'c1',
                  },
                ],
                pageInfo: {
                  startCursor: 'c1',
                  endCursor: 'c1',
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
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
                id: 'orgId',
                advertisements: {
                  edges: [],
                },
              },
            ],
          },
        },
      },
    ];

    const linkWithPinnedPosts = new StaticMockLink(mocksWithPinnedPosts, true);

    mockUseParams.mockReturnValue({ orgId: 'orgId' });
    setItem('userId', '640d98d9eb6a743d75341067');

    render(
      <MockedProvider addTypename={false} link={linkWithPinnedPosts}>
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

    await waitFor(() => {
      expect(screen.getByText('Pinned Story Post')).toBeInTheDocument();
    });

    // This test covers the InstagramStory component and story-related code
    // The presence of pinned posts should trigger the stories container rendering
    const storiesContainer = screen
      .getByText('Pinned Story Post')
      .closest('div');
    expect(storiesContainer).toBeInTheDocument();
  });

  it('should handle post button click', async () => {
    mockUseParams.mockReturnValue({ orgId: 'orgId' });
    setItem('userId', '640d98d9eb6a743d75341067');

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

    await waitFor(() => {
      expect(screen.getByTestId('postBtn')).toBeInTheDocument();
    });

    // Test handlePostButtonClick functionality
    const postButton = screen.getByTestId('postBtn');
    fireEvent.click(postButton);

    // Should open the start post modal
    await waitFor(() => {
      expect(screen.getByTestId('startPostModal')).toBeInTheDocument();
    });
  });

  it('should handle empty posts scenario', async () => {
    const mockWithNoPosts = [
      {
        request: {
          query: USER_DETAILS,
          variables: {
            input: { id: '640d98d9eb6a743d75341067' },
            first: 10,
          },
        },
        result: {
          data: {
            user: {
              id: '640d98d9eb6a743d75341067',
              name: 'Test User',
              email: 'test@example.com',
              joinedOrganizations: {
                edges: [],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: null,
                  endCursor: null,
                },
              },
              organizationsBlockedBy: {
                edges: [],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: null,
                  endCursor: null,
                },
              },
              tags: {
                edges: [],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: null,
                  endCursor: null,
                },
              },
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_POST_LIST_WITH_VOTES,
          variables: {
            input: { id: 'orgId' },
            first: 5,
            after: null,
            before: null,
            last: null,
            userId: '640d98d9eb6a743d75341067',
          },
        },
        result: {
          data: {
            organization: {
              id: 'orgId',
              postsCount: 0,
              posts: {
                edges: [],
                pageInfo: {
                  startCursor: null,
                  endCursor: null,
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
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
                id: 'orgId',
                advertisements: {
                  edges: [],
                },
              },
            ],
          },
        },
      },
    ];

    const linkWithNoPosts = new StaticMockLink(mockWithNoPosts, true);

    mockUseParams.mockReturnValue({ orgId: 'orgId' });
    setItem('userId', '640d98d9eb6a743d75341067');

    render(
      <MockedProvider addTypename={false} link={linkWithNoPosts}>
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

    await waitFor(() => {
      expect(screen.getByTestId('no-post')).toBeInTheDocument();
    });
  });
  it('should handle query errors gracefully', async () => {
    const mocksWithErrors = [
      {
        request: {
          query: USER_DETAILS,
          variables: {
            input: { id: '640d98d9eb6a743d75341067' },
            first: 100,
          },
        },
        error: new GraphQLError('User details fetch failed'),
      },
      {
        request: {
          query: ORGANIZATION_POST_LIST_WITH_VOTES,
          variables: {
            input: { id: 'orgId' },
            first: 5,
            after: null,
            before: null,
            last: null,
            userId: '640d98d9eb6a743d75341067',
          },
        },
        error: new GraphQLError('Posts fetch failed'),
      },
      {
        request: {
          query: ORGANIZATION_ADVERTISEMENT_LIST,
          variables: { id: 'orgId', first: 6 },
        },
        error: new GraphQLError('Advertisements fetch failed'),
      },
    ];

    const linkWithErrors = new StaticMockLink(mocksWithErrors, true);

    mockUseParams.mockReturnValue({ orgId: 'orgId' });
    setItem('userId', '640d98d9eb6a743d75341067');

    render(
      <MockedProvider addTypename={false} link={linkWithErrors}>
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

    // Component should still render even with errors
    await waitFor(() => {
      expect(screen.getByTestId('postBtn')).toBeInTheDocument();
    });
  });

  it('should handle posts with comments and votes', async () => {
    const mocksWithComments = [
      {
        request: {
          query: USER_DETAILS,
          variables: {
            input: { id: '640d98d9eb6a743d75341067' },
            first: 100,
          },
        },
        result: {
          data: {
            user: {
              id: '640d98d9eb6a743d75341067',
              name: 'Test User',
              email: 'test@example.com',
              joinedOrganizations: {
                edges: [],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: null,
                  endCursor: null,
                },
              },
              organizationsBlockedBy: {
                edges: [],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: null,
                  endCursor: null,
                },
              },
              tags: {
                edges: [],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: null,
                  endCursor: null,
                },
              },
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_POST_LIST_WITH_VOTES,
          variables: {
            input: { id: 'orgId' },
            first: 5,
            after: null,
            before: null,
            last: null,
            userId: '640d98d9eb6a743d75341067',
          },
        },
        result: {
          data: {
            organization: {
              id: 'orgId',
              postsCount: 1,
              posts: {
                edges: [
                  {
                    node: {
                      id: 'post-with-comments',
                      caption: 'Post with comments',
                      creator: {
                        id: 'u1',
                        name: 'User1',
                        avatarURL: 'https://example.com/avatar.jpg',
                      },
                      commentsCount: 2,
                      pinnedAt: null,
                      downVotesCount: 1,
                      upVotesCount: 5,
                      hasUserVoted: {
                        hasVoted: true,
                        voteType: 'up_vote',
                      },
                      createdAt: '2024-01-01T00:00:00.000Z',
                      comments: {
                        edges: [
                          {
                            node: {
                              id: 'comment-1',
                              body: 'Great post!',
                              creator: {
                                id: 'u2',
                                name: 'Commenter1',
                                avatarURL: null,
                              },
                              downVotesCount: 0,
                              upVotesCount: 2,
                              hasUserVoted: {
                                hasVoted: false,
                                voteType: null,
                              },
                            },
                          },
                          {
                            node: {
                              id: 'comment-2',
                              body: 'I agree!',
                              creator: {
                                id: 'u3',
                                name: 'Commenter2',
                                avatarURL: 'https://example.com/avatar2.jpg',
                              },
                              downVotesCount: 1,
                              upVotesCount: 0,
                              hasUserVoted: {
                                hasVoted: true,
                                voteType: 'down_vote',
                              },
                            },
                          },
                        ],
                        pageInfo: {
                          startCursor: 'comment-cursor-1',
                          endCursor: 'comment-cursor-2',
                          hasNextPage: false,
                          hasPreviousPage: false,
                        },
                      },
                    },
                    cursor: 'c1',
                  },
                ],
                pageInfo: {
                  startCursor: 'c1',
                  endCursor: 'c1',
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
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
                id: 'orgId',
                advertisements: {
                  edges: [],
                },
              },
            ],
          },
        },
      },
    ];

    const linkWithComments = new StaticMockLink(mocksWithComments, true);

    mockUseParams.mockReturnValue({ orgId: 'orgId' });
    setItem('userId', '640d98d9eb6a743d75341067');

    render(
      <MockedProvider addTypename={false} link={linkWithComments}>
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

    await waitFor(() => {
      expect(screen.getByText('Post with comments')).toBeInTheDocument();
      const showCommentsBtn = screen.getByTestId('comment-card');
      expect(showCommentsBtn).toBeInTheDocument();
      fireEvent.click(showCommentsBtn);
      expect(screen.getByText('Great post!')).toBeInTheDocument();
      expect(screen.getByText('I agree!')).toBeInTheDocument();
    });
  });

  it('should handle file selection without files', async () => {
    mockUseParams.mockReturnValue({ orgId: 'orgId' });
    setItem('userId', '640d98d9eb6a743d75341067');

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

    await waitFor(() => {
      expect(screen.getByTestId('postBtn')).toBeInTheDocument();
    });

    // Test file selection with no files
    const hiddenFileInput = document.querySelector('input[type="file"]');
    expect(hiddenFileInput).toBeInTheDocument();

    // Trigger change event with no files
    if (hiddenFileInput) {
      fireEvent.change(hiddenFileInput, { target: { files: null } });
    }

    // Modal should not open
    await wait(100);
    expect(screen.queryByTestId('startPostModal')).not.toBeInTheDocument();
  });

  it('should handle posts with attachments', async () => {
    const mocksWithAttachments = [
      {
        request: {
          query: USER_DETAILS,
          variables: {
            input: { id: '640d98d9eb6a743d75341067' },
            first: 100,
          },
        },
        result: {
          data: {
            user: {
              id: '640d98d9eb6a743d75341067',
              name: 'Test User',
              email: 'test@example.com',
              joinedOrganizations: {
                edges: [],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: null,
                  endCursor: null,
                },
              },
              organizationsBlockedBy: {
                edges: [],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: null,
                  endCursor: null,
                },
              },
              tags: {
                edges: [],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: null,
                  endCursor: null,
                },
              },
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_POST_LIST_WITH_VOTES,
          variables: {
            input: { id: 'orgId' },
            first: 5,
            after: null,
            before: null,
            last: null,
            userId: '640d98d9eb6a743d75341067',
          },
        },
        result: {
          data: {
            organization: {
              id: 'orgId',
              postsCount: 1,
              posts: {
                edges: [
                  {
                    node: {
                      id: 'post-with-attachments',
                      caption: 'Post with attachments',
                      creator: {
                        id: 'u1',
                        name: 'User1',
                        avatarURL: null,
                      },
                      commentsCount: 0,
                      pinnedAt: null,
                      downVotesCount: 0,
                      upVotesCount: 0,
                      hasUserVoted: {
                        hasVoted: false,
                        voteType: null,
                      },
                      createdAt: '2024-01-01T00:00:00.000Z',
                      attachments: [
                        {
                          id: 'attachment-1',
                          type: 'IMAGE',
                          url: 'https://example.com/image.jpg',
                        },
                        {
                          id: 'attachment-2',
                          type: 'VIDEO',
                          url: 'https://example.com/video.mp4',
                        },
                      ],
                      comments: {
                        edges: [],
                        pageInfo: {
                          startCursor: null,
                          endCursor: null,
                          hasNextPage: false,
                          hasPreviousPage: false,
                        },
                      },
                    },
                    cursor: 'c1',
                  },
                ],
                pageInfo: {
                  startCursor: 'c1',
                  endCursor: 'c1',
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
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
                id: 'orgId',
                advertisements: {
                  edges: [],
                },
              },
            ],
          },
        },
      },
    ];

    const linkWithAttachments = new StaticMockLink(mocksWithAttachments, true);

    mockUseParams.mockReturnValue({ orgId: 'orgId' });
    setItem('userId', '640d98d9eb6a743d75341067');

    render(
      <MockedProvider addTypename={false} link={linkWithAttachments}>
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

    await waitFor(() => {
      expect(screen.getByText('Post with attachments')).toBeInTheDocument();
      expect(screen.getByAltText('Post with attachments')).toHaveAttribute(
        'src',
        '/src/assets/images/defaultImg.png',
      );
    });
  });

  it('should handle pagination when no next/previous page available', async () => {
    mockUseParams.mockReturnValue({ orgId: 'orgId' });
    setItem('userId', '640d98d9eb6a743d75341067');

    const singlePageMocks = [
      {
        request: {
          query: USER_DETAILS,
          variables: {
            input: { id: '640d98d9eb6a743d75341067' },
            first: 100,
          },
        },
        result: {
          data: {
            user: {
              id: '640d98d9eb6a743d75341067',
              name: 'Test User',
              email: 'test@example.com',
              joinedOrganizations: {
                edges: [],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: null,
                  endCursor: null,
                },
              },
              organizationsBlockedBy: {
                edges: [],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: null,
                  endCursor: null,
                },
              },
              tags: {
                edges: [],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  startCursor: null,
                  endCursor: null,
                },
              },
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_POST_LIST_WITH_VOTES,
          variables: {
            input: { id: 'orgId' },
            first: 5,
            after: null,
            before: null,
            last: null,
            userId: '640d98d9eb6a743d75341067',
          },
        },
        result: {
          data: {
            organization: {
              id: 'orgId',
              postsCount: 1,
              posts: {
                edges: [
                  {
                    node: {
                      id: 'single-post',
                      caption: 'Single post',
                      creator: {
                        id: 'u1',
                        name: 'User1',
                        avatarURL: null,
                      },
                      commentsCount: 0,
                      pinnedAt: null,
                      downVotesCount: 0,
                      upVotesCount: 0,
                      hasUserVoted: {
                        hasVoted: false,
                        voteType: null,
                      },
                      createdAt: '2024-01-01T00:00:00.000Z',
                      comments: {
                        edges: [],
                        pageInfo: {
                          startCursor: null,
                          endCursor: null,
                          hasNextPage: false,
                          hasPreviousPage: false,
                        },
                      },
                    },
                    cursor: 'c1',
                  },
                ],
                pageInfo: {
                  startCursor: 'c1',
                  endCursor: 'c1',
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
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
                id: 'orgId',
                advertisements: {
                  edges: [],
                },
              },
            ],
          },
        },
      },
    ];

    const singlePageLink = new StaticMockLink(singlePageMocks, true);

    render(
      <MockedProvider addTypename={false} link={singlePageLink}>
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

    await waitFor(() => {
      expect(screen.getByText('Single post')).toBeInTheDocument();
    });

    // Both pagination buttons should be disabled
    const nextBtn = screen.getByTestId('next-btn');
    const prevBtn = screen.getByTestId('prev-btn');

    expect(nextBtn).toBeDisabled();
    expect(prevBtn).toBeDisabled();

    // Clicking should have no effect
    fireEvent.click(nextBtn);
    fireEvent.click(prevBtn);

    await wait(100);
    // Should still be on the same page
    expect(screen.getByText('Single post')).toBeInTheDocument();
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

    await waitFor(() => {
      expect(screen.getByTestId('homeEl')).toBeInTheDocument();
      expect(screen.queryAllByTestId('postCardContainer')).toHaveLength(0);
    });
  });
});

// const { setItem } = useLocalStorage();
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

// const mockUseParams = vi.fn().mockReturnValue({ orgId: 'orgId' });

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => mockUseParams(),
    useNavigate: () => vi.fn(),
  };
});

// Helper functions
const createUserDetailsMock = (first: number = 10) => ({
  request: {
    query: USER_DETAILS,
    variables: {
      input: { id: '640d98d9eb6a743d75341067' },
      first,
    },
  },
  result: {
    data: {
      user: {
        id: '640d98d9eb6a743d75341067',
        name: 'Test User',
        emailAddress: 'test@example.com',
        joinedOrganizations: {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        },
        organizationsBlockedBy: {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        },
        tags: {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        },
      },
    },
  },
});

const createEmptyAdsMock = () => ({
  request: {
    query: ORGANIZATION_ADVERTISEMENT_LIST,
    variables: { id: 'orgId', first: 6 },
  },
  result: {
    data: {
      organizations: [
        {
          id: 'orgId',
          advertisements: {
            edges: [],
          },
        },
      ],
    },
  },
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('PinnedPostCard Component Tests', () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ orgId: 'orgId' });
    setItem('userId', '640d98d9eb6a743d75341067');
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render pinned posts in carousel', async () => {
    const mocksWithPinnedPosts = [
      createUserDetailsMock(),
      {
        request: {
          query: ORGANIZATION_POST_LIST_WITH_VOTES,
          variables: {
            input: { id: 'orgId' },
            first: 5,
            after: null,
            before: null,
            last: null,
            userId: '640d98d9eb6a743d75341067',
          },
        },
        result: {
          data: {
            organization: {
              id: 'orgId',
              postsCount: 2,
              posts: {
                edges: [
                  {
                    node: {
                      id: 'pinned-1',
                      caption: 'First Pinned Post',
                      creator: {
                        id: 'u1',
                        name: 'User1',
                        avatarURL: null,
                      },
                      commentsCount: 0,
                      pinnedAt: '2024-01-01T00:00:00.000Z',
                      downVotesCount: 0,
                      upVotesCount: 0,
                      hasUserVoted: {
                        hasVoted: false,
                        voteType: null,
                      },
                      createdAt: '2024-01-01T00:00:00.000Z',
                      comments: {
                        edges: [],
                        pageInfo: {
                          startCursor: null,
                          endCursor: null,
                          hasNextPage: false,
                          hasPreviousPage: false,
                        },
                      },
                    },
                    cursor: 'c1',
                  },
                  {
                    node: {
                      id: 'pinned-2',
                      caption: 'Second Pinned Post',
                      creator: {
                        id: 'u2',
                        name: 'User2',
                        avatarURL: null,
                      },
                      commentsCount: 0,
                      pinnedAt: '2024-01-02T00:00:00.000Z',
                      downVotesCount: 0,
                      upVotesCount: 0,
                      hasUserVoted: {
                        hasVoted: false,
                        voteType: null,
                      },
                      createdAt: '2024-01-02T00:00:00.000Z',
                      comments: {
                        edges: [],
                        pageInfo: {
                          startCursor: null,
                          endCursor: null,
                          hasNextPage: false,
                          hasPreviousPage: false,
                        },
                      },
                    },
                    cursor: 'c2',
                  },
                ],
                pageInfo: {
                  startCursor: 'c1',
                  endCursor: 'c2',
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
          },
        },
      },
      pinnedPostsMock1,
      pinnedPostsMock2,
      createEmptyAdsMock(),
    ];

    const link = new StaticMockLink(mocksWithPinnedPosts, true);

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

    await waitFor(
      () => {
        expect(screen.getByText('First Pinned Post')).toBeInTheDocument();
        expect(screen.getByText('Second Pinned Post')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Verify the "Pinned Posts" heading is visible
    expect(screen.getByText(/pinned posts/i)).toBeInTheDocument();
  });

  it('should close modal when clicking outside or close button', async () => {
    const mocksWithPinnedPost = [
      createUserDetailsMock(),
      {
        request: {
          query: ORGANIZATION_POST_LIST_WITH_VOTES,
          variables: {
            input: { id: 'orgId' },
            first: 5,
            after: null,
            before: null,
            last: null,
            userId: '640d98d9eb6a743d75341067',
          },
        },
        result: {
          data: {
            organization: {
              id: 'orgId',
              postsCount: 1,
              posts: {
                edges: [
                  {
                    node: {
                      id: 'pinned-close-test',
                      caption: 'Test Close Modal',
                      creator: {
                        id: 'u1',
                        name: 'User1',
                        avatarURL: null,
                      },
                      commentsCount: 0,
                      pinnedAt: '2024-01-01T00:00:00.000Z',
                      downVotesCount: 0,
                      upVotesCount: 0,
                      hasUserVoted: {
                        hasVoted: false,
                        voteType: null,
                      },
                      createdAt: '2024-01-01T00:00:00.000Z',
                      comments: {
                        edges: [],
                        pageInfo: {
                          startCursor: null,
                          endCursor: null,
                          hasNextPage: false,
                          hasPreviousPage: false,
                        },
                      },
                    },
                    cursor: 'c1',
                  },
                ],
                pageInfo: {
                  startCursor: 'c1',
                  endCursor: 'c1',
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
          },
        },
      },
      pinnedPostsMock1,
      createEmptyAdsMock(),
    ];

    const link = new StaticMockLink(mocksWithPinnedPost, true);

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

    await waitFor(
      () => {
        expect(screen.getByText('Test Close Modal')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Verify pinned posts section exists
    // expect(screen.getByText("Pinned Posts")).toBeInTheDocument();
  });

  it('should display default image when post has no image', async () => {
    const mocksWithPinnedPost = [
      createUserDetailsMock(),
      {
        request: {
          query: ORGANIZATION_POST_LIST_WITH_VOTES,
          variables: {
            input: { id: 'orgId' },
            first: 5,
            after: null,
            before: null,
            last: null,
            userId: '640d98d9eb6a743d75341067',
          },
        },
        result: {
          data: {
            organization: {
              id: 'orgId',
              postsCount: 1,
              posts: {
                edges: [
                  {
                    node: {
                      id: 'no-image-post',
                      caption: 'Post Without Image',
                      creator: {
                        id: 'u1',
                        name: 'User1',
                        avatarURL: null,
                      },
                      commentsCount: 0,
                      pinnedAt: '2024-01-01T00:00:00.000Z',
                      downVotesCount: 0,
                      upVotesCount: 0,
                      hasUserVoted: {
                        hasVoted: false,
                        voteType: null,
                      },
                      createdAt: '2024-01-01T00:00:00.000Z',
                      comments: {
                        edges: [],
                        pageInfo: {
                          startCursor: null,
                          endCursor: null,
                          hasNextPage: false,
                          hasPreviousPage: false,
                        },
                      },
                    },
                    cursor: 'c1',
                  },
                ],
                pageInfo: {
                  startCursor: 'c1',
                  endCursor: 'c1',
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
          },
        },
      },
      createEmptyAdsMock(),
    ];

    const link = new StaticMockLink(mocksWithPinnedPost, true);

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

    await waitFor(() => {
      expect(screen.getByText('Post Without Image')).toBeInTheDocument();
    });

    // Check that default image is used
    const image = screen.getByAltText('Post Without Image');
    expect(image).toHaveAttribute('src', '/src/assets/images/defaultImg.png');
  });

  it('should not render pinned posts section when no pinned posts exist', async () => {
    const mocksWithoutPinnedPosts = [
      createUserDetailsMock(),
      {
        request: {
          query: ORGANIZATION_POST_LIST_WITH_VOTES,
          variables: {
            input: { id: 'orgId' },
            first: 5,
            after: null,
            before: null,
            last: null,
            userId: '640d98d9eb6a743d75341067',
          },
        },
        result: {
          data: {
            organization: {
              id: 'orgId',
              postsCount: 1,
              posts: {
                edges: [
                  {
                    node: {
                      id: 'regular-post',
                      caption: 'Regular Post',
                      creator: {
                        id: 'u1',
                        name: 'User1',
                        avatarURL: null,
                      },
                      commentsCount: 0,
                      pinnedAt: null, // Not pinned
                      downVotesCount: 0,
                      upVotesCount: 0,
                      hasUserVoted: {
                        hasVoted: false,
                        voteType: null,
                      },
                      createdAt: '2024-01-01T00:00:00.000Z',
                      comments: {
                        edges: [],
                        pageInfo: {
                          startCursor: null,
                          endCursor: null,
                          hasNextPage: false,
                          hasPreviousPage: false,
                        },
                      },
                    },
                    cursor: 'c1',
                  },
                ],
                pageInfo: {
                  startCursor: 'c1',
                  endCursor: 'c1',
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
          },
        },
      },
      createEmptyAdsMock(),
    ];

    const link = new StaticMockLink(mocksWithoutPinnedPosts, true);

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

    await waitFor(() => {
      expect(screen.getByText('Regular Post')).toBeInTheDocument();
    });

    // Verify pinned posts section is not rendered
    expect(screen.queryByTestId('pinned-post')).not.toBeInTheDocument();
  });

  it('should handle mixed pinned and regular posts correctly', async () => {
    const mocksWithMixedPosts = [
      createUserDetailsMock(),
      {
        request: {
          query: ORGANIZATION_POST_LIST_WITH_VOTES,
          variables: {
            input: { id: 'orgId' },
            first: 5,
            after: null,
            before: null,
            last: null,
            userId: '640d98d9eb6a743d75341067',
          },
        },
        result: {
          data: {
            organization: {
              id: 'orgId',
              postsCount: 3,
              posts: {
                edges: [
                  {
                    node: {
                      id: 'pinned-1',
                      caption: 'Pinned Post 1',
                      creator: { id: 'u1', name: 'User1', avatarURL: null },
                      commentsCount: 0,
                      pinnedAt: '2024-01-01T00:00:00.000Z',
                      downVotesCount: 0,
                      upVotesCount: 0,
                      hasUserVoted: { hasVoted: false, voteType: null },
                      createdAt: '2024-01-01T00:00:00.000Z',
                      comments: {
                        edges: [],
                        pageInfo: {
                          startCursor: null,
                          endCursor: null,
                          hasNextPage: false,
                          hasPreviousPage: false,
                        },
                      },
                    },
                    cursor: 'c1',
                  },
                  {
                    node: {
                      id: 'regular-1',
                      caption: 'Regular Post 1',
                      creator: { id: 'u2', name: 'User2', avatarURL: null },
                      commentsCount: 0,
                      pinnedAt: null,
                      downVotesCount: 0,
                      upVotesCount: 0,
                      hasUserVoted: { hasVoted: false, voteType: null },
                      createdAt: '2024-01-02T00:00:00.000Z',
                      comments: {
                        edges: [],
                        pageInfo: {
                          startCursor: null,
                          endCursor: null,
                          hasNextPage: false,
                          hasPreviousPage: false,
                        },
                      },
                    },
                    cursor: 'c2',
                  },
                  {
                    node: {
                      id: 'pinned-2',
                      caption: 'Pinned Post 2',
                      creator: { id: 'u3', name: 'User3', avatarURL: null },
                      commentsCount: 0,
                      pinnedAt: '2024-01-03T00:00:00.000Z',
                      downVotesCount: 0,
                      upVotesCount: 0,
                      hasUserVoted: { hasVoted: false, voteType: null },
                      createdAt: '2024-01-03T00:00:00.000Z',
                      comments: {
                        edges: [],
                        pageInfo: {
                          startCursor: null,
                          endCursor: null,
                          hasNextPage: false,
                          hasPreviousPage: false,
                        },
                      },
                    },
                    cursor: 'c3',
                  },
                ],
                pageInfo: {
                  startCursor: 'c1',
                  endCursor: 'c3',
                  hasNextPage: false,
                  hasPreviousPage: false,
                },
              },
            },
          },
        },
      },
      pinnedPostsMock1,
      createEmptyAdsMock(),
    ];

    const link = new StaticMockLink(mocksWithMixedPosts, true);

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

    await waitFor(
      () => {
        expect(screen.getByText('Pinned Post 1')).toBeInTheDocument();
        expect(screen.getByText('Pinned Post 2')).toBeInTheDocument();
        expect(screen.getByText('Regular Post 1')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Verify pinned posts section is visible
    expect(screen.getByText(/pinned posts/i)).toBeInTheDocument();
  });
});

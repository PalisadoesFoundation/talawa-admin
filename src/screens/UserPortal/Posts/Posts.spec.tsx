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
  ORGANIZATION_POST_LIST,
} from 'GraphQl/Queries/Queries';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import Home from './Posts';
import useLocalStorage from 'utils/useLocalstorage';
import { DELETE_POST_MUTATION } from 'GraphQl/Mutations/mutations';
import { expect, describe, it, vi } from 'vitest';
import { GraphQLError } from 'graphql';

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
  // Initial load - Page 1
  {
    request: {
      query: ORGANIZATION_POST_LIST,
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
                  upVoters: {
                    edges: [],
                    pageInfo: {
                      startCursor: null,
                      endCursor: null,
                      hasNextPage: false,
                      hasPreviousPage: false,
                    },
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
                  upVoters: {
                    edges: [],
                    pageInfo: {
                      startCursor: null,
                      endCursor: null,
                      hasNextPage: false,
                      hasPreviousPage: false,
                    },
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
      query: ORGANIZATION_POST_LIST,
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
                  upVoters: {
                    edges: [],
                    pageInfo: {
                      startCursor: null,
                      endCursor: null,
                      hasNextPage: false,
                      hasPreviousPage: false,
                    },
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
                  upVoters: {
                    edges: [],
                    pageInfo: {
                      startCursor: null,
                      endCursor: null,
                      hasNextPage: false,
                      hasPreviousPage: false,
                    },
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
      query: ORGANIZATION_POST_LIST,
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
                  upVoters: {
                    edges: [],
                    pageInfo: {
                      startCursor: null,
                      endCursor: null,
                      hasNextPage: false,
                      hasPreviousPage: false,
                    },
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
                  upVoters: {
                    edges: [],
                    pageInfo: {
                      startCursor: null,
                      endCursor: null,
                      hasNextPage: false,
                      hasPreviousPage: false,
                    },
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

    await waitFor(() => {
      expect(screen.getByTestId('homeEl')).toBeInTheDocument();
      expect(screen.queryAllByTestId('postCardContainer')).toHaveLength(0);
    });
  });
});

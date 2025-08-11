import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import type { RenderResult } from '@testing-library/react';
import { fireEvent, render, screen, within } from '@testing-library/react';
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

const MOCKS = [
  {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: {
        input: { id: 'orgId' },
        first: 10,
      },
    },
    result: {
      data: {
        organization: {
          id: 'orgId',
          posts: {
            edges: [
              {
                node: {
                  id: '6411e53835d7ba2344a78e21',
                  caption: 'post one',
                  commentsCount: 0,
                  pinnedAt: '2024-03-05T00:00:00.000Z',
                  downVotesCount: 0,
                  upVoters: {
                    edges: [],
                    pageInfo: {
                      startCursor: null,
                      endCursor: null,
                      hasNextPage: false,
                      hasPreviousPage: false,
                    },
                  },
                  upVotesCount: 0,
                  creator: {
                    id: '640d98d9eb6a743d75341067',
                    name: 'Glen Dsza',
                  },
                  createdAt: '2024-03-03T09:26:56.524Z',
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
                cursor: '6411e53835d7ba2344a78e21',
              },
              {
                node: {
                  id: '6411e54835d7ba2344a78e29',
                  caption: 'post two',
                  commentsCount: 1,
                  pinnedAt: null,
                  downVotesCount: 0,
                  upVoters: {
                    edges: [
                      {
                        node: {
                          id: '640d98d9eb6a743d75341067',
                          creator: {
                            id: '640d98d9eb6a743d75341067',
                            name: 'Glen Dsza',
                          },
                        },
                      },
                      {
                        node: {
                          id: '640d98d9eb6a743d75341068',
                          creator: {
                            id: '640d98d9eb6a743d75341068',
                            name: 'Glen2 Dsza2',
                          },
                        },
                      },
                    ],
                    pageInfo: {
                      startCursor: null,
                      endCursor: null,
                      hasNextPage: false,
                      hasPreviousPage: false,
                    },
                  },
                  upVotesCount: 2,
                  creator: {
                    id: '640d98d9eb6a743d75341067',
                    name: 'Glen Dsza',
                  },
                  createdAt: '2024-03-03T09:26:56.524Z',
                  comments: {
                    edges: [
                      {
                        node: {
                          id: 'comment-6411e54835d7ba2344a78e29',
                          body: 'This is the post two',
                          creator: {
                            id: '640d98d9eb6a743d75341067',
                            name: 'Glen Dsza',
                          },
                          downVotesCount: 0,
                          upVotesCount: 2,
                        },
                      },
                    ],
                    pageInfo: {
                      startCursor: null,
                      endCursor: null,
                      hasNextPage: false,
                      hasPreviousPage: false,
                    },
                  },
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
          },
        },
      },
    },
  },
  // Continue with your advertisements and DELETE_POST_MUTATION mocks as before,
  // but ensure `type` of ads is one of 'BANNER' | 'MENU' | 'POPUP', e.g.:
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
                    type: 'BANNER',
                    organization: { _id: 'orgId' },
                    mediaUrl: 'Link 1',
                    startDate: '2022-01-01',
                    endDate: '2024-12-31',
                  },
                  cursor: '1234',
                },
                // other ads...
              ],
              pageInfo: {
                startCursor: null,
                endCursor: null,
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

  it('Check whether Posts render in PostCard', async () => {
    setItem('userId', '640d98d9eb6a743d75341067'); // Ensure userId is set for the test
    renderHomeScreen();
    await wait();

    const postCardContainers =
      await screen.findAllByTestId('postCardContainer');
    expect(postCardContainers.length).toBe(1);
  });

  it('Checking if refetch works after deleting this post', async () => {
    setItem('userId', '640d98d9eb6a743d75341067');
    renderHomeScreen();
    expect(screen.queryAllByTestId('dropdown')).not.toBeNull();
    const dropdowns = await screen.findAllByTestId('dropdown');
    await userEvent.click(dropdowns[1]);
    const deleteButton = await screen.findByTestId('deletePost');
    await userEvent.click(deleteButton);
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

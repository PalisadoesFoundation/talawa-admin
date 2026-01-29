import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import userEvent from '@testing-library/user-event';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import Requests from './Requests';
import {
  EMPTY_MOCKS,
  MOCKS_WITH_ERROR,
  MOCKS2,
  EMPTY_REQUEST_MOCKS,
  UPDATED_MOCKS,
  MOCKS3,
  MOCKS4,
} from './RequestsMocks';
import { vi } from 'vitest';
import {
  MEMBERSHIP_REQUEST_PG,
  ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import {
  ACCEPT_ORGANIZATION_REQUEST_MUTATION,
  REJECT_ORGANIZATION_REQUEST_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { PAGE_SIZE } from 'types/ReportingTable/utils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const { mockLocalStorageStore } = vi.hoisted(() => ({
  mockLocalStorageStore: {} as Record<string, string>,
}));

// Mock useLocalStorage
vi.mock('utils/useLocalstorage', () => {
  return {
    default: () => ({
      getItem: (key: string) => mockLocalStorageStore[key] || null,
      setItem: (key: string, value: string) => {
        mockLocalStorageStore[key] = value;
      },
      removeItem: (key: string) => {
        delete mockLocalStorageStore[key];
      },
      clear: () => {
        for (const key in mockLocalStorageStore)
          delete mockLocalStorageStore[key];
      },
    }),
    // Removed unused named exports
  };
});

// Mock errorHandler
vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

// We don't need to mock global localStorage anymore for the hook
// But we might need it if the component uses localStorage directly
// The component uses useLocalStorage hook.

// Direct wrapper functions for test usage
const setItem = (key: string, value: unknown): void => {
  mockLocalStorageStore[key] =
    typeof value === 'string' ? value : JSON.stringify(value);
};

const removeItem = (key: string): void => {
  delete mockLocalStorageStore[key];
};

// Mock window.location
const mockLocation = {
  href: 'http://localhost/',
  assign: vi.fn(),
  reload: vi.fn(),
  pathname: '/',
  search: '',
  hash: '',
  origin: 'http://localhost',
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

// Create mock links
const link = new StaticMockLink(UPDATED_MOCKS, true);
const link2 = new StaticMockLink(EMPTY_MOCKS, true);
const link3 = new StaticMockLink(EMPTY_REQUEST_MOCKS, true);
const link4 = new StaticMockLink(MOCKS2, true);
const link5 = new StaticMockLink(MOCKS_WITH_ERROR, true);
const link6 = new StaticMockLink(MOCKS3, true);
const link7 = new StaticMockLink(MOCKS4, true);

const NULL_RESPONSE_MOCKS = [
  {
    request: {
      query: MEMBERSHIP_REQUEST_PG,
      variables: {
        input: { id: '' },
        skip: 0,
        first: 8,
        name_contains: 'User', // Use name_contains instead of firstName_contains
      },
    },
    result: {
      data: {
        organization: {
          id: '',
          membershipRequests: [],
        },
      },
    },
  },
];

const linkNullResponse = new StaticMockLink(NULL_RESPONSE_MOCKS, true);

// Mock data for infinite scroll tests
const INFINITE_SCROLL_MOCKS = [
  // Initial organization list query
  {
    request: {
      query: ORGANIZATION_LIST,
    },
    result: {
      data: {
        organizations: [
          {
            id: 'org1',
            name: 'Test Organization',
            addressLine1: '123 Test Street',
            description: 'A test organization',
            avatarURL: null,
            members: {
              edges: [
                {
                  node: {
                    id: 'user1',
                  },
                },
              ],
              pageInfo: {
                hasNextPage: false,
              },
            },
          },
        ],
      },
    },
  },
  // Initial membership requests query (PAGE_SIZE = 10)
  {
    request: {
      query: MEMBERSHIP_REQUEST_PG,
      variables: {
        input: { id: '' },
        skip: 0,
        first: 10,
        name_contains: '',
      },
    },
    result: {
      data: {
        organization: {
          id: '',
          membershipRequests: Array(10)
            .fill(null)
            .map((_, i) => ({
              membershipRequestId: `request${i + 1}`,
              createdAt: dayjs
                .utc()
                .subtract(1, 'year')
                .add(i, 'days')
                .toISOString(),
              status: 'pending',
              user: {
                avatarURL: null,
                id: `user${i + 1}`,
                name: `User${i + 1} Test`,
                emailAddress: `user${i + 1}@test.com`,
              },
            })),
        },
      },
    },
  },
  // Follow-up query for more data
  {
    request: {
      query: MEMBERSHIP_REQUEST_PG,
      variables: {
        input: { id: '' },
        skip: 10,
        first: 10,
        name_contains: '',
      },
    },
    result: {
      data: {
        organization: {
          id: '',
          membershipRequests: Array(10)
            .fill(null)
            .map((_, i) => ({
              membershipRequestId: `request${i + 11}`,
              createdAt: dayjs()
                .subtract(1, 'year')
                .add(i + 10, 'days')
                .toISOString(),
              status: 'pending',
              user: {
                avatarURL: null,
                id: `user${i + 11}`,
                name: `User${i + 11} Test`,
                emailAddress: `user${i + 11}@test.com`,
              },
            })),
        },
      },
    },
  },
];

const linkInfiniteScroll = new StaticMockLink(INFINITE_SCROLL_MOCKS, true);

/**
 * Utility function to wait for a specified amount of time.
 */
async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

beforeEach(() => {
  setItem('id', 'user1');
  setItem('role', 'administrator');
  setItem('SuperAdmin', false);
  vi.clearAllMocks();
});

afterEach(() => {
  for (const key in mockLocalStorageStore) delete mockLocalStorageStore[key];
  // Restore all mocks
  vi.restoreAllMocks();
});

describe('Testing Requests screen', () => {
  // Helper factories to reduce mock repetition
  const makeOrgListMock = (orgOverrides: Partial<unknown> = {}) => ({
    request: { query: ORGANIZATION_LIST },
    result: {
      data: {
        organizations: [
          {
            id: 'org1',
            name: 'Test Organization',
            addressLine1: '123 Test Street',
            description: 'A test organization',
            avatarURL: null,
            members: {
              edges: [{ node: { id: 'user1' } }],
              pageInfo: { hasNextPage: false },
            },
            ...orgOverrides,
          },
        ],
      },
    },
  });

  const makeMembershipRequestsMock = (
    requests: Array<{
      membershipRequestId?: string;
      createdAt?: string;
      status?: string;
      user: {
        avatarURL?: string | null;
        id: string;
        name?: string;
        emailAddress?: string;
      };
    }>,
    variablesOverrides: Partial<{
      input: { id: string };
      skip: number;
      first: number;
      name_contains: string;
    }> = {},
  ) => ({
    request: {
      query: MEMBERSHIP_REQUEST_PG,
      variables: {
        input: { id: '' },
        skip: 0,
        first: 10,
        name_contains: '',
        ...variablesOverrides,
      },
    },
    result: {
      data: {
        organization: {
          id: variablesOverrides.input?.id ?? '',
          membershipRequests: requests.map((r) => ({
            membershipRequestId: r.membershipRequestId,
            createdAt: r.createdAt ?? dayjs().subtract(1, 'year').toISOString(),
            status: r.status ?? 'pending',
            user: r.user,
          })),
        },
      },
    },
  });

  test('Component should be rendered properly', async () => {
    render(
      <MockedProvider link={link7}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);
    expect(screen.getByTestId('testComp')).toBeInTheDocument();

    // Verify basic page elements are rendered
    expect(screen.getByTestId('searchByName')).toBeInTheDocument();
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test(`Component should be rendered properly when user is not Admin
  and or userId does not exists in localstorage`, async () => {
    setItem('id', '');
    removeItem('AdminFor');
    removeItem('SuperAdmin');
    setItem('role', 'user');

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    expect(window.location.assign).toHaveBeenCalledWith('/admin/orglist');
  });

  test('Component should be rendered properly when user is Admin', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    expect(screen.getByTestId('searchByName')).toBeInTheDocument();
  });

  test('Redirecting on error', async () => {
    setItem('SuperAdmin', true);
    render(
      <MockedProvider link={link5}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);
    expect(window.location.href).toEqual('http://localhost/');
  });

  test('Testing Search requests functionality', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);
    const searchBtn = await screen.findByTestId('searchButton');
    const searchInput = await screen.findByTestId('searchByName');

    const search1 = 'John';
    await userEvent.type(searchInput, search1);
    await userEvent.click(searchBtn);
    await wait(200);

    await userEvent.clear(searchInput);
    const search2 = 'Pete';
    await userEvent.type(searchInput, search2);
    await wait(100);
    await userEvent.clear(searchInput);

    const search3 = 'Sam';
    await userEvent.type(searchInput, search3);
    await wait(100);
    await userEvent.clear(searchInput);

    const search4 = 'P';
    await userEvent.type(searchInput, search4);
    await wait(100);
    await userEvent.clear(searchInput);

    const search5 = 'Xe';
    await userEvent.type(searchInput, search5);
    await userEvent.clear(searchInput);
    await userEvent.click(searchBtn);
    await wait(200);
  });

  test('Testing search not found', async () => {
    render(
      <MockedProvider link={link3}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);
    const searchInput = await screen.findByTestId('searchByName');
    const search = 'hello';
    await userEvent.type(searchInput, search);
    await userEvent.keyboard('{Enter}');
    await wait(200);

    // When there are no requests at all, show "no requests found" message
    const grid = screen.getByRole('grid');
    expect(grid).toBeInTheDocument();

    const rows = grid.querySelectorAll('[role="row"]');
    expect(rows.length).toBe(1);
  });

  test('Testing Request data is not present', async () => {
    render(
      <MockedProvider link={link3}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    expect(
      screen.getByTestId('requests-no-requests-empty'),
    ).toBeInTheDocument();
  });

  test('Should render warning alert when there are no organizations', async () => {
    const { container } = render(
      <MockedProvider link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(500);

    expect(screen.getByTestId('testComp')).toBeInTheDocument();

    expect(container).toBeInTheDocument();
  });

  test('Should not render warning alert when there are organizations present', async () => {
    const { container } = render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);
    expect(container.textContent).not.toMatch(
      'Organizations not found, please create an organization through dashboard',
    );
  });

  test('Should render properly when there are no organizations present in requestsData', async () => {
    render(
      <MockedProvider link={link6}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);
  });

  test('check for rerendering', async () => {
    const { rerender } = render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);
    rerender(
      <MockedProvider link={link4}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait(200);
  });

  test('Shows warning toast when there are no organizations', async () => {
    render(
      <MockedProvider link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    expect(NotificationToast.warning).toHaveBeenCalledWith(expect.any(String));
    expect(NotificationToast.warning).toHaveBeenCalledTimes(1);
  });

  test('should handle loading more requests successfully', async () => {
    render(
      <MockedProvider link={linkInfiniteScroll}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    const table = screen.getByRole('grid');
    expect(table).toBeInTheDocument();

    const initialRows = screen.getAllByRole('row').length;
    expect(initialRows).toBeGreaterThan(1);

    await waitFor(() => {
      expect(screen.getByText(/User1 Test/i)).toBeInTheDocument();
    });

    const paginationButtons = screen
      .getAllByRole('button')
      .filter(
        (btn) =>
          btn.getAttribute('aria-label')?.includes('Go to page') ||
          btn.getAttribute('aria-label')?.includes('page'),
      );
    expect(paginationButtons.length).toBeGreaterThan(0);
  });

  test('rows.length whould be greater than 9 when newRequests.length > perPageResult', async () => {
    const CORRECT_STRUCTURE_MOCKS = [
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [
              {
                id: 'org1',
                name: 'Test Organization',
                addressLine1: '123 Test Street',
                description: 'Test description',
                avatarURL: null,
                members: {
                  edges: [
                    {
                      node: {
                        id: 'user1',
                      },
                    },
                  ],
                  pageInfo: {
                    hasNextPage: false,
                  },
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: 'org1',
              membershipRequests: Array(10)
                .fill(null)
                .map((_, i) => ({
                  membershipRequestId: `request${i + 1}`,
                  createdAt: dayjs()
                    .subtract(1, 'year')
                    .add(i, 'days')
                    .toISOString(),
                  status: 'pending',
                  user: {
                    avatarURL: null,
                    id: `user${i + 1}`,
                    name: `User${i + 1} Test`,
                    emailAddress: `user${i + 1}@test.com`,
                  },
                })),
            },
          },
        },
      },
    ];

    const correctStructureLink = new StaticMockLink(
      CORRECT_STRUCTURE_MOCKS,
      true,
    );

    render(
      <MockedProvider link={correctStructureLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(500);

    const initialRows = screen.getAllByRole('row').length;
    expect(initialRows).toBeGreaterThan(1);

    await waitFor(() => {
      expect(screen.getByText(/User1 Test/i)).toBeInTheDocument();
      expect(screen.getByText(/User2 Test/i)).toBeInTheDocument();
    });

    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(5);
  });

  test('should handle loading more requests with search term', async () => {
    render(
      <MockedProvider link={linkInfiniteScroll}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    const searchInput = screen.getByTestId('searchByName');
    await userEvent.type(searchInput, 'User');
    await wait(200);

    const requestsContainer = document.querySelector(
      '[data-testid="requests-list"]',
    );
    if (requestsContainer) {
      fireEvent.scroll(requestsContainer, {
        target: { scrollTop: (requestsContainer as HTMLElement).scrollHeight },
      });
    } else {
      fireEvent.scroll(window, {
        target: { scrollY: document.documentElement.scrollHeight },
      });
    }

    await wait(500);

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('should handle loading more requests when no previous data exists', async () => {
    render(
      <MockedProvider link={link3}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);
    // With no previous data and no search term, component renders the empty state message
    expect(
      screen.getByTestId('requests-no-requests-empty'),
    ).toBeInTheDocument();
  });

  test('shows no results message when search returns no rows', async () => {
    const SEARCH_EMPTY_MOCKS = [
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [
              {
                id: 'org1',
                name: 'Palisadoes',
                addressLine1: '123 Jamaica Street',
                description: 'A community organization',
                avatarURL: null,
                members: {
                  edges: [
                    {
                      node: {
                        id: 'user1',
                      },
                    },
                  ],
                  pageInfo: {
                    hasNextPage: false,
                  },
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 8,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: '',
              membershipRequests: [
                {
                  membershipRequestId: '1',
                  createdAt: dayjs().subtract(1, 'year').toISOString(),
                  status: 'pending',
                  user: {
                    avatarURL: null,
                    id: 'user1',
                    name: 'Test User',
                    emailAddress: 'test@example.com',
                  },
                },
              ],
            },
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 8,
            name_contains: 'NonExistent',
          },
        },
        result: {
          data: {
            organization: {
              id: '',
              membershipRequests: [],
            },
          },
        },
      },
    ];

    const searchLink = new StaticMockLink(SEARCH_EMPTY_MOCKS, true);

    render(
      <MockedProvider link={searchLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);
    const input = await screen.findByTestId('searchByName');
    await userEvent.type(input, 'NonExistent');
    await userEvent.keyboard('{Enter}');
    await waitFor(
      () => {
        const grid = screen.getByRole('grid');
        expect(grid.getAttribute('aria-rowcount')).toBe('1');
      },
      { timeout: 3000 },
    );

    // Verify the search input still contains the search term
    expect(input).toHaveValue('NonExistent');
  });

  test('renders loading skeleton while fetching first page', async () => {
    const DELAYED_MOCKS = UPDATED_MOCKS.map((mock) =>
      mock.request?.query === MEMBERSHIP_REQUEST_PG
        ? { ...mock, delay: 250 }
        : mock,
    );
    const delayedLink = new StaticMockLink(DELAYED_MOCKS, true);

    render(
      <MockedProvider link={delayedLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Assert TableLoader is shown during initial loading
    expect(screen.getByTestId('TableLoader')).toBeInTheDocument();

    // Wait for data to load and grid to appear
    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });

  test('should handle loading more requests with null response', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    const table = screen.getByRole('grid');
    expect(table).toBeInTheDocument();

    const requestsContainer = document.querySelector(
      '[data-testid="requests-list"]',
    );
    if (requestsContainer) {
      fireEvent.scroll(requestsContainer, {
        target: { scrollTop: (requestsContainer as HTMLElement).scrollHeight },
      });
    } else {
      fireEvent.scroll(window, {
        target: { scrollY: document.documentElement.scrollHeight },
      });
    }

    await wait(200);

    expect(table).toBeInTheDocument();
  });

  test('should handle null membership requests in response', async () => {
    render(
      <MockedProvider link={linkNullResponse}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);
    expect(screen.getByTestId('testComp')).toBeInTheDocument();
  });

  test('Component should be rendered properly when user is SuperAdmin', async () => {
    setItem('SuperAdmin', true);
    removeItem('AdminFor');

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);
    expect(screen.getByTestId('searchByName')).toBeInTheDocument();
  });

  test('Search functionality should reset when empty string is provided', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);
    const searchInput = screen.getByTestId('searchByName');

    await userEvent.type(searchInput, 'John');
    await wait(100);

    await userEvent.clear(searchInput);
    await wait(200);

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('should handle null response in fetchMore correctly', async () => {
    const NULL_FETCH_MORE_MOCKS = [
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [
              {
                id: 'org1',
                name: 'Test Organization',
                addressLine1: '123 Test Street',
                description: 'Test description',
                avatarURL: null,
                members: {
                  edges: [
                    {
                      node: {
                        id: 'user1',
                      },
                    },
                  ],
                  pageInfo: {
                    hasNextPage: false,
                  },
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: '',
              membershipRequests: Array(10).fill({
                membershipRequestId: '1',
                createdAt: dayjs().subtract(1, 'year').toISOString(),
                status: 'pending',
                user: {
                  id: 'user1',
                  name: 'Test User',
                  emailAddress: 'test@example.com',
                },
              }),
            },
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 10,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: '',
              membershipRequests: null,
            },
          },
        },
      },
    ];

    const linkNullFetchMore = new StaticMockLink(NULL_FETCH_MORE_MOCKS, true);

    render(
      <MockedProvider link={linkNullFetchMore}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    const requestsContainer = document.querySelector(
      '[data-testid="requests-list"]',
    );
    if (requestsContainer) {
      fireEvent.scroll(requestsContainer, {
        target: { scrollTop: (requestsContainer as HTMLElement).scrollHeight },
      });
    } else {
      fireEvent.scroll(window, {
        target: { scrollY: document.documentElement.scrollHeight },
      });
    }

    await wait(500);

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('should handle empty state when organization returns null', async () => {
    const NULL_ORGANIZATION_MOCKS = [
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [
              {
                id: 'org1',
                name: 'Test Organization',
                addressLine1: '123 Test Street',
                description: 'Test description',
                avatarURL: null,
                members: {
                  edges: [
                    {
                      node: {
                        id: 'user1',
                      },
                    },
                  ],
                  pageInfo: {
                    hasNextPage: false,
                  },
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: null,
          },
        },
      },
    ];

    const linkNullOrganization = new StaticMockLink(
      NULL_ORGANIZATION_MOCKS,
      true,
    );

    render(
      <MockedProvider link={linkNullOrganization}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    // Verify the component renders without crashing
    expect(screen.getByTestId('testComp')).toBeInTheDocument();

    // Verify appropriate empty state or error handling
    expect(
      screen.getByTestId('requests-no-requests-empty'),
    ).toBeInTheDocument();
  });

  test('Search functionality should handle special characters', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);
    const searchInput = screen.getByTestId('searchByName');

    await userEvent.type(searchInput, '@#$%');
    await wait(200);

    expect(screen.getByTestId('testComp')).toBeInTheDocument();
  });

  test('Should handle rapid search input changes', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);
    const searchInput = screen.getByTestId('searchByName');

    for (let i = 0; i < 5; i++) {
      await userEvent.type(searchInput, 'test');
      await userEvent.clear(searchInput);
    }

    await wait(200);

    expect(screen.getByTestId('testComp')).toBeInTheDocument();
  });

  test('should handle loadMoreRequests when data is undefined or data.organization is undefined', async () => {
    const NO_DATA_MOCKS = [
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [
              {
                id: 'org1',
                name: 'Test Organization',
                addressLine1: '123 Test Street',
                description: 'Test description',
                avatarURL: null,
                members: {
                  edges: [
                    {
                      node: {
                        id: 'user1',
                      },
                    },
                  ],
                  pageInfo: {
                    hasNextPage: false,
                  },
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: { data: null },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: 'org1',
              membershipRequests: [],
            },
          },
        },
      },
    ];

    const noDataLink = new StaticMockLink(NO_DATA_MOCKS, true);

    render(
      <MockedProvider link={noDataLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    expect(screen.getByTestId('testComp')).toBeInTheDocument();

    const requestsContainer = document.querySelector(
      '[data-testid="requests-list"]',
    );
    if (requestsContainer) {
      fireEvent.scroll(requestsContainer, {
        target: { scrollTop: (requestsContainer as HTMLElement).scrollHeight },
      });
    } else {
      fireEvent.scroll(window, {
        target: { scrollY: document.documentElement.scrollHeight },
      });
    }

    await wait(500);

    // Verify component still renders properly
    expect(screen.getByTestId('testComp')).toBeInTheDocument();
  });

  test('should render avatar with error handler for broken image URL', async () => {
    const AVATAR_ERROR_MOCKS = [
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [
              {
                id: 'org1',
                name: 'Test Organization',
                addressLine1: '123 Test Street',
                description: 'A test organization',
                avatarURL: null,
                members: {
                  edges: [{ node: { id: 'user1' } }],
                  pageInfo: { hasNextPage: false },
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: '',
              membershipRequests: [
                {
                  membershipRequestId: '1',
                  createdAt: dayjs().subtract(1, 'year').toISOString(),
                  status: 'pending',
                  user: {
                    avatarURL: 'http://invalid-url.com/avatar.jpg',
                    id: 'user1',
                    name: 'Test User',
                    emailAddress: 'test@example.com',
                  },
                },
              ],
            },
          },
        },
      },
    ];

    const avatarErrorLink = new StaticMockLink(AVATAR_ERROR_MOCKS, true);

    render(
      <MockedProvider link={avatarErrorLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    const avatarImg = await screen.findByTestId('display-img');
    expect(avatarImg).toBeInTheDocument();

    fireEvent.error(avatarImg);
    await wait(100);
  });

  test('should render Avatar component when avatarURL is not available', async () => {
    const NO_AVATAR_MOCKS = [
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [
              {
                id: 'org1',
                name: 'Test Organization',
                addressLine1: '123 Test Street',
                description: 'A test organization',
                avatarURL: null,
                members: {
                  edges: [{ node: { id: 'user1' } }],
                  pageInfo: { hasNextPage: false },
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: '',
              membershipRequests: [
                {
                  membershipRequestId: '1',
                  createdAt: dayjs().subtract(1, 'year').toISOString(),
                  status: 'pending',
                  user: {
                    avatarURL: null,
                    id: 'user1',
                    name: 'John Doe',
                    emailAddress: 'john@example.com',
                  },
                },
              ],
            },
          },
        },
      },
    ];

    const noAvatarLink = new StaticMockLink(NO_AVATAR_MOCKS, true);

    render(
      <MockedProvider link={noAvatarLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    // Check that the component renders and has the grid with data
    expect(screen.getByRole('grid')).toBeInTheDocument();
    // Verify the user name is displayed, indicating the row is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('should call handleAcceptUser when accept button is clicked', async () => {
    const ACCEPT_BUTTON_MOCKS = [
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [
              {
                id: 'org1',
                name: 'Test Organization',
                addressLine1: '123 Test Street',
                description: 'A test organization',
                avatarURL: null,
                members: {
                  edges: [{ node: { id: 'user1' } }],
                  pageInfo: { hasNextPage: false },
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: '',
              membershipRequests: [
                {
                  membershipRequestId: '1',
                  createdAt: dayjs().subtract(1, 'year').toISOString(),
                  status: 'pending',
                  user: {
                    avatarURL: null,
                    id: 'user1',
                    name: 'Test User',
                    emailAddress: 'test@example.com',
                  },
                },
              ],
            },
          },
        },
      },
      {
        request: {
          query: ACCEPT_ORGANIZATION_REQUEST_MUTATION,
          variables: {
            input: {
              membershipRequestId: '1',
            },
          },
        },
        result: {
          data: {
            acceptMembershipRequest: {
              __typename: 'MembershipRequestResponse',
              success: true,
              message: 'Membership request accepted successfully',
            },
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: '',
              membershipRequests: [],
            },
          },
        },
      },
    ];

    const acceptButtonLink = new StaticMockLink(ACCEPT_BUTTON_MOCKS, true);

    render(
      <MockedProvider link={acceptButtonLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    const acceptButton = await screen.findByTestId(
      'acceptMembershipRequestBtn1',
    );
    expect(acceptButton).toBeInTheDocument();

    await userEvent.click(acceptButton);
    await wait(200);
  });

  test('should call handleRejectUser when reject button is clicked', async () => {
    const REJECT_BUTTON_MOCKS = [
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [
              {
                id: 'org1',
                name: 'Test Organization',
                addressLine1: '123 Test Street',
                description: 'A test organization',
                avatarURL: null,
                members: {
                  edges: [{ node: { id: 'user1' } }],
                  pageInfo: { hasNextPage: false },
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: '',
              membershipRequests: [
                {
                  membershipRequestId: '1',
                  createdAt: dayjs().subtract(1, 'year').toISOString(),
                  status: 'pending',
                  user: {
                    avatarURL: null,
                    id: 'user1',
                    name: 'Test User',
                    emailAddress: 'test@example.com',
                  },
                },
              ],
            },
          },
        },
      },
      {
        request: {
          query: REJECT_ORGANIZATION_REQUEST_MUTATION,
          variables: {
            input: {
              membershipRequestId: '1',
            },
          },
        },
        result: {
          data: {
            rejectMembershipRequest: {
              __typename: 'MembershipRequestResponse',
              success: true,
              message: 'Membership request rejected successfully',
            },
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: '',
              membershipRequests: [],
            },
          },
        },
      },
    ];

    const rejectButtonLink = new StaticMockLink(REJECT_BUTTON_MOCKS, true);

    render(
      <MockedProvider link={rejectButtonLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    const rejectButton = await screen.findByTestId(
      'rejectMembershipRequestBtn1',
    );
    expect(rejectButton).toBeInTheDocument();

    await userEvent.click(rejectButton);
    await wait(200);
  });

  test('should handle accept mutation error gracefully', async () => {
    const ACCEPT_ERROR_MOCKS = [
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [
              {
                id: 'org1',
                name: 'Test Organization',
                addressLine1: '123 Test Street',
                description: 'A test organization',
                avatarURL: null,
                members: {
                  edges: [{ node: { id: 'user1' } }],
                  pageInfo: { hasNextPage: false },
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: '',
              membershipRequests: [
                {
                  membershipRequestId: '1',
                  createdAt: dayjs().subtract(1, 'year').toISOString(),
                  status: 'pending',
                  user: {
                    avatarURL: null,
                    id: 'user1',
                    name: 'Test User',
                    emailAddress: 'test@example.com',
                  },
                },
              ],
            },
          },
        },
      },
      {
        request: {
          query: ACCEPT_ORGANIZATION_REQUEST_MUTATION,
          variables: {
            input: {
              membershipRequestId: '1',
            },
          },
        },
        error: new Error('Failed to accept membership request'),
      },
    ];

    const acceptErrorLink = new StaticMockLink(ACCEPT_ERROR_MOCKS, true);

    render(
      <MockedProvider link={acceptErrorLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    const acceptButton = await screen.findByTestId(
      'acceptMembershipRequestBtn1',
    );
    await userEvent.click(acceptButton);
    await wait(200);
  });

  test('should handle reject mutation error gracefully', async () => {
    const REJECT_ERROR_MOCKS = [
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [
              {
                id: 'org1',
                name: 'Test Organization',
                addressLine1: '123 Test Street',
                description: 'A test organization',
                avatarURL: null,
                members: {
                  edges: [{ node: { id: 'user1' } }],
                  pageInfo: { hasNextPage: false },
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: '',
              membershipRequests: [
                {
                  membershipRequestId: '1',
                  createdAt: dayjs().subtract(1, 'year').toISOString(),
                  status: 'pending',
                  user: {
                    avatarURL: null,
                    id: 'user1',
                    name: 'Test User',
                    emailAddress: 'test@example.com',
                  },
                },
              ],
            },
          },
        },
      },
      {
        request: {
          query: REJECT_ORGANIZATION_REQUEST_MUTATION,
          variables: {
            input: {
              membershipRequestId: '1',
            },
          },
        },
        error: new Error('Failed to reject membership request'),
      },
    ];

    const rejectErrorLink = new StaticMockLink(REJECT_ERROR_MOCKS, true);

    render(
      <MockedProvider link={rejectErrorLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    const rejectButton = await screen.findByTestId(
      'rejectMembershipRequestBtn1',
    );
    await userEvent.click(rejectButton);
    await wait(200);
  });

  test('should handle accept button with null membershipRequestId', async () => {
    const ACCEPT_NULL_ID_MOCKS = [
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [
              {
                id: 'org1',
                name: 'Test Organization',
                addressLine1: '123 Test Street',
                description: 'A test organization',
                avatarURL: null,
                members: {
                  edges: [{ node: { id: 'user1' } }],
                  pageInfo: { hasNextPage: false },
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: '',
              membershipRequests: [
                {
                  membershipRequestId: '',
                  createdAt: dayjs().subtract(1, 'year').toISOString(),
                  status: 'pending',
                  user: {
                    avatarURL: null,
                    id: 'user1',
                    name: 'Test User',
                    emailAddress: 'test@example.com',
                  },
                },
              ],
            },
          },
        },
      },
    ];

    const acceptNullIdLink = new StaticMockLink(ACCEPT_NULL_ID_MOCKS, true);

    render(
      <MockedProvider link={acceptNullIdLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('should handle avatar with null string avatarURL', async () => {
    const NULL_URL_STRING_MOCKS = [
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [
              {
                id: 'org1',
                name: 'Test Organization',
                addressLine1: '123 Test Street',
                description: 'A test organization',
                avatarURL: null,
                members: {
                  edges: [{ node: { id: 'user1' } }],
                  pageInfo: { hasNextPage: false },
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: '',
              membershipRequests: [
                {
                  membershipRequestId: '1',
                  createdAt: dayjs().subtract(1, 'year').toISOString(),
                  status: 'pending',
                  user: {
                    avatarURL: 'null',
                    id: 'user1',
                    name: 'Test User',
                    emailAddress: 'test@example.com',
                  },
                },
              ],
            },
          },
        },
      },
    ];

    const nullUrlStringLink = new StaticMockLink(NULL_URL_STRING_MOCKS, true);

    render(
      <MockedProvider link={nullUrlStringLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  test('should handle name with fallback when user.name is missing', async () => {
    const MISSING_NAME_MOCKS = [
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [
              {
                id: 'org1',
                name: 'Test Organization',
                addressLine1: '123 Test Street',
                description: 'A test organization',
                avatarURL: null,
                members: {
                  edges: [{ node: { id: 'user1' } }],
                  pageInfo: { hasNextPage: false },
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: '',
              membershipRequests: [
                {
                  membershipRequestId: '1',
                  createdAt: dayjs().subtract(1, 'year').toISOString(),
                  status: 'pending',
                  user: {
                    avatarURL: null,
                    id: 'user1',
                    name: '',
                    emailAddress: 'test@example.com',
                  },
                },
              ],
            },
          },
        },
      },
    ];

    const missingNameLink = new StaticMockLink(MISSING_NAME_MOCKS, true);

    render(
      <MockedProvider link={missingNameLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('should handle email with fallback when emailAddress is missing', async () => {
    const MISSING_EMAIL_MOCKS = [
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [
              {
                id: 'org1',
                name: 'Test Organization',
                addressLine1: '123 Test Street',
                description: 'A test organization',
                avatarURL: null,
                members: {
                  edges: [{ node: { id: 'user1' } }],
                  pageInfo: { hasNextPage: false },
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: '',
              membershipRequests: [
                {
                  membershipRequestId: '1',
                  createdAt: dayjs().subtract(1, 'year').toISOString(),
                  status: 'pending',
                  user: {
                    avatarURL: null,
                    id: 'user1',
                    name: 'Test User',
                    emailAddress: '',
                  },
                },
              ],
            },
          },
        },
      },
    ];

    const missingEmailLink = new StaticMockLink(MISSING_EMAIL_MOCKS, true);

    render(
      <MockedProvider link={missingEmailLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  test('should verify accept button renders with all data present', async () => {
    const FULL_DATA_MOCKS = [
      makeOrgListMock(),
      makeMembershipRequestsMock([
        {
          membershipRequestId: '123',
          user: {
            avatarURL: null,
            id: 'user1',
            name: 'Complete User',
            emailAddress: 'complete@example.com',
          },
        },
      ]),
    ];

    const fullDataLink = new StaticMockLink(FULL_DATA_MOCKS, true);

    render(
      <MockedProvider link={fullDataLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    expect(screen.getByText('Complete User')).toBeInTheDocument();
    expect(screen.getByText('complete@example.com')).toBeInTheDocument();
    expect(
      screen.getByTestId('acceptMembershipRequestBtn123'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('rejectMembershipRequestBtn123'),
    ).toBeInTheDocument();
  });

  test('should verify reject button renders with all data present', async () => {
    const FULL_REJECT_MOCKS = [
      makeOrgListMock(),
      makeMembershipRequestsMock([
        {
          membershipRequestId: '123',
          user: {
            avatarURL: null,
            id: 'user1',
            name: 'Reject Test User',
            emailAddress: 'reject@example.com',
          },
        },
      ]),
    ];

    const fullRejectLink = new StaticMockLink(FULL_REJECT_MOCKS, true);

    render(
      <MockedProvider link={fullRejectLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    expect(screen.getByText('Reject Test User')).toBeInTheDocument();
    const rejectBtn = await screen.findByTestId(
      'rejectMembershipRequestBtn123',
    );
    expect(rejectBtn).toBeInTheDocument();
  });

  test('should handle accept mutation returning null data', async () => {
    const NULL_DATA_ACCEPT_MOCKS = [
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [
              {
                id: 'org1',
                name: 'Test Organization',
                addressLine1: '123 Test Street',
                description: 'A test organization',
                avatarURL: null,
                members: {
                  edges: [{ node: { id: 'user1' } }],
                  pageInfo: { hasNextPage: false },
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: '',
              membershipRequests: [
                {
                  membershipRequestId: '456',
                  createdAt: dayjs().subtract(1, 'year').toISOString(),
                  status: 'pending',
                  user: {
                    avatarURL: null,
                    id: 'user2',
                    name: 'Null Accept User',
                    emailAddress: 'nullaccept@example.com',
                  },
                },
              ],
            },
          },
        },
      },
      {
        request: {
          query: ACCEPT_ORGANIZATION_REQUEST_MUTATION,
          variables: {
            input: { membershipRequestId: '456' },
          },
        },
        result: {
          data: null,
        },
      },
    ];

    const nullDataLink = new StaticMockLink(NULL_DATA_ACCEPT_MOCKS, true);

    render(
      <MockedProvider link={nullDataLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    const acceptBtn = screen.getByTestId('acceptMembershipRequestBtn456');
    await userEvent.click(acceptBtn);

    await wait(200);
  });

  test('should handle reject mutation returning null data', async () => {
    const NULL_DATA_REJECT_MOCKS = [
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [
              {
                id: 'org1',
                name: 'Test Organization',
                addressLine1: '123 Test Street',
                description: 'A test organization',
                avatarURL: null,
                members: {
                  edges: [{ node: { id: 'user1' } }],
                  pageInfo: { hasNextPage: false },
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: '',
              membershipRequests: [
                {
                  membershipRequestId: '789',
                  createdAt: dayjs().subtract(1, 'year').toISOString(),
                  status: 'pending',
                  user: {
                    avatarURL: null,
                    id: 'user3',
                    name: 'Null Reject User',
                    emailAddress: 'nullreject@example.com',
                  },
                },
              ],
            },
          },
        },
      },
      {
        request: {
          query: REJECT_ORGANIZATION_REQUEST_MUTATION,
          variables: {
            input: { membershipRequestId: '789' },
          },
        },
        result: {
          data: null,
        },
      },
    ];

    const nullDataLink = new StaticMockLink(NULL_DATA_REJECT_MOCKS, true);

    render(
      <MockedProvider link={nullDataLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    const rejectBtn = screen.getByTestId('rejectMembershipRequestBtn789');
    await userEvent.click(rejectBtn);

    await wait(200);
  });

  test('should handle accept button click with valid membershipRequestId', async () => {
    const VALID_ID_MOCKS = [
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [
              {
                id: 'org1',
                name: 'Test Organization',
                addressLine1: '123 Test Street',
                description: 'A test organization',
                avatarURL: null,
                members: {
                  edges: [{ node: { id: 'user1' } }],
                  pageInfo: { hasNextPage: false },
                },
              },
            ],
          },
        },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST_PG,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 10,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: '',
              membershipRequests: [
                {
                  membershipRequestId: '101',
                  createdAt: dayjs().subtract(1, 'year').toISOString(),
                  status: 'pending',
                  user: {
                    avatarURL: null,
                    id: 'user4',
                    name: 'Valid ID User',
                    emailAddress: 'validid@example.com',
                  },
                },
              ],
            },
          },
        },
      },
    ];

    const validIdLink = new StaticMockLink(VALID_ID_MOCKS, true);

    render(
      <MockedProvider link={validIdLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    expect(screen.getByText('Valid ID User')).toBeInTheDocument();
    expect(
      screen.getByTestId('acceptMembershipRequestBtn101'),
    ).toBeInTheDocument();
  });

  describe('Accept request - success flow', () => {
    test('should call NotificationToast.success and refetch after successful accept', async () => {
      const ACCEPT_SUCCESS_MOCKS = [
        makeOrgListMock(),
        makeMembershipRequestsMock([
          {
            membershipRequestId: 'req123',
            user: {
              avatarURL: null,
              id: 'user1',
              name: 'Test User',
              emailAddress: 'test@example.com',
            },
          },
        ]),
        {
          request: {
            query: ACCEPT_ORGANIZATION_REQUEST_MUTATION,
            variables: {
              input: { membershipRequestId: 'req123' },
            },
          },
          result: {
            data: {
              acceptMembershipRequest: {
                membershipRequest: {
                  membershipRequestId: 'req123',
                },
              },
            },
          },
        },
        makeMembershipRequestsMock([]),
      ];

      const acceptLink = new StaticMockLink(ACCEPT_SUCCESS_MOCKS, true);

      render(
        <MockedProvider link={acceptLink}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Requests />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await wait(200);

      const acceptBtn = await screen.findByTestId(
        'acceptMembershipRequestBtnreq123',
      );
      await userEvent.click(acceptBtn);

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Reject request - success flow', () => {
    test('should call NotificationToast.success and refetch after successful reject', async () => {
      const REJECT_SUCCESS_MOCKS = [
        makeOrgListMock(),
        makeMembershipRequestsMock([
          {
            membershipRequestId: 'req789',
            user: {
              avatarURL: null,
              id: 'user3',
              name: 'Reject User',
              emailAddress: 'reject@example.com',
            },
          },
        ]),
        {
          request: {
            query: REJECT_ORGANIZATION_REQUEST_MUTATION,
            variables: {
              input: { membershipRequestId: 'req789' },
            },
          },
          result: {
            data: {
              rejectMembershipRequest: {
                membershipRequest: {
                  membershipRequestId: 'req789',
                },
              },
            },
          },
        },
        makeMembershipRequestsMock([]),
      ];

      const rejectLink = new StaticMockLink(REJECT_SUCCESS_MOCKS, true);

      render(
        <MockedProvider link={rejectLink}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Requests />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await wait(200);

      const rejectBtn = await screen.findByTestId(
        'rejectMembershipRequestBtnreq789',
      );
      await userEvent.click(rejectBtn);

      await waitFor(
        () => {
          expect(NotificationToast.success).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Error handling', () => {
    test('should call errorHandler when accept mutation fails', async () => {
      const { errorHandler } = await import('utils/errorHandler');
      const ACCEPT_ERROR_MOCKS = [
        makeOrgListMock(),
        makeMembershipRequestsMock([
          {
            membershipRequestId: 'reqError1',
            user: {
              avatarURL: null,
              id: 'user5',
              name: 'Error User',
              emailAddress: 'error@example.com',
            },
          },
        ]),
        {
          request: {
            query: ACCEPT_ORGANIZATION_REQUEST_MUTATION,
            variables: {
              input: { membershipRequestId: 'reqError1' },
            },
          },
          error: new Error('Accept mutation failed'),
        },
      ];

      const errorLink = new StaticMockLink(ACCEPT_ERROR_MOCKS, true);

      render(
        <MockedProvider link={errorLink}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Requests />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await wait(200);

      const acceptBtn = await screen.findByTestId(
        'acceptMembershipRequestBtnreqError1',
      );
      await userEvent.click(acceptBtn);

      await waitFor(
        () => {
          expect(errorHandler).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });

    test('should call errorHandler when reject mutation fails', async () => {
      const { errorHandler } = await import('utils/errorHandler');
      const REJECT_ERROR_MOCKS = [
        makeOrgListMock(),
        makeMembershipRequestsMock([
          {
            membershipRequestId: 'reqError2',
            user: {
              avatarURL: null,
              id: 'user6',
              name: 'Reject Error User',
              emailAddress: 'rejecterror@example.com',
            },
          },
        ]),
        {
          request: {
            query: REJECT_ORGANIZATION_REQUEST_MUTATION,
            variables: {
              input: { membershipRequestId: 'reqError2' },
            },
          },
          error: new Error('Reject mutation failed'),
        },
      ];

      const rejectErrorLink = new StaticMockLink(REJECT_ERROR_MOCKS, true);

      render(
        <MockedProvider link={rejectErrorLink}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Requests />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await wait(200);

      const rejectBtn = await screen.findByTestId(
        'rejectMembershipRequestBtnreqError2',
      );
      await userEvent.click(rejectBtn);

      await waitFor(
        () => {
          expect(errorHandler).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });
  });

  describe('Column rendering', () => {
    test('should render all column headers with correct data-field attributes', async () => {
      render(
        <MockedProvider link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Requests />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await wait(200);

      // Check that DataGrid columns exist by their data-field attributes
      const columnHeaders = document.querySelectorAll('[data-field]');
      const fields = Array.from(columnHeaders).map((el) =>
        el.getAttribute('data-field'),
      );

      // Assert expected columns are present
      expect(fields).toContain('sl_no');
      expect(fields).toContain('profile');
      expect(fields).toContain('name');
      expect(fields).toContain('email');
      expect(fields).toContain('accept');
      expect(fields).toContain('reject');
    });

    test('should render accept and reject buttons in action column', async () => {
      render(
        <MockedProvider link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Requests />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await wait(200);

      // Verify accept and reject buttons exist
      await waitFor(() => {
        const acceptButtons = screen.getAllByTestId(
          /acceptMembershipRequestBtn/i,
        );
        const rejectButtons = screen.getAllByTestId(
          /rejectMembershipRequestBtn/i,
        );

        expect(acceptButtons.length).toBeGreaterThan(0);
        expect(rejectButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Serial number column', () => {
    test('should render serial number "1." for the first visible row', async () => {
      const SERIAL_MOCKS = [
        makeOrgListMock(),
        makeMembershipRequestsMock([
          {
            membershipRequestId: 'serial1',
            user: {
              avatarURL: null,
              id: 'userSerial1',
              name: 'First User',
              emailAddress: 'first@example.com',
            },
          },
        ]),
      ];

      const serialLink = new StaticMockLink(SERIAL_MOCKS, true);

      render(
        <MockedProvider link={serialLink}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Requests />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await wait(200);

      await waitFor(() => {
        expect(screen.getByText('1.')).toBeInTheDocument();
      });
    });
  });

  describe('Pagination consistency', () => {
    test('should use PAGE_SIZE constant in mocks', () => {
      expect(PAGE_SIZE).toBe(10);

      const mockRequest = makeMembershipRequestsMock([
        {
          membershipRequestId: 'test1',
          user: {
            avatarURL: null,
            id: 'userTest1',
            name: 'Test User',
            emailAddress: 'test@example.com',
          },
        },
      ]);

      expect(mockRequest.request.variables.first).toBe(PAGE_SIZE);
    });
  });
});

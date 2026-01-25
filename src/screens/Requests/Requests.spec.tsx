import React, { act } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { ToastContainer } from 'react-toastify';
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
import useLocalStorage from 'utils/useLocalstorage';
import { vi } from 'vitest';
import { MEMBERSHIP_REQUEST, ORGANIZATION_LIST } from 'GraphQl/Queries/Queries';

// Store original localStorage for cleanup
const originalLocalStorage = global.localStorage;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    key: (i: number) => Object.keys(store)[i] || null,
    get length() {
      return Object.keys(store).length;
    },
  };
})();

// Ensure window.localStorage reflects the stub in JSDOM
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  configurable: true,
  writable: true,
});

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost/',
    assign: vi.fn(),
    reload: vi.fn(),
    pathname: '/',
    search: '',
    hash: '',
    origin: 'http://localhost',
  },
  writable: true,
});

// Mock react-toastify
vi.mock('react-toastify', async () => {
  const actual = await vi.importActual('react-toastify');
  return {
    ...actual,
    toast: {
      warning: vi.fn(),
      error: vi.fn(),
      success: vi.fn(),
      info: vi.fn(),
    },
  };
});

const { setItem, removeItem } = useLocalStorage();

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
      query: MEMBERSHIP_REQUEST,
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
  // Initial membership requests query
  {
    request: {
      query: MEMBERSHIP_REQUEST,
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
          membershipRequests: Array(8)
            .fill(null)
            .map((_, i) => ({
              membershipRequestId: `request${i + 1}`,
              createdAt: `2023-01-0${i + 1}T00:00:00Z`,
              status: 'pending',
              user: {
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
      query: MEMBERSHIP_REQUEST,
      variables: {
        input: { id: '' },
        skip: 8,
        first: 8,
        name_contains: '',
      },
    },
    result: {
      data: {
        organization: {
          id: '',
          membershipRequests: Array(4)
            .fill(null)
            .map((_, i) => ({
              membershipRequestId: `request${i + 9}`,
              createdAt: `2023-01-${i + 9}T00:00:00Z`,
              status: 'pending',
              user: {
                avatarURL: null,
                id: `user${i + 9}`,
                name: `User${i + 9} Test`,
                emailAddress: `user${i + 9}@test.com`,
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
  localStorage.clear();
  // Restore all mocks and original global localStorage
  vi.restoreAllMocks();
  global.localStorage = originalLocalStorage;
});

describe('Testing Requests screen', () => {
  test('Component should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link7}>
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
    await screen.findByText('Scott Tony');
    expect(screen.getByText('Scott Tony')).toBeInTheDocument();
  });

  test(`Component should be rendered properly when user is not Admin
  and or userId does not exists in localstorage`, async () => {
    setItem('id', '');
    removeItem('AdminFor');
    removeItem('SuperAdmin');
    setItem('role', 'user');

    render(
      <MockedProvider addTypename={false} link={link}>
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

    expect(window.location.assign).toHaveBeenCalledWith('/orglist');
  });

  test('Component should be rendered properly when user is Admin', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
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
      <MockedProvider addTypename={false} link={link5}>
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
      <MockedProvider addTypename={false} link={link}>
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
      <MockedProvider addTypename={false} link={link3}>
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
  });

  test('Testing Request data is not present', async () => {
    render(
      <MockedProvider addTypename={false} link={link3}>
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

    const noRequestsText = await screen.findByText(
      /No Membership Requests Found/i,
    );
    expect(noRequestsText).toBeInTheDocument();
  });

  test('Should render warning alert when there are no organizations', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
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
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
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
      <MockedProvider addTypename={false} link={link6}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
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
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);
    rerender(
      <MockedProvider addTypename={false} link={link4}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait(200);
  });

  test('Shows warning toast when there are no organizations', async () => {
    const { toast } = await import('react-toastify');

    render(
      <MockedProvider addTypename={false} link={link2}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Requests />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    expect(toast.warning).toHaveBeenCalledWith(expect.any(String));
    expect(toast.warning).toHaveBeenCalledTimes(1);
  });

  test('should handle loading more requests successfully', async () => {
    render(
      <MockedProvider addTypename={false} link={linkInfiniteScroll}>
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

    expect(screen.getAllByRole('row').length).toBeGreaterThan(1);

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

    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(8);
  });

  test('rows.length whould be greater than 9 when newRequests.length > perPageResult', async () => {
    // Create mocks with the CORRECT structure matching what the component expects
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
      // Initial membership requests query - CORRECTED STRUCTURE
      {
        request: {
          query: MEMBERSHIP_REQUEST,
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
              id: 'org1',
              membershipRequests: Array(8)
                .fill(null)
                .map((_, i) => ({
                  membershipRequestId: `request${i + 1}`,
                  createdAt: `2023-01-0${i + 1}T00:00:00Z`,
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
      {
        request: {
          query: MEMBERSHIP_REQUEST,
          variables: {
            input: { id: '' },
            skip: 8,
            first: 8,
            name_contains: '',
          },
        },
        result: {
          data: {
            organization: {
              id: 'org1',
              membershipRequests: Array(9)
                .fill(null)
                .map((_, i) => ({
                  membershipRequestId: `request${i + 9}`,
                  createdAt: `2023-01-${(i + 9).toString().padStart(2, '0')}T00:00:00Z`,
                  status: 'pending',
                  user: {
                    avatarURL: null,
                    id: `user${i + 9}`,
                    name: `User${i + 9} Test`,
                    emailAddress: `user${i + 9}@test.com`,
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
      <MockedProvider addTypename={false} link={correctStructureLink}>
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

    expect(screen.getAllByRole('row').length).toBeGreaterThan(1);

    expect(screen.getByText('User1 Test')).toBeInTheDocument();
    expect(screen.getByText('User2 Test')).toBeInTheDocument();

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

    await wait(600);
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(9);
    expect(screen.getByText('User7 Test')).toBeInTheDocument();
    expect(screen.getByText('User8 Test')).toBeInTheDocument();
  });

  test('should handle loading more requests with search term', async () => {
    render(
      <MockedProvider addTypename={false} link={linkInfiniteScroll}>
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
      <MockedProvider addTypename={false} link={link3}>
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
      screen.getByText(/No Membership Requests Found/i),
    ).toBeInTheDocument();
  });

  test('should handle loading more requests with null response', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
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
      <MockedProvider addTypename={false} link={linkNullResponse}>
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
      <MockedProvider addTypename={false} link={link}>
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
      <MockedProvider addTypename={false} link={link}>
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
          query: MEMBERSHIP_REQUEST,
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
              membershipRequests: Array(8).fill({
                membershipRequestId: '1',
                createdAt: '2023-01-01T00:00:00Z',
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
          query: MEMBERSHIP_REQUEST,
          variables: {
            input: { id: '' },
            skip: 8,
            first: 8,
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
      <MockedProvider addTypename={false} link={linkNullFetchMore}>
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
          query: MEMBERSHIP_REQUEST,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 8,
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
      <MockedProvider addTypename={false} link={linkNullOrganization}>
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
      screen.getByText(/No Membership Requests Found/i),
    ).toBeInTheDocument();
  });

  test('Search functionality should handle special characters', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
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
      <MockedProvider addTypename={false} link={link}>
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
          query: MEMBERSHIP_REQUEST,
          variables: {
            input: { id: '' },
            skip: 0,
            first: 8,
            name_contains: '',
          },
        },
        result: { data: null },
      },
      {
        request: {
          query: MEMBERSHIP_REQUEST,
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
              id: 'org1',
              membershipRequests: [],
            },
          },
        },
      },
    ];

    const noDataLink = new StaticMockLink(NO_DATA_MOCKS, true);

    render(
      <MockedProvider addTypename={false} link={noDataLink}>
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
});

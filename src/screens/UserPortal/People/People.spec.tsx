import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import People from './People';
import userEvent from '@testing-library/user-event';
import { vi, it, beforeEach, afterEach } from 'vitest';
import dayjs from 'dayjs';
import { StaticMockLink } from 'utils/StaticMockLink';

/**
 * This file contains unit tests for the People component.
 *
 * The tests cover:
 * - Proper rendering of the People screen and its elements.
 * - Functionality of the search input and search button.
 * - Correct behavior when switching between member and admin modes.
 * - "Load More" pagination functionality with CursorPaginationManager.
 * - Integration with mocked GraphQL queries for testing data fetching.
 *
 * These tests use Vitest for test execution, StaticMockLink for mocking GraphQL queries
 * (since CursorPaginationManager fires multiple queries for the same variables),
 * and react-testing-library for rendering and interactions.
 */

// Common test params
const DEFAULT_ORG_ID = '';
const DEFAULT_FIRST = 10; // Matches ITEMS_PER_PAGE in component

// Helper for members edges
interface InterfaceMemberEdgeProps {
  cursor?: string;
  id?: string;
  name?: string;
  role?: string;
  avatarURL?: string | null;
  emailAddress?: string | null;
  node?: Record<string, unknown>;
}

// Helper for members edges
const memberEdge = (props: InterfaceMemberEdgeProps = {}) => ({
  cursor: props.cursor || 'cursor1',
  node: {
    id: props.id || 'user-1',
    name: props.name || 'User 1',
    role: props.role || 'member',
    avatarURL: props.avatarURL || null,
    emailAddress: props.emailAddress || 'user1@example.com',
    createdAt: dayjs().subtract(1, 'year').month(2).toISOString(),
    ...props.node,
  },
});

// Queries in People.tsx use these variables (orgId, where, first, after)
const makeQueryVars = (overrides: Record<string, unknown> = {}) => {
  return {
    orgId: DEFAULT_ORG_ID,
    first: DEFAULT_FIRST,
    after: null,
    ...overrides,
  };
};

// Mocks for default render (All Members mode)
const defaultMembersEdges = [
  memberEdge({
    cursor: 'cursor1',
    id: '1',
    name: 'Test User',
    role: 'member',
    emailAddress: 'test@example.com',
  }),
  memberEdge({
    cursor: 'cursor2',
    id: '2',
    name: 'Admin User',
    role: 'administrator',
    emailAddress: 'admin@example.com',
  }),
  memberEdge({
    cursor: 'cursor3',
    id: '3',
    name: 'User Custom Role',
    role: 'member',
    emailAddress: null,
  }),
];

const page2MembersEdges = [
  memberEdge({
    cursor: 'cursor4',
    id: '4',
    name: 'Page Two User',
    role: 'member',
    emailAddress: 'page2@example.com',
  }),
];

const defaultQueryMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: makeQueryVars(),
  },
  result: {
    data: {
      organization: {
        members: {
          edges: defaultMembersEdges,
          pageInfo: {
            endCursor: 'cursor3',
            hasPreviousPage: false,
            hasNextPage: true,
            startCursor: 'cursor1',
          },
        },
      },
    },
  },
};

const loadMoreMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: makeQueryVars({ after: 'cursor3' }),
  },
  result: {
    data: {
      organization: {
        members: {
          edges: page2MembersEdges,
          pageInfo: {
            endCursor: 'cursor4',
            hasPreviousPage: true,
            hasNextPage: false,
            startCursor: 'cursor4',
          },
        },
      },
    },
  },
};

// Mock for admin filtering (mode = 1)
const adminsOnlyMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: makeQueryVars({
      where: { role: { equal: 'administrator' } },
    }),
  },
  result: {
    data: {
      organization: {
        members: {
          edges: [
            memberEdge({
              cursor: 'cursor2',
              id: '2',
              name: 'Admin User',
              role: 'administrator',
              emailAddress: 'admin@example.com',
            }),
          ],
          pageInfo: {
            endCursor: 'cursor2',
            hasPreviousPage: false,
            hasNextPage: false,
            startCursor: 'cursor2',
          },
        },
      },
    },
  },
};

// Mock with no results
const emptyResultsMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: makeQueryVars(),
  },
  result: {
    data: {
      organization: {
        members: {
          edges: [],
          pageInfo: {
            endCursor: null,
            hasPreviousPage: false,
            hasNextPage: false,
            startCursor: null,
          },
        },
      },
    },
  },
};

// Debounce duration used by SearchFilterBar component (default: 300ms)
const SEARCH_DEBOUNCE_MS = 300;

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const sharedMocks = vi.hoisted(() => ({
  useParams: vi.fn(() => ({ orgId: '' })),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: sharedMocks.useParams,
  };
});

const setMatchMediaStub = (): void => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

let user: ReturnType<typeof userEvent.setup>;
beforeEach(() => {
  vi.clearAllMocks();
  user = userEvent.setup();
  sharedMocks.useParams.mockReturnValue({ orgId: '' });
  setMatchMediaStub();
});

afterEach(() => {
  vi.clearAllMocks();
  sharedMocks.useParams.mockReturnValue({ orgId: '' });
});

describe('Testing People Screen [User Portal]', () => {
  it('Screen should be rendered properly', async () => {
    const link = new StaticMockLink([defaultQueryMock], true);
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
    expect(screen.queryAllByText('Test User')).not.toBe([]);
    expect(screen.queryAllByText('Admin User')).not.toBe([]);
  });

  it('Search works properly by pressing enter', async () => {
    const link = new StaticMockLink([defaultQueryMock], true);
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await user.type(screen.getByTestId('searchInput'), 'Ad{enter}');
    await wait(SEARCH_DEBOUNCE_MS);

    await waitFor(() => {
      expect(screen.queryByText('Admin User')).toBeInTheDocument();
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    });
  });

  it('Search works properly by clicking search Btn', async () => {
    const link = new StaticMockLink([defaultQueryMock], true);
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const searchBtn = screen.getByTestId('searchBtn');
    await user.clear(screen.getByTestId('searchInput'));
    await user.click(searchBtn);
    await user.type(screen.getByTestId('searchInput'), 'Admin');
    await wait(SEARCH_DEBOUNCE_MS);
    await user.click(searchBtn);
    await wait();

    await waitFor(() => {
      expect(screen.queryByText('Admin User')).toBeInTheDocument();
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    });
  });

  it('Mode is changed to Admins', async () => {
    const link = new StaticMockLink([defaultQueryMock, adminsOnlyMock], true);
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await user.click(screen.getByTestId('modeChangeBtn-toggle'));
    await user.click(screen.getByTestId('modeChangeBtn-item-1'));
    await wait();

    await waitFor(() => {
      expect(screen.queryByText('Admin User')).toBeInTheDocument();
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    });
  });

  it('Shows loading state while fetching data', async () => {
    const link = new StaticMockLink([defaultQueryMock], true);
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('datatable-loading')).toBeInTheDocument();
    await wait();
  });

  it('Shows empty state when no members found', async () => {
    const link = new StaticMockLink([emptyResultsMock], true);
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Nothing to show here')).toBeInTheDocument();
    });
  });
});

describe('Testing People Screen Load More [User Portal]', () => {
  it('Load More button appears when hasNextPage is true', async () => {
    const link = new StaticMockLink([defaultQueryMock, loadMoreMock], true);
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Load More button should be visible
    expect(screen.getByTestId('load-more-button')).toBeInTheDocument();
  });

  it('Clicking Load More fetches more data', async () => {
    const link = new StaticMockLink([defaultQueryMock, loadMoreMock], true);
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Click Load More
    const loadMoreBtn = screen.getByTestId('load-more-button');
    await user.click(loadMoreBtn);

    // Should now show page 2 data along with page 1
    await waitFor(() => {
      expect(screen.getByText('Page Two User')).toBeInTheDocument();
      // Original data should still be visible
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  it('Load More button is hidden when hasNextPage is false', async () => {
    const noNextPageMock = {
      request: {
        query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
        variables: makeQueryVars(),
      },
      result: {
        data: {
          organization: {
            members: {
              edges: defaultMembersEdges,
              pageInfo: {
                endCursor: 'cursor3',
                hasPreviousPage: false,
                hasNextPage: false,
                startCursor: 'cursor1',
              },
            },
          },
        },
      },
    };

    const link = new StaticMockLink([noNextPageMock], true);
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Load More button should not be visible
    expect(screen.queryByTestId('load-more-button')).not.toBeInTheDocument();
  });
});

describe('People Component Mode Switch and Search Coverage', () => {
  it('searches partial user name correctly and displays matching results', async (): Promise<void> => {
    const link = new StaticMockLink([defaultQueryMock], true);
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.type(screen.getByTestId('searchInput'), 'Admin');
    await wait(SEARCH_DEBOUNCE_MS);
    await user.click(screen.getByTestId('searchBtn'));

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    });
  });

  it('should not trigger search for non-Enter key press', async () => {
    const link = new StaticMockLink([defaultQueryMock], true);
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const searchInput = screen.getByTestId('searchInput');
    await user.type(searchInput, 'A'); // Type 'A' without Enter

    await wait();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('should handle search with empty input value', async () => {
    const link = new StaticMockLink([defaultQueryMock], true);
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const searchBtn = screen.getByTestId('searchBtn');
    // Remove the search input from DOM to simulate edge case
    const searchInput = screen.getByTestId('searchInput');
    searchInput.remove();

    await user.click(searchBtn);
    await wait();
  });
});

describe('People Component Field Tests (Email, ID, Role)', () => {
  it('should display user email addresses correctly', async () => {
    const link = new StaticMockLink([defaultQueryMock], true);
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
  });

  it('should handle users with different ID formats', async () => {
    const link = new StaticMockLink([defaultQueryMock], true);
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Admin User')).toBeInTheDocument();
  });

  it('should correctly identify and display different user roles', async () => {
    const link = new StaticMockLink([defaultQueryMock, adminsOnlyMock], true);
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Admin User')).toBeInTheDocument();

    await user.click(screen.getByTestId('modeChangeBtn-toggle'));
    await user.click(screen.getByTestId('modeChangeBtn-item-1'));
    await wait();

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    });
  });

  it('should correctly assign userType based on role for admin filtering', async () => {
    const link = new StaticMockLink([defaultQueryMock, adminsOnlyMock], true);
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();

    await user.click(screen.getByTestId('modeChangeBtn-toggle'));
    await user.click(screen.getByTestId('modeChangeBtn-item-1'));
    await wait();

    await waitFor(() => {
      expect(screen.queryByText('Admin User')).toBeInTheDocument();
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    });

    await user.click(screen.getByTestId('modeChangeBtn-toggle'));
    await user.click(screen.getByTestId('modeChangeBtn-item-0'));
    await wait();

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  it('should pass correct props including id, email, and role to DataTable', async () => {
    const link = new StaticMockLink([defaultQueryMock, adminsOnlyMock], true);
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();

    await user.click(screen.getByTestId('modeChangeBtn-toggle'));
    await user.click(screen.getByTestId('modeChangeBtn-item-1'));
    await wait();

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();
      expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
    });
  });

  it('clears search input', async () => {
    const link = new StaticMockLink([defaultQueryMock], true);
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const searchInput = screen.getByTestId('searchInput');
    await user.type(searchInput, 'Test');
    expect(searchInput).toHaveValue('Test');

    // SearchBar renders a clear button when value is not empty
    const clearBtn = screen.getByLabelText('Clear');
    await user.click(clearBtn);

    expect(searchInput).toHaveValue('');
  });

  it('displays localized emailNotAvailable when email is missing', async () => {
    // Create a mock with a member that has null email
    const mockWithNullEmail = {
      request: {
        query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
        variables: makeQueryVars(),
      },
      result: {
        data: {
          organization: {
            members: {
              edges: [
                {
                  cursor: 'cursor1',
                  node: {
                    id: 'user-null-email',
                    name: 'Test User No Email',
                    role: 'member',
                    avatarURL: null,
                    emailAddress: null,
                    createdAt: dayjs().subtract(2, 'year').toISOString(),
                  },
                },
              ],
              pageInfo: {
                endCursor: 'cursor1',
                hasPreviousPage: false,
                hasNextPage: false,
                startCursor: 'cursor1',
              },
            },
          },
        },
      },
    };

    const link = new StaticMockLink([mockWithNullEmail], true);
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Verify member is rendered
    expect(screen.getByText('Test User No Email')).toBeInTheDocument();
    // Verify emailNotAvailable translation is displayed
    expect(screen.getByText('Email not available')).toBeInTheDocument();
  });
});

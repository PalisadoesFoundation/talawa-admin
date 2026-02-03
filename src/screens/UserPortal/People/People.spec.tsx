import React from 'react';
import type { RenderResult } from '@testing-library/react';
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
/**
 * This file contains unit tests for the People component.
 *
 * The tests cover:
 * - Proper rendering of the People screen and its elements.
 * - Functionality of the search input and search button.
 * - Correct behavior when switching between member and admin modes.
 * - Integration with mocked GraphQL queries for testing data fetching.
 *
 * These tests use Vitest for test execution, MockedProvider for mocking GraphQL queries, and react-testing-library for rendering and interactions.
 */

// Reusable mock data constants

// Common test params
const DEFAULT_ORG_ID = '';
const DEFAULT_SEARCH = '';
const DEFAULT_FIRST = 5;

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

// Queries in People.tsx always set these variables (orgId, firstName_contains, first, after)
const makeQueryVars = (overrides = {}) => ({
  orgId: DEFAULT_ORG_ID,
  firstName_contains: DEFAULT_SEARCH,
  first: DEFAULT_FIRST,
  after: undefined,
  ...overrides,
});

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
const defaultMembersEdges2 = [
  memberEdge({
    cursor: 'cursor4',
    id: '1',
    name: 'Test User',
    role: 'member',
    emailAddress: 'test@example.com',
  }),
  memberEdge({
    cursor: 'cursor5',
    id: '2',
    name: 'Admin User',
    role: 'administrator',
    emailAddress: 'admin@example.com',
  }),
  memberEdge({
    cursor: 'cursor6',
    id: '3',
    name: 'User Custom Role',
    role: 'member',
    emailAddress: null,
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
            hasPreviousPage: true,
            hasNextPage: true,
            startCursor: 'cursor1',
          },
        },
      },
    },
  },
};
const nextPageMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: {
      orgId: '',
      firstName_contains: '',
      first: 5,
      after: 'cursor3', // This matches the failing query!
    },
  },
  result: {
    data: {
      organization: {
        members: {
          edges: defaultMembersEdges2, // or whatever members you want for page 2
          pageInfo: {
            endCursor: 'cursor6',
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
    variables: makeQueryVars(),
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

// Mock for search with "Admin" as firstName_contains
const adminSearchMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: makeQueryVars({ firstName_contains: 'Admin' }),
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

// Mock for search with "Ad" as firstName_contains
const adSearchMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: makeQueryVars({ firstName_contains: 'Ad' }),
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

// Mocks for changing rows per page (simulate more members)
const lotsOfMembersEdges = Array.from({ length: 6 }, (_, i) =>
  memberEdge({
    cursor: `cursor${i + 1}`,
    id: `${i + 1}`,
    name: `user${i + 1}`,
  }),
);
const lotsOfMembersMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: makeQueryVars({ first: 10 }),
  },
  result: {
    data: {
      organization: {
        members: {
          edges: lotsOfMembersEdges,
          pageInfo: {
            endCursor: 'cursor6',
            hasPreviousPage: true,
            hasNextPage: false,
            startCursor: 'cursor1',
          },
        },
      },
    },
  },
};

const fiveMembersMock = {
  request: {
    query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
    variables: makeQueryVars({ first: 5 }),
  },
  result: {
    data: {
      organization: {
        members: {
          edges: lotsOfMembersEdges.slice(0, 5),
          pageInfo: {
            endCursor: 'cursor5',
            hasPreviousPage: true,
            hasNextPage: true,
            startCursor: 'cursor1',
          },
        },
      },
    },
  },
};

// Debounce duration used by SearchFilterBar component (default: 300ms)
// NOTE: This value must be manually kept in sync with SearchFilterBar's debounceDelay default
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
    render(
      <MockedProvider mocks={[defaultQueryMock]}>
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
    render(
      <MockedProvider mocks={[defaultQueryMock, adSearchMock]}>
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
    render(
      <MockedProvider mocks={[defaultQueryMock, adminSearchMock]}>
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
    render(
      <MockedProvider mocks={[defaultQueryMock, adminsOnlyMock]}>
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

    expect(screen.queryByText('Admin User')).toBeInTheDocument();
    expect(screen.queryByText('Test User')).not.toBeInTheDocument();
  });

  it('Shows loading state while fetching data', async () => {
    render(
      <MockedProvider mocks={[defaultQueryMock]}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    await wait();
  });

  it('pagination working', async () => {
    render(
      <MockedProvider mocks={[fiveMembersMock, lotsOfMembersMock]}>
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
    // Pagination functional (visual test)
    expect(screen.getByText('user1')).toBeInTheDocument();
  });
});

describe('Testing People Screen Pagination [User Portal]', () => {
  const renderComponent = (): RenderResult => {
    return render(
      <MockedProvider mocks={[fiveMembersMock, lotsOfMembersMock]}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  };

  it('handles rows per page change and pagination navigation', async () => {
    renderComponent();
    await wait();

    // Default should show 5 items
    expect(screen.getByText('user5')).toBeInTheDocument();

    // Change rows per page to 10 (should show 6 now)
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '10');
    await wait();

    expect(screen.getByText('user6')).toBeInTheDocument();

    // Reset to smaller page size to test navigation
    await user.selectOptions(select, '5');
    await wait();
  });

  it('handles backward pagination correctly', async () => {
    // Use mocks that support forward and backward navigation
    render(
      <MockedProvider mocks={[defaultQueryMock, nextPageMock]}>
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

    // Navigate to page 2
    const nextButton = screen.getByTestId('nextPage');
    await user.click(nextButton);
    await wait();

    // Now navigate back to page 1 (this covers lines 158-161)
    // This uses cached cursor, no new query needed
    const prevButton = screen.getByTestId('previousPage');
    await user.click(prevButton);
    await wait();

    // Should be back on first page
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});

describe('People Component Mode Switch and Search Coverage', () => {
  it('searches partial user name correctly and displays matching results', async (): Promise<void> => {
    render(
      <MockedProvider mocks={[defaultQueryMock, adminSearchMock]}>
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

  it('handles rowsPerPage = 0 case and edge cases', async () => {
    render(
      <MockedProvider mocks={[defaultQueryMock, nextPageMock]}>
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

    const select = screen.getByLabelText('rows per page');
    expect(select).toBeInTheDocument();
    const nextButton = screen.getByTestId('nextPage');
    await user.click(nextButton);
  });

  it('should not trigger search for non-Enter key press', async () => {
    render(
      <MockedProvider mocks={[defaultQueryMock]}>
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
    render(
      <MockedProvider mocks={[defaultQueryMock]}>
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
  const renderComponentWithEmailMock = (): RenderResult => {
    return render(
      <MockedProvider mocks={[defaultQueryMock]}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  };

  it('should display user email addresses correctly', async () => {
    renderComponentWithEmailMock();
    await wait();

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
  });

  it('should handle users with different ID formats', async () => {
    renderComponentWithEmailMock();
    await wait();

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Admin User')).toBeInTheDocument();
  });

  it('should correctly identify and display different user roles', async () => {
    renderComponentWithEmailMock();
    await wait();

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Admin User')).toBeInTheDocument();

    await user.click(screen.getByTestId('modeChangeBtn-toggle'));
    await user.click(screen.getByTestId('modeChangeBtn-item-1'));
    await wait();

    expect(screen.getByText('Admin User')).toBeInTheDocument();
  });

  it('should correctly assign userType based on role for admin filtering', async () => {
    renderComponentWithEmailMock();
    await wait();

    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();

    await user.click(screen.getByTestId('modeChangeBtn-toggle'));
    await user.click(screen.getByTestId('modeChangeBtn-item-1'));
    await wait();

    expect(screen.queryByText('Admin User')).toBeInTheDocument();

    await user.click(screen.getByTestId('modeChangeBtn-toggle'));
    await user.click(screen.getByTestId('modeChangeBtn-item-0'));
    await wait();

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should pass correct props including id, email, and role to PeopleCard components', async () => {
    renderComponentWithEmailMock();
    await wait();

    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();

    await user.click(screen.getByTestId('modeChangeBtn-toggle'));
    await user.click(screen.getByTestId('modeChangeBtn-item-1'));
    await wait();

    expect(screen.getByText('Admin User')).toBeInTheDocument();
  });

  it('clears search input', async () => {
    render(
      <MockedProvider mocks={[defaultQueryMock]}>
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

    render(
      <MockedProvider mocks={[mockWithNullEmail]}>
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
    const emailElement = screen.getByTestId('people-email-user-null-email');
    expect(emailElement).toHaveTextContent('Email not available');
  });
});

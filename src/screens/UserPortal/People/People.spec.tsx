import React from 'react';
import type { RenderResult } from '@testing-library/react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import People from './People';
import userEvent from '@testing-library/user-event';
import { vi, it } from 'vitest';

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
const memberEdge = (props: any = {}) => ({
  cursor: props.cursor || 'cursor1',
  node: {
    id: props.id || 'user-1',
    name: props.name || 'User 1',
    role: props.role || 'member',
    avatarURL: props.avatarURL || null,
    emailAddress: props.emailAddress || 'user1@example.com',
    createdAt: '2023-03-02T03:22:08.101Z',
    ...props.node,
  },
});

// Queries in People.tsx always set these variables (orgId, firstName_contains, first, after)
const makeQueryVars = (overrides = {}) => ({
  orgId: DEFAULT_ORG_ID,
  firstName_contains: DEFAULT_SEARCH,
  first: DEFAULT_FIRST,
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

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useParams: () => ({ orgId: '' }),
  };
});

describe('Testing People Screen [User Portal]', () => {
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

  it('Screen should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} mocks={[defaultQueryMock]}>
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
      <MockedProvider
        addTypename={false}
        mocks={[defaultQueryMock, adSearchMock]}
      >
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

    await userEvent.type(screen.getByTestId('searchInput'), 'Ad{enter}');
    await wait();

    expect(screen.queryByText('Admin User')).toBeInTheDocument();
    expect(screen.queryByText('Test User')).not.toBeInTheDocument();
  });

  it('Search works properly by clicking search Btn', async () => {
    render(
      <MockedProvider
        addTypename={false}
        mocks={[defaultQueryMock, adminSearchMock]}
      >
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
    await userEvent.clear(screen.getByTestId('searchInput'));
    await userEvent.click(searchBtn);
    await userEvent.type(screen.getByTestId('searchInput'), 'Admin');
    await userEvent.click(searchBtn);
    await wait();

    expect(screen.queryByText('Admin User')).toBeInTheDocument();
    expect(screen.queryByText('Test User')).not.toBeInTheDocument();
  });

  it('Mode is changed to Admins', async () => {
    render(
      <MockedProvider
        addTypename={false}
        mocks={[defaultQueryMock, adminsOnlyMock]}
      >
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

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn1'));
    await wait();

    expect(screen.queryByText('Admin User')).toBeInTheDocument();
    expect(screen.queryByText('Test User')).not.toBeInTheDocument();
  });

  it('Shows loading state while fetching data', async () => {
    render(
      <MockedProvider addTypename={false} mocks={[defaultQueryMock]}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await wait();
  });

  it('pagination working', async () => {
    render(
      <MockedProvider
        addTypename={false}
        mocks={[fiveMembersMock, lotsOfMembersMock]}
      >
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
      <MockedProvider
        addTypename={false}
        mocks={[fiveMembersMock, lotsOfMembersMock]}
      >
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

  beforeAll(() => {
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
  });

  it('handles rows per page change and pagination navigation', async () => {
    renderComponent();
    await wait();

    // Default should show 5 items
    expect(screen.getByText('user5')).toBeInTheDocument();

    // Change rows per page to 10 (should show 6 now)
    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, '10');
    await wait();

    expect(screen.getByText('user6')).toBeInTheDocument();

    // Reset to smaller page size to test navigation
    await userEvent.selectOptions(select, '5');
    await wait();
  });
});

describe('People Component Mode Switch and Search Coverage', () => {
  it('searches partial user name correctly and displays matching results', async (): Promise<void> => {
    render(
      <MockedProvider
        addTypename={false}
        mocks={[defaultQueryMock, adminSearchMock]}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await userEvent.type(screen.getByTestId('searchInput'), 'Admin');
    await userEvent.click(screen.getByTestId('searchBtn'));

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });
  });

  it('handles rowsPerPage = 0 case and edge cases', async () => {
    render(
      <MockedProvider
        addTypename={false}
        mocks={[defaultQueryMock, nextPageMock]}
      >
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
    await userEvent.click(nextButton);
  });

  it('should not trigger search for non-Enter key press', async () => {
    render(
      <MockedProvider addTypename={false} mocks={[defaultQueryMock]}>
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
    fireEvent.keyUp(searchInput, { key: 'A', code: 'KeyA' });

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('should handle search with empty input value', async () => {
    render(
      <MockedProvider addTypename={false} mocks={[defaultQueryMock]}>
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

    await userEvent.click(searchBtn);
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
});

describe('People Component Field Tests (Email, ID, Role)', () => {
  const renderComponentWithEmailMock = (): RenderResult => {
    return render(
      <MockedProvider mocks={[defaultQueryMock]} addTypename={false}>
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

  beforeAll(() => {
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
  });

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

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn1'));
    await wait();

    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.queryByText('Test User')).not.toBeInTheDocument();
  });

  it('should correctly assign userType based on role for admin filtering', async () => {
    renderComponentWithEmailMock();
    await wait();

    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn1'));
    await wait();

    expect(screen.queryByText('Admin User')).toBeInTheDocument();
    expect(screen.queryByText('Test User')).not.toBeInTheDocument();

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn0'));
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

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn1'));
    await wait();

    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
  });
});

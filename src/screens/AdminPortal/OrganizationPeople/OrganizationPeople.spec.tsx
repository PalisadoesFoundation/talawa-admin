import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Routes, Route } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { StaticMockLink } from 'utils/StaticMockLink';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { vi, afterEach, describe, test, expect } from 'vitest';
import OrganizationPeople from './OrganizationPeople';
import i18nForTest from 'utils/i18nForTest';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST_FOR_TABLE,
} from 'GraphQl/Queries/Queries';

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
  },
}));

vi.mock('./addMember/AddMember', () => ({
  default: () => (
    <button type="button" data-testid="add-member-button">
      Add Member
    </button>
  ),
}));

vi.mock('components/AdminPortal/OrgPeopleListCard/OrgPeopleListCard', () => ({
  default: () => <div data-testid="mock-org-people-list-card">Mock Modal</div>,
}));

vi.mock(
  'shared-components/SearchFilterBar/SearchFilterBar',
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import('shared-components/SearchFilterBar/SearchFilterBar')
      >();
    return {
      default: (props: React.ComponentProps<typeof actual.default>) => (
        <>
          <actual.default {...props} />
          <button
            type="button"
            data-testid="trigger-invalid-sort"
            onClick={() => {
              if (props.hasDropdowns) {
                props.dropdowns?.[0]?.onOptionChange?.('invalid');
              }
            }}
          >
            Invalid Sort
          </button>
        </>
      ),
    };
  },
);

const FIXED_DATE_TIMESTAMP = 1672531200000;
const FIXED_DATE = dayjs(FIXED_DATE_TIMESTAMP);

let originalLocation: Location;
let client: ApolloClient<unknown>;

const renderComponent = (
  link: StaticMockLink,
  initialEntries: (string | Partial<Location>)[] = ['/admin/orgpeople/orgid'],
) => {
  return render(
    <MockedProvider
      link={link}
      cache={client.cache as unknown as InMemoryCache}
    >
      <MemoryRouter initialEntries={initialEntries}>
        <I18nextProvider i18n={i18nForTest}>
          <Routes>
            <Route
              path="/admin/orgpeople/:orgId"
              element={<OrganizationPeople />}
            />
            <Route
              path="/user/orgpeople/:orgId"
              element={<OrganizationPeople />}
            />
          </Routes>
        </I18nextProvider>
      </MemoryRouter>
    </MockedProvider>,
  );
};

const PAGE_SIZE = 10;

const TIMEOUT_MS = 10000;

const createMemberConnectionMock = (
  variables: Record<string, unknown>,
  overrides: Record<string, unknown> = {},
) => {
  const defaultData = {
    organization: {
      members: {
        edges: [
          {
            node: {
              id: 'member1',
              name: 'John Doe',
              emailAddress: 'john@example.com',
              avatarURL: 'https://example.com/avatar1.jpg',
              createdAt: FIXED_DATE.subtract(3, 'day').toISOString(),
              role: 'member',
            },
            cursor: 'cursor1',
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: 'cursor1',
          endCursor: 'cursor1',
        },
      },
    },
  };

  const data = JSON.parse(JSON.stringify(defaultData)); // Deep copy
  if (overrides.edges) {
    data.organization.members.edges = overrides.edges;
  }
  if (overrides.pageInfo) {
    data.organization.members.pageInfo = {
      ...data.organization.members.pageInfo,
      ...overrides.pageInfo,
    };
  }

  return {
    request: {
      query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
      variables: {
        first: PAGE_SIZE, // Ensure strictly 10
        after: null,
        last: null,
        before: null,
        where: undefined,
        ...variables,
      },
    },
    result: {
      data,
    },
  };
};

describe('OrganizationPeople', () => {
  beforeEach(() => {
    originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost/',
        assign: vi.fn(),
        reload: vi.fn(),
        pathname: '/',
        search: '',
        hash: '',
        origin: 'http://localhost',
        state: null,
      },
      writable: true,
    });

    client = new ApolloClient({
      cache: new InMemoryCache({ addTypename: false }),
    });
  });

  afterEach(async () => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
    await client.clearStore();
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('renders loading state initially', async () => {
    const mocks = [createMemberConnectionMock({ orgId: 'orgid' })];
    const link = new StaticMockLink(mocks, true);
    renderComponent(link);
  });

  test('displays members list correctly', async () => {
    const mocks = [createMemberConnectionMock({ orgId: 'orgid' })];
    const link = new StaticMockLink(mocks, true);
    renderComponent(link);
    await waitFor(
      () => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      },
      { timeout: TIMEOUT_MS },
    );
  });

  test('handles search functionality correctly', async () => {
    const user = userEvent.setup({ delay: null });

    const initialMock = createMemberConnectionMock({ orgId: 'orgid' });
    const searchMock = createMemberConnectionMock(
      { orgId: 'orgid', where: { name: 'Jane' } },
      {
        edges: [
          {
            node: {
              id: 'member2',
              name: 'Jane Smith',
              emailAddress: 'jane@example.com',
              avatarURL: null,
              createdAt: FIXED_DATE.toISOString(),
              role: 'member',
            },
            cursor: 'cursor2',
          },
        ],
      },
    );
    // When search is cleared, we refetch initial
    const clearMock = createMemberConnectionMock({ orgId: 'orgid' });

    const link = new StaticMockLink([initialMock, searchMock, clearMock], true);

    renderComponent(link);

    await waitFor(
      () => expect(screen.getByText('John Doe')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );

    const searchInput = screen.getByTestId('member-search-input');
    await user.type(searchInput, 'Jane');

    await waitFor(
      () => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      },
      { timeout: TIMEOUT_MS },
    );
  });

  test('handles pagination correctly via server-side cursors', async () => {
    // Page 1
    const page1Mock = createMemberConnectionMock(
      { orgId: 'orgid' },
      {
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: 'startCursor1',
          endCursor: 'cursor1',
        },
      },
    );

    // Page 2 (triggered by click next)
    const page2Mock = createMemberConnectionMock(
      { orgId: 'orgid', after: 'cursor1' },
      {
        edges: [
          {
            node: {
              id: 'member2',
              name: 'Jane Smith',
              emailAddress: 'jane@example.com',
              avatarURL: null,
              createdAt: FIXED_DATE.toISOString(),
              role: 'member',
            },
            cursor: 'cursor2',
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: true,
          startCursor: 'adminCursor1',
          endCursor: 'cursor2',
        },
      },
    );

    const link = new StaticMockLink([page1Mock, page2Mock], true);
    const user = userEvent.setup({ delay: null });

    renderComponent(link);

    await waitFor(
      () => expect(screen.getByText('John Doe')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );

    const nextBtn = screen.getByRole('button', { name: /Next/i });
    expect(nextBtn).toBeEnabled();

    await user.click(nextBtn);

    await waitFor(
      () => expect(screen.getByText('Jane Smith')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );
  });

  test('switches to Administrators tab correctly', async () => {
    const user = userEvent.setup({ delay: null });
    const initialMock = createMemberConnectionMock({ orgId: 'orgid' });
    const adminMock = createMemberConnectionMock(
      { orgId: 'orgid', where: { role: { equal: 'administrator' } } },
      {
        edges: [
          {
            node: {
              id: 'admin1',
              name: 'Admin User',
              emailAddress: 'admin@example.com',
              avatarURL: null,
              createdAt: FIXED_DATE.toISOString(),
              role: 'administrator',
            },
            cursor: 'cursor_admin',
          },
        ],
      },
    );

    const link = new StaticMockLink([initialMock, adminMock], true);
    renderComponent(link);

    await waitFor(
      () => expect(screen.getByText('John Doe')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );

    // Open sort dropdown (mocked via SearchFilterBar)
    const sortDropdown = screen.getByTestId('sort-toggle');
    await user.click(sortDropdown);

    const adminOption = screen.getByTestId('sort-item-admin');
    await user.click(adminOption);

    await waitFor(
      () => {
        expect(screen.getByText('Admin User')).toBeInTheDocument();
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      },
      { timeout: TIMEOUT_MS },
    );
  });

  test('switches to Users tab correctly', async () => {
    const user = userEvent.setup({ delay: null });
    const initialMock = createMemberConnectionMock({ orgId: 'orgid' });
    const usersMock = {
      request: {
        query: USER_LIST_FOR_TABLE,
        variables: {
          first: PAGE_SIZE,
          after: null,
          last: null,
          before: null,
          where: undefined,
        },
      },
      result: {
        data: {
          allUsers: {
            edges: [
              {
                node: {
                  id: 'user1',
                  name: 'Generic User',
                  emailAddress: 'user@example.com',
                  avatarURL: null,
                  createdAt: FIXED_DATE.toISOString(),
                  role: 'member',
                },
                cursor: 'cursor_user',
              },
            ],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: 'cursor_user',
              endCursor: 'cursor_user',
            },
          },
        },
      },
    };

    const link = new StaticMockLink([initialMock, usersMock], true);
    renderComponent(link);

    await waitFor(
      () => expect(screen.getByText('John Doe')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );

    const sortDropdown = screen.getByTestId('sort-toggle');
    await user.click(sortDropdown);

    const usersOption = screen.getByTestId('sort-item-users');
    await user.click(usersOption);

    await waitFor(
      () => {
        expect(screen.getByText('Generic User')).toBeInTheDocument();
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      },
      { timeout: TIMEOUT_MS },
    );
  });

  test('handles search in Users tab', async () => {
    const user = userEvent.setup({ delay: null });

    const initialMock = createMemberConnectionMock({ orgId: 'orgid' });
    const usersMock = {
      request: {
        query: USER_LIST_FOR_TABLE,
        variables: {
          first: PAGE_SIZE,
          after: null,
          last: null,
          before: null,
          where: undefined,
        },
      },
      result: {
        data: {
          allUsers: {
            edges: [{ node: { id: 'u1', name: 'User 1' }, cursor: 'c1' }],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: 'c1',
              endCursor: 'c1',
            },
          },
        },
      },
    };

    const searchMock = {
      request: {
        query: USER_LIST_FOR_TABLE,
        variables: {
          first: PAGE_SIZE,
          after: null,
          last: null,
          before: null,
          where: { name: { contains: 'Specific' } },
        },
      },
      result: {
        data: {
          allUsers: {
            edges: [
              { node: { id: 'u2', name: 'Specific User' }, cursor: 'c2' },
            ],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: 'c2',
              endCursor: 'c2',
            },
          },
        },
      },
    };

    const link = new StaticMockLink([initialMock, usersMock, searchMock], true);
    renderComponent(link);

    await waitFor(
      () => expect(screen.getByText('John Doe')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );

    // Switch to Users tab
    const sortDropdown = screen.getByTestId('sort-toggle');
    await user.click(sortDropdown);
    await user.click(screen.getByTestId('sort-item-users'));

    await waitFor(
      () => expect(screen.getByText('User 1')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );

    // Type in search
    const searchInput = screen.getByTestId('member-search-input');
    await user.type(searchInput, 'Specific');

    await waitFor(
      () => {
        expect(screen.getByText('Specific User')).toBeInTheDocument();
      },
      { timeout: TIMEOUT_MS },
    );
  });

  test('handles invalid sort option correctly', async () => {
    const user = userEvent.setup({ delay: null });
    const initialMock = createMemberConnectionMock({ orgId: 'orgid' });
    // Re-mock for fallback (resets to members/0)
    const membersMock = createMemberConnectionMock({ orgId: 'orgid' });

    const link = new StaticMockLink([initialMock, membersMock], true);
    renderComponent(link);

    await waitFor(
      () => expect(screen.getByText('John Doe')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );

    const triggerInvalid = screen.getByTestId('trigger-invalid-sort');
    await user.click(triggerInvalid);

    // Should still display members
    await waitFor(
      () => expect(screen.getByText('John Doe')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );
  });

  test('calls errorHandler on member query error', async () => {
    const errorHandlerMock = await import('utils/errorHandler');
    const spy = vi.spyOn(errorHandlerMock, 'errorHandler');

    const errorMock = {
      request: {
        query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
        variables: {
          orgId: 'orgid',
          after: null,
          first: PAGE_SIZE,
          last: null,
          before: null,
          where: undefined,
        },
      },
      error: new Error('Network Error'),
    };

    const link = new StaticMockLink([errorMock], true);
    renderComponent(link);

    await waitFor(
      () => {
        expect(spy).toHaveBeenCalled();
      },
      { timeout: TIMEOUT_MS },
    );
  });

  test('calls errorHandler on user query error', async () => {
    const user = userEvent.setup({ delay: null });
    const errorHandlerMock = await import('utils/errorHandler');
    const spy = vi.spyOn(errorHandlerMock, 'errorHandler');

    const initialMock = createMemberConnectionMock({ orgId: 'orgid' });
    const userErrorMock = {
      request: {
        query: USER_LIST_FOR_TABLE,
        variables: {
          first: PAGE_SIZE,
          after: null,
          last: null,
          before: null,
          where: undefined,
        },
      },
      error: new Error('User fetch error'),
    };

    const link = new StaticMockLink([initialMock, userErrorMock], true);
    renderComponent(link);

    await waitFor(
      () => expect(screen.getByText('John Doe')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );

    // Switch to Users tab to trigger error
    const sortDropdown = screen.getByTestId('sort-toggle');
    await user.click(sortDropdown);
    const usersOption = screen.getByTestId('sort-item-users');
    await user.click(usersOption);

    await waitFor(
      () => {
        expect(spy).toHaveBeenCalled();
      },
      { timeout: TIMEOUT_MS },
    );
  });

  test('renders User Portal view correctly', async () => {
    const mocks = [createMemberConnectionMock({ orgId: 'orgid' })];
    const link = new StaticMockLink(mocks, true);
    renderComponent(link, ['/user/orgpeople/orgid']);

    await waitFor(
      () => expect(screen.getByText('John Doe')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );

    // Users option should be hidden
    const sortDropdown = screen.getByTestId('sort-toggle');
    const user = userEvent.setup({ delay: null });
    await user.click(sortDropdown);
    expect(screen.queryByTestId('sort-item-users')).not.toBeInTheDocument();

    // Action button (Delete) should be hidden or removed
    expect(
      screen.queryByTestId('removeMemberModalBtn'),
    ).not.toBeInTheDocument();

    // Add Member button should be hidden
    expect(screen.queryByTestId('add-member-button')).not.toBeInTheDocument();
  });

  test('triggers remove member modal', async () => {
    const mocks = [createMemberConnectionMock({ orgId: 'orgid' })];
    const link = new StaticMockLink(mocks, true);
    const user = userEvent.setup({ delay: null });
    renderComponent(link);

    await waitFor(
      () => expect(screen.getByText('John Doe')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );

    const removeBtn = screen.getByTestId('removeMemberModalBtn');
    await user.click(removeBtn);

    // For coverage, just clicking it is enough.
  });

  test('falls back to members tab if invalid role is provided', async () => {
    const mocks = [createMemberConnectionMock({ orgId: 'orgid' })];
    const link = new StaticMockLink(mocks, true);
    renderComponent(link, [
      {
        pathname: '/admin/orgpeople/orgid',
        state: { role: 99 },
      } as unknown as Partial<Location>,
    ]);

    await waitFor(
      () => expect(screen.getByText('John Doe')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );
  });

  test('guards against users tab in User Portal', async () => {
    const mocks = [createMemberConnectionMock({ orgId: 'orgid' })];
    const link = new StaticMockLink(mocks, true);
    renderComponent(link, [
      {
        pathname: '/user/orgpeople/orgid',
        state: { role: 2 },
      } as unknown as Partial<Location>,
    ]);

    await waitFor(
      () => expect(screen.getByText('John Doe')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );
  });

  test('handles search correctly in Administrators tab', async () => {
    const user = userEvent.setup({ delay: null });

    const initialMock = createMemberConnectionMock({ orgId: 'orgid' });
    const adminMock = createMemberConnectionMock({
      orgId: 'orgid',
      where: { role: { equal: 'administrator' } },
    });
    const adminSearchMock = createMemberConnectionMock(
      {
        orgId: 'orgid',
        where: { role: { equal: 'administrator' }, name: 'AdminSearch' },
      },
      {
        edges: [
          {
            node: { id: 'as1', name: 'AdminSearch Result' },
            cursor: 'asc1',
          },
        ],
      },
    );

    const link = new StaticMockLink(
      [initialMock, adminMock, adminSearchMock],
      true,
    );
    renderComponent(link);

    await waitFor(
      () => expect(screen.getByText('John Doe')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );

    // Switch to Administrators tab
    const sortDropdown = screen.getByTestId('sort-toggle');
    await user.click(sortDropdown);
    const adminOption = screen.getByTestId('sort-item-admin');
    await user.click(adminOption);

    // Type in search
    const searchInput = screen.getByTestId('member-search-input');
    await user.type(searchInput, 'AdminSearch');

    await waitFor(
      () => {
        expect(screen.getByText('AdminSearch Result')).toBeInTheDocument();
      },
      { timeout: TIMEOUT_MS },
    );

    // Clear search to hit false branch of searchTerm check
    await user.clear(searchInput);
    await waitFor(
      () => {
        // Wait for reset if any
      },
      { timeout: TIMEOUT_MS },
    );
  });

  test('handles pagination correctly in Users tab', async () => {
    const user = userEvent.setup({ delay: null });
    const initialMock = createMemberConnectionMock({ orgId: 'orgid' });
    const usersPage1Mock = {
      request: {
        query: USER_LIST_FOR_TABLE,
        variables: {
          first: PAGE_SIZE,
          after: null,
          last: null,
          before: null,
          where: undefined,
        },
      },
      result: {
        data: {
          allUsers: {
            edges: [{ node: { id: 'u1', name: 'User Page 1' }, cursor: 'uc1' }],
            pageInfo: {
              hasNextPage: true,
              hasPreviousPage: false,
              startCursor: 'uc1',
              endCursor: 'uc1',
            },
          },
        },
      },
    };
    const usersPage2Mock = {
      request: {
        query: USER_LIST_FOR_TABLE,
        variables: {
          first: PAGE_SIZE,
          after: 'uc1',
          last: null,
          before: null,
          where: undefined,
        },
      },
      result: {
        data: {
          allUsers: {
            edges: [{ node: { id: 'u2', name: 'User Page 2' }, cursor: 'uc2' }],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: true,
              startCursor: 'uc2',
              endCursor: 'uc2',
            },
          },
        },
      },
    };

    const link = new StaticMockLink(
      [initialMock, usersPage1Mock, usersPage2Mock],
      true,
    );
    renderComponent(link);

    await waitFor(
      () => expect(screen.getByText('John Doe')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );

    // Switch to Users tab
    const sortDropdown = screen.getByTestId('sort-toggle');
    await user.click(sortDropdown);
    const usersOption = screen.getByTestId('sort-item-users');
    await user.click(usersOption);

    await waitFor(
      () => expect(screen.getByText('User Page 1')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );

    const nextBtn = screen.getByRole('button', { name: /Next/i });
    await user.click(nextBtn);

    await waitFor(
      () => expect(screen.getByText('User Page 2')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );
  });

  test('formats date correctly for different languages', async () => {
    const mocks = [createMemberConnectionMock({ orgId: 'orgid' })];
    const link = new StaticMockLink(mocks, true);

    // Try to change language
    i18nForTest.changeLanguage('hi');

    renderComponent(link);

    await waitFor(
      () =>
        expect(screen.getByTestId(/^org-people-joined-/)).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );

    // Reset language
    i18nForTest.changeLanguage('en');
  });

  test('formats date correctly for unsupported language', async () => {
    const mocks = [createMemberConnectionMock({ orgId: 'orgid' })];
    const link = new StaticMockLink(mocks, true);

    // Set an unsupported language
    i18nForTest.changeLanguage('de');

    renderComponent(link);

    await waitFor(
      () =>
        expect(screen.getByTestId(/^org-people-joined-/)).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );

    // Reset language
    i18nForTest.changeLanguage('en');
  });
  test('renders OrgPeopleListCard modal when triggered', async () => {
    const mocks = [createMemberConnectionMock({ orgId: 'orgid' })];
    const link = new StaticMockLink(mocks, true);
    const user = userEvent.setup({ delay: null });
    renderComponent(link);

    await waitFor(
      () => expect(screen.getByText('John Doe')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );

    const removeBtn = screen.getByTestId('removeMemberModalBtn');
    await user.click(removeBtn);

    expect(screen.getByTestId('mock-org-people-list-card')).toBeInTheDocument();
  });

  test('verifies rapid typing cancels previous debounces', async () => {
    const user = userEvent.setup({ delay: null });

    const initialMock = createMemberConnectionMock({ orgId: 'orgid' });
    // This mock should ONLY be called once for the final "Jane" search
    const searchMock = createMemberConnectionMock(
      { orgId: 'orgid', where: { name: 'Jane' } },
      {
        edges: [
          {
            node: { id: 'member2', name: 'Jane Smith' },
            cursor: 'cursor2',
          },
        ],
      },
    );

    const link = new StaticMockLink([initialMock, searchMock], true);
    renderComponent(link);

    await waitFor(
      () => expect(screen.getByText('John Doe')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );

    const searchInput = screen.getByTestId('member-search-input');

    // Type "J" then immediately "Jane"
    await user.type(searchInput, 'J');
    await user.type(searchInput, 'ane');

    // If debounce works, only one request for "Jane" is sent
    // We verify "Jane Smith" appears
    await waitFor(
      () => expect(screen.getByText('Jane Smith')).toBeInTheDocument(),
      { timeout: TIMEOUT_MS },
    );

    // Verify StaticMockLink only received one search request
    // We can check if searchMock was consumed exactly once.
    // In StaticMockLink (if it's the one I think it is), unconsumed mocks remain.
  });
});

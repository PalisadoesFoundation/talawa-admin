import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Routes, Route } from 'react-router';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi, afterEach } from 'vitest';
import OrganizationPeople from './OrganizationPeople';
import i18nForTest from 'utils/i18nForTest';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST_FOR_TABLE,
} from 'GraphQl/Queries/Queries';
import { REMOVE_MEMBER_MUTATION_PG } from 'GraphQl/Mutations/mutations';
import { store } from 'state/store';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import { PAGE_SIZE } from 'types/ReportingTable/utils';

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

// Setup mock window.location
const setupLocationMock = () => {
  Object.defineProperty(window, 'location', {
    value: {
      href: 'http://localhost/',
      assign: vi.fn((url) => {
        const urlObj = new URL(url, 'http://localhost');
        window.location.href = urlObj.href;
        window.location.pathname = urlObj.pathname;
        window.location.search = urlObj.search;
        window.location.hash = urlObj.hash;
      }),
      reload: vi.fn(),
      pathname: '/',
      search: '',
      hash: '',
      origin: 'http://localhost',
    },
    writable: true,
  });
};

// Helper function to create mock Apollo responses
type MemberConnectionVariables = {
  orgId: string;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
  where?: { role?: { equal: string } };
};

type MemberEdge = {
  node: {
    id: string;
    name: string;
    emailAddress: string;
    avatarURL: string | null;
    createdAt: string;
    role?: string;
  };
  cursor: string;
};

type MemberConnectionOverrides = {
  edges?: MemberEdge[];
  pageInfo?: {
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    startCursor?: string;
    endCursor?: string;
  };
};

const createMemberConnectionMock = (
  variables: MemberConnectionVariables,
  overrides: MemberConnectionOverrides = {},
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
              createdAt: dayjs.utc().subtract(3, 'day').toISOString(),
              role: 'member',
            },
            cursor: 'cursor1',
          },
          {
            node: {
              id: 'member2',
              name: 'Jane Smith',
              emailAddress: 'jane@example.com',
              avatarURL: null,
              createdAt: dayjs.utc().subtract(2, 'day').toISOString(),
              role: 'member',
            },
            cursor: 'cursor2',
          },
        ] as MemberEdge[],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: 'cursor1',
          endCursor: 'cursor2',
        },
      },
    },
  };

  const data = { ...defaultData };
  const withRole = (edge: MemberEdge): MemberEdge => ({
    ...edge,
    node: {
      ...edge.node,
      role: edge.node.role ?? 'member',
    },
  });

  data.organization.members.edges =
    data.organization.members.edges.map(withRole);

  if (overrides.edges) {
    data.organization.members.edges = overrides.edges.map(withRole);
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
      variables,
    },
    result: {
      data,
    },
  };
};

type UserListVariables = {
  orgId: string;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
};

type UserEdge = {
  node: {
    id: string;
    name: string;
    emailAddress: string;
    avatarURL: string | null;
    createdAt: string;
    role: string;
  };
  cursor: string;
};

type UserListOverrides = {
  edges?: UserEdge[];
  pageInfo?: {
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    startCursor?: string;
    endCursor?: string;
  };
};

const createUserListMock = (
  variables: UserListVariables,
  overrides: UserListOverrides = {},
) => {
  const defaultData = {
    allUsers: {
      edges: [
        {
          node: {
            id: 'user1',
            name: 'User One',
            emailAddress: 'user1@example.com',
            avatarURL: 'https://example.com/avatar1.jpg' as string | null,
            createdAt: dayjs.utc().subtract(3, 'day').toISOString(),
            role: 'member',
          },
          cursor: 'userCursor1',
        },
        {
          node: {
            id: 'user2',
            name: 'User Two',
            emailAddress: 'user2@example.com',
            avatarURL: null as string | null,
            createdAt: dayjs.utc().subtract(2, 'day').toISOString(),
            role: 'member',
          },
          cursor: 'userCursor2',
        },
      ],
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'userCursor1',
        endCursor: 'userCursor2',
      },
    },
  };

  const data = { ...defaultData };
  const withRole = (edge: UserEdge): UserEdge => ({
    ...edge,
    node: {
      ...edge.node,
      role: edge.node.role ?? 'member',
    },
  });

  data.allUsers.edges = data.allUsers.edges.map(withRole) as UserEdge[];

  if (overrides.edges) {
    data.allUsers.edges = overrides.edges.map(withRole);
  }
  if (overrides.pageInfo) {
    data.allUsers.pageInfo = {
      ...data.allUsers.pageInfo,
      ...overrides.pageInfo,
    };
  }

  return {
    request: {
      query: USER_LIST_FOR_TABLE,
      variables,
    },
    result: {
      data,
    },
  };
};

// Helper for waiting
describe('OrganizationPeople', () => {
  beforeEach(() => {
    setupLocationMock();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders loading state initially', async () => {
    const mocks = [
      createMemberConnectionMock({
        orgId: 'orgid',
        first: 10,
        after: null,
        last: null,
        before: null,
      }),
    ];

    const link = new StaticMockLink(mocks, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );
  });

  test('displays members list correctly', async () => {
    const mocks = [
      createMemberConnectionMock({
        orgId: 'orgid',
        first: 10,
        after: null,
        last: null,
        before: null,
      }),
    ];

    const link = new StaticMockLink(mocks, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(screen.getByText('jane@example.com')).toBeInTheDocument();

    // The new component includes a "Joined:" label and a different date format.
    expect(screen.getByText(/Joined:/i)).toBeInTheDocument();
    // Check for the dynamic date format (YYYY-MM-DD)
    expect(
      screen.getByText(
        new RegExp(dayjs.utc().subtract(3, 'day').format('YYYY-MM-DD')),
      ),
    ).toBeInTheDocument();
  });

  test('handles search functionality correctly', async () => {
    const mocks = [
      createMemberConnectionMock({
        orgId: 'orgid',
        first: 10,
        after: null,
        last: null,
        before: null,
      }),
    ];

    const link = new StaticMockLink(mocks, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Search for "Jane"
    const searchInput = screen.getByTestId('searchbtn');
    await userEvent.type(searchInput, 'Jane');

    // Wait for debounced search (AdminSearchFilterBar has 300ms debounce)
    await waitFor(
      () => {
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      },
      { timeout: 1000 },
    );

    // Should show Jane but not John
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();

    // Clear search
    await userEvent.clear(searchInput);

    // Should show both again
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('handles tab switching between members, admins, and users', async () => {
    const initialMock = createMemberConnectionMock({
      orgId: 'orgid',
      first: 10,
      after: null,
      last: null,
      before: null,
    });

    const adminMock = createMemberConnectionMock(
      {
        orgId: 'orgid',
        first: 10,
        after: null,
        last: null,
        before: null,
        where: { role: { equal: 'administrator' } },
      },
      {
        edges: [
          {
            node: {
              id: 'admin1',
              name: 'Admin User',
              emailAddress: 'admin@example.com',
              avatarURL: null,
              createdAt: dayjs.utc().toISOString(),
              role: 'administrator',
            },
            cursor: 'adminCursor1',
          },
        ],
      },
    );

    const usersMock = createUserListMock({
      orgId: 'orgid',
      first: 10,
      after: null,
      last: null,
      before: null,
    });

    const mocks = [initialMock, adminMock, usersMock];
    const link = new StaticMockLink(mocks, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for initial members data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Switch to admin tab
    const sortingButton = screen.getByTestId('sort');
    fireEvent.click(sortingButton);

    const adminOption = screen.getByText(/admin/i);
    fireEvent.click(adminOption);

    // Wait for admin data to load
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    // Switch to users tab
    fireEvent.click(sortingButton);
    const usersOption = screen.getByText(/users/i);
    fireEvent.click(usersOption);

    // Wait for users data to load
    await waitFor(() => {
      expect(screen.getByText('User One')).toBeInTheDocument();
      expect(screen.getByText('User Two')).toBeInTheDocument();
    });

    // Switch to users tab
    fireEvent.click(sortingButton);
    const memberOption = screen.getByText(/members/i);
    fireEvent.click(memberOption);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('handles pagination correctly for MEMBERS', async () => {
    const initialMock = createMemberConnectionMock({
      orgId: 'orgid',
      first: 10,
      after: null,
      last: null,
      before: null,
    });

    const nextPageMock = createMemberConnectionMock(
      {
        orgId: 'orgid',
        first: 10,
        after: 'cursor2',
        last: null,
        before: null,
      },
      {
        edges: [
          {
            node: {
              id: 'member3',
              name: 'Bob Johnson',
              emailAddress: 'bob@example.com',
              avatarURL: null,
              createdAt: dayjs.utc().toISOString(),
            },
            cursor: 'cursor3',
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: true,
          startCursor: 'cursor3',
          endCursor: 'cursor3',
        },
      },
    );

    const prevPageMock = createMemberConnectionMock({
      orgId: 'orgid',
      first: null,
      after: null,
      last: 10,
      before: 'cursor3',
    });

    const mocks = [initialMock, nextPageMock, prevPageMock];
    const link = new StaticMockLink(mocks, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Navigate to next page
    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextPageButton);

    // Wait for next page data to load
    await waitFor(() => {
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    // Navigate back to previous page
    const prevPageButton = screen.getByRole('button', {
      name: /previous page/i,
    });
    fireEvent.click(prevPageButton);

    // Wait for previous page data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('handles pagination correctly for ADMIN', async () => {
    const initialMemberMock = createMemberConnectionMock({
      orgId: 'orgid',
      first: 10,
      after: null,
      last: null,
      before: null,
    });

    const initialAdminMock = createMemberConnectionMock(
      {
        orgId: 'orgid',
        first: 10,
        after: null,
        last: null,
        before: null,
        where: { role: { equal: 'administrator' } },
      },
      {
        edges: [
          {
            node: {
              id: 'admin1',
              name: 'Admin User',
              emailAddress: 'admin@example.com',
              avatarURL: null,
              createdAt: dayjs.utc().toISOString(),
              role: 'administrator',
            },
            cursor: 'adminCursor1',
          },
        ],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: 'adminCursor1',
          endCursor: 'adminCursor1',
        },
      },
    );

    const nextAdminPageMock = createMemberConnectionMock(
      {
        orgId: 'orgid',
        last: null,
        after: 'adminCursor1',
        first: 10,
        before: null,
        where: { role: { equal: 'administrator' } },
      },
      {
        edges: [
          {
            node: {
              id: 'admin2',
              name: 'Admin User 2',
              emailAddress: 'admin2@example.com',
              avatarURL: null,
              createdAt: dayjs.utc().toISOString(),
              role: 'administrator',
            },
            cursor: 'adminCursor2',
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: true,
          startCursor: 'adminCursor2',
          endCursor: 'adminCursor2',
        },
      },
    );

    const prevAdminPageMock = createMemberConnectionMock(
      {
        orgId: 'orgid',
        last: 10,
        after: null,
        first: null,
        before: 'adminCursor2',
        where: { role: { equal: 'administrator' } },
      },
      {
        edges: [
          {
            node: {
              id: 'admin1',
              name: 'Admin User',
              emailAddress: 'admin1@example.com',
              avatarURL: null,
              createdAt: dayjs.utc().toISOString(),
              role: 'administrator',
            },
            cursor: 'adminCursor1',
          },
        ],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: 'adminCursor1',
          endCursor: 'adminCursor1',
        },
      },
    );

    const mocks = [
      initialMemberMock,
      initialAdminMock,
      nextAdminPageMock,
      prevAdminPageMock,
    ];
    const link = new StaticMockLink(mocks, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Switch to admin tab
    const sortingButton = screen.getByTestId('sort');
    fireEvent.click(sortingButton);

    const adminOption = screen.getByText(/ADMIN/i);
    fireEvent.click(adminOption);

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    // Navigate to next page
    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextPageButton);

    // Wait for next page data to load
    await waitFor(() => {
      expect(screen.getByText('Admin User 2')).toBeInTheDocument();
    });

    // Navigate back to previous page
    const prevPageButton = screen.getByRole('button', {
      name: /previous page/i,
    });
    fireEvent.click(prevPageButton);

    // Wait for previous page data to load
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });
  });

  test('handles pagination correctly for USER', async () => {
    const initialMemberMock = createMemberConnectionMock({
      orgId: 'orgid',
      first: 10,
      after: null,
      last: null,
      before: null,
    });

    const initialUsersMock = createUserListMock({
      orgId: 'orgid',
      first: 10,
      after: null,
      last: null,
      before: null,
    });

    const nextUserMock = createUserListMock(
      {
        orgId: 'orgid',
        first: 10,
        after: 'userCursor2',
        last: null,
        before: null,
      },
      {
        edges: [
          {
            node: {
              id: 'member3',
              name: 'Bob Johnson',
              emailAddress: 'bob@example.com',
              avatarURL: null,
              createdAt: dayjs.utc().subtract(1, 'year').toISOString(),
              role: 'member',
            },
            cursor: 'cursor3',
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: true,
          startCursor: 'cursor3',
          endCursor: 'cursor3',
        },
      },
    );

    const prevUserMock = createUserListMock({
      orgId: 'orgid',
      first: null,
      after: null,
      last: 10,
      before: 'cursor3',
    });

    const mocks = [
      initialMemberMock,
      initialUsersMock,
      nextUserMock,
      prevUserMock,
    ];
    const link = new StaticMockLink(mocks, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Switch to admin tab
    const sortingButton = screen.getByTestId('sort');
    fireEvent.click(sortingButton);

    const usersOption = screen.getByTestId('users');
    fireEvent.click(usersOption);

    await waitFor(() => {
      expect(screen.getByText('User One')).toBeInTheDocument();
    });

    // Navigate to next page
    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextPageButton);

    // Wait for next page data to load
    await waitFor(() => {
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    // Navigate back to previous page
    const prevPageButton = screen.getByRole('button', {
      name: /previous page/i,
    });
    fireEvent.click(prevPageButton);

    // Wait for previous page data to load
    await waitFor(() => {
      expect(screen.getByText('User One')).toBeInTheDocument();
    });
  });

  test('handles pagination correctly for ADMIN no next', async () => {
    const initialMemberMock = createMemberConnectionMock({
      orgId: 'orgid',
      first: 10,
      after: null,
      last: null,
      before: null,
    });

    const initialAdminMock = createMemberConnectionMock(
      {
        orgId: 'orgid',
        first: 10,
        after: null,
        last: null,
        before: null,
        where: { role: { equal: 'administrator' } },
      },
      {
        edges: [
          {
            node: {
              id: 'admin1',
              name: 'Admin User',
              emailAddress: 'admin@example.com',
              avatarURL: null,
              createdAt: dayjs.utc().subtract(1, 'year').toISOString(),
              role: 'administrator',
            },
            cursor: 'adminCursor1',
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: 'adminCursor1',
          endCursor: 'adminCursor1',
        },
      },
    );

    const mocks = [initialMemberMock, initialAdminMock];
    const link = new StaticMockLink(mocks, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Switch to admin tab
    const sortingButton = screen.getByTestId('sort');
    fireEvent.click(sortingButton);

    const adminOption = screen.getByText(/ADMIN/i);
    fireEvent.click(adminOption);

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes('Admin User')),
      ).toBeInTheDocument();
    });

    // Navigate to next page
    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextPageButton);

    // Navigate back to previous page
    const prevPageButton = screen.getByRole('button', {
      name: /previous page/i,
    });
    fireEvent.click(prevPageButton);
  });

  test('handles errors from GraphQL queries', async () => {
    const errorMock = {
      request: {
        query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
        variables: {
          orgId: 'orgid',
          first: 10,
          after: null,
          last: null,
          before: null,
        },
      },
      error: new Error('An error occurred'),
    };

    const link = new StaticMockLink([errorMock], true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for error handling
    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith('An error occurred');
    });
  });

  test('handles errors from GraphQL queries for users', async () => {
    const initialMemberMock = createMemberConnectionMock({
      orgId: 'orgid',
      first: 10,
      after: null,
      last: null,
      before: null,
    });

    const errorMock = {
      request: {
        query: USER_LIST_FOR_TABLE,
        variables: {
          orgId: 'orgid',
          first: 10,
          after: null,
          last: null,
          before: null,
        },
      },
      error: new Error('An error occurred'),
    };

    const link = new StaticMockLink([initialMemberMock, errorMock], true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Switch to users tab
    const sortingButton = screen.getByTestId('sort');
    fireEvent.click(sortingButton);

    const usersOption = screen.getByTestId('users');
    fireEvent.click(usersOption);

    // Wait for error handling
    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith('An error occurred');
    });
  });

  test('displays localized notFound message in empty state', async () => {
    const emptyMock = createMemberConnectionMock(
      {
        orgId: 'orgid',
        first: 10,
        after: null,
        last: null,
        before: null,
      },
      {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: undefined,
          endCursor: undefined,
        },
      },
    );

    const link = new StaticMockLink([emptyMock], true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for loading to finish and empty state to appear
    await waitFor(
      () => {
        expect(
          screen.getByTestId('organization-people-empty-state'),
        ).toBeInTheDocument();
        const msg =
          i18nForTest.getDataByLanguage('en')?.common?.notFound ?? 'Not Found';
        expect(screen.getByText(msg)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  test('handles member removal modal correctly', async () => {
    const initialMember = createMemberConnectionMock({
      orgId: 'orgid',
      first: 10,
      after: null,
      last: null,
      before: null,
    });

    const removeMemberMock = {
      request: {
        query: REMOVE_MEMBER_MUTATION_PG,
        variables: { organizationId: 'orgid', memberId: 'member1' },
      },
      result: {
        data: {
          removeMember: { id: 1 },
        },
      },
    };

    const mocks = [initialMember, removeMemberMock];

    const link = new StaticMockLink(mocks, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click on delete button for a member
    const deleteButtons = screen.getAllByTestId('removeMemberModalBtn');
    fireEvent.click(deleteButtons[0]);

    // Modal should be open
    await waitFor(() => {
      expect(screen.getByTestId('removeMemberModal')).toBeInTheDocument();
    });

    // Close the modal
    const closeButton = screen.getByTestId('removeMemberBtn');
    fireEvent.click(closeButton);

    // Modal should be closed
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalled();
    });
  });

  test('prevents navigation when there are no pages available', async () => {
    const singlePageMock = createMemberConnectionMock(
      {
        orgId: 'orgid',
        first: 10,
        after: null,
        last: null,
        before: null,
      },
      {
        edges: [
          {
            node: {
              id: 'member1',
              name: 'John Doe',
              emailAddress: 'john@example.com',
              avatarURL: 'https://example.com/avatar1.jpg',
              createdAt: dayjs().subtract(1, 'year').toISOString(),
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
    );

    const link = new StaticMockLink([singlePageMock], true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Try to navigate to next page (should not work)
    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextPageButton);

    // Should still show the same data
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('handles backward navigation with missing page cursors', async () => {
    const initialMock = createMemberConnectionMock({
      orgId: 'orgid',
      first: 10,
      after: null,
      last: null,
      before: null,
    });

    // Mock for backward navigation without stored cursors
    const backwardMock = createMemberConnectionMock({
      orgId: 'orgid',
      first: null,
      after: null,
      last: 10,
      before: null, // This will test the fallback to null
    });

    const link = new StaticMockLink([initialMock, backwardMock], true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for initial data
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Manually trigger pagination to page 1 to simulate being on a later page
    // without having proper cursor data stored
    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextPageButton);

    // Now try to go back - this should trigger the fallback to null
    const prevPageButton = screen.getByRole('button', {
      name: /previous page/i,
    });
    fireEvent.click(prevPageButton);
  });

  test('prevents forward pagination when hasNextPage is false', async () => {
    vi.resetModules();

    vi.doMock('shared-components/ReportingTable/ReportingTable', () => ({
      __esModule: true,
      default: ({
        rows,
        gridProps,
      }: {
        rows?: unknown[];
        gridProps?: {
          onPaginationModelChange?: (model: {
            page: number;
            pageSize: number;
          }) => void;
        };
      }) => (
        <div>
          <div data-testid="row-count">{rows?.length ?? 0}</div>
          <button
            data-testid="trigger-forward"
            onClick={() =>
              gridProps?.onPaginationModelChange?.({
                page: 1,
                pageSize: PAGE_SIZE,
              })
            }
          >
            Trigger Forward
          </button>
        </div>
      ),
    }));

    const singlePageMock = createMemberConnectionMock(
      {
        orgId: 'orgid',
        first: 10,
        after: null,
        last: null,
        before: null,
      },
      {
        edges: [
          {
            node: {
              id: 'member1',
              name: 'John Doe',
              emailAddress: 'john@example.com',
              avatarURL: 'https://example.com/avatar1.jpg',
              createdAt: dayjs().subtract(1, 'year').toISOString(),
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
    );

    const link = new StaticMockLink([singlePageMock], true);

    const { default: Component } = await import('./OrganizationPeople');

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route path="/orgpeople/:orgId" element={<Component />} />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('row-count').textContent).toBe('1');
    });

    fireEvent.click(screen.getByTestId('trigger-forward'));

    await waitFor(() => {
      expect(screen.getByTestId('row-count').textContent).toBe('1');
    });

    vi.doUnmock('shared-components/ReportingTable/ReportingTable');
    vi.resetModules();
  });
});

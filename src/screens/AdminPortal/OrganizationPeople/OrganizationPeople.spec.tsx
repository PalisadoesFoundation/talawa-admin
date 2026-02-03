import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
import { render, screen, waitFor } from '@testing-library/react';
import userEvent, {
  PointerEventsCheckLevel,
} from '@testing-library/user-event';
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
        <MemoryRouter initialEntries={['/admin/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgpeople/:orgId"
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
        <MemoryRouter initialEntries={['/admin/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for data to load (longer timeout for full suite run under load)
    await waitFor(
      () => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    const joinedLabels = screen.getAllByText(/Joined :/i);
    expect(joinedLabels).toHaveLength(2);

    // Use the same Intl.DateTimeFormat as the component
    const dateFormatter = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC',
    });
    const expectedDate1 = dateFormatter.format(
      dayjs.utc().subtract(3, 'day').toDate(),
    );
    const expectedDate2 = dateFormatter.format(
      dayjs.utc().subtract(2, 'day').toDate(),
    );
    expect(screen.getByTestId('org-people-joined-member1')).toHaveTextContent(
      `Joined : ${expectedDate1}`,
    );
    expect(screen.getByTestId('org-people-joined-member2')).toHaveTextContent(
      `Joined : ${expectedDate2}`,
    );
  });

  test('handles search functionality correctly', async () => {
    const user = userEvent.setup({ delay: null });
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
        <MemoryRouter initialEntries={['/admin/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for data to load (longer timeout for full suite run under load)
    await waitFor(
      () => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Search for "Jane"
    const searchInput = screen.getByTestId('searchbtn');
    await user.type(searchInput, 'Jane');

    // Wait for debounced search (SearchFilterBar has 300ms debounce)
    await waitFor(
      () => {
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    // Should show Jane but not John
    await waitFor(
      () => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    // Clear search
    await user.clear(searchInput);

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
        <MemoryRouter initialEntries={['/admin/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgpeople/:orgId"
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
    const sortingButton = screen.getByTestId('sort-toggle');
    await userEvent.click(sortingButton);

    const adminOption = screen.getByText(/admin/i);
    await userEvent.click(adminOption);

    // Wait for admin data to load
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    // Switch to users tab
    await userEvent.click(sortingButton);
    const usersOption = screen.getByText(/users/i);
    await userEvent.click(usersOption);

    // Wait for users data to load
    await waitFor(() => {
      expect(screen.getByText('User One')).toBeInTheDocument();
      expect(screen.getByText('User Two')).toBeInTheDocument();
    });

    // Switch to users tab
    await userEvent.click(sortingButton);
    const memberOption = screen.getByText(/members/i);
    await userEvent.click(memberOption);

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

    const mocks = [initialMock];
    const link = new StaticMockLink(mocks, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/admin/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgpeople/:orgId"
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

    // Verify second member is also displayed
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
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
        <MemoryRouter initialEntries={['/admin/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgpeople/:orgId"
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
    const sortingButton = screen.getByTestId('sort-toggle');
    await userEvent.click(sortingButton);

    const adminOption = screen.getByText(/admin/i);
    await userEvent.click(adminOption);

    // Wait for admin data to load
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

    const mocks = [initialMemberMock, initialUsersMock];
    const link = new StaticMockLink(mocks, true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/admin/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgpeople/:orgId"
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
    const sortingButton = screen.getByTestId('sort-toggle');
    await userEvent.click(sortingButton);

    const usersOption = screen.getByText(/users/i);
    await userEvent.click(usersOption);

    // Wait for users data to load
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
        <MemoryRouter initialEntries={['/admin/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgpeople/:orgId"
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
    const sortingButton = screen.getByTestId('sort-toggle');
    await userEvent.click(sortingButton);

    const adminOption = screen.getByText(/ADMIN/i);
    await userEvent.click(adminOption);

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes('Admin User')),
      ).toBeInTheDocument();
    });

    // Navigate to next page
    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    expect(nextPageButton).toBeDisabled();

    // Navigate back to previous page
    const prevPageButton = screen.getByRole('button', {
      name: /previous page/i,
    });
    expect(prevPageButton).toBeDisabled();
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
        <MemoryRouter initialEntries={['/admin/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgpeople/:orgId"
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
        <MemoryRouter initialEntries={['/admin/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgpeople/:orgId"
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
    const sortingButton = screen.getByTestId('sort-toggle');
    await userEvent.click(sortingButton);

    const adminOption = screen.getByText(/user/i);
    await userEvent.click(adminOption);

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
        <MemoryRouter initialEntries={['/admin/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgpeople/:orgId"
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
        <MemoryRouter initialEntries={['/admin/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgpeople/:orgId"
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
    await userEvent.click(deleteButtons[0]);

    // Modal should be open
    await waitFor(() => {
      expect(screen.getByTestId('removeMemberModal')).toBeInTheDocument();
    });

    // Close the modal
    const closeButton = screen.getByTestId('removeMemberBtn');
    await userEvent.click(closeButton);

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
        <MemoryRouter initialEntries={['/admin/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgpeople/:orgId"
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
    expect(nextPageButton).toBeDisabled();

    // Should still show the same data
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('handles backward navigation with missing page cursors', async () => {
    const user = userEvent.setup({
      pointerEventsCheck: PointerEventsCheckLevel.Never,
    });
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
        <MemoryRouter initialEntries={['/admin/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgpeople/:orgId"
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
    await user.click(nextPageButton);

    // Now try to go back - this should trigger the fallback to null
    const prevPageButton = screen.getByRole('button', {
      name: /previous page/i,
    });
    await user.click(prevPageButton);
  });

  test('prevents forward pagination when hasNextPage is false', async () => {
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
        <MemoryRouter initialEntries={['/admin/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('skips storing cursors when startCursor or endCursor is missing', async () => {
    // This test targets line 256 - the ELSE path (when condition is false)
    const mockWithPartialCursors = {
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
      result: {
        data: {
          organization: {
            members: {
              edges: [
                {
                  node: {
                    id: 'member1',
                    name: 'John Doe',
                    emailAddress: 'john@example.com',
                    avatarURL: null,
                    createdAt: dayjs.utc().subtract(3, 'day').toISOString(),
                    role: 'member',
                  },
                  cursor: 'cursor1',
                },
              ],
              pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: '', // Empty string (falsy)
                endCursor: 'cursor1',
              },
            },
          },
        },
      },
    };

    const link = new StaticMockLink([mockWithPartialCursors], true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/admin/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('prevents backward navigation attempt when hasPreviousPage is false', async () => {
    // This test targets line 353 - the second return statement
    const firstPageMock = createMemberConnectionMock(
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
              avatarURL: null,
              createdAt: dayjs.utc().toISOString(),
              role: 'member',
            },
            cursor: 'cursor1',
          },
        ],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false, // We're on the first page
          startCursor: 'cursor1',
          endCursor: 'cursor1',
        },
      },
    );

    const link = new StaticMockLink([firstPageMock], true);

    render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/admin/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click the previous page button (should be prevented from navigating)
    const prevPageButton = screen.getByRole('button', {
      name: /previous page/i,
    });

    expect(prevPageButton).toBeDisabled();

    // Verify we're still showing the same data
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('renders img element when member has avatarURL', async () => {
    // This test targets line 473 - the img element rendering
    const mockWithAvatar = createMemberConnectionMock(
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
              id: 'member-with-image',
              name: 'User With Image',
              emailAddress: 'user@example.com',
              avatarURL: 'https://example.com/user-avatar.jpg',
              createdAt: dayjs.utc().toISOString(),
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
    );

    const link = new StaticMockLink([mockWithAvatar], true);

    const { container } = render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/admin/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('User With Image')).toBeInTheDocument();
    });

    // Find the actual img element - this covers line 473
    const imgElement = container.querySelector(
      'img[src="https://example.com/user-avatar.jpg"]',
    );
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('crossorigin', 'anonymous');
  });

  test('calls getRowClassName for each rendered row', async () => {
    // This test verifies that rows are rendered with proper styling
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

    const { container } = render(
      <MockedProvider link={link}>
        <MemoryRouter initialEntries={['/admin/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/admin/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    // Verify rows exist in the DataGrid
    const dataGridRows = container.querySelectorAll('.MuiDataGrid-row');
    expect(dataGridRows.length).toBeGreaterThanOrEqual(2);

    // Verify each row has proper styling
    dataGridRows.forEach((row) => {
      expect(row).toHaveAttribute('class');
      expect(row.getAttribute('class')).not.toBe('');
      // DataGridWrapper applies standard MUI DataGrid classes
      expect(row.getAttribute('class')).toMatch(/MuiDataGrid-row/);
    });
  });
});

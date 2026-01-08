import dayjs from 'dayjs';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
  act,
} from '@testing-library/react';
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

vi.mock('./addMember/AddMember', () => ({
  default: () => (
    <button type="button" data-testid="add-member-button">
      Add Member
    </button>
  ),
}));

// Helper function to create mock Apollo responses
type MemberConnectionVariables = {
  orgId: string;
  first?: number | null;
  after?: string | null;
  where?: {
    role?: { equal: string };
    firstName?: { contains: string };
  };
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
              createdAt: dayjs().subtract(3, 'day').toISOString(),
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
              createdAt: dayjs().subtract(2, 'day').toISOString(),
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
      variables,
    },
    result: {
      data,
    },
  };
};

type UserListVariables = {
  first?: number | null;
  after?: string | null;
  where?: {
    firstName?: { contains: string };
  };
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
            createdAt: dayjs().subtract(3, 'day').toISOString(),
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
            createdAt: dayjs().subtract(2, 'day').toISOString(),
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
  if (overrides.edges) {
    data.allUsers.edges = overrides.edges;
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

describe('OrganizationPeople', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('displays members list correctly', async () => {
    const mocks = [
      createMemberConnectionMock({
        orgId: 'orgid',
        first: 10,
        after: null,
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
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    // Verify email addresses are displayed
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  test('handles search functionality correctly', async () => {
    const initialMock = createMemberConnectionMock({
      orgId: 'orgid',
      first: 10,
      after: null,
    });

    const searchMock = createMemberConnectionMock(
      {
        orgId: 'orgid',
        first: 10,
        after: null,
        where: { firstName: { contains: 'Jane' } },
      },
      {
        edges: [
          {
            node: {
              id: 'member2',
              name: 'Jane Smith',
              emailAddress: 'jane@example.com',
              avatarURL: null,
              createdAt: dayjs().subtract(2, 'day').toISOString(),
              role: 'member',
            },
            cursor: 'cursor2',
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: 'cursor2',
          endCursor: 'cursor2',
        },
      },
    );

    const mocks = [initialMock, searchMock];
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

    // Search for "Jane"
    const searchInput = screen.getByTestId('searchbtn');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'Jane');

    // Wait for debounce (300ms default) plus some buffer
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
    });

    // Wait for search results
    await waitFor(
      () => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  test('handles tab switching between members, admins, and users', async () => {
    const membersMock = createMemberConnectionMock({
      orgId: 'orgid',
      first: 10,
      after: null,
    });

    const adminMock = createMemberConnectionMock(
      {
        orgId: 'orgid',
        first: 10,
        after: null,
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
              createdAt: dayjs().toISOString(),
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

    const usersMock = createUserListMock({
      first: 10,
      after: null,
    });

    const mocks = [membersMock, adminMock, usersMock];
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

    // Wait for initial members data
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Switch to admin tab
    const sortingButton = screen.getByTestId('sort');
    fireEvent.click(sortingButton);

    const adminOption = screen.getByText(/admin/i);
    fireEvent.click(adminOption);

    // Wait for admin data
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    // Switch to users tab
    fireEvent.click(sortingButton);
    const usersOption = screen.getByText(/users/i);
    fireEvent.click(usersOption);

    // Wait for users data
    await waitFor(() => {
      expect(screen.getByText('User One')).toBeInTheDocument();
      expect(screen.getByText('User Two')).toBeInTheDocument();
    });
  });

  test('handles load more functionality for members', async () => {
    const initialMock = createMemberConnectionMock({
      orgId: 'orgid',
      first: 10,
      after: null,
    });

    const loadMoreMock = createMemberConnectionMock(
      {
        orgId: 'orgid',
        first: 10,
        after: 'cursor2',
      },
      {
        edges: [
          {
            node: {
              id: 'member3',
              name: 'Bob Johnson',
              emailAddress: 'bob@example.com',
              avatarURL: null,
              createdAt: dayjs().toISOString(),
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

    const mocks = [initialMock, loadMoreMock];
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

    // Wait for initial data
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click load more button
    const loadMoreButton = screen.getByRole('button', { name: /load more/i });
    fireEvent.click(loadMoreButton);

    // Wait for more data to load
    await waitFor(() => {
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });
  });

  test('displays empty state when no members found', async () => {
    const emptyMock = createMemberConnectionMock(
      {
        orgId: 'orgid',
        first: 10,
        after: null,
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

    // Wait for empty state to appear
    await waitFor(() => {
      expect(
        screen.getByTestId('organization-people-empty-state'),
      ).toBeInTheDocument();
    });
  });

  test('handles GraphQL errors correctly', async () => {
    const errorMock = {
      request: {
        query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
        variables: {
          orgId: 'orgid',
          first: 10,
          after: null,
        },
      },
      error: new Error('GraphQL error occurred'),
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

    // Wait for error message to be displayed by CursorPaginationManager
    await waitFor(() => {
      expect(screen.getByTestId('cursor-pagination-error')).toBeInTheDocument();
      expect(screen.getByText('GraphQL error occurred')).toBeInTheDocument();
    });
  });

  test('opens and closes remove member modal', async () => {
    const mocks = [
      createMemberConnectionMock({
        orgId: 'orgid',
        first: 10,
        after: null,
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

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByTestId('removeMemberModalBtn');
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('remove-member-modal')).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(
        screen.queryByTestId('remove-member-modal'),
      ).not.toBeInTheDocument();
    });
  });

  test('handles member deletion', async () => {
    const initialMock = createMemberConnectionMock({
      orgId: 'orgid',
      first: 10,
      after: null,
    });

    const deleteMock = {
      request: {
        query: REMOVE_MEMBER_MUTATION_PG,
        variables: {
          memberId: 'member1',
          organizationId: 'orgid',
        },
      },
      result: {
        data: {
          deleteOrganizationMembership: {
            id: 'member1',
          },
        },
      },
    };

    const refetchMock = createMemberConnectionMock({
      orgId: 'orgid',
      first: 10,
      after: null,
    });

    const link = new StaticMockLink(
      [initialMock, deleteMock, refetchMock],
      true,
    );

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

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByTestId('removeMemberModalBtn');
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('remove-member-modal')).toBeInTheDocument();
    });

    const modal = screen.getByTestId('remove-member-modal');
    const confirmButton = within(modal).getByRole('button', {
      name: /remove/i,
    });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(
        screen.queryByTestId('remove-member-modal'),
      ).not.toBeInTheDocument();
    });
  });

  test('renders avatar image when avatarURL is present', async () => {
    const mocks = [
      createMemberConnectionMock({
        orgId: 'orgid',
        first: 10,
        after: null,
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
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Check for avatar image - use screen queries if alt text is available
    const avatarImages = screen.getAllByRole('img');
    const johnDoeAvatar = avatarImages.find(
      (img) => img.getAttribute('src') === 'https://example.com/avatar1.jpg',
    );
    expect(johnDoeAvatar).toBeInTheDocument();
  });

  test('disables remove button for users tab', async () => {
    const membersMock = createMemberConnectionMock({
      orgId: 'orgid',
      first: 10,
      after: null,
    });

    const usersMock = createUserListMock({
      first: 10,
      after: null,
    });

    const mocks = [membersMock, usersMock];
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

    // Wait for initial data
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Switch to users tab
    const sortingButton = screen.getByTestId('sort');
    fireEvent.click(sortingButton);
    const usersOption = screen.getByText(/users/i);
    fireEvent.click(usersOption);

    // Wait for users data
    await waitFor(() => {
      expect(screen.getByText('User One')).toBeInTheDocument();
    });

    // Remove buttons should be disabled
    const removeButtons = screen.getAllByTestId('removeMemberModalBtn');
    removeButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});

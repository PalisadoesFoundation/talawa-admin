import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi } from 'vitest';
import OrganizationPeople from './OrganizationPeople';
import i18nForTest from 'utils/i18nForTest';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST_FOR_TABLE,
} from 'GraphQl/Queries/Queries';
import { REMOVE_MEMBER_MUTATION_PG } from 'GraphQl/Mutations/mutations';
import { store } from 'state/store';
import { toast } from 'react-toastify';

// Mock the required modules
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('./AddMember', () => ({
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
const createMemberConnectionMock = (variables: any, overrides: any = {}) => {
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
              createdAt: '2023-01-01T00:00:00Z',
            },
            cursor: 'cursor1',
          },
          {
            node: {
              id: 'member2',
              name: 'Jane Smith',
              emailAddress: 'jane@example.com',
              avatarURL: null,
              createdAt: '2023-01-02T00:00:00Z',
            },
            cursor: 'cursor2',
          },
        ],
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

const createUserListMock = (variables: any, overrides: any = {}) => {
  const defaultData = {
    allUsers: {
      edges: [
        {
          node: {
            id: 'user1',
            name: 'User One',
            emailAddress: 'user1@example.com',
            avatarURL: 'https://example.com/avatar1.jpg',
            createdAt: '2023-01-01T00:00:00Z',
          },
          cursor: 'userCursor1',
        },
        {
          node: {
            id: 'user2',
            name: 'User Two',
            emailAddress: 'user2@example.com',
            avatarURL: null,
            createdAt: '2023-01-02T00:00:00Z',
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

// Helper for waiting
const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

describe('OrganizationPeople', () => {
  beforeEach(() => {
    setupLocationMock();
    vi.clearAllMocks();
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
      <MockedProvider addTypename={false} link={link}>
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

    // Initially should show loading state
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
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
      <MockedProvider addTypename={false} link={link}>
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
    expect(screen.getByText('01/01/2023')).toBeInTheDocument(); // Formatted date
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
      <MockedProvider addTypename={false} link={link}>
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
    const searchInput = screen.getByPlaceholderText(/Enter Full Name/i);
    await userEvent.type(searchInput, 'Jane');

    const searchButton = screen.getByTestId('searchbtn');
    fireEvent.click(searchButton);

    // Should show Jane but not John
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();

    // Clear search
    await userEvent.clear(searchInput);
    fireEvent.click(searchButton);

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
              createdAt: '2023-01-03T00:00:00Z',
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
      <MockedProvider addTypename={false} link={link}>
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
    const sortingButton = screen.getByText(/members/i);
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
        after: 'cursor1',
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
              createdAt: '2023-01-03T00:00:00Z',
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
      <MockedProvider addTypename={false} link={link}>
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
              createdAt: '2023-01-03T00:00:00Z',
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
              createdAt: '2023-01-03T00:00:00Z',
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
              createdAt: '2023-01-03T00:00:00Z',
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
      <MockedProvider addTypename={false} link={link}>
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
    const sortingButton = screen.getByText(/members/i);
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
        after: 'userCursor1',
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
              createdAt: '2023-01-03T00:00:00Z',
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
      <MockedProvider addTypename={false} link={link}>
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
    const sortingButton = screen.getByText(/members/i);
    fireEvent.click(sortingButton);

    const adminOption = screen.getByText(/user/i);
    fireEvent.click(adminOption);

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
              createdAt: '2023-01-03T00:00:00Z',
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
      <MockedProvider addTypename={false} link={link}>
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
    const sortingButton = screen.getByText(/members/i);
    fireEvent.click(sortingButton);

    const adminOption = screen.getByText(/ADMIN/i);
    fireEvent.click(adminOption);

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
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
      <MockedProvider addTypename={false} link={link}>
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
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('An error occurred');
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
      <MockedProvider addTypename={false} link={link}>
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
    const sortingButton = screen.getByText(/members/i);
    fireEvent.click(sortingButton);

    const adminOption = screen.getByText(/user/i);
    fireEvent.click(adminOption);

    // Wait for error handling
    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith('An error occurred');
    });
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
      <MockedProvider addTypename={false} link={link}>
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
      expect(toast.success).toHaveBeenCalled();
    });
  });
});

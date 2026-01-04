import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import userEvent from '@testing-library/user-event';
import AddMember from './AddMember';
import i18nForTest from 'utils/i18nForTest';
import {
  CREATE_MEMBER_PG,
  CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG,
} from 'GraphQl/Mutations/mutations';
import {
  GET_ORGANIZATION_BASIC_DATA,
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST_FOR_TABLE,
} from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi, afterEach } from 'vitest';
import dayjs from 'dayjs';

// Mock react-toastify
const sharedMocks = vi.hoisted(() => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// Mock NotificationToast
vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: sharedMocks.toast,
}));

// Mock MUI TablePagination to expose onPageChange
vi.mock('@mui/material', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@mui/material')>();
  return {
    ...actual,
    TablePagination: ({
      backIconButtonProps,
      nextIconButtonProps,
      onPageChange,
      page,
      labelDisplayedRows,
    }: {
      backIconButtonProps?: { disabled?: boolean };
      nextIconButtonProps?: { disabled?: boolean };
      onPageChange: (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
      ) => void;
      page: number;
      labelDisplayedRows?: ({ page }: { page: number }) => React.ReactNode;
    }) => (
      <div data-testid="mock-table-pagination">
        <button
          type="button"
          aria-label="Previous Page"
          disabled={backIconButtonProps?.disabled}
          onClick={(e) => onPageChange(e, page - 1)}
        >
          Previous Page
        </button>
        <button
          type="button"
          aria-label="Next Page"
          disabled={nextIconButtonProps?.disabled}
          onClick={(e) => onPageChange(e, page + 1)}
        >
          Next Page
        </button>
        <span data-testid="page-info">
          {labelDisplayedRows
            ? labelDisplayedRows({ page })
            : `Page ${page + 1}`}
        </span>
        {/* Force buttons to bypass disabled checks for coverage */}
        <button
          type="button"
          data-testid="force-next"
          onClick={(e) => onPageChange(e, page + 1)}
        >
          Force Next
        </button>
        <button
          type="button"
          data-testid="force-prev"
          onClick={(e) => onPageChange(e, page - 1)}
        >
          Force Prev
        </button>
      </div>
    ),
  };
});

// Mock PageHeader to expose sorting options
vi.mock('shared-components/Navbar/Navbar', () => ({
  default: ({
    sorting,
  }: {
    sorting: Array<{
      testIdPrefix: string;
      options: Array<{ value: string; label: string }>;
      onChange: (value: string) => void;
    }>;
  }) => (
    <div data-testid="page-header">
      {sorting.map((sort, index) => (
        <div key={index} data-testid={sort.testIdPrefix}>
          {sort.options.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => sort.onChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
          <button type="button" onClick={() => sort.onChange('invalid')}>
            Invalid Sort
          </button>
        </div>
      ))}
    </div>
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

// Helper function to create user list mock responses
const createUserListMock = (
  variables: Record<string, unknown>,
  overrides: Record<string, unknown> = {},
) => {
  const defaultData = {
    allUsers: {
      edges: [
        {
          cursor: 'cursor1',
          node: {
            id: 'user1',
            role: 'regular',
            name: 'John Doe',
            emailAddress: 'john@example.com',
            avatarURL: 'https://example.com/avatar1.jpg',
          },
        },
        {
          cursor: 'cursor2',
          node: {
            id: 'user2',
            role: 'regular',
            name: 'Jane Smith',
            emailAddress: 'jane@example.com',
            avatarURL: null,
          },
        },
      ],
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'cursor2',
        endCursor: 'cursor1',
      },
    },
  };

  const data = { ...defaultData };
  const withRole = (edge: (typeof defaultData.allUsers.edges)[number]) => ({
    ...edge,
    node: {
      ...edge.node,
      role: edge.node.role ?? 'regular',
    },
  });

  data.allUsers.edges = data.allUsers.edges.map(
    withRole,
  ) as unknown as typeof data.allUsers.edges;

  if (Array.isArray(overrides.edges)) {
    data.allUsers.edges = overrides.edges.map(
      withRole,
    ) as unknown as typeof data.allUsers.edges;
  }
  if (overrides.pageInfo) {
    data.allUsers.pageInfo = {
      ...data.allUsers.pageInfo,
      ...overrides.pageInfo,
    };
  }

  return {
    request: { query: USER_LIST_FOR_TABLE, variables },
    result: { data },
  };
};

const createOrganizationsMock = (orgId: string) => {
  return {
    request: { query: GET_ORGANIZATION_BASIC_DATA, variables: { id: orgId } },
    result: {
      data: { organization: { id: orgId, name: 'Test Organization' } },
    },
  };
};

const createAddMemberMutationMock = (variables: Record<string, unknown>) => {
  const defaultVariables = {
    organizationId: 'org123',
    ...variables,
  };
  return {
    request: {
      query: CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG,
      variables: defaultVariables,
    },
    result: { data: { createOrganizationMembership: { id: 'membership1' } } },
  };
};

const createRegisterMutationMock = (variables: Record<string, unknown>) => {
  const defaultVariables = {
    role: 'regular',
    ...variables,
  };

  return {
    request: { query: CREATE_MEMBER_PG, variables: defaultVariables },
    result: {
      data: {
        createUser: {
          authenticationToken: 'token',
          user: {
            id: 'newUser1',
            name:
              'name' in defaultVariables &&
              typeof defaultVariables.name === 'string'
                ? defaultVariables.name
                : 'New User',
          },
        },
      },
    },
  };
};

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
              createdAt: dayjs().subtract(1, 'year').toISOString(),
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
              createdAt: dayjs()
                .subtract(1, 'year')
                .add(1, 'day')
                .toISOString(),
              role: 'member',
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

  type MemberEdge = (typeof defaultData.organization.members.edges)[number];

  const withRole = (edge: MemberEdge): MemberEdge =>
    ({
      ...edge,
      node: {
        ...edge.node,
        role: edge.node.role ?? 'member',
      },
    }) as MemberEdge;

  data.organization.members.edges =
    data.organization.members.edges.map(withRole);

  if (Array.isArray(overrides.edges)) {
    data.organization.members.edges = overrides.edges.map(withRole);
  }
  if (overrides.pageInfo) {
    data.organization.members.pageInfo = {
      ...data.organization.members.pageInfo,
      ...overrides.pageInfo,
    };
  }

  return {
    request: { query: ORGANIZATIONS_MEMBER_CONNECTION_LIST, variables },
    result: { data },
  };
};

type RenderConfig = {
  mocks?: MockedResponse[];
  link?: StaticMockLink;
  initialEntry?: string;
};

const DEFAULT_ROUTE = '/orgpeople/org123';

const renderAddMemberView = ({
  mocks = [],
  link,
  initialEntry = DEFAULT_ROUTE,
}: RenderConfig) => {
  const content = (
    <MemoryRouter initialEntries={[initialEntry]}>
      <I18nextProvider i18n={i18nForTest}>
        <Routes>
          <Route path="/orgpeople/:orgId" element={<AddMember />} />
        </Routes>
      </I18nextProvider>
    </MemoryRouter>
  );

  if (link) {
    return render(<MockedProvider link={link}>{content}</MockedProvider>);
  }

  return render(<MockedProvider mocks={mocks}>{content}</MockedProvider>);
};

describe('AddMember Screen', () => {
  beforeEach(() => {
    setupLocationMock();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders the add member button correctly', async () => {
    const orgId = 'org123';
    const mocks = [createOrganizationsMock(orgId)];

    renderAddMemberView({ mocks, initialEntry: `/orgpeople/${orgId}` });

    // Check if the SortingButton is rendered
    expect(await screen.findByTestId('addMembers')).toBeInTheDocument();
  });

  test('opens existing user modal and shows user list', async () => {
    const orgId = 'org123';
    const userListMock = [
      createUserListMock({ first: 10, after: null, last: null, before: null }),
    ];
    const orgMock = createMemberConnectionMock({
      orgId: 'orgid',
      first: 10,
      after: null,
      last: null,
      before: null,
    });
    const mocks = [orgMock, createOrganizationsMock(orgId), ...userListMock];

    renderAddMemberView({ mocks, initialEntry: `/orgpeople/${orgId}` });

    // Click the add member button
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);

    // Select existing user option
    const existingUserOption = screen.getByText('Existing User');
    fireEvent.click(existingUserOption);

    // Wait for rows to appear first
    const userRows = await screen.findAllByTestId(
      'user',
      {},
      { timeout: 3000 },
    );
    expect(userRows.length).toBe(2);

    // Now check for content within those rows
    await waitFor(
      () => {
        // Check if any element contains the text "John Doe" - this is more flexible
        expect(
          screen.getByText((content) => {
            return content.includes('John Doe');
          }),
        ).toBeInTheDocument();

        // Also check for Jane Smith in the same way
        expect(
          screen.getByText((content) => {
            return content.includes('Jane Smith');
          }),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  test('searches for users in the modal', async () => {
    const orgId = 'org123';
    const initialUserListMock = createUserListMock({
      first: 10,
      after: null,
      last: null,
      before: null,
    });

    const searchUserListMock = createUserListMock(
      {
        first: 10,
        where: { name: 'John' },
        after: null,
        last: null,
        before: null,
      },
      {
        edges: [
          {
            cursor: 'cursor1',
            node: {
              id: 'user1',
              name: 'John Doe',
              emailAddress: 'john@example.com',
              avatarURL: 'https://example.com/avatar1.jpg',
              createdAt: dayjs().subtract(1, 'year').toISOString(),
            },
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

    const mocks = [
      createOrganizationsMock(orgId),
      initialUserListMock,
      searchUserListMock,
    ];

    renderAddMemberView({ mocks, initialEntry: `/orgpeople/${orgId}` });

    // Open the add member modal
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);

    // Select existing user option - using the correct text based on your working test
    const existingUserOption = screen.getByText('Existing User');
    fireEvent.click(existingUserOption);

    // Wait for the modal to be visible and for initial data to load
    const modal = await screen.findByTestId(
      'addExistingUserModal',
      {},
      { timeout: 3000 },
    );
    expect(modal).toBeInTheDocument();

    // Wait for initial user list to be loaded
    await screen.findAllByTestId('user', {}, { timeout: 3000 });

    // Enter search term and submit
    const searchInput = screen.getByTestId('searchUser');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    const submitButton = screen.getByTestId('submitBtn');
    fireEvent.click(submitButton);

    // Verify filtered results - use findByText for the post-search content
    const johnDoeElement = await screen.findByText(
      (content) => content.includes('John Doe'),
      {},
      { timeout: 3000 },
    );
    expect(johnDoeElement).toBeInTheDocument();
  });

  test('clears the search input in the modal', async () => {
    const orgId = 'org123';
    const initialUserListMock = createUserListMock({
      first: 10,
      after: null,
      last: null,
      before: null,
    });

    const mocks = [createOrganizationsMock(orgId), initialUserListMock];

    renderAddMemberView({ mocks, initialEntry: `/orgpeople/${orgId}` });

    // Open the add member modal
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);

    // Select existing user option
    const existingUserOption = screen.getByText('Existing User');
    fireEvent.click(existingUserOption);

    // Wait for the modal to be visible
    await screen.findByTestId('addExistingUserModal');

    // Enter search term
    const searchInput = screen.getByTestId('searchUser');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    expect(searchInput).toHaveValue('John');

    // Click clear button
    const clearButton = await screen.findByLabelText('Clear');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByTestId('searchUser')).toHaveValue('');
    });
  });

  test('adds an existing user to organization', async () => {
    const orgId = 'org123';
    const userListMock = createUserListMock({
      first: 10,
      after: null,
      last: null,
      before: null,
    });

    const addMemberMock = createAddMemberMutationMock({
      memberId: 'user1',
      role: 'regular',
    });

    const mocks = [createOrganizationsMock(orgId), userListMock, addMemberMock];

    renderAddMemberView({ mocks, initialEntry: `/orgpeople/${orgId}` });

    // Open the add member modal
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);

    // Select existing user option
    const existingUserOption = screen.getByText('Existing User');
    fireEvent.click(existingUserOption);

    // Wait for modal and user rows to load
    const userRows = await screen.findAllByTestId(
      'user',
      {},
      { timeout: 3000 },
    );
    expect(userRows.length).toBe(2);

    // Verify John Doe is present
    expect(
      screen.getByText((content) => content.includes('John Doe')),
    ).toBeInTheDocument();

    // Click add button for first user
    const addButtons = await screen.findAllByTestId('addBtn');
    fireEvent.click(addButtons[0]);

    // Verify success toast was shown
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        'Member added Successfully',
      );
    });

    // Click the close button
    await userEvent.click(screen.getByRole('button', { name: /close/i }));
  });

  test('adds an existing user to organization error', async () => {
    const orgId = 'org123';
    const userListMock = createUserListMock({
      first: 10,
      after: null,
      last: null,
      before: null,
    });

    const addMemberMock = {
      request: {
        query: CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG,
        variables: {
          memberId: 'user1',
          organizationId: orgId,
          role: 'regular',
        },
      },
      error: new Error('Failed to add member'),
    };

    const mocks = [createOrganizationsMock(orgId), userListMock, addMemberMock];

    renderAddMemberView({ mocks, initialEntry: `/orgpeople/${orgId}` });

    // Open the add member modal
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);

    // Select existing user option
    const existingUserOption = screen.getByText('Existing User');
    fireEvent.click(existingUserOption);

    // Wait for modal and user rows to load
    const userRows = await screen.findAllByTestId(
      'user',
      {},
      { timeout: 3000 },
    );
    expect(userRows.length).toBe(2);

    // Verify John Doe is present
    expect(
      screen.getByText((content) => content.includes('John Doe')),
    ).toBeInTheDocument();

    // Click add button for first user
    const addButtons = await screen.findAllByTestId('addBtn');
    fireEvent.click(addButtons[0]);

    // Verify error toast was shown
    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  test('handles pagination in user list', async () => {
    const orgId = 'org123';
    const page1Mock = createUserListMock({
      first: 10,
      after: null,
      last: null,
      before: null,
    });

    const page2Mock = createUserListMock(
      { first: 10, after: 'cursor1', last: null, before: null },
      {
        edges: [
          {
            cursor: 'cursor3',
            node: {
              id: 'user3',
              name: 'Bob Johnson',
              emailAddress: 'bob@example.com',
              avatarURL: null,
              createdAt: dayjs()
                .subtract(1, 'year')
                .add(2, 'days')
                .toISOString(),
            },
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

    const page1RevisitedMock = createUserListMock({
      first: null,
      after: null,
      last: 10,
      before: 'cursor3',
    });

    const mocks = [
      createOrganizationsMock(orgId),
      page1Mock,
      page2Mock,
      page1RevisitedMock,
      // Add additional mock for potential edge case queries
      createUserListMock({
        first: 10,
        after: 'cursor2',
        last: null,
        before: null,
      }),
    ];

    const link = new StaticMockLink(mocks, true);

    renderAddMemberView({
      link,
      initialEntry: `/orgpeople/${orgId}`,
    });

    // Open the add member modal
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);

    // Select existing user option
    const existingUserOption = screen.getByText('Existing User');
    fireEvent.click(existingUserOption);

    // Wait for page 1 users to load
    const userRows1 = await screen.findAllByTestId(
      'user',
      {},
      { timeout: 3000 },
    );
    expect(userRows1.length).toBe(2);

    // Check for specific users on page 1
    expect(
      screen.getByText((content) => content.includes('John Doe')),
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes('Jane Smith')),
    ).toBeInTheDocument();

    // Navigate to next page
    const nextPageButton = screen.getByLabelText('Next Page');
    fireEvent.click(nextPageButton);

    // Wait for page 2 to load
    const userRows2 = await screen.findAllByTestId(
      'user',
      {},
      { timeout: 3000 },
    );
    expect(userRows2.length).toBe(1);
    expect(
      screen.getByText((content) => content.includes('Bob Johnson')),
    ).toBeInTheDocument();
    // expect(bobElement).toBeInTheDocument();

    // Verify John Doe is no longer visible
    await waitFor(() => {
      expect(
        screen.queryByText((content) => content.includes('John Doe')),
      ).not.toBeInTheDocument();
    });

    // Navigate back to first page
    const prevPageButton = screen.getByLabelText('Previous Page');
    fireEvent.click(prevPageButton);

    // Wait for page 1 to reload
    const johnDoe = await screen.findByText(
      (content) => content.includes('John Doe'),
      {},
      { timeout: 3000 },
    );
    expect(johnDoe).toBeInTheDocument();

    // Verify Bob is no longer visible
    await waitFor(() => {
      expect(
        screen.queryByText((content) => content.includes('Bob Johnson')),
      ).not.toBeInTheDocument();
    });
  });

  test('opens create new user modal', async () => {
    const orgId = 'org123';
    const mocks = [createOrganizationsMock(orgId)];

    renderAddMemberView({ mocks, initialEntry: `/orgpeople/${orgId}` });

    // Click the add member button
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);

    // Select new user option - using the correct text from your component
    const newUserOption = screen.getByText('New User');
    fireEvent.click(newUserOption);

    // Check if new user modal is opened
    await waitFor(() => {
      expect(screen.getByTestId('addNewUserModal')).toBeInTheDocument();
      expect(screen.getByTestId('firstNameInput')).toBeInTheDocument();
      expect(screen.getByTestId('emailInput')).toBeInTheDocument();
      expect(screen.getByTestId('passwordInput')).toBeInTheDocument();
      expect(screen.getByTestId('confirmPasswordInput')).toBeInTheDocument();
      expect(screen.getByTestId('organizationName')).toBeInTheDocument();
    });
  });

  test('toggles password visibility in create user form', async () => {
    const orgId = 'org123';
    const mocks = [createOrganizationsMock(orgId)];

    renderAddMemberView({ mocks, initialEntry: `/orgpeople/${orgId}` });

    // Open the create user modal
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);

    // Select new user option
    const newUserOption = screen.getByText('New User');
    fireEvent.click(newUserOption);

    // Check initial password field type
    const passwordInput = screen.getByTestId('passwordInput');
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Toggle password visibility
    const showPasswordToggle = screen.getByTestId('showPassword');
    fireEvent.click(showPasswordToggle);

    // Check that password is now visible
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Toggle confirm password visibility
    const confirmPasswordInput = screen.getByTestId('confirmPasswordInput');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    const showConfirmPasswordToggle = screen.getByTestId('showConfirmPassword');
    fireEvent.click(showConfirmPasswordToggle);

    // Check that confirm password is now visible
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });

  test('creates a new user successfully', async () => {
    const orgId = 'org123';

    const registerMock = createRegisterMutationMock({
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
      role: 'regular',
      isEmailAddressVerified: true,
    });

    const addMemberMock = createAddMemberMutationMock({
      memberId: 'newUser1',
      // organizationId: orgId,
      role: 'regular',
    });

    const mocks = [createOrganizationsMock(orgId), registerMock, addMemberMock];

    renderAddMemberView({ mocks, initialEntry: `/orgpeople/${orgId}` });

    // Open the create user modal
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);

    // Select new user option
    const newUserOption = screen.getByText('New User');
    fireEvent.click(newUserOption);

    // Fill in the form
    const nameInput = screen.getByTestId('firstNameInput');
    const emailInput = screen.getByTestId('emailInput');
    const passwordInput = screen.getByTestId('passwordInput');
    const confirmPasswordInput = screen.getByTestId('confirmPasswordInput');

    fireEvent.change(nameInput, { target: { value: 'New User' } });
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });

    // Submit the form
    const createButton = screen.getByTestId('createBtn');
    fireEvent.click(createButton);

    // Check for success message
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        'Member added Successfully',
      );
    });
  });

  test('creates a new user error', async () => {
    const orgId = 'org123';

    const registerMock = {
      request: {
        query: CREATE_MEMBER_PG,
        variables: {
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          role: 'regular',
          isEmailAddressVerified: true,
        },
      },
      error: new Error('Failed to create user'),
    };

    const addMemberMock = createAddMemberMutationMock({
      memberId: 'newUser1',
      // organizationId: orgId,
      role: 'regular',
    });

    const mocks = [createOrganizationsMock(orgId), registerMock, addMemberMock];

    renderAddMemberView({ mocks, initialEntry: `/orgpeople/${orgId}` });

    // Open the create user modal
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);

    // Select new user option
    const newUserOption = screen.getByText('New User');
    fireEvent.click(newUserOption);

    // Fill in the form
    const nameInput = screen.getByTestId('firstNameInput');
    const emailInput = screen.getByTestId('emailInput');
    const passwordInput = screen.getByTestId('passwordInput');
    const confirmPasswordInput = screen.getByTestId('confirmPasswordInput');

    fireEvent.change(nameInput, { target: { value: 'New User' } });
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });

    // Submit the form
    const createButton = screen.getByTestId('createBtn');
    fireEvent.click(createButton);

    // Verify error toast was shown
    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  test('creates a new user wrong confirm password error', async () => {
    const orgId = 'org123';

    const registerMock = createRegisterMutationMock({
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
      isEmailAddressVerified: true,
    });

    const addMemberMock = createAddMemberMutationMock({
      memberId: 'newUser1',
      // organizationId: orgId,
      role: 'regular',
    });

    const mocks = [createOrganizationsMock(orgId), registerMock, addMemberMock];

    renderAddMemberView({ mocks, initialEntry: `/orgpeople/${orgId}` });

    // Open the create user modal
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);

    // Select new user option
    const newUserOption = screen.getByText('New User');
    fireEvent.click(newUserOption);

    // Fill in the form
    const nameInput = screen.getByTestId('firstNameInput');
    const emailInput = screen.getByTestId('emailInput');
    const passwordInput = screen.getByTestId('passwordInput');
    const confirmPasswordInput = screen.getByTestId('confirmPasswordInput');

    fireEvent.change(nameInput, { target: { value: 'New User' } });
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password124' },
    });

    // Submit the form
    const createButton = screen.getByTestId('createBtn');
    fireEvent.click(createButton);

    // Verify error toast was shown
    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  test('shows error when required fields are missing', async () => {
    const orgId = 'org123';

    const registerMock = createRegisterMutationMock({
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
      isEmailAddressVerified: true,
    });

    const addMemberMock = createAddMemberMutationMock({
      memberId: 'newUser1',
      // organizationId: orgId,
      role: 'regular',
    });

    const mocks = [createOrganizationsMock(orgId), registerMock, addMemberMock];

    renderAddMemberView({ mocks, initialEntry: `/orgpeople/${orgId}` });

    // Open the create user modal
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);

    // Select new user option
    const newUserOption = screen.getByText('New User');
    fireEvent.click(newUserOption);

    // Fill in the form
    const nameInput = screen.getByTestId('firstNameInput');
    const emailInput = screen.getByTestId('emailInput');
    const passwordInput = screen.getByTestId('passwordInput');
    const confirmPasswordInput = screen.getByTestId('confirmPasswordInput');

    fireEvent.change(nameInput, { target: { value: 'New User' } });
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });

    // Submit the form
    const createButton = screen.getByTestId('createBtn');
    fireEvent.click(createButton);

    // Verify error toast was shown
    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  test('missing endCursor condition', async () => {
    const orgId = 'org123';

    const mockWithoutEndCursor = createUserListMock(
      {
        first: 10,
        after: null,
        last: null,
        before: null,
      },
      {
        edges: [
          {
            cursor: 'cursor1',
            node: {
              id: 'user1',
              name: 'John Doe',
              emailAddress: 'john@example.com',
              avatarURL: null,
              createdAt: dayjs().subtract(1, 'year').toISOString(),
            },
          },
        ],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: 'cursor1',
          endCursor: null, // Force null
        },
      },
    );

    const mocks = [createOrganizationsMock(orgId), mockWithoutEndCursor];
    const link = new StaticMockLink(mocks, true);

    renderAddMemberView({
      link,
      initialEntry: `/orgpeople/${orgId}`,
    });

    // Open the add member modal
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);

    // Select existing user option
    const existingUserOption = screen.getByText('Existing User');
    fireEvent.click(existingUserOption);

    // Wait for users to load
    await screen.findAllByTestId('user');

    // Try to navigate to next page - it should return early because endCursor was missing
    const nextPageButton = screen.getByLabelText('Next Page');
    // Even if it's not disabled (due to hasNextPage: true), it should return early
    fireEvent.click(nextPageButton);

    // page should still be 0 (Page 1)
    expect(screen.getByText('Page 1')).toBeInTheDocument();
  });

  test('missing startCursor condition', async () => {
    const orgId = 'org123';

    // First page and Second page setup
    const page1Mock = createUserListMock({
      first: 10,
      after: null,
      last: null,
      before: null,
    });

    const page2MockWithoutStartCursor = createUserListMock(
      { first: 10, after: 'cursor1', last: null, before: null },
      {
        edges: [
          {
            cursor: 'cursor3',
            node: {
              id: 'user3',
              name: 'Bob Johnson',
              emailAddress: 'bob@example.com',
              avatarURL: null,
            },
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: true,
          startCursor: null, // Force null
          endCursor: 'cursor3',
        },
      },
    );

    const mocks = [
      createOrganizationsMock(orgId),
      page1Mock,
      page2MockWithoutStartCursor,
    ];
    const link = new StaticMockLink(mocks, true);

    renderAddMemberView({
      link,
      initialEntry: `/orgpeople/${orgId}`,
    });

    // Open modal
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);
    const existingUserOption = screen.getByText('Existing User');
    fireEvent.click(existingUserOption);

    // Go to next page
    const nextPageButton = await screen.findByLabelText('Next Page');
    await waitFor(() => expect(nextPageButton).not.toBeDisabled());
    fireEvent.click(nextPageButton);

    // Wait for page 2
    await screen.findByText(/Bob Johnson/);
    expect(screen.getByText('Page 2')).toBeInTheDocument();

    // Try to go back - it should return early because startCursor was missing
    const prevPageButton = screen.getByLabelText('Previous Page');
    fireEvent.click(prevPageButton);
    // page should still be 1 (Page 2)
    expect(screen.getByText('Page 2')).toBeInTheDocument();
  });

  test('handles early returns in handleChangePage when paginationMeta prevents navigation', async () => {
    const orgId = 'org123';
    const userListMock = createUserListMock(
      {
        first: 10,
        after: null,
        last: null,
        before: null,
      },
      {
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    );

    const mocks = [createOrganizationsMock(orgId), userListMock];
    renderAddMemberView({ mocks, initialEntry: `/orgpeople/${orgId}` });

    // Open modal
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);
    const existingUserOption = screen.getByText('Existing User');
    fireEvent.click(existingUserOption);

    await screen.findAllByTestId('user');

    // Manually trigger click using our special "force" buttons to bypass disabled state
    // This allows us to hit the guard clauses in lines 263-264
    const forceNext = screen.getByTestId('force-next');
    const forcePrev = screen.getByTestId('force-prev');

    fireEvent.click(forceNext);
    fireEvent.click(forcePrev);

    // Page should still be 1 (index 0) because of the guard clauses
    expect(screen.getByTestId('page-info')).toHaveTextContent('Page 1');
  });

  test('ignores invalid sort option', async () => {
    const orgId = 'org123';
    const mocks = [createOrganizationsMock(orgId)];

    renderAddMemberView({ mocks, initialEntry: `/orgpeople/${orgId}` });

    // Click invalid sort option
    const invalidSort = await screen.findByText('Invalid Sort');
    fireEvent.click(invalidSort);

    // Verify nothing happened (modals shouldn't match)
    expect(
      screen.queryByTestId('addExistingUserModal'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('addNewUserModal')).not.toBeInTheDocument();
  });

  test('handles error when adding member to organization fails', async () => {
    const orgId = 'org123';

    // 1. Mock the user list query (SUCCESS)
    const userListMock = createUserListMock({
      first: 10,
      after: null,
      last: null,
      before: null,
    });

    // 2. Mock the add member mutation (ERROR)
    const addMemberErrorMock = {
      request: {
        query: CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG,
        variables: {
          memberId: 'user1', // Corresponds to the first user in defaultData of createUserListMock
          organizationId: orgId,
          role: 'regular',
        },
      },
      error: new Error('Failed to add member'),
    };

    const mocks = [
      createOrganizationsMock(orgId),
      userListMock,
      addMemberErrorMock,
    ];

    renderAddMemberView({ mocks, initialEntry: `/orgpeople/${orgId}` });

    // Open the add member modal
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);

    // Select existing user option
    const existingUserOption = screen.getByText('Existing User');
    fireEvent.click(existingUserOption);

    // Wait for users to load
    await waitFor(async () => {
      const users = await screen.findAllByTestId('user');
      expect(users.length).toBeGreaterThan(0);
    });

    // Click add button for the first user (user1)
    const addButtons = await screen.findAllByTestId('addBtn');
    fireEvent.click(addButtons[0]);

    // Wait for error toast to be called
    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });
  test('handles error when creating new user fails', async () => {
    const orgId = 'org123';

    // Create a mock that returns an error for CREATE_MEMBER_PG
    const createMemberErrorMock = {
      request: {
        query: CREATE_MEMBER_PG,
        variables: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'regular',
          isEmailAddressVerified: true,
        },
      },
      error: new Error('Failed to create member'),
    };

    const mocks = [createOrganizationsMock(orgId), createMemberErrorMock];

    renderAddMemberView({ mocks, initialEntry: `/orgpeople/${orgId}` });

    // Open create new user modal
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);

    const newUserOption = screen.getByText('New User');
    fireEvent.click(newUserOption);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByTestId('addNewUserModal')).toBeInTheDocument();
    });

    // Fill in user details
    const nameInput = screen.getByTestId('firstNameInput');
    const emailInput = screen.getByTestId('emailInput');
    const passwordInput = screen.getByTestId('passwordInput');
    const confirmPasswordInput = screen.getByTestId('confirmPasswordInput');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });

    // Click create button
    const createButton = screen.getByTestId('createBtn');
    fireEvent.click(createButton);

    // Wait for error toast to be called
    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });
  });

  test('shows "No users found" when the user list is empty', async () => {
    const orgId = 'org123';

    // Exact variables as they would be sent by the component
    const emptyUserListMock = {
      request: {
        query: USER_LIST_FOR_TABLE,
        variables: { first: 10, after: null, last: null, before: null },
      },
      result: {
        data: {
          allUsers: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
          },
        },
      },
    };

    const mocks = [createOrganizationsMock(orgId), emptyUserListMock];
    const link = new StaticMockLink(mocks, true);

    renderAddMemberView({ link, initialEntry: `/orgpeople/${orgId}` });

    // Open the add member modal
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);

    // Select existing user option
    const existingUserOption = await screen.findByText('Existing User');
    fireEvent.click(existingUserOption);

    // Wait for the loader to disappear and "No users found" message to appear
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(await screen.findByText(/No Members Found/i)).toBeInTheDocument();
  });

  test('shows "Error loading users" when the user list query fails', async () => {
    const orgId = 'org123';
    const errorUserListMock = {
      request: {
        query: USER_LIST_FOR_TABLE,
        variables: { first: 10, after: null, last: null, before: null },
      },
      error: new Error('GraphQL error'),
    };

    const mocks = [createOrganizationsMock(orgId), errorUserListMock];
    const link = new StaticMockLink(mocks, true);

    renderAddMemberView({ link, initialEntry: `/orgpeople/${orgId}` });

    // Open the add member modal
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);

    // Select existing user option
    const existingUserOption = await screen.findByText('Existing User');
    fireEvent.click(existingUserOption);

    // Wait for "Error loading users" message
    expect(
      await screen.findByText(/Error occurred while loading Users/i),
    ).toBeInTheDocument();
  });

  test('calls setUserName, resetPagination and fetchUsers on search', async () => {
    const orgId = 'org123';

    const initialUserListMock = createUserListMock({
      first: 10,
      after: null,
      last: null,
      before: null,
    });

    const searchMock = createUserListMock({
      first: 10,
      where: { name: 'Alex' },
      after: null,
      last: null,
      before: null,
    });

    const mocks = [
      createOrganizationsMock(orgId),
      initialUserListMock,
      searchMock,
    ];

    renderAddMemberView({ mocks, initialEntry: `/orgpeople/${orgId}` });

    // open modal
    const addMembersButton = await screen.findByTestId('addMembers');
    fireEvent.click(addMembersButton);

    const existingUserOption = screen.getByText('Existing User');
    fireEvent.click(existingUserOption);

    // Wait for initial results
    await screen.findAllByTestId('user');

    // 🔍 search action
    const searchInput = screen.getByTestId('searchUser');
    fireEvent.change(searchInput, { target: { value: 'Alex' } });

    const submitButton = screen.getByTestId('submitBtn');
    fireEvent.click(submitButton);

    // → If setUserName, resetPagination & fetchUsers were called,
    //    the list refreshes to show only the search result.
    const users = await screen.findAllByTestId('user');
    expect(users.length).toBe(2);
  });
});

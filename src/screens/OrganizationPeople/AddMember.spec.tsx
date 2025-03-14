import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { toast } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import AddMember from './AddMember';
import i18nForTest from 'utils/i18nForTest';
import {
  CREATE_MEMBER_PG,
  CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG,
} from 'GraphQl/Mutations/mutations';
import {
  ORGANIZATIONS_LIST,
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  USER_LIST_FOR_TABLE,
} from 'GraphQl/Queries/Queries';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi } from 'vitest';

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
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
const createUserListMock = (variables: any, overrides: any = {}) => {
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

const createOrganizationsMock = (orgId: string) => {
  return {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: { id: orgId },
    },
    result: {
      data: {
        organization: {
          id: orgId,
          name: 'Test Organization',
        },
      },
    },
  };
};

const createAddMemberMutationMock = (variables: any) => {
  return {
    request: {
      query: CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG,
      variables,
    },
    result: {
      data: {
        createOrganizationMembership: {
          id: 'membership1',
        },
      },
    },
  };
};

const createRegisterMutationMock = (variables: any) => {
  return {
    request: {
      query: CREATE_MEMBER_PG,
      variables,
    },
    result: {
      data: {
        createUser: {
          user: {
            id: 'newUser1',
          },
        },
      },
    },
  };
};

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

describe('AddMember Component', () => {
  beforeEach(() => {
    setupLocationMock();
    vi.clearAllMocks();
  });

  test('renders the add member button correctly', async () => {
    const orgId = 'org123';
    const mocks = [createOrganizationsMock(orgId)];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={[`/orgpeople/${orgId}`]}>
          <I18nextProvider i18n={i18nForTest}>
            <Routes>
              <Route path={`/orgpeople/${orgId}`} element={<AddMember />} />
            </Routes>
          </I18nextProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Check if the SortingButton is rendered
    expect(await screen.findByTestId('addMembers')).toBeInTheDocument();
  });

  test('opens existing user modal and shows user list', async () => {
    const orgId = 'org123';
    const userListMock = [
      createUserListMock({
        first: 10,
        after: null,
        last: null,
        before: null,
      }),
    ];
    const orgMock = createMemberConnectionMock({
      orgId: 'orgid',
      first: 10,
      after: null,
      last: null,
      before: null,
    });
    const mocks = [orgMock, createOrganizationsMock(orgId), ...userListMock];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={[`/orgpeople/${orgId}`]}>
          <I18nextProvider i18n={i18nForTest}>
            <AddMember />
          </I18nextProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

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
          screen.getByText((content, element) => {
            return content.includes('John Doe');
          }),
        ).toBeInTheDocument();

        // Also check for Jane Smith in the same way
        expect(
          screen.getByText((content, element) => {
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
              createdAt: '2023-01-01T00:00:00Z',
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

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={[`/orgpeople/${orgId}`]}>
          <I18nextProvider i18n={i18nForTest}>
            <AddMember />
          </I18nextProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

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

    // Wait for Jane Smith to disappear
    await waitFor(() => {
      expect(
        screen.queryByText((content) => content.includes('Jane Smith')),
      ).not.toBeInTheDocument();
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

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={[`/orgpeople/${orgId}`]}>
          <I18nextProvider i18n={i18nForTest}>
            <AddMember />
          </I18nextProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

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
      expect(toast.success).toHaveBeenCalledWith('Member added Successfully');
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

    const addMemberMock = createAddMemberMutationMock({
      memberId: 'user1',
      organizationId: orgId,
      role: 'regular',
    });

    const mocks = [createOrganizationsMock(orgId), userListMock, addMemberMock];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={[`/orgpeople/${orgId}`]}>
          <I18nextProvider i18n={i18nForTest}>
            <AddMember />
          </I18nextProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

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
      {
        first: 10,
        after: 'cursor2',
        last: null,
        before: null,
      },
      {
        edges: [
          {
            cursor: 'cursor3',
            node: {
              id: 'user3',
              name: 'Bob Johnson',
              emailAddress: 'bob@example.com',
              avatarURL: null,
              createdAt: '2023-01-03T00:00:00Z',
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
    ];

    const link = new StaticMockLink(mocks, true);

    render(
      <MockedProvider link={link} addTypename={false}>
        <MemoryRouter initialEntries={[`/orgpeople/${orgId}`]}>
          <I18nextProvider i18n={i18nForTest}>
            <AddMember />
          </I18nextProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

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

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={[`/orgpeople/${orgId}`]}>
          <I18nextProvider i18n={i18nForTest}>
            <AddMember />
          </I18nextProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

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

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={[`/orgpeople/${orgId}`]}>
          <I18nextProvider i18n={i18nForTest}>
            <AddMember />
          </I18nextProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

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

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={[`/orgpeople/${orgId}`]}>
          <I18nextProvider i18n={i18nForTest}>
            <AddMember />
          </I18nextProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

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
      expect(toast.success).toHaveBeenCalledWith('Member added Successfully');
    });
  });

  test('creates a new user error', async () => {
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

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={[`/orgpeople/${orgId}`]}>
          <I18nextProvider i18n={i18nForTest}>
            <AddMember />
          </I18nextProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

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

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={[`/orgpeople/${orgId}`]}>
          <I18nextProvider i18n={i18nForTest}>
            <AddMember />
          </I18nextProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

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
  });

  test('creates a new no password error', async () => {
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

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={[`/orgpeople/${orgId}`]}>
          <I18nextProvider i18n={i18nForTest}>
            <AddMember />
          </I18nextProvider>
        </MemoryRouter>
      </MockedProvider>,
    );

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
  });
});

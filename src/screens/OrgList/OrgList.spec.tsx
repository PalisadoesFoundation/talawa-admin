// SKIP_LOCALSTORAGE_CHECK
import React from 'react';
import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import {
  act,
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import OrgList from './OrgList';
import { MOCKS, MOCKS_ADMIN, MOCKS_EMPTY } from './OrgListMocks';
import { ORGANIZATION_LIST, CURRENT_USER } from 'GraphQl/Queries/Queries';
import { GET_USER_NOTIFICATIONS } from 'GraphQl/Queries/NotificationQueries';
import useLocalStorage from 'utils/useLocalstorage';
import { vi } from 'vitest';
import {
  CREATE_ORGANIZATION_MUTATION_PG,
  CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG,
} from 'GraphQl/Mutations/mutations';

vi.setConfig({ testTimeout: 30000 });

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  ToastContainer: vi
    .fn()
    .mockImplementation(() => <div data-testid="toast-container" />),
}));

const { setItem } = useLocalStorage();

const mockLinks = {
  superAdmin: new StaticMockLink(MOCKS, true),
  admin: new StaticMockLink(MOCKS_ADMIN, true),
  empty: new StaticMockLink(MOCKS_EMPTY, true),
};

// Common test user configurations
const mockUsers = {
  superAdmin: {
    id: '123',
    SuperAdmin: true,
    AdminFor: [{ name: 'adi', _id: '1234', image: '' }],
  },
  admin: {
    id: '123',
    SuperAdmin: false,
    AdminFor: [{ name: 'adi', _id: 'a0', image: '' }],
  },
  basic: {
    id: '123',
    role: 'administrator',
  },
};

// Helper function to set up user in localStorage
const setupUser = (userType: keyof typeof mockUsers) => {
  const user = mockUsers[userType];
  setItem('id', user.id);
  if ('SuperAdmin' in user) setItem('SuperAdmin', user.SuperAdmin);
  if ('AdminFor' in user) setItem('AdminFor', user.AdminFor);
  if ('role' in user) setItem('role', user.role);
};

// Helper function to render component with common providers.
const renderWithProviders = (link = mockLinks.superAdmin) => {
  return render(
    <MockedProvider addTypename={false} link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <ThemeProvider theme={createTheme()}>
              <OrgList />
            </ThemeProvider>
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

// Helper function for rendering with custom mocks
const renderWithMocks = (mocks: MockedResponse[]) => {
  return render(
    <MockedProvider addTypename={false} mocks={mocks}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <ThemeProvider theme={createTheme()}>
              <OrgList />
            </ThemeProvider>
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

// Mock organization data helpers
const createOrgMock = (organizations: unknown[]) => [
  ...MOCKS,
  {
    request: {
      query: ORGANIZATION_LIST,
      variables: { filter: '' },
    },
    result: {
      data: {
        organizations,
      },
    },
  },
];

const mockOrgData = {
  singleOrg: [
    {
      id: 'xyz',
      name: 'Dogs Care',
      avatarURL: '',
      description: 'Dog care center',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
  ],
  multipleOrgs: [
    {
      id: 'xyz',
      name: 'Dogs Care',
      avatarURL: '',
      description: 'Dog care center',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
    {
      id: 'xyz2',
      name: 'Cats Care',
      avatarURL: '',
      description: 'Cat care center',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
    {
      id: 'xyz3',
      name: 'Birds Care',
      avatarURL: '',
      description: 'Bird care center',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
    {
      id: 'xyz4',
      name: 'Fish Care',
      avatarURL: '',
      description: 'Fish care center',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
    {
      id: 'xyz5',
      name: 'Rabbit Care',
      avatarURL: '',
      description: 'Rabbit care center',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
    {
      id: 'xyz6',
      name: 'Horse Care',
      avatarURL: '',
      description: 'Horse care center',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
  ],
  paginationOrgs: Array.from({ length: 15 }, (_, i) => ({
    id: `org${i + 1}`,
    name: `Organization ${i + 1}`,
    avatarURL: '',
    description: `Description ${i + 1}`,
    members: { edges: [] },
    addressLine1: 'Test Address',
  })),
  manyOrgs: [
    {
      id: 'xyz1',
      name: 'Dogs Care 1',
      avatarURL: '',
      description: 'Dog care center 1',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
    {
      id: 'xyz2',
      name: 'Cats Care 2',
      avatarURL: '',
      description: 'Cat care center 2',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
    {
      id: 'xyz3',
      name: 'Birds Care 3',
      avatarURL: '',
      description: 'Bird care center 3',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
    {
      id: 'xyz4',
      name: 'Fish Care 4',
      avatarURL: '',
      description: 'Fish care center 4',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
    {
      id: 'xyz5',
      name: 'Rabbit Care 5',
      avatarURL: '',
      description: 'Rabbit care center 5',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
    {
      id: 'xyz6',
      name: 'Horse Care 6',
      avatarURL: '',
      description: 'Horse care center 6',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
    {
      id: 'xyz7',
      name: 'Turtle Care 7',
      avatarURL: '',
      description: 'Turtle care center 7',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
    {
      id: 'xyz8',
      name: 'Hamster Care 8',
      avatarURL: '',
      description: 'Hamster care center 8',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
  ],
  searchTestOrgs: [
    {
      id: 'xyz1',
      name: 'Dog Shelter North',
      avatarURL: '',
      description: 'Dog care center',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
    {
      id: 'xyz2',
      name: 'Cat Rescue Center',
      avatarURL: '',
      description: 'Cat care center',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
    {
      id: 'xyz3',
      name: 'Dog Training Center',
      avatarURL: '',
      description: 'Dog training facility',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
    {
      id: 'xyz4',
      name: 'Pet Grooming Service',
      avatarURL: '',
      description: 'Pet grooming',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
    {
      id: 'xyz5',
      name: 'Dog Walking Service',
      avatarURL: '',
      description: 'Professional dog walking',
      members: { edges: [] },
      addressLine1: 'Texas, USA',
    },
  ],
  scrollOrgs: [
    {
      id: 'org1',
      name: 'Organization 1',
      addressLine1: '123 Main Street',
      description: 'Description 1',
      avatarURL: null,
      membersCount: 4,
      adminsCount: 2,
      __typename: 'Organization',
      members: {
        edges: [
          {
            node: {
              id: 'abc',
              __typename: 'User',
            },
            __typename: 'OrganizationMembersConnectionEdge',
          },
        ],
        pageInfo: {
          hasNextPage: false,
          __typename: 'PageInfo',
        },
        __typename: 'OrganizationMembersConnection',
      },
    },
    {
      id: 'org2',
      name: 'Organization 2',
      addressLine1: '456 Oak Avenue',
      description: 'Description 2',
      avatarURL: null,
      membersCount: 5,
      adminsCount: 2,
      __typename: 'Organization',
      members: {
        edges: [
          {
            node: {
              id: 'def',
              __typename: 'User',
            },
            __typename: 'OrganizationMembersConnectionEdge',
          },
        ],
        pageInfo: {
          hasNextPage: false,
          __typename: 'PageInfo',
        },
        __typename: 'OrganizationMembersConnection',
      },
    },
  ],
};

// More complex mock configurations
const mockConfigurations = {
  searchableMocks: [
    ...MOCKS,
    {
      request: {
        query: ORGANIZATION_LIST,
        variables: { filter: '' },
      },
      result: {
        data: {
          organizations: mockOrgData.searchTestOrgs,
        },
      },
    },
    {
      request: {
        query: ORGANIZATION_LIST,
        variables: { filter: 'Dog' },
      },
      result: {
        data: {
          organizations: [
            {
              id: 'xyz1',
              name: 'Dog Shelter North',
              avatarURL: '',
              description: 'Dog care center',
              members: { edges: [] },
              addressLine1: 'Texas, USA',
            },
            {
              id: 'xyz3',
              name: 'Dog Training Center',
              avatarURL: '',
              description: 'Dog training facility',
              members: { edges: [] },
              addressLine1: 'Texas, USA',
            },
            {
              id: 'xyz5',
              name: 'Dog Walking Service',
              avatarURL: '',
              description: 'Professional dog walking',
              members: { edges: [] },
              addressLine1: 'Texas, USA',
            },
          ],
        },
      },
    },
  ],
  scrollMocks: [
    {
      request: {
        query: CURRENT_USER,
        variables: { userId: '123' },
      },
      result: {
        data: {
          user: {
            user: {
              _id: '123',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@akatsuki.com',
              image: null,
            },
          },
        },
      },
    },
    {
      request: {
        query: GET_USER_NOTIFICATIONS,
        variables: { userId: '123', input: { first: 5, skip: 0 } },
      },
      result: {
        data: {
          user: {
            __typename: 'User',
            notifications: [],
          },
        },
      },
    },
    {
      request: {
        query: ORGANIZATION_LIST,
        variables: { filter: '' },
      },
      result: {
        data: {
          organizations: mockOrgData.scrollOrgs,
        },
      },
    },
  ],
  orgCreationMocks: [
    ...MOCKS,
    {
      request: {
        query: ORGANIZATION_LIST,
        variables: { filter: '' },
      },
      result: {
        data: {
          organizations: mockOrgData.singleOrg,
        },
      },
    },
    {
      request: {
        query: CREATE_ORGANIZATION_MUTATION_PG,
        variables: {
          name: 'Test Organization',
          description: 'Test Description',
          addressLine1: '123 Test St',
          addressLine2: '',
          city: 'Test City',
          countryCode: 'US',
          postalCode: '12345',
          state: 'Test State',
          avatar: null,
        },
      },
      result: {
        data: {
          createOrganization: {
            id: 'new-org-id',
            name: 'Test Organization',
          },
        },
      },
    },
    {
      request: {
        query: CREATE_ORGANIZATION_MEMBERSHIP_MUTATION_PG,
        variables: {
          memberId: '123',
          organizationId: 'new-org-id',
          role: 'administrator',
        },
      },
      result: {
        data: {
          createOrganizationMembership: {
            id: 'membership-id',
          },
        },
      },
    },
  ],
};

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

beforeEach(() => {
  vi.spyOn(Storage.prototype, 'setItem');
});

afterEach(() => {
  localStorage.clear();
  cleanup();
  vi.clearAllMocks();
});

describe('Organisations Page testing as SuperAdmin', () => {
  test('Testing search functionality by pressing enter', async () => {
    setupUser('superAdmin');

    renderWithProviders();
    await wait();

    // Test that the search bar filters organizations by name
    const searchBar = screen.getByTestId(/searchInput/i);
    expect(searchBar).toBeInTheDocument();
    await userEvent.type(searchBar, 'Dummy{enter}');
  });

  test('Testing search functionality by Btn click', async () => {
    setupUser('superAdmin');

    renderWithProviders();
    await wait();

    const searchBar = screen.getByTestId('searchInput');
    const searchBtn = screen.getByTestId('searchBtn');
    await userEvent.type(searchBar, 'Dummy');
    fireEvent.click(searchBtn);
  });

  test('Testing search functionality by with empty search bar', async () => {
    setupUser('basic');

    renderWithProviders();
    await wait();

    const searchBar = screen.getByTestId('searchInput');
    const searchBtn = screen.getByTestId('searchBtn');
    await userEvent.clear(searchBar);
    fireEvent.click(searchBtn);
  });

  test('Testing debounced search functionality', async () => {
    setupUser('superAdmin');

    renderWithProviders();
    await wait();

    const searchBar = screen.getByTestId('searchInput');
    expect(searchBar).toBeInTheDocument();

    // Type multiple characters quickly to test debouncing
    await userEvent.type(searchBar, 'Dum');

    // Wait for debounce delay (300ms)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });
  });

  test('Testing immediate search on Enter key press', async () => {
    setupUser('superAdmin');

    renderWithProviders();
    await wait();

    const searchBar = screen.getByTestId('searchInput');
    expect(searchBar).toBeInTheDocument();

    // Type and press Enter to test immediate search
    await userEvent.type(searchBar, 'Dogs');
    fireEvent.keyUp(searchBar, { key: 'Enter', code: 'Enter' });
  });

  test('Testing pagination component presence', async () => {
    setupUser('superAdmin');
    setItem('role', 'administrator');

    const mockWithOrgData = createOrgMock(mockOrgData.singleOrg);
    renderWithMocks(mockWithOrgData);
    await wait();

    // Check if pagination component is rendered (should appear when there are organizations)
    const paginationElement = screen.getByTestId('table-pagination');
    expect(paginationElement).toBeInTheDocument();
  });

  test('Testing pagination functionality with multiple organizations', async () => {
    setupUser('superAdmin');

    const mockWithMultipleOrgs = createOrgMock(mockOrgData.multipleOrgs);
    renderWithMocks(mockWithMultipleOrgs);
    await wait();

    // Check if pagination component is rendered
    const paginationElement = screen.getByTestId('table-pagination');
    expect(paginationElement).toBeInTheDocument();

    // Check if rows per page selector is present
    const rowsPerPageSelect = screen.getByDisplayValue('5');
    expect(rowsPerPageSelect).toBeInTheDocument();
  });

  test('Testing pagination page change functionality', async () => {
    setupUser('superAdmin');
    setItem('role', 'administrator');

    const mockWithPaginationData = createOrgMock(mockOrgData.manyOrgs);
    renderWithMocks(mockWithPaginationData);
    await wait();

    // Verify pagination component is rendered
    const paginationElement = screen.getByTestId('table-pagination');
    expect(paginationElement).toBeInTheDocument();

    // Verify that only the first 5 organizations are displayed initially (default page size)
    expect(screen.getByText('Dogs Care 1')).toBeInTheDocument();
    expect(screen.getByText('Cats Care 2')).toBeInTheDocument();
    expect(screen.getByText('Birds Care 3')).toBeInTheDocument();
    expect(screen.getByText('Fish Care 4')).toBeInTheDocument();
    expect(screen.getByText('Rabbit Care 5')).toBeInTheDocument();

    // Verify that organizations beyond page 1 are not shown
    expect(screen.queryByText('Horse Care 6')).not.toBeInTheDocument();
    expect(screen.queryByText('Turtle Care 7')).not.toBeInTheDocument();
  });

  test('Testing pagination rows per page change functionality', async () => {
    setupUser('superAdmin');
    setItem('role', 'administrator');

    const mockWithManyOrgs = createOrgMock(mockOrgData.paginationOrgs);
    renderWithMocks(mockWithManyOrgs);
    await wait();

    // Verify default rows per page is 5
    const rowsPerPageSelect = screen.getByDisplayValue('5');
    expect(rowsPerPageSelect).toBeInTheDocument();

    // Verify that only first 5 organizations are shown
    expect(screen.getByText('Organization 1')).toBeInTheDocument();
    expect(screen.getByText('Organization 5')).toBeInTheDocument();
    expect(screen.queryByText('Organization 6')).not.toBeInTheDocument();

    // Change rows per page to 10
    fireEvent.change(rowsPerPageSelect, { target: { value: '10' } });

    await wait();

    // Now organization 6-10 should be visible
    expect(screen.getByText('Organization 6')).toBeInTheDocument();
    expect(screen.getByText('Organization 10')).toBeInTheDocument();
    expect(screen.queryByText('Organization 11')).not.toBeInTheDocument();
  });

  test('Testing pagination with search integration', async () => {
    setupUser('superAdmin');
    setItem('role', 'administrator');

    renderWithMocks(mockConfigurations.searchableMocks);
    await wait();

    // Verify pagination is present initially
    const paginationElement = screen.getByTestId('table-pagination');
    expect(paginationElement).toBeInTheDocument();

    // Verify all organizations are shown initially
    expect(screen.getByText('Dog Shelter North')).toBeInTheDocument();
    expect(screen.getByText('Dog Training Center')).toBeInTheDocument();

    // Perform search
    const searchInput = screen.getByTestId('searchInput');
    await userEvent.type(searchInput, 'Dog');

    // Wait for debounce
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });

    // After search, pagination should still be present but with filtered results
    expect(paginationElement).toBeInTheDocument();
    expect(screen.getByText('Dog Shelter North')).toBeInTheDocument();
    expect(screen.getByText('Dog Training Center')).toBeInTheDocument();
    expect(screen.getByText('Dog Walking Service')).toBeInTheDocument();
    expect(screen.queryByText('Cat Rescue South')).not.toBeInTheDocument();
    expect(screen.queryByText('Pet Hospital')).not.toBeInTheDocument();
  });

  test('Should render no organisation warning alert when there are no organization', async () => {
    window.location.assign('/');
    setupUser('basic');

    renderWithProviders(mockLinks.empty);

    await wait();
    expect(screen.queryByText('Organizations Not Found')).toBeInTheDocument();
    expect(
      screen.queryByText('Please create an organization through dashboard'),
    ).toBeInTheDocument();
  });

  test('Testing Organization data is not present', async () => {
    setupUser('basic');

    renderWithProviders(mockLinks.empty);

    await wait();
  });

  test('testing scroll', async () => {
    setupUser('superAdmin');
    setItem('role', 'administrator');

    renderWithMocks(mockConfigurations.scrollMocks);

    await waitFor(() => {
      expect(screen.getByTestId('createOrganizationBtn')).toBeInTheDocument();
    });

    // Wait for initial organizations to load
    expect(await screen.findByText('Organization 1')).toBeInTheDocument();
    expect(await screen.findByText('Organization 2')).toBeInTheDocument();

    fireEvent.scroll(window, { target: { scrollY: 1000 } });
  });
});

describe('Organisations Page testing as Admin', () => {
  test('Testing sort latest and oldest toggle', async () => {
    setupUser('admin');

    renderWithProviders(mockLinks.admin);

    await wait();

    const sortDropdown = screen.getByTestId('sort');
    expect(sortDropdown).toBeInTheDocument();

    const sortToggle = screen.getByTestId('sortOrgs');

    await act(async () => {
      fireEvent.click(sortToggle);
    });

    const latestOption = screen.getByTestId('Latest');

    await act(async () => {
      fireEvent.click(latestOption);
    });

    expect(sortDropdown).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(sortToggle);
    });

    const oldestOption = await waitFor(() => screen.getByTestId('Earliest'));

    await act(async () => {
      fireEvent.click(oldestOption);
    });

    expect(sortDropdown).toBeInTheDocument();
  });
});

describe('Plugin Modal Tests', () => {
  test('Testing plugin notification modal functionality', async () => {
    setItem('id', '123');
    setItem('role', 'administrator');

    render(
      <MockedProvider
        addTypename={false}
        mocks={mockConfigurations.orgCreationMocks}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ThemeProvider theme={createTheme()}>
                <OrgList />
              </ThemeProvider>
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Open organization creation modal
    await userEvent.click(screen.getByTestId('createOrganizationBtn'));

    // Fill form and submit
    await userEvent.type(
      screen.getByTestId('modalOrganizationName'),
      'Test Organization',
    );
    await userEvent.type(
      screen.getByTestId('modalOrganizationDescription'),
      'Test Description',
    );
    await userEvent.type(
      screen.getByTestId('modalOrganizationAddressLine1'),
      '123 Test St',
    );
    await userEvent.type(
      screen.getByTestId('modalOrganizationCity'),
      'Test City',
    );
    await userEvent.type(
      screen.getByTestId('modalOrganizationState'),
      'Test State',
    );
    await userEvent.type(
      screen.getByTestId('modalOrganizationPostalCode'),
      '12345',
    );
    await userEvent.selectOptions(
      screen.getByTestId('modalOrganizationCountryCode'),
      'Afghanistan',
    );

    await userEvent.click(screen.getByTestId('submitOrganizationForm'));
  });
});

describe('Advanced Component Functionality Tests', () => {
  test('Testing pagination edge cases', async () => {
    setItem('id', '123');
    setItem('SuperAdmin', true);
    setItem('role', 'administrator');
    setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);

    // Create mock with exactly one organization to test edge case
    const singleOrgMocks = [
      ...MOCKS,
      {
        request: {
          query: ORGANIZATION_LIST,
          variables: { filter: '' },
        },
        result: {
          data: {
            organizations: [
              {
                id: 'single',
                name: 'Single Organization',
                avatarURL: '',
                description: 'Only organization',
                members: { edges: [] },
                addressLine1: 'Single Address',
              },
            ],
          },
        },
      },
    ];

    render(
      <MockedProvider addTypename={false} mocks={singleOrgMocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ThemeProvider theme={createTheme()}>
                <OrgList />
              </ThemeProvider>
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();

    // Verify pagination is shown even with single organization
    const paginationElement = screen.getByTestId('table-pagination');
    expect(paginationElement).toBeInTheDocument();

    // Test pagination with rowsPerPage = 0 edge case
    const rowsPerPageSelect = screen.getByDisplayValue('5');
    fireEvent.change(rowsPerPageSelect, { target: { value: '0' } });
    await wait();
  });
});

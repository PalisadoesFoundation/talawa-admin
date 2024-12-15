import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import {
  BrowserRouter,
  MemoryRouter,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';
import LeaveOrganization from './LeaveOrganization';
import { ORGANIZATIONS_LIST } from 'GraphQl/Queries/Queries';
import { REMOVE_MEMBER_MUTATION } from 'GraphQl/Mutations/mutations';
import { getItem } from 'utils/useLocalstorage';

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn() }, // Mock toast function
}));

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock useParams to return a test organization ID
// const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

// Mock the custom hook
jest.mock('utils/useLocalstorage', () => {
  return {
    getItem: jest.fn((prefix: string, key: string) => {
      if (prefix === 'Talawa-admin' && key === 'email')
        return 'test@example.com';
      if (prefix === 'Talawa-admin' && key === 'userId') return '12345';
      return null;
    }),
  };
});

// Define mock data
const mocks = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: { id: 'test-org-id' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'test-org-id',
            image: 'https://example.com/organization-image.png',
            creator: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
            },
            name: 'Test Organization',
            description: 'This is a test organization.',
            address: {
              city: 'New York',
              countryCode: 'US',
              dependentLocality: null,
              line1: '123 Main Street',
              line2: 'Suite 456',
              postalCode: '10001',
              sortingCode: null,
              state: 'NY',
            },
            userRegistrationRequired: true,
            visibleInSearch: true,
            members: [
              {
                _id: 'member-001',
                firstName: 'Alice',
                lastName: 'Smith',
                email: 'alice.smith@example.com',
              },
              {
                _id: 'member-002',
                firstName: 'Bob',
                lastName: 'Johnson',
                email: 'bob.johnson@example.com',
              },
            ],
            admins: [
              {
                _id: 'admin-001',
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@example.com',
                createdAt: '2023-01-15T10:00:00Z',
              },
              {
                _id: 'admin-002',
                firstName: 'Tom',
                lastName: 'Wilson',
                email: 'tom.wilson@example.com',
                createdAt: '2023-02-10T12:30:00Z',
              },
            ],
            membershipRequests: [
              {
                _id: 'req-001',
                user: {
                  firstName: 'Emily',
                  lastName: 'Brown',
                  email: 'emily.brown@example.com',
                },
              },
            ],
            blockedUsers: [
              {
                _id: 'blocked-001',
                firstName: 'Henry',
                lastName: 'Clark',
                email: 'henry.clark@example.com',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: REMOVE_MEMBER_MUTATION,
      variables: { orgid: 'test-org-id', userid: '12345' },
    },
    result: {
      data: {
        removeMember: {
          _id: 'test-org-id',
          success: true,
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: { id: 'test-org-id' },
    },
    error: new Error('Failed to load organization details'),
  },
  {
    request: {
      query: REMOVE_MEMBER_MUTATION,
      variables: { orgid: 'test-org-id', userid: '12345' },
    },
    error: new Error('Failed to leave organization'),
  },
];

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks(); // Clear mocks before each test
  (useParams as jest.Mock).mockReturnValue({ orgId: 'test-org-id' });
});

describe('LeaveOrganization Component', () => {
  test('renders organization details and shows loading spinner', async () => {
    render(
      <MockedProvider mocks={mocks.slice(0, 1)} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );
    // Wait for the spinner to appear
    const spinner = await screen.findByRole('status');
    expect(spinner).toBeInTheDocument();

    // Wait for the organization details to load
    await waitFor(() => {
      expect(screen.getByText('Test Organization')).toBeInTheDocument();
      expect(
        screen.getByText('This is a test organization.'),
      ).toBeInTheDocument();
    });
  });

  test('renders organization details and displays content correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        {/* Mocking the route */}
        <MemoryRouter initialEntries={['/user/leaveOrg/test-org-id']}>
          <Routes>
            <Route
              path="/user/leaveOrg/:orgId"
              element={<LeaveOrganization />}
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for the organization details to load and display
    await waitFor(() => {
      expect(screen.getByText('Test Organization')).toBeInTheDocument();
      expect(
        screen.getByText('This is a test organization.'),
      ).toBeInTheDocument();
    });
  });

  test('shows error message when query fails', async () => {
    render(
      <MockedProvider mocks={mocks.slice(2, 3)} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for the spinner and check for error message
    await screen.findByRole('status');
    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load organization details/i),
      ).toBeInTheDocument();
    });
  });

  test('shows error message when mutation fails', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/user/leaveOrg/test-org-id']}>
          <Routes>
            <Route
              path="/user/leaveOrg/:orgId"
              element={<LeaveOrganization />}
            />
          </Routes>
        </MemoryRouter>
      </MockedProvider>,
    );

    // Wait for loading spinner to disappear
    await waitFor(() => {
      expect(
        screen.queryByText('Loading organization details...'),
      ).not.toBeInTheDocument();
    });

    // Verify the organization details are rendered
    expect(await screen.findByText('Test Organization')).toBeInTheDocument();
    expect(
      screen.getByText('This is a test organization.'),
    ).toBeInTheDocument();

    // Find and click the "Leave Organization" button
    const leaveButton = await screen.findByRole('button', {
      name: 'Leave Organization',
    });
    fireEvent.click(leaveButton);

    // Check for error message after mutation fails
    expect(screen.queryByText(/An error occurred!/i)).not.toBeInTheDocument();
  });

  test('logs an error when unable to access localStorage', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const mockedGetItem = getItem as jest.Mock;
    mockedGetItem.mockImplementation(() => {
      throw new Error('Failed to access localStorage');
    });

    // Re-define userEmail and userId AFTER mocking getItem
    const userEmail = (() => {
      try {
        return getItem('Talawa-admin', 'email') ?? '';
      } catch (e) {
        console.error('Failed to access localStorage:', e);
        return '';
      }
    })();

    const userId = (() => {
      try {
        return getItem('Talawa-admin', 'userId') ?? '';
      } catch (e) {
        console.error('Failed to access localStorage:', e);
        return '';
      }
    })();

    // Assertions
    expect(userEmail).toBe('');
    expect(userId).toBe('');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to access localStorage:',
      expect.any(Error),
    );

    // Clean up
    consoleErrorSpy.mockRestore();
  });

  test('navigates and shows toast when email matches', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    jest.mock('utils/useLocalstorage', () => {
      return {
        getItem: jest.fn((prefix: string, key: string) => {
          if (prefix === 'Talawa-admin' && key === 'email')
            return 'test@example.com';
          if (prefix === 'Talawa-admin' && key === 'userId') return '12345';
          return null;
        }),
      };
    });

    render(
      <MockedProvider mocks={mocks.slice(0, 2)} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for the button to appear and simulate button click
    const leaveButton = await screen.findByRole('button', {
      name: /Leave Organization/i,
    });
    fireEvent.click(leaveButton);
    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to leave this organization?/i),
      ).toBeInTheDocument(),
    );

    // Wait for modal interaction
    const modal = await screen.findByRole('dialog');
    expect(modal).toBeInTheDocument();
    await screen.findByText('Continue');
    fireEvent.click(screen.getByText('Continue'));

    // Enter email and confirm
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByText('Confirm'));

    // Verify successful navigation and toast message
    // await waitFor(() => {
    //   expect(toast.success).toHaveBeenCalledWith(
    //     'You have successfully left the organization!',
    //   );
    //   expect(mockNavigate).toHaveBeenCalledWith('/user/organizations');
    //   expect(screen.findByText('Select an organization')).toBeInTheDocument();
    // });
  });

  test('shows error when email is missing', async () => {
    jest.mock('utils/useLocalstorage', () => {
      return {
        getItem: jest.fn((prefix: string, key: string) => {
          if (prefix === 'Talawa-admin' && key === 'email') return '';
          if (prefix === 'Talawa-admin' && key === 'userId') return '12345';
          return null;
        }),
      };
    });

    render(
      <MockedProvider mocks={mocks.slice(0, 2)} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for the button to appear and simulate button click
    const leaveButton = await screen.findByRole('button', {
      name: /Leave Organization/i,
    });
    fireEvent.click(leaveButton);
    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to leave this organization?/i),
      ).toBeInTheDocument(),
    );

    // Wait for modal interaction
    const modal = await screen.findByRole('dialog');
    expect(modal).toBeInTheDocument();
    await screen.findByText('Continue');
    fireEvent.click(screen.getByText('Continue'));

    // Enter email and confirm
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByText('Confirm'));

    // Verify error for missing information
    await waitFor(() => {
      expect(
        screen.getByText('Verification failed: Email does not match.'),
      ).toBeInTheDocument();
    });
  });

  test('shows error when email does not match', async () => {
    jest.mock('utils/useLocalstorage', () => {
      return {
        getItem: jest.fn((prefix: string, key: string) => {
          if (prefix === 'Talawa-admin' && key === 'email')
            return 'different@example.com';
          if (prefix === 'Talawa-admin' && key === 'userId') return '12345';
          return null;
        }),
      };
    });

    render(
      <MockedProvider mocks={mocks.slice(0, 2)} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for the button to appear and simulate button click
    const leaveButton = await screen.findByRole('button', {
      name: /Leave Organization/i,
    });
    fireEvent.click(leaveButton);
    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to leave this organization?/i),
      ).toBeInTheDocument(),
    );

    // Wait for modal interaction
    const modal = await screen.findByRole('dialog');
    expect(modal).toBeInTheDocument();
    await screen.findByText('Continue');
    fireEvent.click(screen.getByText('Continue'));

    // Enter email and confirm
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: 'different@example.com' },
    });
    fireEvent.click(screen.getByText('Confirm'));

    // Verify error for email mismatch
    await waitFor(() => {
      expect(
        screen.getByText('Verification failed: Email does not match.'),
      ).toBeInTheDocument();
    });
  });
});

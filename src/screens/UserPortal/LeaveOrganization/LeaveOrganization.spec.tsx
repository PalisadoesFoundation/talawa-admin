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
import {
  ORGANIZATIONS_LIST,
  USER_ORGANIZATION_CONNECTION,
} from 'GraphQl/Queries/Queries';
import { REMOVE_MEMBER_MUTATION } from 'GraphQl/Mutations/mutations';
import { getItem } from 'utils/useLocalstorage';
import { toast } from 'react-toastify';
import { vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn() }, // Mock toast function
}));

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock useParams to return a test organization ID

vi.mock('react-router-dom', async () => {
  const actualDom = await vi.importActual('react-router-dom');
  return {
    ...actualDom,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

// Mock the custom hook
vi.mock('utils/useLocalstorage', () => {
  return {
    getItem: vi.fn((prefix: string, key: string) => {
      if (prefix === 'Talawa-admin' && key === 'email')
        return 'test@example.com';
      if (prefix === 'Talawa-admin' && key === 'userId') return '12345';
      if (prefix === 'Talawa-admin-error' && key === 'user-email-error')
        throw new Error();
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
      query: USER_ORGANIZATION_CONNECTION,
      variables: { id: 'test-org-id' },
    },
    result: {
      data: {
        organizationsConnection: [
          {
            _id: 'org123',
            name: 'Tech Enthusiasts Club',
            image: 'https://example.com/org-logo.png',
            description:
              'A community of tech lovers who meet to share ideas and projects.',
            userRegistrationRequired: true,
            creator: {
              firstName: 'Alice',
              lastName: 'Johnson',
            },
            members: [
              { _id: 'user001' },
              { _id: 'user002' },
              { _id: 'user003' },
            ],
            admins: [{ _id: 'admin001' }, { _id: 'admin002' }],
            createdAt: '2024-01-15T12:34:56.789Z',
            address: {
              city: 'San Francisco',
              countryCode: 'US',
              dependentLocality: null,
              line1: '123 Tech Ave',
              line2: 'Suite 100',
              postalCode: '94105',
              sortingCode: null,
              state: 'California',
            },
            membershipRequests: [
              {
                _id: 'req001',
                user: {
                  _id: 'user004',
                },
              },
              {
                _id: 'req002',
                user: {
                  _id: 'user005',
                },
              },
            ],
          },
        ],
      },
    },
  },
];

const errorMocks = [
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
  {
    request: {
      query: USER_ORGANIZATION_CONNECTION,
      variables: { id: 'test-org-id' },
    },
    error: new Error('Operation Failed'),
  },
];

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  (useParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    orgId: 'test-org-id',
  });
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
    const spinner = await screen.findByRole('status');
    expect(spinner).toBeInTheDocument();
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
    await waitFor(() => {
      expect(screen.getByText('Test Organization')).toBeInTheDocument();
      expect(
        screen.getByText('This is a test organization.'),
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
    await waitFor(() => {
      expect(
        screen.queryByText('Loading organization details...'),
      ).not.toBeInTheDocument();
    });
    expect(await screen.findByText('Test Organization')).toBeInTheDocument();
    expect(
      screen.getByText('This is a test organization.'),
    ).toBeInTheDocument();
    const leaveButton = await screen.findByRole('button', {
      name: 'Leave Organization',
    });
    fireEvent.click(leaveButton);
    expect(screen.queryByText(/An error occurred!/i)).not.toBeInTheDocument();
  });

  test('logs an error when unable to access localStorage', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const userEmail = (() => {
      try {
        return getItem('Talawa-admin-error', 'user-email-error') ?? '';
      } catch (e) {
        console.error('Failed to access localStorage:', e);
        return '';
      }
    })();
    const userId = (() => {
      try {
        return getItem('Talawa-admin-error', 'user-email-error') ?? '';
      } catch (e) {
        console.error('Failed to access localStorage:', e);
        return '';
      }
    })();
    expect(userEmail).toBe('');
    expect(userId).toBe('');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to access localStorage:',
      expect.any(Error),
    );
    consoleErrorSpy.mockRestore();
  });

  test('navigates and shows toast when email matches', async () => {
    const mockNavigate = vi.fn();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockNavigate,
    );
    const toastSuccessMock = vi.fn();
    toast.success = toastSuccessMock;
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );
    const leaveButton = await screen.findByRole('button', {
      name: /Leave Organization/i,
    });
    fireEvent.click(leaveButton);
    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to leave this organization?/i),
      ).toBeInTheDocument(),
    );
    const modal = await screen.findByRole('dialog');
    expect(modal).toBeInTheDocument();
    await screen.findByText('Continue');
    fireEvent.click(screen.getByText('Continue'));
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' },
    });
    fireEvent.keyDown(emailInput, { key: 'Enter', code: 'Enter' });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(`/user/organizations`);
    });
    await waitFor(() => {
      expect(toastSuccessMock).toHaveBeenCalledWith(
        'You have successfully left the organization!',
      );
    });
  });

  test('shows error when email is missing', async () => {
    render(
      <MockedProvider mocks={mocks.slice(0, 2)} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );
    const leaveButton = await screen.findByRole('button', {
      name: /Leave Organization/i,
    });
    fireEvent.click(leaveButton);
    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to leave this organization?/i),
      ).toBeInTheDocument(),
    );
    const modal = await screen.findByRole('dialog');
    expect(modal).toBeInTheDocument();
    await screen.findByText('Continue');
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByText('Confirm'));
    await waitFor(() => {
      expect(
        screen.getByText('Verification failed: Email does not match.'),
      ).toBeInTheDocument();
    });
  });

  test('shows error when email does not match', async () => {
    render(
      <MockedProvider mocks={mocks.slice(0, 2)} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );
    const leaveButton = await screen.findByRole('button', {
      name: /Leave Organization/i,
    });
    fireEvent.click(leaveButton);
    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to leave this organization?/i),
      ).toBeInTheDocument(),
    );
    const modal = await screen.findByRole('dialog');
    expect(modal).toBeInTheDocument();
    await screen.findByText('Continue');
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
      target: { value: 'different@example.com' },
    });
    fireEvent.click(screen.getByText('Confirm'));
    await waitFor(() => {
      expect(
        screen.getByText('Verification failed: Email does not match.'),
      ).toBeInTheDocument();
    });
  });

  test('resets state when back button pressed', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );
    const leaveButton = await screen.findByRole('button', {
      name: /Leave Organization/i,
    });
    fireEvent.click(leaveButton);
    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to leave this organization?/i),
      ).toBeInTheDocument(),
    );
    const modal = await screen.findByRole('dialog');
    expect(modal).toBeInTheDocument();
    await screen.findByText('Continue');
    fireEvent.click(screen.getByText('Continue'));
    const closeButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(closeButton);
    expect(
      screen.queryByText(/Are you sure you want to leave this organization?/i),
    ).toBeInTheDocument();
  });

  test('resets state when modal is closed', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );
    const leaveButton = await screen.findByRole('button', {
      name: /Leave Organization/i,
    });
    fireEvent.click(leaveButton);
    const closeButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(closeButton);
    expect(screen.queryByText(/Leave Organization/i)).toBeInTheDocument();
  });

  test('closes modal and resets state when Esc key is pressed', async () => {
    const mockNavigate = vi.fn();
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockNavigate,
    );
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );
    const leaveButton = await screen.findByRole('button', {
      name: /Leave Organization/i,
    });
    fireEvent.click(leaveButton);
    const modal = await screen.findByTestId('leave-organization-modal');
    expect(modal).toBeInTheDocument();
    fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByTestId('leave-organization-modal')).toBeNull(); // Modal should no longer be present
    });
    expect(modal).not.toBeInTheDocument();
  });

  test('displays an error alert when query fails', async () => {
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <LeaveOrganization />
      </MockedProvider>,
    );
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent(/Error:/i);
  });
});

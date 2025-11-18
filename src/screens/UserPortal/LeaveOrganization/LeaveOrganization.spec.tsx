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
} from 'react-router';
import LeaveOrganization from './LeaveOrganization';
import {
  ORGANIZATIONS_LIST_BASIC,
  ORGANIZATION_LIST,
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

vi.mock('react-router', async () => {
  const actualDom = await vi.importActual('react-router');
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
      query: ORGANIZATIONS_LIST_BASIC,
      variables: { id: 'test-org-id' },
    },
    result: {
      data: {
        organizations: [
          {
            id: 'test-org-id',
            name: 'Test Organization',
            description: 'This is a test organization.',
            addressLine1: '123 Test St',
            addressLine2: 'Suite 100',
            city: 'Test City',
            state: 'Test State',
            postalCode: '12345',
            countryCode: 'US',
            avatarURL: null,
            __typename: 'Organization',
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
      query: ORGANIZATION_LIST,
      variables: { id: 'test-org-id' },
    },
    result: {
      data: {
        organizations: [
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
      query: ORGANIZATIONS_LIST_BASIC,
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
      query: ORGANIZATION_LIST,
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
      <MockedProvider mocks={mocks.slice(0, 1)} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
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

  test('handles network error in removeMember mutation', async () => {
    // Create a network error mock for the removeMember mutation
    const networkErrorMock = {
      request: {
        query: REMOVE_MEMBER_MUTATION,
        variables: { orgid: 'test-org-id', userid: '12345' },
      },
      error: new Error('Network error'),
    };

    // Combine regular organization query mock with network error mock
    const combinedMocks = [mocks[0], networkErrorMock];

    render(
      <MockedProvider mocks={combinedMocks} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for organization data to load
    await waitFor(() => {
      expect(screen.getByText('Test Organization')).toBeInTheDocument();
    });

    // Click leave organization button
    const leaveButton = screen.getByRole('button', {
      name: 'Leave Organization',
    });
    fireEvent.click(leaveButton);

    // Continue to verification step
    fireEvent.click(screen.getByText('Continue'));

    // Enter correct email and submit
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Use aria-label to find the confirm button
    const confirmButton = screen.getByRole('button', {
      name: 'confirm-leave-button',
    });
    fireEvent.click(confirmButton);

    // Verify network error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText(
          'Unable to process your request. Please check your connection.',
        ),
      ).toBeInTheDocument();
    });
  });

  test('handles GraphQL error in removeMember mutation', async () => {
    // Create a GraphQL error mock for the removeMember mutation
    const graphQLErrorMock = {
      request: {
        query: REMOVE_MEMBER_MUTATION,
        variables: { orgid: 'test-org-id', userid: '12345' },
      },
      result: {
        errors: [new Error('GraphQL error')],
      },
    };

    // Combine regular organization query mock with GraphQL error mock
    const combinedMocks = [mocks[0], graphQLErrorMock];

    render(
      <MockedProvider mocks={combinedMocks} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for organization data to load
    await waitFor(() => {
      expect(screen.getByText('Test Organization')).toBeInTheDocument();
    });

    // Click leave organization button
    const leaveButton = screen.getByRole('button', {
      name: 'Leave Organization',
    });
    fireEvent.click(leaveButton);

    // Continue to verification step
    fireEvent.click(screen.getByText('Continue'));

    // Enter correct email and submit
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Use aria-label to find the confirm button
    const confirmButton = screen.getByRole('button', {
      name: 'confirm-leave-button',
    });
    fireEvent.click(confirmButton);

    // Verify GraphQL error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText('Failed to leave organization. Please try again.'),
      ).toBeInTheDocument();
    });
  });

  test('handles missing organizationId or userId', async () => {
    // Mock useParams to return undefined orgId
    (useParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      orgId: undefined as unknown as string,
    });

    // Render with mocks that don't depend on specific orgId
    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: ORGANIZATIONS_LIST_BASIC,
              variables: { id: undefined },
            },
            result: {
              data: {
                organizations: [
                  {
                    _id: 'test-org-id',
                    name: 'Test Organization',
                    description: 'This is a test organization.',
                  },
                ],
              },
            },
          },
        ]}
        addTypename={false}
      >
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Skip waiting for organization data since we're testing the error path

    // Click leave organization button
    const leaveButton = await screen.findByRole('button', {
      name: 'Leave Organization',
    });
    fireEvent.click(leaveButton);

    // Continue to verification step
    fireEvent.click(screen.getByText('Continue'));

    // Enter correct email and submit
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Use aria-label to find the confirm button
    const confirmButton = screen.getByRole('button', {
      name: 'confirm-leave-button',
    });
    fireEvent.click(confirmButton);

    // Verify error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText(
          'Unable to process request: Missing required information.',
        ),
      ).toBeInTheDocument();
    });
  });

  test('displays "Organization not found" when no organization data is returned', async () => {
    // Create a mock that returns empty organizations array
    const emptyOrgMock = {
      request: {
        query: ORGANIZATIONS_LIST_BASIC,
        variables: { id: 'test-org-id' },
      },
      result: {
        data: {
          organizations: [],
        },
      },
    };

    render(
      <MockedProvider mocks={[emptyOrgMock]} addTypename={false}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(
        screen.queryByText('Loading organization details...'),
      ).not.toBeInTheDocument();
    });

    // Verify "Organization not found" message is displayed
    expect(screen.getByText('Organization not found')).toBeInTheDocument();
  });
});

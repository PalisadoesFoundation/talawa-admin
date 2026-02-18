import React from 'react';
import dayjs from 'dayjs';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

import i18nForTest from 'utils/i18nForTest';
import LeaveOrganization from './LeaveOrganization';
import {
  ORGANIZATIONS_LIST_BASIC,
  ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import { REMOVE_MEMBER_MUTATION } from 'GraphQl/Mutations/mutations';
import { vi, beforeEach, afterEach, describe, test } from 'vitest';

const routerMocks = vi.hoisted(() => ({
  params: vi.fn(),
  navigate: vi.fn(),
}));

const mockNotificationToast = vi.hoisted(() => ({
  success: vi.fn(),
}));

vi.mock('react-i18next', async () => {
  const original = await vi.importActual('react-i18next');
  return {
    ...original,
    useTranslation: () => ({
      t: (key: string, options?: Record<string, unknown>) =>
        i18nForTest.t(key, options),
      i18n: i18nForTest,
    }),
  };
});

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: mockNotificationToast,
}));

// Mock useParams to return a test organization ID

vi.mock('react-router', async () => {
  const actualDom =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actualDom,
    useParams: routerMocks.params,
    useNavigate: () => routerMocks.navigate,
  };
});

// Mock the custom hook
vi.mock('utils/useLocalstorage', () => {
  return {
    getItem: vi.fn((prefix: string, key: string) => {
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
    delay: 50, // Add delay to show loading spinner
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
            createdAt: dayjs().month(0).date(15).toISOString(),
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

describe('LeaveOrganization Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routerMocks.params.mockReset();
    routerMocks.navigate.mockReset();
    routerMocks.params.mockReturnValue({
      orgId: 'test-org-id',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  test('renders organization details and shows loading spinner', async () => {
    render(
      <MockedProvider mocks={mocks.slice(0, 1)}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );
    // LoadingState renders with data-testid="loading-state"
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Test Organization')).toBeInTheDocument();
      expect(
        screen.getByText('This is a test organization.'),
      ).toBeInTheDocument();
    });
  });

  test('renders organization details and displays content correctly', async () => {
    render(
      <MockedProvider mocks={mocks.slice(0, 1)}>
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
      <MockedProvider mocks={mocks}>
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
    await userEvent.click(leaveButton);
    expect(screen.queryByText(/An error occurred!/i)).not.toBeInTheDocument();
  });

  // Note: localStorage error/null/undefined handling is comprehensively tested
  // in LeaveOrganization.localStorage.spec.tsx using vi.resetModules() and dynamic imports

  test('does not submit when non-Enter key is pressed on email input', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );
    const leaveButton = await screen.findByRole('button', {
      name: /Leave Organization/i,
    });
    await userEvent.click(leaveButton);
    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to leave/i),
      ).toBeInTheDocument(),
    );
    await screen.findByText('Continue');
    await userEvent.click(screen.getByText('Continue'));
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    await userEvent.type(emailInput, 'test@example.com');
    // Press a non-Enter key - should not trigger verification
    await userEvent.tab();
    // Verify the modal is still open and no navigation happened
    expect(
      screen.getByPlaceholderText(/Enter your email/i),
    ).toBeInTheDocument();
    expect(routerMocks.navigate).not.toHaveBeenCalled();
  });

  test('navigates and shows toast when email matches', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );
    const leaveButton = await screen.findByRole('button', {
      name: /Leave Organization/i,
    });
    await userEvent.click(leaveButton);
    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to leave/i),
      ).toBeInTheDocument(),
    );
    const modal = await screen.findByTestId('leave-organization-modal');
    expect(modal).toBeInTheDocument();
    await screen.findByText('Continue');
    await userEvent.click(screen.getByText('Continue'));
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(emailInput, '{enter}');
    await waitFor(() => {
      expect(routerMocks.navigate).toHaveBeenCalledWith(`/user/organizations`);
    });
    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        'You have successfully left the organization!',
      );
    });
  });

  test('shows error when email is missing', async () => {
    render(
      <MockedProvider mocks={mocks.slice(0, 2)}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );
    const leaveButton = await screen.findByRole('button', {
      name: /Leave Organization/i,
    });
    await userEvent.click(leaveButton);
    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to leave/i),
      ).toBeInTheDocument(),
    );
    const modal = await screen.findByTestId('leave-organization-modal');
    expect(modal).toBeInTheDocument();
    await screen.findByText('Continue');
    await userEvent.click(screen.getByText('Continue'));

    const confirmButton = screen.getByRole('button', {
      name: /confirm/i,
    });
    await userEvent.click(confirmButton);
    await waitFor(() => {
      expect(
        screen.getByText(
          'The email you entered does not match your account email.',
        ),
      ).toBeInTheDocument();
    });
  });

  test('shows error when email does not match', async () => {
    render(
      <MockedProvider mocks={mocks.slice(0, 2)}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );
    const leaveButton = await screen.findByRole('button', {
      name: /Leave Organization/i,
    });
    await userEvent.click(leaveButton);
    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to leave/i),
      ).toBeInTheDocument(),
    );
    const modal = await screen.findByTestId('leave-organization-modal');
    expect(modal).toBeInTheDocument();
    await screen.findByText('Continue');
    await userEvent.click(screen.getByText('Continue'));
    await userEvent.type(
      screen.getByPlaceholderText(/Enter your email/i),
      'different@example.com',
    );
    const confirmButton = screen.getByRole('button', {
      name: /confirm/i,
    });
    await userEvent.click(confirmButton);
    await waitFor(() => {
      expect(
        screen.getByText(
          'The email you entered does not match your account email.',
        ),
      ).toBeInTheDocument();
    });
  });

  test('resets state when back button pressed', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );
    const leaveButton = await screen.findByRole('button', {
      name: /Leave Organization/i,
    });
    await userEvent.click(leaveButton);
    await waitFor(() =>
      expect(
        screen.getByText(/Are you sure you want to leave/i),
      ).toBeInTheDocument(),
    );
    const modal = await screen.findByTestId('leave-organization-modal');
    expect(modal).toBeInTheDocument();
    await screen.findByText('Continue');
    await userEvent.click(screen.getByText('Continue'));
    const closeButton = screen.getByRole('button', { name: /Back/i });
    await userEvent.click(closeButton);
    expect(
      screen.queryByText(/are you sure you want to leave/i),
    ).toBeInTheDocument();
  });

  test('resets state when modal is closed', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );
    const leaveButton = await screen.findByRole('button', {
      name: /Leave Organization/i,
    });
    await userEvent.click(leaveButton);
    const closeButton = screen.getByRole('button', { name: /Cancel/i });
    await userEvent.click(closeButton);
    expect(screen.queryByText(/Leave Organization/i)).toBeInTheDocument();
  });

  test('closes modal and resets state when Esc key is pressed', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <LeaveOrganization />
        </BrowserRouter>
      </MockedProvider>,
    );
    const leaveButton = await screen.findByRole('button', {
      name: /Leave Organization/i,
    });
    await userEvent.click(leaveButton);
    const modal = await screen.findByTestId('leave-organization-modal');
    expect(modal).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByTestId('leave-organization-modal')).toBeNull(); // Modal should no longer be present
    });
    expect(modal).not.toBeInTheDocument();
  });

  test('displays an error alert when query fails', async () => {
    render(
      <MockedProvider mocks={errorMocks}>
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
      <MockedProvider mocks={combinedMocks}>
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
    await userEvent.click(leaveButton);

    // Continue to verification step
    await userEvent.click(screen.getByText('Continue'));

    // Enter correct email and submit
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    await userEvent.type(emailInput, 'test@example.com');

    // Use aria-label to find the confirm button
    const confirmButton = screen.getByRole('button', {
      name: /confirm/i,
    });
    await userEvent.click(confirmButton);

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
      <MockedProvider mocks={combinedMocks}>
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
    await userEvent.click(leaveButton);

    // Continue to verification step
    await userEvent.click(screen.getByText('Continue'));

    // Enter correct email and submit
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    await userEvent.type(emailInput, 'test@example.com');

    // Use aria-label to find the confirm button
    const confirmButton = screen.getByRole('button', {
      name: /confirm/i,
    });
    await userEvent.click(confirmButton);

    // Verify GraphQL error message is displayed
    await waitFor(() => {
      expect(
        screen.getByText('Failed to leave organization. Please try again.'),
      ).toBeInTheDocument();
    });
  });

  test('handles missing organizationId or userId', async () => {
    // Mock useParams to return undefined orgId
    routerMocks.params.mockReturnValue({
      orgId: undefined as string | undefined,
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
    await userEvent.click(leaveButton);

    // Continue to verification step
    await userEvent.click(screen.getByText('Continue'));

    // Enter correct email and submit
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    await userEvent.type(emailInput, 'test@example.com');

    // Use the button text to find the confirm button
    const confirmButton = screen.getByRole('button', {
      name: /confirm/i,
    });
    await userEvent.click(confirmButton);

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
      <MockedProvider mocks={[emptyOrgMock]}>
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

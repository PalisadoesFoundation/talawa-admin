import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import OrganizationCard from './OrganizationCard';
import { InterfaceOrganizationCardProps } from 'types/OrganizationCard/interface';
import { MockedProvider } from '@apollo/client/testing';
import {
  SEND_MEMBERSHIP_REQUEST,
  JOIN_PUBLIC_ORGANIZATION,
  CANCEL_MEMBERSHIP_REQUEST,
} from 'GraphQl/Mutations/OrganizationMutations';
import { ORGANIZATION_LIST } from 'GraphQl/Queries/Queries';
import { USER_JOINED_ORGANIZATIONS_PG } from 'GraphQl/Queries/OrganizationQueries';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';

// Mock utils/i18n to use the test i18n instance for NotificationToast
vi.mock('utils/i18n', async () => {
  const i18n = await import('utils/i18nForTest');
  return {
    default: i18n.default,
  };
});

vi.mock('react-i18next', () => ({
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'orgListCard.manage': 'Manage',
        'users.visit': 'Visit',
        'users.joinNow': 'joinNow',
        'users.withdraw': 'withdraw',
        'users.orgJoined': 'orgJoined',
        'users.errorOccurred': 'errorOccurred',
        'users.member': 'Member',
        'users.pending': 'Pending',
        'users.notMember': 'Not a member',
        'users.AlreadyJoined': 'AlreadyJoined',
        'users.MembershipRequestSent': 'MembershipRequestSent',
        'users.UserIdNotFound': 'UserIdNotFound',
        'users.MembershipRequestWithdrawn': 'MembershipRequestWithdrawn',
        'users.MembershipRequestNotFound': 'MembershipRequestNotFound',
        'users.membershipStatus.member': 'Membership status: Member',
        'users.membershipStatus.pending': 'Membership status: Pending',
        'users.membershipStatus.notMember': 'Membership status: Not a member',
      };

      return translations[key] || key;
    },
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('shared-components/Avatar/Avatar', () => ({
  default: ({ name }: { name: string }) => (
    <div data-testid="mock-avatar">{name}</div>
  ),
}));

vi.mock('shared-components/TruncatedText/TruncatedText', () => ({
  default: ({ text }: { text: string }) => <span>{text}</span>,
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

const mockUseLocalStorage = vi.fn(() => ({
  getItem: (key: string): string | null =>
    key === 'userId' ? 'user123' : null,
  setItem: vi.fn(),
  removeItem: vi.fn(),
  getStorageKey: vi.fn(),
}));

vi.mock('utils/useLocalstorage', () => ({
  default: () => mockUseLocalStorage(),
}));

describe('OrganizationCard', () => {
  const mockData: InterfaceOrganizationCardProps = {
    id: '123',
    name: 'Test Org',
    description: 'This is a test organization',
    addressLine1: '123 Test St',
    avatarURL: 'http://example.com/avatar.png',
    members: { edges: [{ node: { id: '1' } }, { node: { id: '2' } }] },
    membersCount: 10,
    adminsCount: 2,
    role: 'user',
    isJoined: false,
    userRegistrationRequired: false,
    membershipRequestStatus: undefined,
    membershipRequests: [],
  };

  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: vi.fn() },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('renders organization details correctly', () => {
    render(
      <MockedProvider>
        <OrganizationCard data={mockData} />
      </MockedProvider>,
    );

    expect(
      screen.getByRole('heading', { name: 'Test Org' }),
    ).toBeInTheDocument();
    expect(screen.getByText('This is a test organization')).toBeInTheDocument();
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
  });

  it('renders avatar image when avatarURL is provided', () => {
    render(
      <MockedProvider>
        <OrganizationCard data={mockData} />
      </MockedProvider>,
    );
    const img = screen.getByAltText('Test Org');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'http://example.com/avatar.png');
  });

  it('renders Avatar component when avatarURL is missing', () => {
    const dataWithoutAvatar = { ...mockData, avatarURL: null };
    render(
      <MockedProvider>
        <OrganizationCard data={dataWithoutAvatar} />
      </MockedProvider>,
    );
    expect(screen.getByTestId('mock-avatar')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Test Org' }),
    ).toBeInTheDocument();
  });

  it('displays correct member and admin counts for admin role', () => {
    const adminData = { ...mockData, role: 'admin' };
    render(
      <MockedProvider>
        <OrganizationCard data={adminData} />
      </MockedProvider>,
    );

    expect(screen.getByText('admins:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('members:')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('displays correct member count for user role', () => {
    render(
      <MockedProvider>
        <OrganizationCard data={mockData} />
      </MockedProvider>,
    );
    expect(screen.getByText('members:')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.queryByText('admins:')).not.toBeInTheDocument();
  });

  it('renders "Manage" button and navigates correctly for admin role', () => {
    const adminData = { ...mockData, role: 'admin' };
    render(
      <MockedProvider>
        <OrganizationCard data={adminData} />
      </MockedProvider>,
    );

    const button = screen.getByTestId('manageBtn');
    expect(button).toHaveTextContent('Manage');

    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/admin/orgdash/123');
  });

  it('renders "Visit" button and navigates correctly for joined user', () => {
    const joinedData = { ...mockData, isJoined: true };
    render(
      <MockedProvider>
        <OrganizationCard data={joinedData} />
      </MockedProvider>,
    );

    const button = screen.getByTestId('manageBtn');
    expect(button).toHaveTextContent('Visit');

    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/user/organization/123');
  });

  it('displays "Member" status chip for joined users', () => {
    const joinedData = { ...mockData, isJoined: true };

    render(
      <MockedProvider>
        <OrganizationCard data={joinedData} />
      </MockedProvider>,
    );

    const statusChip = screen.getByTestId('membershipStatus');

    expect(statusChip).toHaveTextContent('Member');
    expect(statusChip).toHaveAttribute('data-status', 'member');
    expect(statusChip).toHaveAttribute('role', 'status');
    expect(statusChip).toHaveAttribute(
      'aria-label',
      'Membership status: Member',
    );
  });

  it('displays "Pending" status chip when membership request is pending', () => {
    const pendingData = {
      ...mockData,
      isJoined: false,
      membershipRequestStatus: 'pending',
    };

    render(
      <MockedProvider>
        <OrganizationCard data={pendingData} />
      </MockedProvider>,
    );

    const statusChip = screen.getByTestId('membershipStatus');

    expect(statusChip).toHaveTextContent('Pending');
    expect(statusChip).toHaveAttribute('data-status', 'pending');
    expect(statusChip).toHaveAttribute(
      'aria-label',
      'Membership status: Pending',
    );
  });

  it('displays "Not a member" status chip for non-members', () => {
    const nonMemberData = {
      ...mockData,
      isJoined: false,
      membershipRequestStatus: undefined,
    };

    render(
      <MockedProvider>
        <OrganizationCard data={nonMemberData} />
      </MockedProvider>,
    );

    const statusChip = screen.getByTestId('membershipStatus');

    expect(statusChip).toHaveTextContent('Not a member');
    expect(statusChip).toHaveAttribute('data-status', 'notMember');
    expect(statusChip).toHaveAttribute(
      'aria-label',
      'Membership status: Not a member',
    );
  });

  it('renders "Join" button for non-joined user', () => {
    render(
      <MockedProvider>
        <OrganizationCard data={mockData} />
      </MockedProvider>,
    );

    const button = screen.getByTestId('joinBtn');
    expect(button).toHaveTextContent('joinNow');
  });

  it('joins public organization successfully', async () => {
    const mocks = [
      {
        request: {
          query: JOIN_PUBLIC_ORGANIZATION,
          variables: { input: { organizationId: '123' } },
        },
        result: {
          data: {
            joinPublicOrganization: {
              id: '123',
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {},
        },
      },
      {
        request: {
          query: USER_JOINED_ORGANIZATIONS_PG,
          variables: { id: 'user123', first: 5 },
        },
        result: {
          data: {},
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <OrganizationCard data={mockData} />
      </MockedProvider>,
    );

    const button = screen.getByTestId('joinBtn');
    fireEvent.click(button);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith('orgJoined');
    });
  });

  it('sends membership request when registration is required', async () => {
    const dataWithRegistration = {
      ...mockData,
      userRegistrationRequired: true,
    };
    const mocks = [
      {
        request: {
          query: SEND_MEMBERSHIP_REQUEST,
          variables: { organizationId: '123' },
        },
        result: {
          data: {
            sendMembershipRequest: {
              id: 'req123',
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <OrganizationCard data={dataWithRegistration} />
      </MockedProvider>,
    );

    const button = screen.getByTestId('joinBtn');
    fireEvent.click(button);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        'MembershipRequestSent',
      );
    });
  });

  it('handles ALREADY_MEMBER error when joining', async () => {
    const mocks = [
      {
        request: {
          query: JOIN_PUBLIC_ORGANIZATION,
          variables: { input: { organizationId: '123' } },
        },
        result: {
          errors: [
            {
              message: 'Already a member',
              extensions: { code: 'ALREADY_MEMBER' },
            },
          ],
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <OrganizationCard data={mockData} />
      </MockedProvider>,
    );

    const button = screen.getByTestId('joinBtn');
    fireEvent.click(button);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith('AlreadyJoined');
    });
  });

  it('handles ApolloError with different code when joining', async () => {
    const mocks = [
      {
        request: {
          query: JOIN_PUBLIC_ORGANIZATION,
          variables: { input: { organizationId: '123' } },
        },
        result: {
          errors: [
            {
              message: 'Some other error',
              extensions: { code: 'SOME_OTHER_CODE' },
            },
          ],
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <OrganizationCard data={mockData} />
      </MockedProvider>,
    );

    const button = screen.getByTestId('joinBtn');
    fireEvent.click(button);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith('errorOccurred');
    });
  });

  it('handles generic error when joining', async () => {
    const mocks = [
      {
        request: {
          query: JOIN_PUBLIC_ORGANIZATION,
          variables: { input: { organizationId: '123' } },
        },
        error: new Error('Network error'),
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <OrganizationCard data={mockData} />
      </MockedProvider>,
    );

    const button = screen.getByTestId('joinBtn');
    fireEvent.click(button);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith('errorOccurred');
    });
  });

  it('handles non-ApolloError when joining', async () => {
    const mocks = [
      {
        request: {
          query: JOIN_PUBLIC_ORGANIZATION,
          variables: { input: { organizationId: '123' } },
        },
        result: {
          data: {
            joinPublicOrganization: {
              id: '123',
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {},
        },
      },
      {
        request: {
          query: USER_JOINED_ORGANIZATIONS_PG,
          variables: { id: 'user123', first: 5 },
        },
        result: {
          data: {},
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <OrganizationCard data={mockData} />
      </MockedProvider>,
    );

    const button = screen.getByTestId('joinBtn');
    fireEvent.click(button);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith('orgJoined');
    });
  });

  it('renders "Withdraw" button when membership request is pending', () => {
    const pendingData = { ...mockData, membershipRequestStatus: 'pending' };
    render(
      <MockedProvider>
        <OrganizationCard data={pendingData} />
      </MockedProvider>,
    );

    const button = screen.getByTestId('withdrawBtn');
    expect(button).toHaveTextContent('withdraw');
  });

  it('shows error when withdrawing if userId is not found', async () => {
    const pendingData = { ...mockData, membershipRequestStatus: 'pending' };

    // Mock getItem to return null for userId
    mockUseLocalStorage.mockReturnValueOnce({
      getItem: (key: string) => (key === 'userId' ? null : 'some-value'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      getStorageKey: vi.fn(),
    });

    render(
      <MockedProvider>
        <OrganizationCard data={pendingData} />
      </MockedProvider>,
    );

    const button = screen.getByTestId('withdrawBtn');
    fireEvent.click(button);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith('UserIdNotFound');
    });
  });

  it('withdraws membership request successfully', async () => {
    const pendingData = {
      ...mockData,
      membershipRequestStatus: 'pending',
      membershipRequests: [{ id: 'req123', user: { id: 'user123' } }],
    };

    const mocks = [
      {
        request: {
          query: CANCEL_MEMBERSHIP_REQUEST,
          variables: { membershipRequestId: 'req123' },
        },
        result: {
          data: {
            cancelMembershipRequest: {
              id: 'req123',
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <OrganizationCard data={pendingData} />
      </MockedProvider>,
    );

    const button = screen.getByTestId('withdrawBtn');
    fireEvent.click(button);

    await waitFor(() => {
      expect(NotificationToast.success).toHaveBeenCalledWith(
        'MembershipRequestWithdrawn',
      );
    });
  });

  it('shows error when withdrawing if membership request not found', async () => {
    const pendingData = {
      ...mockData,
      membershipRequestStatus: 'pending',
      membershipRequests: [],
    };

    render(
      <MockedProvider>
        <OrganizationCard data={pendingData} />
      </MockedProvider>,
    );

    const button = screen.getByTestId('withdrawBtn');
    fireEvent.click(button);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'MembershipRequestNotFound',
      );
    });
  });

  it('handles error when withdrawing membership request', async () => {
    const pendingData = {
      ...mockData,
      membershipRequestStatus: 'pending',
      membershipRequests: [{ id: 'req123', user: { id: 'user123' } }],
    };

    const mocks = [
      {
        request: {
          query: CANCEL_MEMBERSHIP_REQUEST,
          variables: { membershipRequestId: 'req123' },
        },
        error: new Error('Network error'),
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <OrganizationCard data={pendingData} />
      </MockedProvider>,
    );

    const button = screen.getByTestId('withdrawBtn');
    fireEvent.click(button);

    await waitFor(() => {
      expect(NotificationToast.error).toHaveBeenCalled();
    });

    expect(NotificationToast.error).toHaveBeenCalledWith('errorOccurred');
  });
  it('handles error gracefully when withdrawing fails in development environment', async () => {
    const pendingData = {
      ...mockData,
      membershipRequestStatus: 'pending',
      membershipRequests: [{ id: 'req123', user: { id: 'user123' } }],
    };

    const mocks = [
      {
        request: {
          query: CANCEL_MEMBERSHIP_REQUEST,
          variables: { membershipRequestId: 'req123' },
        },
        error: new Error('Network error'),
      },
    ];

    const originalEnv = process.env;

    try {
      process.env = { ...originalEnv, NODE_ENV: 'development' };

      render(
        <MockedProvider mocks={mocks}>
          <OrganizationCard data={pendingData} />
        </MockedProvider>,
      );

      const button = screen.getByTestId('withdrawBtn');
      fireEvent.click(button);

      await waitFor(() => {
        expect(NotificationToast.error).toHaveBeenCalled();
      });

      expect(NotificationToast.error).toHaveBeenCalledWith('errorOccurred');
    } finally {
      process.env = originalEnv;
    }
  });
});

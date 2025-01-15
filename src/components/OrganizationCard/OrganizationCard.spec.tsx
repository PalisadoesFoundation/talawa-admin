import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { MockedResponse } from '@apollo/client/testing';
import { toast } from 'react-toastify';
import i18n from 'i18next';
import OrganizationCard from './OrganizationCard';
import { TestWrapper } from '../../components/test-utils/TestWrapper';
import {
  SEND_MEMBERSHIP_REQUEST,
  JOIN_PUBLIC_ORGANIZATION,
  CANCEL_MEMBERSHIP_REQUEST,
} from 'GraphQl/Mutations/OrganizationMutations';
import { USER_JOINED_ORGANIZATIONS } from 'GraphQl/Queries/OrganizationQueries';

// Mock hooks
const mockGetItem = vi.fn();
vi.mock('utils/useLocalstorage', () => ({
  __esModule: true,
  default: () => ({
    getItem: () => mockGetItem(),
    setItem: vi.fn(),
  }),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => {
  const actual = vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    BrowserRouter: ({
      children,
    }: {
      children: React.ReactNode;
    }): JSX.Element => <div>{children}</div>,
  };
});

// Initialize i18n for testing
i18n.init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        users: {
          MembershipRequestSent: 'Request sent',
          orgJoined: 'Joined',
          AlreadyJoined: 'Already joined',
          errorOccured: 'error occurred',
          MembershipRequestNotFound: 'Request not found',
          MembershipRequestWithdrawn: 'Request withdrawn',
          visit: 'Visit',
          withdraw: 'Withdraw',
          joinNow: 'Join Now',
        },
      },
      common: {
        admins: 'Admins',
        members: 'Members',
      },
    },
  },
});

// Success mocks
const successMocks: MockedResponse[] = [
  {
    request: {
      query: SEND_MEMBERSHIP_REQUEST,
      variables: { organizationId: '123' },
    },
    result: {
      data: { sendMembershipRequest: { success: true } },
    },
  },
  {
    request: {
      query: JOIN_PUBLIC_ORGANIZATION,
      variables: { organizationId: '123' },
    },
    result: {
      data: { joinPublicOrganization: { success: true } },
    },
  },
  {
    request: {
      query: CANCEL_MEMBERSHIP_REQUEST,
      variables: { membershipRequestId: 'requestId' },
    },
    result: {
      data: { cancelMembershipRequest: { success: true } },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: { userId: 'mockUserId' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '123',
            name: 'Test Org',
          },
        ],
      },
    },
  },
];

// Error mocks
const errorMocks: MockedResponse[] = [
  {
    request: {
      query: SEND_MEMBERSHIP_REQUEST,
      variables: { organizationId: '123' },
    },
    error: new Error('Failed to send request'),
  },
  {
    request: {
      query: JOIN_PUBLIC_ORGANIZATION,
      variables: { organizationId: '123' },
    },
    error: new Error('Failed to join organization'),
  },
  {
    request: {
      query: CANCEL_MEMBERSHIP_REQUEST,
      variables: { membershipRequestId: 'requestId' },
    },
    error: new Error('Failed to cancel request'),
  },
];

describe('OrganizationCard Component', () => {
  const defaultProps = {
    id: '123',
    image: 'https://via.placeholder.com/80',
    firstName: 'John',
    lastName: 'Doe',
    name: 'Sample',
    description: '',
    admins: [],
    members: [],
    address: {
      city: '',
      countryCode: '',
      line1: '',
      postalCode: '',
      state: '',
    },
    membershipRequestStatus: '',
    userRegistrationRequired: false,
    membershipRequests: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetItem.mockReturnValue('mockUserId');
  });

  // Basic Rendering Tests
  describe('Rendering', () => {
    it('should render props and text elements', () => {
      render(
        <TestWrapper mocks={successMocks}>
          <OrganizationCard isJoined={false} {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.getByText(defaultProps.name)).toBeInTheDocument();
      expect(screen.getByText(/Admins/i)).toBeInTheDocument();
      expect(screen.getByText(/Members/i)).toBeInTheDocument();
    });

    it('should render without image', () => {
      const props = { ...defaultProps, image: '' };
      render(
        <TestWrapper mocks={successMocks}>
          <OrganizationCard isJoined={false} {...props} />
        </TestWrapper>,
      );

      expect(screen.getByText(props.name)).toBeInTheDocument();
    });

    it('should render full address when provided', () => {
      const props = {
        ...defaultProps,
        address: {
          city: 'Test City',
          countryCode: 'TC',
          line1: 'Test Line 1',
          postalCode: '12345',
          state: 'TS',
        },
      };

      render(
        <TestWrapper mocks={successMocks}>
          <OrganizationCard isJoined={false} {...props} />
        </TestWrapper>,
      );

      expect(screen.getByText(/Test Line 1/)).toBeInTheDocument();
      expect(screen.getByText(/Test City/)).toBeInTheDocument();
      expect(screen.getByText(/TC/)).toBeInTheDocument();
    });
  });

  // Hook Tests
  describe('Hooks Behavior', () => {
    it('should handle localStorage error gracefully', () => {
      mockGetItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      render(
        <TestWrapper mocks={successMocks}>
          <OrganizationCard isJoined={false} {...defaultProps} />
        </TestWrapper>,
      );

      const joinButton = screen.getByTestId('joinBtn');
      expect(joinButton).toBeInTheDocument();
      expect(joinButton).toHaveTextContent('joinNow');
    });

    it('should navigate to organization page on visit', () => {
      render(
        <TestWrapper mocks={successMocks}>
          <OrganizationCard isJoined={true} {...defaultProps} />
        </TestWrapper>,
      );

      const visitButton = screen.getByTestId('manageBtn');
      fireEvent.click(visitButton);
      expect(mockNavigate).toHaveBeenCalledWith(
        `/user/organization/${defaultProps.id}`,
      );
    });

    it('should correctly translate all text elements', () => {
      render(
        <TestWrapper mocks={successMocks}>
          <OrganizationCard isJoined={false} {...defaultProps} />
        </TestWrapper>,
      );

      const adminText = screen.getByText(/Admins:/);
      const memberText = screen.getByText(/Members:/);

      expect(adminText).toBeInTheDocument();
      expect(memberText).toBeInTheDocument();
    });
  });

  // Mutation Tests
  describe('Mutations', () => {
    it('should handle joining a private organization successfully', async () => {
      render(
        <TestWrapper mocks={successMocks}>
          <OrganizationCard
            {...defaultProps}
            userRegistrationRequired={true}
            isJoined={false}
          />
        </TestWrapper>,
      );

      const joinButton = screen.getByText('joinNow');
      await fireEvent.click(joinButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('MembershipRequestSent');
      });
    });

    it('should handle joining a public organization successfully', async () => {
      render(
        <TestWrapper mocks={successMocks}>
          <OrganizationCard
            {...defaultProps}
            userRegistrationRequired={false}
            isJoined={false}
          />
        </TestWrapper>,
      );

      const joinButton = screen.getByText('joinNow');
      await fireEvent.click(joinButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('orgJoined');
      });
    });

    it('should handle private organization join error', async () => {
      render(
        <TestWrapper mocks={errorMocks}>
          <OrganizationCard
            {...defaultProps}
            userRegistrationRequired={true}
            isJoined={false}
          />
        </TestWrapper>,
      );

      const joinButton = screen.getByTestId('joinBtn');
      await fireEvent.click(joinButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('errorOccured');
      });
    });
  });

  it('should handle membership withdrawal successfully', async () => {
    const props = {
      ...defaultProps,
      membershipRequestStatus: 'pending',
      membershipRequests: [{ _id: 'requestId', user: { _id: 'mockUserId' } }],
    };

    render(
      <TestWrapper mocks={successMocks}>
        <OrganizationCard {...props} isJoined={false} />
      </TestWrapper>,
    );

    const withdrawButton = screen.getByTestId('withdrawBtn');
    await fireEvent.click(withdrawButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('MembershipRequestWithdrawn');
    });
  });

  it('should handle membership withdrawal error when request not found', async () => {
    const props = {
      ...defaultProps,
      membershipRequestStatus: 'pending',
      membershipRequests: [], // Empty requests to trigger error
    };

    render(
      <TestWrapper mocks={errorMocks}>
        <OrganizationCard {...props} isJoined={false} />
      </TestWrapper>,
    );

    const withdrawButton = screen.getByTestId('withdrawBtn');
    await fireEvent.click(withdrawButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('MembershipRequestNotFound');
    });
  });
});

import '@testing-library/dom';
import { vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { MockedResponse } from '@apollo/client/testing';
import { toast } from 'react-toastify';
import i18n from 'i18next';
import OrganizationCard from './OrganizationCard';
import { TestWrapper } from '../../../components/test-utils/TestWrapper';
import {
  SEND_MEMBERSHIP_REQUEST,
  JOIN_PUBLIC_ORGANIZATION,
  CANCEL_MEMBERSHIP_REQUEST,
} from 'GraphQl/Mutations/OrganizationMutations';
import {
  USER_JOINED_ORGANIZATIONS_PG,
  ORGANIZATIONS_LIST,
} from 'GraphQl/Queries/Queries';
import { InterfaceOrganizationCardProps } from 'types/Organization/interface';

// Mock hooks
let mockGetItem: ReturnType<typeof vi.fn>;
vi.mock('utils/useLocalstorage', () => ({
  getItem: () => mockGetItem(),
  setItem: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

let mockNavigate: ReturnType<typeof vi.fn>;
vi.mock('react-router', () => {
  const actual = vi.importActual('react-router');
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

vi.mock('components/OrgListCard/TruncatedText', () => ({
  default: ({ text }: { text: string }) => <span>{text}</span>,
}));

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
          UserIdNotFound: 'User ID not found',
          MembershipRequestNotFound: 'Request not found',
          MembershipRequestWithdrawn: 'Request withdrawn',
          visit: 'Visit',
          withdraw: 'Withdraw',
          joinNow: 'joinNow',
        },
        common: {
          admins: 'Admins',
          members: 'Members',
        },
      },
    },
  },
});

// Success mocks updated for new interface
const successMocks: MockedResponse[] = [
  {
    request: {
      query: SEND_MEMBERSHIP_REQUEST,
      variables: { organizationId: '123' },
    },
    result: {
      data: {
        sendMembershipRequest: {
          success: true,
          __typename: 'MembershipRequest',
        },
      },
    },
  },
  {
    request: {
      query: JOIN_PUBLIC_ORGANIZATION,
      variables: {
        input: {
          organizationId: '123',
        },
      },
    },
    result: {
      data: {
        joinPublicOrganization: {
          organizationId: '123',
          __typename: 'Organization',
        },
      },
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
      query: USER_JOINED_ORGANIZATIONS_PG,
      variables: { id: 'mockUserId', first: 5, filter: undefined },
    },
    result: {
      data: {
        user: {
          __typename: 'User',
          organizationsWhereMember: {
            __typename: 'OrganizationConnection',
            pageInfo: {
              hasNextPage: false,
              __typename: 'PageInfo',
            },
            edges: [
              {
                __typename: 'OrganizationEdge',
                node: {
                  __typename: 'Organization',
                  id: '123',
                  name: 'Test Org',
                  description: '',
                  avatarURL: '',
                  membersCount: 10,
                  adminsCount: 2,
                  city: '',
                  countryCode: '',
                  addressLine1: '',
                  postalCode: '',
                  state: '',
                  members: {
                    __typename: 'UserConnection',
                    edges: [],
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: {},
    },
    result: {
      data: {
        organizations: {
          __typename: 'OrganizationConnection',
          edges: [],
          pageInfo: {
            hasNextPage: false,
            __typename: 'PageInfo',
          },
        },
      },
    },
  },
];

// Error mocks remain largely unchanged
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
      variables: {
        input: {
          organizationId: '123',
        },
      },
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

// Define default props based on new interface
const defaultProps: InterfaceOrganizationCardProps = {
  id: '123',
  name: 'Sample',
  image: 'https://via.placeholder.com/80',
  description: '',
  members: [],
  addressLine1: '',
  membersCount: 0,
  adminsCount: 0,
  membershipRequestStatus: '',
  userRegistrationRequired: false,
  membershipRequests: [],
  isJoined: false,
};

describe('OrganizationCard Component with New Interface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetItem = vi.fn();
    mockNavigate = vi.fn();
    mockGetItem.mockReturnValue('mockUserId');
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Basic Rendering Tests
  describe('Rendering', () => {
    it('should render props and text elements', () => {
      render(
        <TestWrapper mocks={successMocks}>
          <OrganizationCard {...defaultProps} />
        </TestWrapper>,
      );

      expect(screen.getByText(defaultProps.name)).toBeInTheDocument();
      expect(screen.getByText(/Members/i)).toBeInTheDocument();
    });

    it('should render without image', () => {
      const props = { ...defaultProps, image: '' };
      render(
        <TestWrapper mocks={successMocks}>
          <OrganizationCard {...props} />
        </TestWrapper>,
      );

      expect(screen.getByText(props.name)).toBeInTheDocument();
    });

    it('should render full address when provided', () => {
      const props = {
        ...defaultProps,
        addressLine1: 'Test Line 1',
      };

      render(
        <TestWrapper mocks={successMocks}>
          <OrganizationCard {...props} />
        </TestWrapper>,
      );

      expect(screen.getByText(/Test Line 1/)).toBeInTheDocument();
    });

    it('should display membersCount and adminsCount', () => {
      const props = {
        ...defaultProps,
        membersCount: 15,
        adminsCount: 3,
      };

      render(
        <TestWrapper mocks={successMocks}>
          <OrganizationCard {...props} />
        </TestWrapper>,
      );

      const membersElements = screen.queryAllByText((content, element) => {
        if (!element) return false;
        const text = element.textContent ?? '';
        return text.includes('members') && text.includes('15');
      });
      expect(membersElements.length).toBeGreaterThan(0);
      expect(membersElements[0]).toBeInTheDocument();
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
          <OrganizationCard {...defaultProps} />
        </TestWrapper>,
      );

      const joinButton = screen.getByTestId('joinBtn');
      expect(joinButton).toBeInTheDocument();
      expect(joinButton).toHaveTextContent('joinNow');
    });

    it('should navigate to organization page on visit when isJoined is true', () => {
      render(
        <TestWrapper mocks={successMocks}>
          <OrganizationCard {...defaultProps} isJoined={true} />
        </TestWrapper>,
      );

      const visitButton = screen.getByTestId('manageBtn');
      fireEvent.click(visitButton);
      expect(mockNavigate).toHaveBeenCalledWith(
        `/user/organization/${defaultProps.id}`,
      );
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
        expect(toast.success).toHaveBeenCalledWith('Request sent');
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
        expect(toast.success).toHaveBeenCalledWith('Joined');
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
        expect(toast.error).toHaveBeenCalledWith('error occurred');
      });
    });

    it('should handle membership withdrawal successfully', async () => {
      const props = {
        ...defaultProps,
        membershipRequestStatus: 'pending',
        membershipRequests: [{ id: 'requestId', user: { id: 'mockUserId' } }],
      };

      render(
        <TestWrapper mocks={successMocks}>
          <OrganizationCard {...props} />
        </TestWrapper>,
      );

      const withdrawButton = screen.getByTestId('withdrawBtn');
      await fireEvent.click(withdrawButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Request withdrawn');
      });
    });

    it('should log development error and show generic error toast', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      process.env.NODE_ENV = 'development';

      const props = {
        ...defaultProps,
        membershipRequestStatus: 'pending',
        membershipRequests: [{ id: 'requestId', user: { id: 'mockUserId' } }],
      };

      const errorMocks: MockedResponse[] = [
        {
          request: {
            query: CANCEL_MEMBERSHIP_REQUEST,
            variables: { membershipRequestId: 'requestId' },
          },
          error: new Error('Withdrawal failed'),
        },
      ];

      render(
        <TestWrapper mocks={errorMocks}>
          <OrganizationCard {...props} />
        </TestWrapper>,
      );

      const withdrawButton = screen.getByTestId('withdrawBtn');
      await fireEvent.click(withdrawButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to withdraw membership request:',
          expect.any(Error),
        );
        expect(toast.error).toHaveBeenCalledWith('error occurred');
      });

      process.env.NODE_ENV = undefined;
      consoleErrorSpy.mockRestore();
    });

    it('should handle already joined error when joining organization', async () => {
      const errorMocksWithAlreadyJoined: MockedResponse[] = [
        {
          request: {
            query: JOIN_PUBLIC_ORGANIZATION,
            variables: {
              input: {
                organizationId: '123',
              },
            },
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
        <TestWrapper mocks={errorMocksWithAlreadyJoined}>
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
        expect(toast.error).toHaveBeenCalledWith('Already joined');
      });
    });

    it('should handle membership request not found', async () => {
      mockGetItem.mockReturnValue('testUserId');

      const cancelRequestSpy = vi.fn(() => ({
        data: {
          cancelMembershipRequest: { success: true },
        },
      }));

      const mocksWithSpy = [
        ...successMocks,
        {
          request: {
            query: CANCEL_MEMBERSHIP_REQUEST,
            variables: { membershipRequestId: 'requestId' },
          },
          result: cancelRequestSpy,
        },
      ];

      const props = {
        ...defaultProps,
        membershipRequestStatus: 'pending',
        membershipRequests: [
          {
            id: 'requestId',
            user: { id: 'differentUserId' },
          },
        ],
      };

      render(
        <TestWrapper mocks={mocksWithSpy}>
          <OrganizationCard {...props} />
        </TestWrapper>,
      );

      const withdrawButton = screen.getByTestId('withdrawBtn');
      await fireEvent.click(withdrawButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Request not found');
      });

      expect(cancelRequestSpy).not.toHaveBeenCalled();
    });

    it('should handle withdrawal attempt with no userId', async () => {
      mockGetItem.mockReturnValue(null);

      const cancelRequestSpy = vi.fn(() => ({
        data: {
          cancelMembershipRequest: { success: true },
        },
      }));

      const mocksWithSpy = [
        ...successMocks,
        {
          request: {
            query: CANCEL_MEMBERSHIP_REQUEST,
            variables: { membershipRequestId: 'requestId' },
          },
          result: cancelRequestSpy,
        },
      ];

      const props = {
        ...defaultProps,
        membershipRequestStatus: 'pending',
        membershipRequests: [{ id: 'requestId', user: { id: 'mockUserId' } }],
      };

      render(
        <TestWrapper mocks={mocksWithSpy}>
          <OrganizationCard {...props} />
        </TestWrapper>,
      );

      const withdrawButton = screen.getByTestId('withdrawBtn');
      await fireEvent.click(withdrawButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('User ID not found');
      });

      expect(cancelRequestSpy).not.toHaveBeenCalled();
    });

    it('should not log error in production mode', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      process.env.NODE_ENV = 'production';

      const props = {
        ...defaultProps,
        membershipRequestStatus: 'pending',
        membershipRequests: [{ id: 'requestId', user: { id: 'mockUserId' } }],
      };

      const errorMocks: MockedResponse[] = [
        {
          request: {
            query: CANCEL_MEMBERSHIP_REQUEST,
            variables: { membershipRequestId: 'requestId' },
          },
          error: new Error('Withdrawal failed'),
        },
      ];

      render(
        <TestWrapper mocks={errorMocks}>
          <OrganizationCard {...props} />
        </TestWrapper>,
      );

      const withdrawButton = screen.getByTestId('withdrawBtn');
      await fireEvent.click(withdrawButton);

      await waitFor(() => {
        expect(consoleErrorSpy).not.toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith('error occurred');
      });

      process.env.NODE_ENV = undefined;
      consoleErrorSpy.mockRestore();
    });

    it('should handle generic thrown error (non-GraphQL)', async () => {
      const genericErrorMock: MockedResponse[] = [
        {
          request: {
            query: JOIN_PUBLIC_ORGANIZATION,
            variables: {
              input: {
                organizationId: '123',
              },
            },
          },
          error: new Error('Network error'),
        },
      ];

      render(
        <TestWrapper mocks={genericErrorMock}>
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
        expect(toast.error).toHaveBeenCalledWith('error occurred');
      });
    });

    it('should refetch queries after successful join', async () => {
      const organizationListMock = {
        request: {
          query: ORGANIZATIONS_LIST,
          variables: {},
        },
        result: {
          data: {
            organizations: {
              __typename: 'OrganizationConnection',
              edges: [],
              pageInfo: {
                hasNextPage: false,
                __typename: 'PageInfo',
              },
            },
          },
        },
      };

      const joinMutation = {
        request: {
          query: JOIN_PUBLIC_ORGANIZATION,
          variables: {
            input: {
              organizationId: '123',
            },
          },
        },
        result: {
          data: {
            joinPublicOrganization: {
              organizationId: '123',
              __typename: 'Organization',
            },
          },
        },
      };

      const userOrgQuery = {
        request: {
          query: USER_JOINED_ORGANIZATIONS_PG,
          variables: { id: 'mockUserId', first: 5, filter: undefined },
        },
        result: {
          data: {
            user: {
              __typename: 'User',
              organizationsWhereMember: {
                __typename: 'OrganizationConnection',
                pageInfo: {
                  hasNextPage: false,
                  __typename: 'PageInfo',
                },
                edges: [],
              },
            },
          },
        },
      };

      // Mock window.location.reload
      const reloadMock = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { reload: reloadMock },
        writable: true,
      });

      render(
        <TestWrapper mocks={[joinMutation, userOrgQuery, organizationListMock]}>
          <OrganizationCard
            {...defaultProps}
            userRegistrationRequired={false}
            isJoined={false}
          />
        </TestWrapper>,
      );

      const joinButton = screen.getByTestId('joinBtn');
      await fireEvent.click(joinButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Joined');
      });

      // Wait for reload to be called
      await waitFor(
        () => {
          expect(reloadMock).toHaveBeenCalled();
        },
        { timeout: 2000 },
      );
    });
  });
});

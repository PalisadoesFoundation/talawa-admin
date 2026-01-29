import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import MembershipRequestsCard from './MembershipRequestsCard';
import userEvent from '@testing-library/user-event';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: { type: '3rdParty', init: () => {} },
}));

const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
}));

// Mock NotificationToast
vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: toastMocks,
}));

// Mock CardItem component
vi.mock(
  'components/AdminPortal/OrganizationDashCards/CardItem/CardItem',
  () => ({
    default: ({
      title,
      creator,
    }: {
      title: string;
      creator?: { name: string };
    }) => (
      <div data-testid="card-item">
        <div>{title}</div>
        <div>{creator?.name}</div>
      </div>
    ),
  }),
);

// Mock CardItemLoading component
vi.mock(
  'components/AdminPortal/OrganizationDashCards/CardItem/Loader/CardItemLoading',
  () => ({
    default: () => <div data-testid="card-loading" />,
  }),
);

describe('MembershipRequestsCard Component', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    toastMocks.success.mockReset();
    toastMocks.error.mockReset();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });
  const mockMembershipRequestData = {
    organization: {
      membershipRequests: [
        {
          status: 'pending' as const,
          membershipRequestId: 'request1',
          user: { name: 'John Doe' },
        },
        {
          status: 'pending' as const,
          membershipRequestId: 'request2',
          user: { name: 'Jane Smith' },
        },
        {
          status: 'pending' as const,
          membershipRequestId: 'request3',
          user: { name: 'Bob Johnson' },
        },
      ],
    },
  };

  const mockProps = {
    membershipRequestData: mockMembershipRequestData,
    isLoading: false,
    onViewAllClick: vi.fn(),
  };

  it('renders membership requests card with correct title', () => {
    render(<MembershipRequestsCard {...mockProps} />);

    expect(screen.getByText('membershipRequests')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    const loadingProps = { ...mockProps, isLoading: true };
    render(<MembershipRequestsCard {...loadingProps} />);

    const loadingElements = screen.getAllByTestId('card-loading');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('calls onViewAllClick when view all button is clicked', async () => {
    render(<MembershipRequestsCard {...mockProps} />);

    // Use the specific test id for membership requests button
    const viewAllButton = screen.getByTestId('viewAllMembershipRequests');
    await user.click(viewAllButton);

    expect(mockProps.onViewAllClick).toHaveBeenCalled();
  });

  it('handles empty membership requests list gracefully', () => {
    const emptyData = {
      organization: {
        membershipRequests: [],
      },
    };
    const emptyProps = { ...mockProps, membershipRequestData: emptyData };
    render(<MembershipRequestsCard {...emptyProps} />);

    expect(screen.getByText('membershipRequests')).toBeInTheDocument();
    expect(screen.getByTestId('viewAllMembershipRequests')).toBeInTheDocument();
  });

  it('handles missing organization data gracefully', () => {
    const missingOrgProps = { ...mockProps, membershipRequestData: {} };
    render(<MembershipRequestsCard {...missingOrgProps} />);

    expect(screen.getByText('membershipRequests')).toBeInTheDocument();
  });

  it('renders with correct card structure', () => {
    render(<MembershipRequestsCard {...mockProps} />);

    // Check for card title and button
    const cardTitle = screen.getByText('membershipRequests');
    expect(cardTitle).toBeInTheDocument();

    const viewAllButton = screen.getByTestId('viewAllMembershipRequests');
    expect(viewAllButton).toBeInTheDocument();
  });

  it('shows no membership requests message when empty', () => {
    const emptyData = {
      organization: {
        membershipRequests: [],
      },
    };
    const emptyProps = { ...mockProps, membershipRequestData: emptyData };
    render(<MembershipRequestsCard {...emptyProps} />);

    expect(screen.getByText('noMembershipRequests')).toBeInTheDocument();
  });

  it('renders volunteer rankings section', () => {
    render(<MembershipRequestsCard {...mockProps} />);

    // The component also renders volunteer rankings
    expect(screen.getByText('volunteerRankings')).toBeInTheDocument();
    expect(screen.getByText('comingSoon')).toBeInTheDocument();
  });

  it('has correct button test ids', () => {
    render(<MembershipRequestsCard {...mockProps} />);

    // Check that both buttons have correct test ids
    expect(screen.getByTestId('viewAllMembershipRequests')).toBeInTheDocument();
    expect(screen.getByTestId('viewAllLeaderboard')).toBeInTheDocument();
  });

  it('shows toast when clicking volunteer rankings view all', async () => {
    render(<MembershipRequestsCard {...mockProps} />);

    const leaderboardButton = screen.getByTestId('viewAllLeaderboard');
    await user.click(leaderboardButton);

    expect(NotificationToast.success).toHaveBeenCalledWith('comingSoon');
  });

  it('handles async onViewAllClick correctly', async () => {
    const asyncClickHandler = vi.fn().mockResolvedValue(undefined);
    const asyncProps = { ...mockProps, onViewAllClick: asyncClickHandler };
    render(<MembershipRequestsCard {...asyncProps} />);

    const viewAllButton = screen.getByTestId('viewAllMembershipRequests');
    await user.click(viewAllButton);

    expect(asyncClickHandler).toHaveBeenCalled();
  });
});

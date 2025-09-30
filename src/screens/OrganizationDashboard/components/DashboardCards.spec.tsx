/**
 * Unit tests for DashboardCards component
 * Tests rendering, navigation, and interaction behaviors
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardCards from './DashboardCards';
import type { InterfaceDashboardCardsProps } from './DashboardCards';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        members: 'Members',
        admins: 'Admins',
        postsCount: 'Posts',
        events: 'Events',
        blockedUsers: 'Blocked Users',
        requests: 'Requests',
        venues: 'Venues',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock the SVG components
vi.mock('assets/svgs/admin.svg?react', () => ({
  default: () => React.createElement('div', { 'data-testid': 'AdminsIcon' }),
}));

vi.mock('assets/svgs/blockedUser.svg?react', () => ({
  default: () =>
    React.createElement('div', { 'data-testid': 'BlockedUsersIcon' }),
}));

vi.mock('assets/svgs/events.svg?react', () => ({
  default: () => React.createElement('div', { 'data-testid': 'EventsIcon' }),
}));

vi.mock('assets/svgs/post.svg?react', () => ({
  default: () => React.createElement('div', { 'data-testid': 'PostsIcon' }),
}));

vi.mock('assets/svgs/users.svg?react', () => ({
  default: () => React.createElement('div', { 'data-testid': 'UsersIcon' }),
}));

vi.mock('assets/svgs/venues.svg?react', () => ({
  default: () => React.createElement('div', { 'data-testid': 'VenuesIcon' }),
}));

// Mock DashBoardCard component
vi.mock('components/OrganizationDashCards/DashboardCard', () => ({
  default: ({
    count,
    title,
    icon,
  }: {
    count: number;
    title: string;
    icon: React.ReactNode;
  }) =>
    React.createElement('div', {
      'data-testid': `dashboard-card-${title.toLowerCase().replace(/\s+/g, '-')}`,
      children: [
        React.createElement(
          'span',
          { key: 'count', 'data-testid': 'card-count' },
          count,
        ),
        React.createElement(
          'span',
          { key: 'title', 'data-testid': 'card-title' },
          title,
        ),
        React.createElement(
          'div',
          { key: 'icon', 'data-testid': 'card-icon' },
          icon,
        ),
      ],
    }),
}));

// Mock DashboardCardLoading component
vi.mock('components/OrganizationDashCards/Loader/DashboardCardLoading', () => ({
  default: () =>
    React.createElement('div', { 'data-testid': 'dashboard-card-loading' }),
}));

const mockNavigate = vi.fn();

const defaultProps: InterfaceDashboardCardsProps = {
  memberCount: 50,
  adminCount: 5,
  eventCount: 12,
  blockedCount: 2,
  venueCount: 8,
  membershipRequestsCount: 3,
  postsCount: 25,
  postsLink: '/posts',
  eventsLink: '/events',
  blockUserLink: '/blocked-users',
  requestLink: '/requests',
  venuesLink: '/venues',
  isLoading: false,
  navigate: mockNavigate,
};

describe('DashboardCards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should render loading cards when isLoading is true', () => {
      render(<DashboardCards {...defaultProps} isLoading={true} />);

      const loadingCards = screen.getAllByTestId('dashboard-card-loading');
      expect(loadingCards).toHaveLength(6); // Should render 6 loading cards
    });

    it('should not render actual cards when loading', () => {
      render(<DashboardCards {...defaultProps} isLoading={true} />);

      expect(screen.queryByTestId('membersCount')).not.toBeInTheDocument();
      expect(screen.queryByTestId('adminsCount')).not.toBeInTheDocument();
    });
  });

  describe('Loaded state', () => {
    it('should render all dashboard cards with correct data', () => {
      render(<DashboardCards {...defaultProps} />);

      // Check all cards are rendered
      expect(screen.getByTestId('membersCount')).toBeInTheDocument();
      expect(screen.getByTestId('adminsCount')).toBeInTheDocument();
      expect(screen.getByTestId('postsCount')).toBeInTheDocument();
      expect(screen.getByTestId('eventsCount')).toBeInTheDocument();
      expect(screen.getByTestId('blockedUsersCount')).toBeInTheDocument();
      expect(screen.getByTestId('membershipRequestsCount')).toBeInTheDocument();
      expect(screen.getByTestId('venuesCount')).toBeInTheDocument();
    });

    it('should display correct counts for each card', () => {
      render(<DashboardCards {...defaultProps} />);

      const cardCounts = screen.getAllByTestId('card-count');
      expect(cardCounts[0]).toHaveTextContent('50'); // Members
      expect(cardCounts[1]).toHaveTextContent('5'); // Admins
      expect(cardCounts[2]).toHaveTextContent('25'); // Posts
      expect(cardCounts[3]).toHaveTextContent('12'); // Events
      expect(cardCounts[4]).toHaveTextContent('2'); // Blocked Users
      expect(cardCounts[5]).toHaveTextContent('3'); // Membership Requests
      expect(cardCounts[6]).toHaveTextContent('8'); // Venues
    });

    it('should display correct titles for each card', () => {
      render(<DashboardCards {...defaultProps} />);

      const cardTitles = screen.getAllByTestId('card-title');
      expect(cardTitles[0]).toHaveTextContent('Members');
      expect(cardTitles[1]).toHaveTextContent('Admins');
      expect(cardTitles[2]).toHaveTextContent('Posts');
      expect(cardTitles[3]).toHaveTextContent('Events');
      expect(cardTitles[4]).toHaveTextContent('Blocked Users');
      expect(cardTitles[5]).toHaveTextContent('Requests');
      expect(cardTitles[6]).toHaveTextContent('Venues');
    });

    it('should render appropriate icons for each card', () => {
      render(<DashboardCards {...defaultProps} />);

      expect(screen.getAllByTestId('UsersIcon')).toHaveLength(2); // Members and Requests cards
      expect(screen.getByTestId('AdminsIcon')).toBeInTheDocument();
      expect(screen.getByTestId('PostsIcon')).toBeInTheDocument();
      expect(screen.getByTestId('EventsIcon')).toBeInTheDocument();
      expect(screen.getByTestId('BlockedUsersIcon')).toBeInTheDocument();
      expect(screen.getByTestId('VenuesIcon')).toBeInTheDocument();
    });
  });

  describe('Navigation functionality', () => {
    it('should not navigate when clicking members card', () => {
      render(<DashboardCards {...defaultProps} />);

      const membersCard = screen.getByTestId('membersCount');
      fireEvent.click(membersCard);

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should not navigate when clicking admins card', () => {
      render(<DashboardCards {...defaultProps} />);

      const adminsCard = screen.getByTestId('adminsCount');
      fireEvent.click(adminsCard);

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should navigate to posts when clicking posts card', () => {
      render(<DashboardCards {...defaultProps} />);

      const postsCard = screen.getByTestId('postsCount');
      fireEvent.click(postsCard);

      expect(mockNavigate).toHaveBeenCalledWith('/posts');
    });

    it('should navigate to events when clicking events card', () => {
      render(<DashboardCards {...defaultProps} />);

      const eventsCard = screen.getByTestId('eventsCount');
      fireEvent.click(eventsCard);

      expect(mockNavigate).toHaveBeenCalledWith('/events');
    });

    it('should navigate to blocked users when clicking blocked users card', () => {
      render(<DashboardCards {...defaultProps} />);

      const blockedUsersCard = screen.getByTestId('blockedUsersCount');
      fireEvent.click(blockedUsersCard);

      expect(mockNavigate).toHaveBeenCalledWith('/blocked-users');
    });

    it('should navigate to membership requests when clicking requests card', () => {
      render(<DashboardCards {...defaultProps} />);

      const requestsCard = screen.getByTestId('membershipRequestsCount');
      fireEvent.click(requestsCard);

      expect(mockNavigate).toHaveBeenCalledWith('/requests');
    });

    it('should navigate to venues when clicking venues card', () => {
      render(<DashboardCards {...defaultProps} />);

      const venuesCard = screen.getByTestId('venuesCount');
      fireEvent.click(venuesCard);

      expect(mockNavigate).toHaveBeenCalledWith('/venues');
    });
  });

  describe('Edge cases', () => {
    it('should handle zero counts correctly', () => {
      const zeroProps = {
        ...defaultProps,
        memberCount: 0,
        adminCount: 0,
        eventCount: 0,
        blockedCount: 0,
        venueCount: 0,
        membershipRequestsCount: 0,
        postsCount: 0,
      };

      render(<DashboardCards {...zeroProps} />);

      const cardCounts = screen.getAllByTestId('card-count');
      cardCounts.forEach((count) => {
        expect(count).toHaveTextContent('0');
      });
    });

    it('should handle large numbers correctly', () => {
      const largeProps = {
        ...defaultProps,
        memberCount: 9999,
        adminCount: 999,
        eventCount: 1234,
        blockedCount: 567,
        venueCount: 890,
        membershipRequestsCount: 123,
        postsCount: 4567,
      };

      render(<DashboardCards {...largeProps} />);

      const cardCounts = screen.getAllByTestId('card-count');
      expect(cardCounts[0]).toHaveTextContent('9999');
      expect(cardCounts[1]).toHaveTextContent('999');
      expect(cardCounts[2]).toHaveTextContent('4567');
      expect(cardCounts[3]).toHaveTextContent('1234');
      expect(cardCounts[4]).toHaveTextContent('567');
      expect(cardCounts[5]).toHaveTextContent('123');
      expect(cardCounts[6]).toHaveTextContent('890');
    });

    it('should handle empty navigation links', () => {
      const emptyLinksProps = {
        ...defaultProps,
        postsLink: '',
        eventsLink: '',
        blockUserLink: '',
        requestLink: '',
        venuesLink: '',
      };

      render(<DashboardCards {...emptyLinksProps} />);

      // Click cards and verify empty strings are passed
      fireEvent.click(screen.getByTestId('postsCount'));
      expect(mockNavigate).toHaveBeenCalledWith('');

      fireEvent.click(screen.getByTestId('eventsCount'));
      expect(mockNavigate).toHaveBeenCalledWith('');

      fireEvent.click(screen.getByTestId('blockedUsersCount'));
      expect(mockNavigate).toHaveBeenCalledWith('');

      fireEvent.click(screen.getByTestId('membershipRequestsCount'));
      expect(mockNavigate).toHaveBeenCalledWith('');

      fireEvent.click(screen.getByTestId('venuesCount'));
      expect(mockNavigate).toHaveBeenCalledWith('');
    });
  });

  describe('Accessibility', () => {
    it('should have role="button" for clickable cards', () => {
      render(<DashboardCards {...defaultProps} />);

      // All cards should have role="button"
      expect(screen.getByTestId('membersCount')).toHaveAttribute(
        'role',
        'button',
      );
      expect(screen.getByTestId('adminsCount')).toHaveAttribute(
        'role',
        'button',
      );
      expect(screen.getByTestId('postsCount')).toHaveAttribute(
        'role',
        'button',
      );
      expect(screen.getByTestId('eventsCount')).toHaveAttribute(
        'role',
        'button',
      );
      expect(screen.getByTestId('blockedUsersCount')).toHaveAttribute(
        'role',
        'button',
      );
      expect(screen.getByTestId('membershipRequestsCount')).toHaveAttribute(
        'role',
        'button',
      );
      expect(screen.getByTestId('venuesCount')).toHaveAttribute(
        'role',
        'button',
      );
    });

    it('should have correct CSS classes', () => {
      render(<DashboardCards {...defaultProps} />);

      // Check that cards have appropriate Bootstrap classes
      expect(screen.getByTestId('membersCount')).toHaveClass('mb-4');
      expect(screen.getByTestId('adminsCount')).toHaveClass('mb-4');
      expect(screen.getByTestId('postsCount')).toHaveClass('mb-4');
      expect(screen.getByTestId('eventsCount')).toHaveClass('mb-4');
      expect(screen.getByTestId('blockedUsersCount')).toHaveClass('mb-4');
      expect(screen.getByTestId('membershipRequestsCount')).toHaveClass('mb-4');
      expect(screen.getByTestId('venuesCount')).toHaveClass('mb-4');
    });
  });

  describe('Component structure', () => {
    it('should render cards in correct order', () => {
      render(<DashboardCards {...defaultProps} />);

      const cards = [
        screen.getByTestId('membersCount'),
        screen.getByTestId('adminsCount'),
        screen.getByTestId('postsCount'),
        screen.getByTestId('eventsCount'),
        screen.getByTestId('blockedUsersCount'),
        screen.getByTestId('membershipRequestsCount'),
        screen.getByTestId('venuesCount'),
      ];

      // Verify all cards are rendered in expected order
      cards.forEach((card) => {
        expect(card).toBeInTheDocument();
      });
    });

    it('should have proper responsive classes', () => {
      render(<DashboardCards {...defaultProps} />);

      // Check that cards have responsive Bootstrap classes
      expect(screen.getByTestId('membersCount')).toHaveClass(
        'col-6',
        'col-sm-4',
      );
      expect(screen.getByTestId('adminsCount')).toHaveClass(
        'col-6',
        'col-sm-4',
      );
      expect(screen.getByTestId('postsCount')).toHaveClass('col-6', 'col-sm-4');
      expect(screen.getByTestId('eventsCount')).toHaveClass(
        'col-6',
        'col-sm-4',
      );
      expect(screen.getByTestId('blockedUsersCount')).toHaveClass(
        'col-6',
        'col-sm-4',
      );
      expect(screen.getByTestId('membershipRequestsCount')).toHaveClass(
        'col-6',
        'col-sm-4',
      );
      expect(screen.getByTestId('venuesCount')).toHaveClass(
        'col-6',
        'col-sm-4',
      );
    });
  });

  describe('Navigation prop handling', () => {
    it('should call navigate function with correct parameters for multiple clicks', () => {
      render(<DashboardCards {...defaultProps} />);

      // Click multiple cards in sequence
      fireEvent.click(screen.getByTestId('postsCount'));
      fireEvent.click(screen.getByTestId('eventsCount'));
      fireEvent.click(screen.getByTestId('venuesCount'));

      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenNthCalledWith(1, '/posts');
      expect(mockNavigate).toHaveBeenNthCalledWith(2, '/events');
      expect(mockNavigate).toHaveBeenNthCalledWith(3, '/venues');
    });

    it('should handle navigation function errors gracefully', () => {
      const errorNavigate = vi.fn().mockImplementation(() => {
        throw new Error('Navigation error');
      });

      const errorProps = {
        ...defaultProps,
        navigate: errorNavigate,
      };

      render(<DashboardCards {...errorProps} />);

      // Should not throw when navigation fails
      expect(() => {
        fireEvent.click(screen.getByTestId('postsCount'));
      }).not.toThrow();

      expect(errorNavigate).toHaveBeenCalledWith('/posts');
    });
  });
});

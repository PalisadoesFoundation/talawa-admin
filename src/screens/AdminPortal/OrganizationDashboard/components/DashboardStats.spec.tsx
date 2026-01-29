import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import DashboardStats from './DashboardStats';

// Mock the SVG icons
vi.mock('assets/svgs/admin.svg?react', () => ({
  default: () => <div data-testid="admin-icon" />,
}));

vi.mock('assets/svgs/blockedUser.svg?react', () => ({
  default: () => <div data-testid="blocked-icon" />,
}));

vi.mock('assets/svgs/events.svg?react', () => ({
  default: () => <div data-testid="events-icon" />,
}));

vi.mock('assets/svgs/post.svg?react', () => ({
  default: () => <div data-testid="posts-icon" />,
}));

vi.mock('assets/svgs/users.svg?react', () => ({
  default: () => <div data-testid="users-icon" />,
}));

vi.mock('assets/svgs/venues.svg?react', () => ({
  default: () => <div data-testid="venues-icon" />,
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('DashboardStats Component', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockProps = {
    memberCount: 25,
    adminCount: 5,
    eventCount: 10,
    venueCount: 3,
    blockedCount: 2,
    postsCount: 15,
    isLoading: false,
    onMembersClick: vi.fn(),
    onAdminsClick: vi.fn(),
    onPostsClick: vi.fn(),
    onEventsClick: vi.fn(),
    onVenuesClick: vi.fn(),
    onBlockedUsersClick: vi.fn(),
  };

  it('renders all dashboard stats correctly', () => {
    render(<DashboardStats {...mockProps} />);

    expect(screen.getByText('members')).toBeInTheDocument();
    expect(screen.getByText('admins')).toBeInTheDocument();
    expect(screen.getByText('events')).toBeInTheDocument();
    expect(screen.getByText('venues')).toBeInTheDocument();
    expect(screen.getByText('blockedUsers')).toBeInTheDocument();
    expect(screen.getByText('posts')).toBeInTheDocument();
  });

  it('displays correct counts for each stat', () => {
    render(<DashboardStats {...mockProps} />);

    expect(screen.getByText('25')).toBeInTheDocument(); // memberCount
    expect(screen.getByText('5')).toBeInTheDocument(); // adminCount
    expect(screen.getByText('10')).toBeInTheDocument(); // eventCount
    expect(screen.getByText('3')).toBeInTheDocument(); // venueCount
    expect(screen.getByText('2')).toBeInTheDocument(); // blockedCount
    expect(screen.getByText('15')).toBeInTheDocument(); // postsCount
  });

  it('shows loading state when isLoading is true', () => {
    const loadingProps = { ...mockProps, isLoading: true };
    render(<DashboardStats {...loadingProps} />);

    // Should show loading cards with fallback-ui test id
    const loadingElements = screen.getAllByTestId('fallback-ui');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('calls correct handlers when cards are clicked', async () => {
    render(<DashboardStats {...mockProps} />);

    // Click each card using accessible button queries
    const membersCard = screen.getByRole('button', { name: 'members' });
    await userEvent.click(membersCard);
    expect(mockProps.onMembersClick).toHaveBeenCalled();

    const adminsCard = screen.getByRole('button', { name: 'admins' });
    await userEvent.click(adminsCard);
    expect(mockProps.onAdminsClick).toHaveBeenCalled();

    const eventsCard = screen.getByRole('button', { name: 'events' });
    await userEvent.click(eventsCard);
    expect(mockProps.onEventsClick).toHaveBeenCalled();

    const venuesCard = screen.getByRole('button', { name: 'venues' });
    await userEvent.click(venuesCard);
    expect(mockProps.onVenuesClick).toHaveBeenCalled();

    const postsCard = screen.getByRole('button', { name: 'posts' });
    await userEvent.click(postsCard);
    expect(mockProps.onPostsClick).toHaveBeenCalled();

    const blockedCard = screen.getByRole('button', { name: 'blockedUsers' });
    await userEvent.click(blockedCard);
    expect(mockProps.onBlockedUsersClick).toHaveBeenCalled();
  });

  it('handles missing postsCount gracefully', () => {
    const propsWithoutPosts = { ...mockProps, postsCount: undefined };
    render(<DashboardStats {...propsWithoutPosts} />);

    // Should still render posts card
    expect(screen.getByText('posts')).toBeInTheDocument();
  });

  it('renders with correct accessibility attributes', () => {
    render(<DashboardStats {...mockProps} />);

    // Check for proper button roles on stats cards with aria-labels
    const membersCard = screen.getByRole('button', { name: 'members' });
    expect(membersCard).toBeInTheDocument();

    const adminsCard = screen.getByRole('button', { name: 'admins' });
    expect(adminsCard).toBeInTheDocument();

    const eventsCard = screen.getByRole('button', { name: 'events' });
    expect(eventsCard).toBeInTheDocument();

    const venuesCard = screen.getByRole('button', { name: 'venues' });
    expect(venuesCard).toBeInTheDocument();
  });

  it('handles edge case with zero counts', () => {
    const propsWithZeros = {
      ...mockProps,
      memberCount: 0,
      adminCount: 0,
      eventCount: 0,
      venueCount: 0,
      blockedCount: 0,
      postsCount: 0,
    };
    render(<DashboardStats {...propsWithZeros} />);

    // Check that zero values are rendered correctly
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements).toHaveLength(6); // Should have 6 zero counts
    expect(screen.getByText('members')).toBeInTheDocument();
  });

  it('handles null postsCount correctly', () => {
    const propsWithNullPosts = { ...mockProps, postsCount: undefined };
    render(<DashboardStats {...propsWithNullPosts} />);

    // Should still render posts card with count 0
    expect(screen.getByText('posts')).toBeInTheDocument();
  });
});

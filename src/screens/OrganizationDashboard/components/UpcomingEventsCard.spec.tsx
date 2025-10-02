import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UpcomingEventsCard from './UpcomingEventsCard';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock CardItem component
vi.mock('components/OrganizationDashCards/CardItem/CardItem', () => ({
  default: ({
    title,
    startdate,
    enddate,
  }: {
    title: string;
    startdate?: string;
    enddate?: string;
  }) => (
    <div data-testid="card-item">
      <div>{title}</div>
      <div>{startdate}</div>
      <div>{enddate}</div>
    </div>
  ),
}));

// Mock CardItemLoading component
vi.mock(
  'components/OrganizationDashCards/CardItem/Loader/CardItemLoading',
  () => ({
    default: () => <div data-testid="card-loading" />,
  }),
);

describe('UpcomingEventsCard Component', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockEvents: any = [
    {
      node: {
        id: 'event1',
        name: 'Test Event 1',
        startAt: '2024-12-25T10:00:00.000Z',
        endAt: '2024-12-25T12:00:00.000Z',
      },
    },
    {
      node: {
        id: 'event2',
        name: 'Test Event 2',
        startAt: '2024-12-26T14:00:00.000Z',
        endAt: '2024-12-26T16:00:00.000Z',
      },
    },
  ];

  const mockProps = {
    upcomingEvents: mockEvents,
    eventLoading: false,
    onViewAllEventsClick: vi.fn(),
  };

  it('renders upcoming events card with correct title', () => {
    render(<UpcomingEventsCard {...mockProps} />);

    expect(screen.getByText('upcomingEvents')).toBeInTheDocument();
  });

  it('displays event list correctly when events are provided', () => {
    render(<UpcomingEventsCard {...mockProps} />);

    expect(screen.getByText('Test Event 1')).toBeInTheDocument();
    expect(screen.getByText('Test Event 2')).toBeInTheDocument();
  });

  it('shows loading state when eventLoading is true', () => {
    const loadingProps = { ...mockProps, eventLoading: true };
    render(<UpcomingEventsCard {...loadingProps} />);

    const loadingElements = screen.getAllByTestId('card-loading');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('calls onViewAllEventsClick when view all button is clicked', () => {
    render(<UpcomingEventsCard {...mockProps} />);

    const viewAllButton = screen.getByRole('button', { name: /viewAll/i });
    fireEvent.click(viewAllButton);

    expect(mockProps.onViewAllEventsClick).toHaveBeenCalled();
  });

  it('handles empty events list gracefully', () => {
    const emptyProps = { ...mockProps, upcomingEvents: [] };
    render(<UpcomingEventsCard {...emptyProps} />);

    expect(screen.getByText('upcomingEvents')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /viewAll/i }),
    ).toBeInTheDocument();
  });

  it('renders with correct card structure', () => {
    render(<UpcomingEventsCard {...mockProps} />);

    // Check for card element and title
    const card = screen.getByText('upcomingEvents');
    expect(card).toBeInTheDocument();

    const viewAllButton = screen.getByRole('button', { name: /viewAll/i });
    expect(viewAllButton).toBeInTheDocument();
  });

  it('displays correct number of events', () => {
    render(<UpcomingEventsCard {...mockProps} />);

    const cardItems = screen.getAllByTestId('card-item');
    expect(cardItems).toHaveLength(2);
  });

  it('sorts events by start date', () => {
    const unsortedEvents = [
      {
        node: {
          id: 'event2',
          name: 'Later Event',
          startAt: '2024-12-25T10:00:00Z',
          endAt: '2024-12-25T12:00:00Z',
        },
      },
      {
        node: {
          id: 'event1',
          name: 'Earlier Event',
          startAt: '2024-12-15T09:00:00Z',
          endAt: '2024-12-15T17:00:00Z',
        },
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortedProps = { ...mockProps, upcomingEvents: unsortedEvents as any };
    render(<UpcomingEventsCard {...sortedProps} />);

    const cardItems = screen.getAllByTestId('card-item');
    expect(cardItems[0]).toHaveTextContent('Earlier Event');
    expect(cardItems[1]).toHaveTextContent('Later Event');
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UpcomingEventsCard from './UpcomingEventsCard';
import type { IEvent } from 'utils/interfaces';

// Mock interfaces for test data - properly typed structures
interface TestInterfaceUser {
  id: string;
  name: string;
}

interface TestInterfaceOrganization {
  id: string;
  name: string;
}

interface TestInterfaceEventNode {
  id: string;
  name: string;
  startAt: string;
  endAt: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  creator: TestInterfaceUser;
  updater: TestInterfaceUser;
  organization: TestInterfaceOrganization;
  attachments: never[]; // Empty array for tests
}

interface TestInterfaceEvent {
  node: TestInterfaceEventNode;
}

// Props interface matching the component's expected props
interface TestInterfaceUpcomingEventsCardProps {
  upcomingEvents: IEvent[];
  eventLoading: boolean;
  onViewAllEventsClick: () => void;
}

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
    default: () => <div data-testid="card-item-loading">Loading...</div>,
  }),
);

describe('UpcomingEventsCard Component', () => {
  const mockEventData: TestInterfaceEvent[] = [
    {
      node: {
        id: 'event1',
        name: 'Test Event 1',
        startAt: '2023-01-01T10:00:00Z',
        endAt: '2023-01-01T12:00:00Z',
        description: 'Test event description',
        createdAt: '2023-01-01T08:00:00Z',
        updatedAt: '2023-01-01T08:00:00Z',
        creator: { id: 'user1', name: 'Creator 1' },
        updater: { id: 'user1', name: 'Creator 1' },
        organization: { id: 'org1', name: 'Test Org' },
        attachments: [],
      },
    },
    {
      node: {
        id: 'event2',
        name: 'Test Event 2',
        startAt: '2023-01-02T10:00:00Z',
        endAt: '2023-01-02T12:00:00Z',
        description: 'Another test event',
        createdAt: '2023-01-02T08:00:00Z',
        updatedAt: '2023-01-02T09:00:00Z',
        creator: { id: 'user2', name: 'Creator 2' },
        updater: { id: 'user2', name: 'Creator 2' },
        organization: { id: 'org1', name: 'Test Org' },
        attachments: [],
      },
    },
  ];

  const mockProps: TestInterfaceUpcomingEventsCardProps = {
    upcomingEvents: mockEventData as unknown as IEvent[],
    eventLoading: false,
    onViewAllEventsClick: vi.fn(),
  };

  it('renders upcoming events card with correct title', () => {
    render(<UpcomingEventsCard {...mockProps} />);

    expect(screen.getByText('upcomingEvents')).toBeInTheDocument();
  });

  it('displays view all button and handles click', () => {
    render(<UpcomingEventsCard {...mockProps} />);

    const viewAllButton = screen.getByText('viewAll');
    expect(viewAllButton).toBeInTheDocument();

    fireEvent.click(viewAllButton);
    expect(mockProps.onViewAllEventsClick).toHaveBeenCalled();
    expect(mockProps.onViewAllEventsClick).toHaveBeenCalledTimes(1);
  });

  it('renders loading state correctly', () => {
    const loadingProps: TestInterfaceUpcomingEventsCardProps = {
      ...mockProps,
      eventLoading: true,
    };

    render(<UpcomingEventsCard {...loadingProps} />);

    expect(screen.getAllByTestId('card-item-loading')).toHaveLength(4);
  });

  it('renders empty state when no events are available', () => {
    const emptyProps: TestInterfaceUpcomingEventsCardProps = {
      upcomingEvents: [],
      eventLoading: false,
      onViewAllEventsClick: vi.fn(),
    };

    render(<UpcomingEventsCard {...emptyProps} />);

    expect(screen.getByText('noUpcomingEvents')).toBeInTheDocument();
  });

  it('displays correct event titles', () => {
    render(<UpcomingEventsCard {...mockProps} />);

    expect(screen.getByText('Test Event 1')).toBeInTheDocument();
    expect(screen.getByText('Test Event 2')).toBeInTheDocument();
  });

  it('displays correctly when more than 10 events', () => {
    const manyEvents: TestInterfaceEvent[] = [];
    for (let i = 1; i <= 15; i++) {
      manyEvents.push({
        node: {
          id: `event${i}`,
          name: `Event ${i}`,
          startAt: `2023-01-${i.toString().padStart(2, '0')}T10:00:00Z`,
          endAt: `2023-01-${i.toString().padStart(2, '0')}T12:00:00Z`,
          description: `Event ${i} description`,
          createdAt: `2023-01-${i.toString().padStart(2, '0')}T09:00:00Z`,
          updatedAt: `2023-01-${i.toString().padStart(2, '0')}T09:00:00Z`,
          creator: { id: `user${i}`, name: `Creator ${i}` },
          updater: { id: `user${i}`, name: `Creator ${i}` },
          organization: { id: 'org1', name: 'Test Org' },
          attachments: [],
        },
      });
    }

    const manyEventsProps: TestInterfaceUpcomingEventsCardProps = {
      upcomingEvents: manyEvents as unknown as IEvent[],
      eventLoading: false,
      onViewAllEventsClick: vi.fn(),
    };

    render(<UpcomingEventsCard {...manyEventsProps} />);

    // Should only show first 10 events
    const cardItems = screen.getAllByTestId('card-item');
    expect(cardItems).toHaveLength(10);
  });
});

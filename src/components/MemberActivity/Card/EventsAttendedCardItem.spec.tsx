import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import EventAttendedCard from './EventsAttendedCardItem';
import { vi } from 'vitest';

// Mock useLocalStorage
const mockGetItem = vi.fn();
vi.mock('utils/useLocalstorage', () => ({
  default: () => ({
    getItem: mockGetItem,
  }),
}));

interface InterfaceEventAttendedCardProps {
  type: 'Event';
  title: string;
  startdate: string;
  time: string;
  location: string;
  orgId: string;
  eventId: string;
}

describe('EventAttendedCard', () => {
  const mockProps: InterfaceEventAttendedCardProps = {
    type: 'Event' as const,
    title: 'Test Event',
    startdate: '2023-05-15',
    time: '14:00',
    location: 'Test Location',
    orgId: 'org123',
    eventId: 'event456',
  };

  const renderComponent = (props = mockProps): void => {
    render(
      <BrowserRouter>
        <EventAttendedCard {...props} />
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default to administrator role
    mockGetItem.mockReturnValue('administrator');
  });

  it('renders event details correctly', () => {
    renderComponent();

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('MAY')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  describe('Administrator user', () => {
    beforeEach(() => {
      mockGetItem.mockReturnValue('administrator');
    });

    it('renders link with correct path for administrator', () => {
      renderComponent();
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/event/org123/event456');
    });

    it('renders chevron right icon for administrator', () => {
      renderComponent();
      expect(screen.getByTestId('ChevronRightIcon')).toBeInTheDocument();
    });
  });

  describe('Regular user', () => {
    beforeEach(() => {
      mockGetItem.mockReturnValue('regular');
    });

    it('does not render link for regular user', () => {
      renderComponent();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('does not render chevron right icon for regular user', () => {
      renderComponent();
      expect(screen.queryByTestId('ChevronRightIcon')).not.toBeInTheDocument();
    });
  });

  it('renders location icon', () => {
    renderComponent();
    expect(screen.getByTestId('LocationOnIcon')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EventAttendedCard from './EventsAttendedCardItem';
import { vi } from 'vitest';

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
  });

  it('renders event details correctly', () => {
    renderComponent();

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('MAY')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  it('renders link with correct path', () => {
    renderComponent();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/event/org123/event456');
  });

  it('renders location icon', () => {
    renderComponent();
    expect(screen.getByTestId('LocationOnIcon')).toBeInTheDocument();
  });

  it('renders chevron right icon', () => {
    renderComponent();
    expect(screen.getByTestId('ChevronRightIcon')).toBeInTheDocument();
  });
});

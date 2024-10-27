import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EventAttendedCard from './EventsAttendedCardItem';

describe('EventAttendedCard', () => {
  const mockProps = {
    type: 'Event' as const,
    title: 'Test Event',
    startdate: '2023-05-15',
    time: '14:00',
    location: 'Test Location',
    orgId: 'org123',
    eventId: 'event456',
  };

  it('renders event details correctly', () => {
    render(
      <BrowserRouter>
        <EventAttendedCard {...mockProps} />
      </BrowserRouter>,
    );

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('MAY')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  it('renders link with correct path', () => {
    render(
      <BrowserRouter>
        <EventAttendedCard {...mockProps} />
      </BrowserRouter>,
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/event/org123/event456');
  });

  it('renders location icon', () => {
    render(
      <BrowserRouter>
        <EventAttendedCard {...mockProps} />
      </BrowserRouter>,
    );

    expect(screen.getByTestId('LocationOnIcon')).toBeInTheDocument();
  });

  it('renders chevron right icon', () => {
    render(
      <BrowserRouter>
        <EventAttendedCard {...mockProps} />
      </BrowserRouter>,
    );

    expect(screen.getByTestId('ChevronRightIcon')).toBeInTheDocument();
  });
});

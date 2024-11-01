import React from 'react';
import { render, screen } from '@testing-library/react';
import { EventsAttendedByUser } from './EventsAttendedByUser';

const mockT = (key: string): string => key;

describe('EventsAttendedByUser Component', () => {
  const mockUserWithEvents = {
    userDetails: {
      firstName: 'John',
      lastName: 'Doe',
      createdAt: '2023-01-01',
      gender: 'Male',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      birthDate: '1990-01-01',
      grade: 'A',
      empStatus: 'Employed',
      maritalStatus: 'Single',
      address: '123 Street',
      state: 'State',
      country: 'Country',
      image: 'image.jpg',
      eventsAttended: [
        { _id: '1', name: 'Event 1' },
        { _id: '2', name: 'Event 2' },
      ],
    },
    t: mockT,
  };

  const mockUserWithoutEvents = {
    userDetails: {
      firstName: 'Jane',
      lastName: 'Doe',
      createdAt: '2023-01-01',
      gender: 'Female',
      email: 'jane@example.com',
      phoneNumber: '0987654321',
      birthDate: '1990-01-01',
      grade: 'B',
      empStatus: 'Unemployed',
      maritalStatus: 'Single',
      address: '456 Street',
      state: 'State',
      country: 'Country',
      image: 'image.jpg',
      eventsAttended: [],
    },
    t: mockT,
  };

  test('renders the component with events', () => {
    render(<EventsAttendedByUser {...mockUserWithEvents} />);

    expect(screen.getByText('eventAttended')).toBeInTheDocument();
    expect(screen.getAllByTestId('usereventsCard')).toHaveLength(2);
  });

  test('renders no events message when user has no events', () => {
    render(<EventsAttendedByUser {...mockUserWithoutEvents} />);

    expect(screen.getByText('noeventsAttended')).toBeInTheDocument();
    expect(screen.queryByTestId('usereventsCard')).not.toBeInTheDocument();
  });

  test('renders card header correctly', () => {
    render(<EventsAttendedByUser {...mockUserWithEvents} />);

    const header = screen.getByText('eventAttended');
    expect(header).toBeInTheDocument();
    expect(header.closest('div')).toHaveClass('cardTitle');
  });

  test('renders scrollable card body', () => {
    render(<EventsAttendedByUser {...mockUserWithEvents} />);

    const cardBody = screen.getByTestId('usereventsCard').closest('.card-body');
    expect(cardBody).toHaveClass('scrollableCardBody');
  });
});

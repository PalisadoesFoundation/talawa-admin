import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import EventsAttendedMemberModal from './EventsAttendedMemberModal';

// Mock translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: () => Promise.resolve() },
  }),
}));

// Mock event data
const mockEvents = Array.from({ length: 6 }, (_, index) => ({
  _id: `event${index + 1}`,
  name: `Event ${index + 1}`,
  date: new Date().toISOString().split('T')[0],
  isRecurring: false,
  attendees: 5,
  description: `Description ${index + 1}`,
  location: `Location ${index + 1}`,
  startTime: '10:00',
  endTime: '11:00',
}));

describe('EventsAttendedMemberModal', () => {
  const defaultProps = {
    eventsAttended: mockEvents,
    setShow: jest.fn(),
    show: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal with correct title when show is true', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <EventsAttendedMemberModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('Events Attended List')).toBeInTheDocument();
    expect(screen.getByText('Showing 1 - 5 of 6 Events')).toBeInTheDocument();
  });

  test('displays empty state message when no events', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <EventsAttendedMemberModal {...defaultProps} eventsAttended={[]} />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('noeventsAttended')).toBeInTheDocument();
  });

  test('renders correct number of events per page', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <EventsAttendedMemberModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    const eventRows = screen.getAllByTestId('custom-row');
    expect(eventRows).toHaveLength(5);
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 5')).toBeInTheDocument();
  });

  test('handles pagination correctly', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <EventsAttendedMemberModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByText('Event 6')).toBeInTheDocument();
  });

  test('closes modal when close button is clicked', () => {
    const mockSetShow = jest.fn();
    render(
      <MockedProvider>
        <BrowserRouter>
          <EventsAttendedMemberModal {...defaultProps} setShow={mockSetShow} />
        </BrowserRouter>
      </MockedProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(mockSetShow).toHaveBeenCalledWith(false);
    expect(mockSetShow).toHaveBeenCalledTimes(1);
  });

  test('displays correct pagination info', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <EventsAttendedMemberModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('Showing 1 - 5 of 6 Events')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByText('Showing 6 - 6 of 6 Events')).toBeInTheDocument();
  });
});

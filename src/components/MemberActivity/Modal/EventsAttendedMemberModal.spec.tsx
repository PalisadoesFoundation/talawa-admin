import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router';
import EventsAttendedMemberModal from './EventsAttendedMemberModal';
import { vi } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

/**
 * Mock the `react-i18next` module to provide translation functionality.
 */

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, params?: Record<string, unknown>) => {
        const translations: Record<string, string> = {
          noEventsAttended: 'No events attended',
          title: 'Events Attended List',
          showing: `Showing ${params?.start} - ${params?.end} of ${params?.total} Events`,
          eventName: 'Event Name',
          dateOfEvent: 'Date of Event',
          recurringEvent: 'Recurring Event',
          attendees: 'Attendees',
          tableAriaLabel: 'Events attended table',
          paginationAriaLabel: 'Events pagination navigation',
          paginationGoToPage: `Go to page ${params?.page}`,
          paginationGoToType: `Go to ${params?.type} page`,
        };
        return translations[key] || key;
      },
      i18n: { changeLanguage: () => Promise.resolve() },
    }),
  };
});

/**
 * Mock the `CustomTableCell` component for testing.
 */

vi.mock('./CustomCell/customTableCell', () => ({
  CustomTableCell: ({ eventId }: { eventId: string }) => (
    <tr data-testid="event-row">
      <td>{`Event ${eventId}`}</td>
      <td>{dayjs.utc().format('YYYY-MM-DD')}</td>
      <td>Yes</td>
      <td>5</td>
    </tr>
  ),
}));

const mockEvents = Array.from({ length: 6 }, (_, index) => ({
  id: `${index + 1}`,
  name: `Event ${index + 1}`,
  date: dayjs.utc().format('YYYY-MM-DD'),
  isRecurring: true,
  attendees: [
    { id: '1', name: 'User 1', emailAddress: 'user1@example.com' },
    { id: '2', name: 'User 2', emailAddress: 'user2@example.com' },
    { id: '3', name: 'User 3', emailAddress: 'user3@example.com' },
    { id: '4', name: 'User 4', emailAddress: 'user4@example.com' },
    { id: '5', name: 'User 5', emailAddress: 'user5@example.com' },
  ],
}));

describe('EventsAttendedMemberModal', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });
  const defaultProps = {
    eventsAttended: mockEvents,
    setShow: vi.fn(),
    show: true,
  };

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

    expect(screen.getByText('No events attended')).toBeInTheDocument();
  });

  test('renders correct number of events per page', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <EventsAttendedMemberModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    const eventRows = screen.getAllByTestId('event-row');
    expect(eventRows).toHaveLength(5);
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 5')).toBeInTheDocument();
  });

  test('handles pagination correctly', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider>
        <BrowserRouter>
          <EventsAttendedMemberModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(screen.getByText('Event 6')).toBeInTheDocument();
  });

  test('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    const mockSetShow = vi.fn();
    render(
      <MockedProvider>
        <BrowserRouter>
          <EventsAttendedMemberModal {...defaultProps} setShow={mockSetShow} />
        </BrowserRouter>
      </MockedProvider>,
    );

    await user.click(screen.getByTestId('modalCloseBtn'));
    expect(mockSetShow).toHaveBeenCalledWith(false);
    expect(mockSetShow).toHaveBeenCalledTimes(1);
  });

  test('displays correct pagination info', async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider>
        <BrowserRouter>
          <EventsAttendedMemberModal {...defaultProps} />
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('Showing 1 - 5 of 6 Events')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(screen.getByText('Showing 6 - 6 of 6 Events')).toBeInTheDocument();
  });
});

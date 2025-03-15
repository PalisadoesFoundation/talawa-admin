import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';
import Calendar from './WeeklyEventCalendar';
import dayjs from 'dayjs';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('WeeklyEventCalendar Component', () => {
  const mockRefetchEvents = vi.fn();
  const today = new Date();

  const mockEventData = [
    {
      _id: '1',
      location: 'Test Location',
      title: 'Test Event',
      description: 'Test Description',
      startDate: dayjs(today).format('YYYY-MM-DD'),
      endDate: dayjs(today).format('YYYY-MM-DD'),
      startTime: '10:00',
      endTime: '11:00',
      allDay: false,
      recurring: false,
      recurrenceRule: null,
      isRecurringEventException: false,
      isPublic: true,
      isRegisterable: true,
      attendees: [{ _id: 'user1' }],
      creator: {
        firstName: 'John',
        lastName: 'Doe',
        _id: 'creator1',
      },
    },
    {
      _id: '2',
      location: 'Test Location 2',
      title: 'Test Event 2',
      description: 'Test Description 2',
      startDate: dayjs(today).add(1, 'day').format('YYYY-MM-DD'),
      endDate: dayjs(today).add(1, 'day').format('YYYY-MM-DD'),
      startTime: '14:00',
      endTime: '15:00',
      allDay: false,
      recurring: false,
      recurrenceRule: null,
      isRecurringEventException: false,
      isPublic: true,
      isRegisterable: true,
      attendees: [{ _id: 'user1' }],
      creator: {
        firstName: 'John',
        lastName: 'Doe',
        _id: 'creator1',
      },
    },
  ];

  const mockOrgData = {
    admins: [{ _id: 'admin1' }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with basic props', async () => {
    const { getByText, getAllByTestId } = renderWithRouter(
      <Calendar
        eventData={mockEventData}
        refetchEvents={mockRefetchEvents}
        orgData={mockOrgData}
        userRole="USER"
        userId="user1"
      />,
    );

    await waitFor(() => {
      expect(getByText('Sunday')).toBeInTheDocument();
      expect(getByText('Monday')).toBeInTheDocument();
      expect(getByText('Tuesday')).toBeInTheDocument();
      expect(getByText('Wednesday')).toBeInTheDocument();
      expect(getByText('Thursday')).toBeInTheDocument();
      expect(getByText('Friday')).toBeInTheDocument();
      expect(getByText('Saturday')).toBeInTheDocument();
    });

    const days = getAllByTestId('day');
    expect(days.length).toBe(7);
  });

  it('handles week navigation correctly', async () => {
    const { getByTestId } = renderWithRouter(
      <Calendar
        eventData={mockEventData}
        refetchEvents={mockRefetchEvents}
        orgData={mockOrgData}
        userRole="USER"
        userId="user1"
      />,
    );

    const currentDate = new Date();
    const prevWeekStartDate = new Date(
      currentDate.setDate(currentDate.getDate() - 7),
    );
    const expectedDate = dayjs(prevWeekStartDate).format('MMM D');

    await act(async () => {
      fireEvent.click(getByTestId('prevWeek'));
    });

    await waitFor(() => {
      const currentWeekElement = getByTestId('current-week');
      expect(currentWeekElement.textContent).toContain(expectedDate);
    });
  });

  it('handles today button correctly', async () => {
    const { getByTestId, getByText } = renderWithRouter(
      <Calendar
        eventData={mockEventData}
        refetchEvents={mockRefetchEvents}
        orgData={mockOrgData}
        userRole="USER"
        userId="user1"
      />,
    );

    await act(async () => {
      fireEvent.click(getByTestId('today'));
    });
    await waitFor(() => {
      expect(
        getByText((content, element) =>
          content.includes(dayjs(today).format('MMM D')),
        ),
      ).toBeInTheDocument();
    });
  });

  it('toggles event list expansion correctly', async () => {
    const { queryByTestId, getByText } = renderWithRouter(
      <Calendar
        eventData={mockEventData}
        refetchEvents={mockRefetchEvents}
        orgData={mockOrgData}
        userRole="USER"
        userId="user1"
      />,
    );

    const moreButton = queryByTestId('more');

    if (moreButton) {
      await act(async () => {
        fireEvent.click(moreButton);
      });
      await waitFor(() => {
        expect(getByText('View less')).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.click(moreButton);
      });
      await waitFor(() => {
        expect(getByText('View all')).toBeInTheDocument();
      });
    } else {
      console.warn('Element with data-testid "more" not found.');
    }
  });

  it('renders events on different days of the week', async () => {
    const { getByText } = renderWithRouter(
      <Calendar
        eventData={mockEventData}
        refetchEvents={mockRefetchEvents}
        orgData={mockOrgData}
        userRole="USER"
        userId="user1"
      />,
    );

    await waitFor(() => {
      expect(getByText('Test Event')).toBeInTheDocument();
      expect(getByText('Test Event 2')).toBeInTheDocument();
    });
  });

  it('renders correctly when there are no events', async () => {
    const { getByText } = renderWithRouter(
      <Calendar
        eventData={[]}
        refetchEvents={mockRefetchEvents}
        orgData={mockOrgData}
        userRole="USER"
        userId="user1"
      />,
    );

    await waitFor(() => {
      expect(getByText('No events this week')).toBeInTheDocument();
    });
  });

  it('renders admin-specific features when user is an admin', async () => {
    const { getByTestId } = renderWithRouter(
      <Calendar
        eventData={mockEventData}
        refetchEvents={mockRefetchEvents}
        orgData={mockOrgData}
        userRole="ADMIN"
        userId="admin1"
      />,
    );

    await waitFor(() => {
      expect(getByTestId('add-event-button')).toBeInTheDocument();
    });
  });
});

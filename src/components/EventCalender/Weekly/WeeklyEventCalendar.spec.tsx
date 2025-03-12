import React, { Suspense } from 'react';
import {
  render,
  fireEvent,
  act,
  screen,
  waitFor,
} from '@testing-library/react';
import { vi } from 'vitest';
import Calendar from './WeeklyEventCalendar';
import { BrowserRouter } from 'react-router-dom';
import dayjs from 'dayjs';

enum Role {
  USER = 'USER',
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
}

const renderWithRouter = (
  ui: React.ReactElement,
): ReturnType<typeof render> => {
  return render(
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>{ui}</Suspense>
    </BrowserRouter>,
  );
};

describe('WeeklyViewCalendar Component', () => {
  const mockRefetchEvents = vi.fn();
  const today = new Date();

  const mockEventData = [
    {
      _id: '1',
      location: 'Test Location',
      title: 'Test Event',
      description: 'Test Description',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
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
      location: 'Private Location',
      title: 'Private Event',
      description: 'Private Description',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      startTime: '12:00',
      endTime: '13:00',
      allDay: false,
      recurring: false,
      recurrenceRule: null,
      isRecurringEventException: false,
      isPublic: false,
      isRegisterable: true,
      attendees: [{ _id: 'user2' }],
      creator: {
        firstName: 'Jane',
        lastName: 'Doe',
        _id: 'creator2',
      },
    },
  ];

  const mockOrgData = {
    admins: [{ _id: 'admin1' }],
  };

  interface Holiday {
    name: string;
    date: string;
  }

  const holidays: Holiday[] = [
    { name: 'New Year', date: '01-01' },
    { name: 'Christmas', date: '12-25' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with basic props', async () => {
    const { getByText, getAllByTestId } = renderWithRouter(
      <Calendar eventData={mockEventData} refetchEvents={mockRefetchEvents} />,
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
    const { getByTestId, getByText } = renderWithRouter(
      <Calendar eventData={mockEventData} refetchEvents={mockRefetchEvents} />,
    );

    const currentWeekStart = dayjs().startOf('week');
    const currentWeekText = `${currentWeekStart.format('MMM D')} - ${currentWeekStart
      .add(6, 'day')
      .format('MMM D')}`;

    await act(async () => {
      fireEvent.click(getByTestId('prevWeek'));
    });
    await waitFor(() => {
      expect(getByTestId('current-week')).not.toHaveTextContent(
        currentWeekText,
      );
    });

    await act(async () => {
      fireEvent.click(getByTestId('nextWeek'));
    });
    await waitFor(() => {
      expect(getByTestId('current-week')).toHaveTextContent(currentWeekText);
    });
  });

  it('navigates to the current week when "Today" button is clicked', async () => {
    const { getByTestId } = renderWithRouter(
      <Calendar eventData={mockEventData} refetchEvents={mockRefetchEvents} />,
    );

    await act(async () => {
      fireEvent.click(getByTestId('today'));
    });

    const currentWeekStart = dayjs().startOf('week');
    const currentWeekText = `${currentWeekStart.format('MMM D')} - ${currentWeekStart
      .add(6, 'day')
      .format('MMM D')}`;

    await waitFor(() => {
      expect(getByTestId('current-week')).toHaveTextContent(currentWeekText);
    });
  });

  it('renders holiday cards correctly', async () => {
    const { getByText } = renderWithRouter(
      <Calendar eventData={mockEventData} refetchEvents={mockRefetchEvents} />,
    );
    

    const currentWeekStart = dayjs().startOf('week');

    await waitFor(() => {
      holidays.forEach((holiday: Holiday) => {
        if (dayjs(currentWeekStart).format('MM-DD') === holiday.date) {
          expect(getByText(holiday.name)).toBeInTheDocument();
        }
      });
    });
  });
});

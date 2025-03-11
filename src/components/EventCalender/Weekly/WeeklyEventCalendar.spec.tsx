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

describe('WeeklyEventCalendar Component', () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with basic props', async () => {
    renderWithRouter(
      <Calendar eventData={mockEventData} refetchEvents={mockRefetchEvents} />,
    );

    await waitFor(() => {
      expect(screen.getByText('Sunday')).toBeInTheDocument();
      expect(screen.getByText('Monday')).toBeInTheDocument();
      expect(screen.getByText('Tuesday')).toBeInTheDocument();
      expect(screen.getByText('Wednesday')).toBeInTheDocument();
      expect(screen.getByText('Thursday')).toBeInTheDocument();
      expect(screen.getByText('Friday')).toBeInTheDocument();
      expect(screen.getByText('Saturday')).toBeInTheDocument();
    });

    const days = screen.getAllByTestId('day');
    expect(days.length).toBe(7);
  });

  it('handles week navigation correctly', async () => {
    renderWithRouter(
      <Calendar eventData={mockEventData} refetchEvents={mockRefetchEvents} />,
    );

    const currentDate = new Date();

    await act(async () => {
      fireEvent.click(screen.getByTestId('prevWeek'));
    });
    await waitFor(() => {
      expect(
        screen.getByText(String(currentDate.getDate() - 7)),
      ).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('nextWeek'));
    });
    await waitFor(() => {
      expect(
        screen.getByText(String(currentDate.getDate())),
      ).toBeInTheDocument();
    });
  });

  it('filters events correctly for SUPERADMIN role', async () => {
    renderWithRouter(
      <Calendar
        eventData={mockEventData}
        refetchEvents={mockRefetchEvents}
        userRole={Role.SUPERADMIN}
        userId="user1"
        orgData={mockOrgData}
      />,
    );

    const todayCell = await screen.findAllByTestId('day');
    expect(todayCell.length).toBe(7);
  });

  it('filters events correctly for ADMIN role', async () => {
    const mockEvent = {
      ...mockEventData[0],
      startDate: today.toISOString(),
      endDate: today.toISOString(),
    };
    renderWithRouter(
      <Calendar
        eventData={[mockEvent]}
        refetchEvents={mockRefetchEvents}
        userRole={Role.ADMIN}
        userId="admin1"
        orgData={mockOrgData}
      />,
    );

    const todayCell = await screen.findAllByTestId('day');
    expect(todayCell.length).toBe(7);
  });

  it('filters events correctly for USER role', async () => {
    const mockEvent = {
      ...mockEventData[0],
      startDate: today.toISOString(),
      endDate: today.toISOString(),
    };
    renderWithRouter(
      <Calendar
        eventData={[mockEvent]}
        refetchEvents={mockRefetchEvents}
        userRole={Role.USER}
        userId="user1"
        orgData={mockOrgData}
      />,
    );

    const todayCell = await screen.findAllByTestId('day');
    expect(todayCell.length).toBe(7);
  });

  it('displays "No Event Available!" message when no events exist', async () => {
    renderWithRouter(
      <Calendar eventData={[]} refetchEvents={mockRefetchEvents} />,
    );

    await waitFor(() => {
      expect(screen.getByText('No Event Available!')).toBeInTheDocument();
    });
  });

  it('updates events when props change', async () => {
    const mockEvent = {
      ...mockEventData[0],
      title: 'Test Event',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };

    const { rerender } = renderWithRouter(
      <Calendar eventData={[mockEvent]} refetchEvents={mockRefetchEvents} />,
    );

    await screen.findAllByTestId('day');

    const newMockEvents = [
      mockEvent,
      {
        ...mockEvent,
        _id: '2',
        title: 'New Test Event',
      },
    ];

    rerender(
      <Calendar eventData={newMockEvents} refetchEvents={mockRefetchEvents} />,
    );

    await waitFor(() => {
      expect(screen.getByText('New Test Event')).toBeInTheDocument();
    });
  });

  it('collapses expanded event list when clicked again', async () => {
    const mockEvent = {
      ...mockEventData[0],
      startDate: today.toISOString(),
      endDate: today.toISOString(),
    };

    renderWithRouter(
      <Calendar eventData={[mockEvent]} refetchEvents={mockRefetchEvents} />,
    );

    const expandButton = screen.getByTestId('expand-button');
    fireEvent.click(expandButton);

    await waitFor(() => {
      expect(screen.getByTestId('expanded-event-list')).toBeInTheDocument();
    });

    fireEvent.click(expandButton);

    await waitFor(() => {
      expect(screen.queryByTestId('expanded-event-list')).toBeNull();
    });
  });
});

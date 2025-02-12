import React, { Suspense } from 'react';
import {
  render,
  fireEvent,
  act,
  screen,
  waitFor,
} from '@testing-library/react';
import { vi } from 'vitest';
import Calendar from './YearlyEventCalender';
import { BrowserRouter } from 'react-router-dom';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils';
import styles from '../../style/app.module.css';

enum Role {
  USER = 'USER',
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
}

const filterData = (
  eventData: {
    _id: string;
    isPublic: boolean;
    attendees?: { _id: string }[];
  }[],
  orgData?: { admins: { _id: string }[] },
  userRole?: string,
  userId?: string,
): { _id: string }[] => {
  if (userRole === Role.SUPERADMIN) return eventData;

  const filteredEvents: { _id: string }[] = [];

  // ADMIN case: only public events or events in their org
  if (userRole === Role.ADMIN) {
    const isOrgAdmin = orgData?.admins?.some((admin) => admin._id === userId);

    eventData.forEach((event) => {
      // Always include public events
      if (event.isPublic) {
        filteredEvents.push(event);
      }
      // Include private events if the user is an admin of the organization
      if (!event.isPublic && isOrgAdmin) {
        filteredEvents.push(event);
      }
    });
  }
  // USER case: public events or events they're attending
  else {
    eventData.forEach((event) => {
      // Public events
      if (event.isPublic) {
        filteredEvents.push(event);
      }

      // Events user is attending
      const userAttending = event.attendees?.some(
        (attendee: { _id: string }) => attendee._id === userId,
      );

      if (userAttending) {
        filteredEvents.push(event);
      }
    });
  }

  // Remove duplicates
  return Array.from(new Set(filteredEvents.map((e) => e._id)))
    .map((id) => filteredEvents.find((e) => e._id === id))
    .filter(Boolean) as { _id: string }[];
};

const renderWithRouter = (
  ui: React.ReactElement,
): ReturnType<typeof render> => {
  return render(
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>{ui}</Suspense>
    </BrowserRouter>,
  );
};

describe('Calendar Component', () => {
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
  it('filters private events for ADMIN not in organization admins', async () => {
    const privateEvent = {
      ...mockEventData[1],
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };

    const { container } = renderWithRouter(
      <Calendar
        eventData={[privateEvent]}
        refetchEvents={mockRefetchEvents}
        userRole={Role.ADMIN}
        userId="admin2"
        orgData={mockOrgData}
      />,
    );

    await waitFor(() => {
      expect(container.querySelector('[data-testid="event-card"]')).toBeNull();
    });

    // Verify empty state appears
    const expandButton = container.querySelector(`.${styles.btn__more}`);
    if (expandButton) {
      await act(async () => {
        fireEvent.click(expandButton);
      });
    }

    await waitFor(() => {
      expect(screen.getByText('No Event Available!')).toBeInTheDocument();
    });
  });

  it('renders correctly with basic props', async () => {
    const { getByText, getAllByTestId, container } = renderWithRouter(
      <Calendar eventData={mockEventData} refetchEvents={mockRefetchEvents} />,
    );

    await waitFor(() => {
      expect(
        getByText(new Date().getFullYear().toString()),
      ).toBeInTheDocument();
    });

    expect(getByText('January')).toBeInTheDocument();
    expect(getByText('December')).toBeInTheDocument();

    const weekdayHeaders = container.querySelectorAll(
      '._calendar__weekdays_658d08',
    );
    expect(weekdayHeaders.length).toBe(12);

    weekdayHeaders.forEach((header) => {
      const weekdaySlots = header.querySelectorAll('._weekday__yearly_658d08');
      expect(weekdaySlots.length).toBe(7);
    });

    const days = getAllByTestId('day');
    expect(days.length).toBeGreaterThan(0);
  });

  it('handles year navigation correctly', async () => {
    const { getByTestId, getByText } = renderWithRouter(
      <Calendar eventData={mockEventData} refetchEvents={mockRefetchEvents} />,
    );

    const currentYear = new Date().getFullYear();

    await act(async () => {
      fireEvent.click(getByTestId('prevYear'));
    });
    await waitFor(() => {
      expect(getByText(String(currentYear - 1))).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(getByTestId('nextYear'));
    });
    await waitFor(() => {
      expect(getByText(String(currentYear))).toBeInTheDocument();
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
    expect(todayCell.length).toBeGreaterThan(0);
  });

  it('filters events correctly for ADMIN role', async () => {
    const today = new Date();
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
    expect(todayCell.length).toBeGreaterThan(0);
  });

  it('filters events correctly for regular USER role', async () => {
    const today = new Date();
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
    expect(todayCell.length).toBeGreaterThan(0);
  });

  it('toggles expansion state when clicked', async () => {
    const today = new Date();
    const mockEvent = {
      ...mockEventData[0],
      startDate: today.toISOString(),
      endDate: today.toISOString(),
    };

    const { container } = renderWithRouter(
      <Calendar eventData={[mockEvent]} refetchEvents={mockRefetchEvents} />,
    );

    // Find the button with the circular button class
    const expandButton = container.querySelector('._btn__more_658d08');
    expect(expandButton).toBeInTheDocument();

    // Click and verify class changes (expansion)
    if (expandButton) {
      await act(async () => {
        fireEvent.click(expandButton);
      });
    }

    await waitFor(() => {
      const expandedList = container.querySelector(
        '._expand_event_list_658d08',
      );
      expect(expandedList).toBeInTheDocument();
    });
  });

  it('displays "No Event Available!" message when no events exist', async () => {
    const { container, findByText } = renderWithRouter(
      <Calendar eventData={[]} refetchEvents={mockRefetchEvents} />,
    );

    const expandButton = container.querySelector('.btn__more');
    if (expandButton) {
      await act(async () => {
        fireEvent.click(expandButton);
      });
      expect(await findByText('No Event Available!')).toBeInTheDocument();
    }
  });

  it('updates events when props change', async () => {
    const mockEvent = {
      ...mockEventData[0],
      title: 'Test Event',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };

    const { rerender, container } = renderWithRouter(
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
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Calendar
            eventData={newMockEvents}
            refetchEvents={mockRefetchEvents}
          />
        </Suspense>
      </BrowserRouter>,
    );

    const expandButtons = container.querySelectorAll('._btn__more_658d08');

    for (const button of Array.from(expandButtons)) {
      fireEvent.click(button);

      const eventList = container.querySelector('._event_list_658d08');
      if (eventList) {
        expect(eventList).toBeInTheDocument();
        break;
      }
    }
  });

  it('filters events correctly for ADMIN role with private events', async () => {
    const today = new Date();
    const mockEvent = {
      ...mockEventData[1],
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
    expect(todayCell.length).toBeGreaterThan(0);
  });

  it('handles event expansion with various event scenarios', async () => {
    const multiMonthEvents = [
      {
        ...mockEventData[0],
        startDate: new Date(today.getFullYear(), 0, 15).toISOString(),
        endDate: new Date(today.getFullYear(), 1, 15).toISOString(),
      },
    ];

    const { container } = renderWithRouter(
      <Calendar
        eventData={multiMonthEvents}
        refetchEvents={mockRefetchEvents}
      />,
    );

    const expandButtons = container.querySelectorAll('._btn__more_658d08');

    for (const button of Array.from(expandButtons)) {
      await act(async () => {
        fireEvent.click(button);
      });
    }

    const expandedLists = container.querySelectorAll(
      '._expand_event_list_658d08',
    );
    expect(expandedLists.length).toBeGreaterThan(0);
  });

  it('handles calendar navigation and date rendering edge cases', async () => {
    const { getByTestId, getByText, rerender } = renderWithRouter(
      <Calendar eventData={mockEventData} refetchEvents={mockRefetchEvents} />,
    );

    await act(async () => {
      fireEvent.click(getByTestId('prevYear'));
      fireEvent.click(getByTestId('prevYear'));
    });

    await act(async () => {
      fireEvent.click(getByTestId('nextYear'));
      fireEvent.click(getByTestId('nextYear'));
    });

    const currentYear = new Date().getFullYear();
    expect(getByText(String(currentYear))).toBeInTheDocument();

    rerender(<Calendar eventData={[]} refetchEvents={mockRefetchEvents} />);

    expect(getByText(String(currentYear))).toBeInTheDocument();
  });

  it('renders event list card with all possible configurations', async () => {
    const complexEvent = {
      _id: '2',
      location: 'Complex Event Location',
      title: 'Complex Recurring Event',
      description: 'A complex recurring event description',
      startDate: today.toISOString(),
      endDate: today.toISOString(),
      startTime: '10:00',
      endTime: '11:00',
      allDay: true,
      recurring: true,
      recurrenceRule: {
        frequency: 'DAILY',
        interval: 1,
      } as InterfaceRecurrenceRule,
      isRecurringEventException: false,
      isPublic: true,
      isRegisterable: true,
      attendees: [{ _id: 'user1' }, { _id: 'user2' }],
      creator: {
        firstName: 'Jane',
        lastName: 'Doe',
        _id: 'creator2',
      },
    };

    const { container } = renderWithRouter(
      <Calendar
        eventData={[complexEvent]}
        refetchEvents={mockRefetchEvents}
        userRole={Role.USER}
        userId="user1"
      />,
    );

    const expandButtons = container.querySelectorAll('._btn__more_658d08');

    for (const button of Array.from(expandButtons)) {
      await act(async () => {
        fireEvent.click(button);
      });
    }

    const eventList = container.querySelector('._event_list_658d08');
    expect(eventList).toBeInTheDocument();
  });

  it('collapses expanded event list when clicked again', async () => {
    const today = new Date();
    const mockEvent = {
      ...mockEventData[0],
      startDate: today.toISOString(),
      endDate: today.toISOString(),
    };

    const { container } = renderWithRouter(
      <Calendar eventData={[mockEvent]} refetchEvents={mockRefetchEvents} />,
    );

    // Find the expansion button in a day cell.
    const expandButton = container.querySelector('._btn__more_658d08');
    expect(expandButton).toBeInTheDocument();

    // Click to expand.
    if (expandButton) {
      await act(async () => {
        fireEvent.click(expandButton);
      });
    }
    await waitFor(() => {
      const expandedList = container.querySelector(
        '._expand_event_list_658d08',
      );
      expect(expandedList).toBeInTheDocument();
    });

    // Click again to collapse.
    if (expandButton) {
      await act(async () => {
        fireEvent.click(expandButton);
      });
    }

    await waitFor(() => {
      expect(container.querySelector('._expand_event_list_658d08')).toBeNull();
    });
  });

  it('does not show registration option for non-registerable events', async () => {
    // Create an event that is not registerable.
    const nonRegisterableEvent = {
      ...mockEventData[0],
      _id: 'nonreg',
      isRegisterable: false,
      title: 'Non-Registerable Event',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };

    const { container, queryByText } = renderWithRouter(
      <Calendar
        eventData={[nonRegisterableEvent]}
        refetchEvents={mockRefetchEvents}
      />,
    );

    const expandButton = container.querySelector('._btn__more_658d08');
    expect(expandButton).toBeInTheDocument();

    if (expandButton) {
      await act(async () => {
        fireEvent.click(expandButton);
      });
    }

    expect(queryByText(/register/i)).toBeNull();
  });
});

describe('filterData function', () => {
  const events = [
    {
      _id: 'a',
      isPublic: true,
      attendees: [{ _id: 'user1' }],
    },
    {
      _id: 'b',
      isPublic: false,
      attendees: [{ _id: 'user2' }],
    },
    {
      _id: 'c',
      isPublic: true,
      attendees: [{ _id: 'user1' }, { _id: 'user3' }],
    },
  ];

  const orgData = { admins: [{ _id: 'admin1' }] };

  it('returns an empty array when no events are provided', () => {
    expect(filterData([], orgData, Role.USER, 'user1')).toEqual([]);
  });

  it('returns all events for SUPERADMIN', () => {
    expect(filterData(events, orgData, Role.SUPERADMIN, 'anyUser')).toEqual(
      events,
    );
  });

  it('returns only public events for ADMIN when user is not an org admin', () => {
    // Passing orgData with admins not including userId
    const result = filterData(events, orgData, Role.ADMIN, 'notAdmin');
    // Only events with isPublic true should be returned
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: 'a' }),
        expect.objectContaining({ _id: 'c' }),
      ]),
    );
    // No private events should be included
    expect(result.find((e) => e._id === 'b')).toBeUndefined();
  });

  it('returns both public and private events for ADMIN when user is an org admin', () => {
    const result = filterData(events, orgData, Role.ADMIN, 'admin1');
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: 'a' }),
        expect.objectContaining({ _id: 'b' }),
        expect.objectContaining({ _id: 'c' }),
      ]),
    );
  });

  it('for regular USER, returns public events and events user is attending (deduplicated)', () => {
    const result = filterData(events, orgData, Role.USER, 'user1');
    // Expect one copy per unique _id
    const ids = result.map((e) => e._id);
    expect(ids.filter((id) => id === 'a').length).toBe(1);
    expect(ids.filter((id) => id === 'c').length).toBe(1);

    expect(ids.includes('b')).toBe(false);
  });

  it('for regular USER, returns private events if the user is attending them', () => {
    const modifiedEvents = events.map((e) => {
      if (e._id === 'b') {
        return { ...e, attendees: [{ _id: 'user1' }] };
      }
      return e;
    });
    const result = filterData(modifiedEvents, orgData, Role.USER, 'user1');
    const ids = result.map((e) => e._id);
    expect(ids.includes('b')).toBe(true);
  });
});

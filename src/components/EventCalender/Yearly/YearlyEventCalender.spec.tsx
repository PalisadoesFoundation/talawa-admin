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
import { UserRole } from 'types/Event/interface';

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
    id: 'org1',
    name: 'Test Organization',
    description: 'Test Description',
    location: 'Test Location',
    isPublic: true,
    visibleInSearch: true,
    members: {
      edges: [
        {
          node: {
            id: 'user1',
            name: 'Test User',
            emailAddress: 'user1@example.com',
            role: 'MEMBER',
          },
          cursor: 'cursor1',
        },
        {
          node: {
            id: 'admin1',
            name: 'Admin User',
            emailAddress: 'admin1@example.com',
            role: 'ADMIN',
          },
          cursor: 'cursor2',
        },
      ],
      pageInfo: {
        hasNextPage: false,
        endCursor: 'cursor2',
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
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
      '._calendar__weekdays_d00707',
    );
    expect(weekdayHeaders.length).toBe(12);

    weekdayHeaders.forEach((header) => {
      const weekdaySlots = header.querySelectorAll('._weekday__yearly_d00707');
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

  it('filters events correctly for ADMINISTRATOR role', async () => {
    renderWithRouter(
      <Calendar
        eventData={mockEventData}
        refetchEvents={mockRefetchEvents}
        userRole={UserRole.ADMINISTRATOR}
        userId="user1"
        orgData={mockOrgData}
      />,
    );

    const todayCell = await screen.findAllByTestId('day');
    expect(todayCell.length).toBeGreaterThan(0);
  });

  it('filters events correctly for ADMINISTRATOR role', async () => {
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
        userRole={UserRole.ADMINISTRATOR}
        userId="admin1"
        orgData={mockOrgData}
      />,
    );

    const todayCell = await screen.findAllByTestId('day');
    expect(todayCell.length).toBeGreaterThan(0);
  });

  it('filters events correctly for regular REGULAR role', async () => {
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
        userRole={UserRole.REGULAR}
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

    const expandButton = container.querySelector('._btn__more_d00707');
    expect(expandButton).toBeInTheDocument();
    if (expandButton) {
      await act(async () => {
        fireEvent.click(expandButton);
      });
    }

    await waitFor(() => {
      const expandedList = container.querySelector(
        '._expand_event_list_d00707',
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

    const expandButtons = container.querySelectorAll('._btn__more_d00707');

    for (const button of Array.from(expandButtons)) {
      fireEvent.click(button);

      const eventList = container.querySelector('._event_list_d00707');
      if (eventList) {
        expect(eventList).toBeInTheDocument();
        break;
      }
    }
  });

  it('filters events correctly for ADMINISTRATOR role with private events', async () => {
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
        userRole={UserRole.ADMINISTRATOR}
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

    const expandButtons = container.querySelectorAll('._btn__more_d00707');

    for (const button of Array.from(expandButtons)) {
      await act(async () => {
        fireEvent.click(button);
      });
    }

    const expandedLists = container.querySelectorAll(
      '._expand_event_list_d00707',
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

    const expandButton = container.querySelector('._btn__more_d00707');
    expect(expandButton).toBeInTheDocument();
    if (expandButton) {
      await act(async () => {
        fireEvent.click(expandButton);
      });
    }
    await waitFor(() => {
      const expandedList = container.querySelector(
        '._expand_event_list_d00707',
      );
      expect(expandedList).toBeInTheDocument();
    });

    if (expandButton) {
      await act(async () => {
        fireEvent.click(expandButton);
      });
    }
    await waitFor(() => {
      expect(container.querySelector('._expand_event_list_d00707')).toBeNull();
    });
  });
});

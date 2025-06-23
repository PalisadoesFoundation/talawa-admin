import React, { Suspense } from 'react';
import {
  render,
  fireEvent,
  act,
  screen,
  waitFor,
} from '@testing-library/react';
import { vi, it, describe, beforeEach, expect } from 'vitest';
import Calendar from './YearlyEventCalender';
import { BrowserRouter, MemoryRouter, useParams } from 'react-router-dom';
import { UserRole } from 'types/Event/interface';

// Mock the react-router-dom module
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  // Create a proper React component that returns null
  const MockNavigate = () => null;

  return {
    ...actual,
    useParams: vi.fn().mockReturnValue({ orgId: 'org1' }),
    useNavigate: vi.fn().mockReturnValue(vi.fn()),
    useLocation: vi.fn().mockReturnValue({
      pathname: '/organization/org1',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    }),
    // Replace the Navigate component with our React component
    Navigate: MockNavigate,
    // Make sure to preserve the actual routers
    MemoryRouter: actual.MemoryRouter,
    BrowserRouter: actual.BrowserRouter,
  };
});

const renderWithRouterAndPath = (
  ui: React.ReactElement,
  { route = '/organization/org1' } = {},
): ReturnType<typeof render> => {
  // Use MemoryRouter with initialEntries to set the path in the router context
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Suspense fallback={<div>Loading...</div>}>{ui}</Suspense>
    </MemoryRouter>,
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
    // Reset the mock implementation for useParams before each test
    vi.mocked(useParams).mockReturnValue({ orgId: 'org1' });
  });

  it('renders correctly with basic props', async () => {
    const { getByText, getAllByTestId, container } = renderWithRouterAndPath(
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
      '._calendar__weekdays_d8535b',
    );
    expect(weekdayHeaders.length).toBe(12);

    weekdayHeaders.forEach((header) => {
      const weekdaySlots = header.querySelectorAll('._weekday__yearly_d8535b');
      expect(weekdaySlots.length).toBe(7);
    });

    const days = getAllByTestId('day');
    expect(days.length).toBeGreaterThan(0);
  });

  it('handles year navigation correctly', async () => {
    const { getByTestId, getByText } = renderWithRouterAndPath(
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
    renderWithRouterAndPath(
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

  it("filters events correctly for ADMINISTRATOR role with today's event", async () => {
    const todayDate = new Date();
    const mockEvent = {
      ...mockEventData[0],
      startDate: todayDate.toISOString(),
      endDate: todayDate.toISOString(),
    };
    renderWithRouterAndPath(
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

  it('filters events correctly for REGULAR role', async () => {
    const todayDate = new Date();
    const mockEvent = {
      ...mockEventData[0],
      startDate: todayDate.toISOString(),
      endDate: todayDate.toISOString(),
    };

    renderWithRouterAndPath(
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
    const todayDate = new Date();
    const mockEvent = {
      ...mockEventData[0],
      startDate: todayDate.toISOString(),
      endDate: todayDate.toISOString(),
    };

    const { container } = renderWithRouterAndPath(
      <Calendar eventData={[mockEvent]} refetchEvents={mockRefetchEvents} />,
    );

    const expandButton = container.querySelector('._btn__more_d8535b');
    expect(expandButton).toBeInTheDocument();
    if (expandButton) {
      await act(async () => {
        fireEvent.click(expandButton);
      });
    }

    await waitFor(() => {
      const expandedList = container.querySelector(
        '._expand_event_list_d8535b',
      );
      expect(expandedList).toBeInTheDocument();
    });
  });

  it('displays "No Event Available!" message when no events exist', async () => {
    const { container, findByText } = renderWithRouterAndPath(
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

    const { rerender, container } = renderWithRouterAndPath(
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
    const todayDate = new Date();
    const mockEvent = {
      ...mockEventData[1],
      startDate: todayDate.toISOString(),
      endDate: todayDate.toISOString(),
    };

    renderWithRouterAndPath(
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

    // Ensure all router mocks are properly set up for this test
    vi.mocked(useParams).mockReturnValue({ orgId: 'org1' });

    // Use the new helper with a route that includes orgId
    const { container, findAllByTestId } = render(
      <MemoryRouter initialEntries={['/organization/org1']}>
        <Suspense fallback={<div>Loading...</div>}>
          <Calendar
            eventData={multiMonthEvents}
            refetchEvents={mockRefetchEvents}
            userRole={UserRole.ADMINISTRATOR}
            userId="admin1"
            orgData={{
              ...mockOrgData,
              id: 'org1', // Ensure this matches the orgId in useParams mock
            }}
          />
        </Suspense>
      </MemoryRouter>,
    );

    // Wait for the calendar days to be rendered
    await findAllByTestId('day');

    // Wait a bit for all components to be fully mounted
    await waitFor(() => {
      const buttons = container.querySelectorAll('._btn__more_d8535b');
      expect(buttons.length).toBeGreaterThan(0);
    });

    const expandButtons = container.querySelectorAll('._btn__more_d00707');

    // Test with only the first button to avoid potential navigation issues
    if (expandButtons.length > 0) {
      await act(async () => {
        fireEvent.click(expandButtons[0]);
        await waitFor(() => {
          const expandedList = container.querySelector(
            '._expand_event_list_d8535b',
          );
          expect(expandedList).toBeInTheDocument();
        });
      });
    }
  });

  it('handles calendar navigation and date rendering edge cases', async () => {
    // Use the helper with default route for consistency
    const { getByTestId, getByText, rerender } = renderWithRouterAndPath(
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

    rerender(
      <MemoryRouter initialEntries={['/organization/org1']}>
        <Suspense fallback={<div>Loading...</div>}>
          <Calendar
            eventData={[]}
            refetchEvents={mockRefetchEvents}
            orgData={mockOrgData}
          />
        </Suspense>
      </MemoryRouter>,
    );

    expect(getByText(String(currentYear))).toBeInTheDocument();
  });

  it('collapses expanded event list when clicked again', async () => {
    const todayDate = new Date();
    const mockEvent = {
      ...mockEventData[0],
      startDate: todayDate.toISOString(),
      endDate: todayDate.toISOString(),
    };

    const { container } = renderWithRouterAndPath(
      <Calendar
        eventData={[mockEvent]}
        refetchEvents={mockRefetchEvents}
        orgData={mockOrgData}
      />,
    );

    const expandButton = container.querySelector('._btn__more_d8535b');
    expect(expandButton).toBeInTheDocument();
    if (expandButton) {
      await act(async () => {
        fireEvent.click(expandButton);
      });
    }
    await waitFor(() => {
      const expandedList = container.querySelector(
        '._expand_event_list_d8535b',
      );
      expect(expandedList).toBeInTheDocument();
    });

    if (expandButton) {
      await act(async () => {
        fireEvent.click(expandButton);
      });
    }
    await waitFor(() => {
      expect(container.querySelector('._expand_event_list_d8535b')).toBeNull();
    });
  });
});

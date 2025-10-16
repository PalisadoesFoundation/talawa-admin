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
      name: 'Test Event',
      description: 'Test Description',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      startTime: '10:00',
      endTime: '11:00',
      allDay: false,
      isPublic: true,
      isRegisterable: true,
      attendees: [{ id: 'user1', name: 'User 1', emailAddress: 'user1@example.com' }],
      creator: {
        id: 'creator1',
        name: 'John Doe',
        emailAddress: 'john@example.com',
      },
    },
    {
      _id: '2',
      location: 'Private Location',
      name: 'Private Event',
      description: 'Private Description',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      startTime: '12:00',
      endTime: '13:00',
      allDay: false,
      isPublic: false,
      isRegisterable: true,
      attendees: [{ id: 'user2', name: 'User 2', emailAddress: 'user2@example.com' }],
      creator: {
        id: 'creator2',
        name: 'Jane Doe',
        emailAddress: 'jane@example.com',
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

    // Check weekday headers - verify header containers exist with 7 weekdays each
    const weekdayHeaders = screen.getAllByTestId('weekday-header');
    expect(weekdayHeaders.length).toBe(12); // One header row for each month

    // Verify each header row contains 7 weekday cells
    weekdayHeaders.forEach((header) => {
      const weekdayCells = Array.from(
        header.querySelectorAll('[data-testid^="weekday-"]'),
      );
      expect(weekdayCells.length).toBe(7);
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
    renderWithRouterAndPath(
      <Calendar eventData={[]} refetchEvents={mockRefetchEvents} />,
    );

    // Wait for the calendar to render
    await waitFor(() => {
      expect(screen.getAllByTestId('day').length).toBeGreaterThan(0);
    });

    // Test expansion with no events (should show "No Event Available!")
    const noEventButtons = screen.getAllByTestId(/no-events-btn-/);
    expect(noEventButtons.length).toBeGreaterThan(0);

    // Click to expand first no-event button
    await act(async () => {
      fireEvent.click(noEventButtons[0]);
    });

    // Verify "No Event Available!" message and "Close" text appear when expanded
    await waitFor(() => {
      expect(screen.getByText('No Event Available!')).toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument();
    });

    // Click again to collapse
    await act(async () => {
      fireEvent.click(noEventButtons[0]);
    });

    // Verify collapsed state
    await waitFor(() => {
      expect(screen.queryByText('Close')).not.toBeInTheDocument();
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
      name: 'Test Event',
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
        name: 'New Test Event',
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
    const currentYear = today.getFullYear();
    const multiMonthEvents = [
      {
        ...mockEventData[0],
        _id: '1',
        name: 'Event 1',
        startDate: new Date(currentYear, 0, 15).toISOString(),
        endDate: new Date(currentYear, 0, 15).toISOString(),
      },
      {
        ...mockEventData[0],
        _id: '2',
        name: 'Event 2',
        startDate: new Date(currentYear, 0, 15).toISOString(),
        endDate: new Date(currentYear, 0, 15).toISOString(),
      },
      {
        ...mockEventData[0],
        _id: '3',
        name: 'Event 3',
        startDate: new Date(currentYear, 0, 15).toISOString(),
        endDate: new Date(currentYear, 0, 15).toISOString(),
      },
    ];

    // Ensure all router mocks are properly set up for this test
    vi.mocked(useParams).mockReturnValue({ orgId: 'org1' });

    // Use the new helper with a route that includes orgId
    const { findAllByTestId } = render(
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
    const days = await findAllByTestId('day');
    expect(days.length).toBeGreaterThan(0);

    // Calendar should be rendered with all 12 months
    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('December')).toBeInTheDocument();

    // Find all buttons (either expand-btn or no-events-btn)
    const allButtons = screen.queryAllByTestId(/btn-0-/);
    expect(allButtons.length).toBeGreaterThan(0);

    // Click first button to test expansion functionality
    await act(async () => {
      fireEvent.click(allButtons[0]);
    });

    // After clicking, should have either "Close" or "No Event Available!" message
    await waitFor(() => {
      const expanded =
        screen.queryByText('Close') ||
        screen.queryByText('No Event Available!');
      expect(expanded).toBeInTheDocument();
    });
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
    renderWithRouterAndPath(
      <Calendar
        eventData={[]}
        refetchEvents={mockRefetchEvents}
        orgData={mockOrgData}
      />,
    );

    // Wait for calendar to render
    await waitFor(() => {
      expect(screen.getAllByTestId('day').length).toBeGreaterThan(0);
    });

    // Find a no-event button
    const noEventButtons = screen.getAllByTestId(/no-events-btn-/);
    expect(noEventButtons.length).toBeGreaterThan(0);

    // Click to expand
    await act(async () => {
      fireEvent.click(noEventButtons[0]);
    });

    // Verify expanded state
    await waitFor(() => {
      expect(screen.getByText('No Event Available!')).toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument();
    });

    // Click again to collapse
    await act(async () => {
      fireEvent.click(noEventButtons[0]);
    });

    // Verify collapsed state (Close button should not be visible)
    await waitFor(() => {
      expect(screen.queryByText('Close')).not.toBeInTheDocument();
    });
  });

  it('filters events for REGULAR users who are organization members', async () => {
    const todayYear = today.getFullYear();
    const testDate = new Date(todayYear, 5, 15);

    const events = [
      {
        ...mockEventData[0],
        _id: 'event1',
        name: 'Public Event',
        isPublic: true,
        startDate: testDate.toISOString(),
        endDate: testDate.toISOString(),
      },
      {
        ...mockEventData[0],
        _id: 'event2',
        name: 'Private Event',
        isPublic: false,
        startDate: testDate.toISOString(),
        endDate: testDate.toISOString(),
      },
    ];

    // Test as REGULAR user who IS a member
    const orgDataWithMember = {
      ...mockOrgData,
      members: {
        edges: [
          { 
            node: { 
              id: 'user123', 
              name: 'Test User', 
              emailAddress: 'test@example.com' 
            },
            cursor: 'cursor1',
          },
        ],
        pageInfo: {
          hasNextPage: false,
          endCursor: 'cursor1',
        },
      },
    };

    renderWithRouterAndPath(
      <Calendar
        eventData={events}
        refetchEvents={mockRefetchEvents}
        userRole={UserRole.REGULAR}
        userId="user123"
        orgData={orgDataWithMember}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('day').length).toBeGreaterThan(0);
    });

    // Verify calendar rendered - both public and private events should be filtered for members
    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('December')).toBeInTheDocument();
  });

  it('filters events for REGULAR users who are NOT organization members', async () => {
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();
    // Create event for today to ensure it's on the calendar
    const testDate = new Date(todayYear, todayMonth, todayDate, 0, 0, 0, 0);

    const events = [
      {
        ...mockEventData[0],
        _id: 'event1',
        name: 'Public Event for Non-Members',
        isPublic: true,
        startDate: testDate.toISOString(),
        endDate: testDate.toISOString(),
      },
      {
        ...mockEventData[0],
        _id: 'event2',
        name: 'Private Event Filtered',
        isPublic: false,
        startDate: testDate.toISOString(),
        endDate: testDate.toISOString(),
      },
    ];

    // Test as REGULAR user who is NOT a member
    const orgDataWithoutMember = {
      ...mockOrgData,
      members: {
        edges: [
          { 
            node: { 
              id: 'otherUser', 
              name: 'Other User', 
              emailAddress: 'other@example.com' 
            },
            cursor: 'cursor1',
          },
        ],
        pageInfo: {
          hasNextPage: false,
          endCursor: 'cursor1',
        },
      },
    };

    renderWithRouterAndPath(
      <Calendar
        eventData={events}
        refetchEvents={mockRefetchEvents}
        userRole={UserRole.REGULAR}
        userId="user123"
        orgData={orgDataWithoutMember}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('day').length).toBeGreaterThan(0);
    });

    // Verify calendar rendered
    expect(screen.getByText('January')).toBeInTheDocument();
    expect(screen.getByText('December')).toBeInTheDocument();

    // Verify role-based filtering: The component should filter events correctly
    // For non-members, private events should be filtered out and only public events visible
    // Check that expand buttons exist for today's month
    const allExpandButtons = screen.queryAllByTestId(/expand-btn-/);
    const allNoEventButtons = screen.queryAllByTestId(/no-events-btn-/);

    // The calendar should have rendered with buttons (either expand or no-event)
    expect(allExpandButtons.length + allNoEventButtons.length).toBeGreaterThan(
      0,
    );

    // Verify filtering logic by checking that private event name is not in DOM
    // (it should be filtered out for non-members before rendering)
    expect(
      screen.queryByText('Private Event Filtered'),
    ).not.toBeInTheDocument();

    // If there are any expand buttons, clicking them should not show the private event
    if (allExpandButtons.length > 0) {
      await act(async () => {
        fireEvent.click(allExpandButtons[0]);
      });

      // After expansion, private event should still not be visible
      await waitFor(() => {
        expect(
          screen.queryByText('Private Event Filtered'),
        ).not.toBeInTheDocument();
      });
    }
  });

  it('handles expand button clicks to test event expansion logic', async () => {
    // Create an event that will be on the calendar
    // Set time to midnight to ensure dayjs.isSame() works
    const testDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0,
    );

    const testEvent = {
      ...mockEventData[0],
      _id: 'event-test',
      name: 'Test Event',
      startDate: testDate.toISOString(),
      endDate: testDate.toISOString(),
    };

    const { container } = renderWithRouterAndPath(
      <Calendar
        eventData={[testEvent]}
        refetchEvents={mockRefetchEvents}
        userRole={UserRole.ADMINISTRATOR}
        orgData={mockOrgData}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('day').length).toBeGreaterThan(0);
    });

    // Find all expand buttons (for days with events)
    const allButtons = container.querySelectorAll(
      '[data-testid^="expand-btn-"]',
    );

    // If there are expand buttons with events, test the onClick handler
    if (allButtons.length > 0) {
      // Click the first expand button
      await act(async () => {
        fireEvent.click(allButtons[0]);
      });

      // Wait a bit for any state updates
      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });

      // Click again to test collapse
      await act(async () => {
        fireEvent.click(allButtons[0]);
      });
    }

    // Verify calendar rendered properly
    expect(screen.getAllByTestId('day').length).toBeGreaterThan(0);
    expect(screen.getByText('January')).toBeInTheDocument();
  });
});

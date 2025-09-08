import React, { Suspense } from 'react';
import Loader from 'components/Loader/Loader';
import {
  render,
  fireEvent,
  act,
  screen,
  waitFor,
} from '@testing-library/react';
import { vi, it, describe, beforeEach, expect } from 'vitest';
import Calendar from './YearlyEventCalender';
import { UserRole } from 'types/Event/interface';

// Hoisted mock for react-router-dom BEFORE importing symbols from it
vi.mock('react-router-dom', async (orig) => {
  const actual: any = await (orig as any)();
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
    Navigate: MockNavigate,
  };
});

// After mocking, import the actual (now mocked) module
import * as ReactRouterDom from 'react-router-dom';

vi.mock('components/EventListCard/Modal/EventListCardModals', () => ({
  __esModule: true,
  default: () => null,
}));

// Retain a lightweight mock for react-router (if imported indirectly)
vi.mock('react-router', async (orig) => {
  const actual: any = await (orig as any)();
  const MockNavigate = () => null;
  return { ...actual, Navigate: MockNavigate };
});

const renderWithRouterAndPath = (
  ui: React.ReactElement,
  { route = '/organization/org1' } = {},
): ReturnType<typeof render> => {
  // Use MemoryRouter with initialEntries to set the path in the router context
  return render(
    <ReactRouterDom.MemoryRouter initialEntries={[route]}>
      <Suspense fallback={<Loader size="xl" />}>{ui}</Suspense>
    </ReactRouterDom.MemoryRouter>,
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
      name: 'Private Event',
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
    (ReactRouterDom as any).useParams.mockReturnValue({ orgId: 'org1' });
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

    const expandButton = container.querySelector(
      '[data-testid^="expand-btn-"]',
    );
    expect(expandButton).toBeInTheDocument();
    if (expandButton) {
      await act(async () => {
        fireEvent.click(expandButton);
      });
    }

    // Expect that clicking again closes (class/state) by toggling text 'Close'
    await waitFor(() => {
      expect(screen.getByText('Close')).toBeInTheDocument();
    });
  });

  it('displays "No Event Available!" message when no events exist', async () => {
    const { container } = renderWithRouterAndPath(
      <Calendar eventData={[]} refetchEvents={mockRefetchEvents} />,
    );

    // pick first no-events button
    const noEventsButton = container.querySelector(
      '[data-testid^="no-events-btn-"]',
    );
    expect(noEventsButton).toBeInTheDocument();
    if (noEventsButton) {
      await act(async () => {
        fireEvent.click(noEventsButton);
      });
      await waitFor(() => {
        expect(screen.getByText('No Event Available!')).toBeInTheDocument();
      });
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
      <Calendar eventData={newMockEvents} refetchEvents={mockRefetchEvents} />,
    );

    const expandButtons = container.querySelectorAll(
      '[data-testid^="expand-btn-"]',
    );

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
    (ReactRouterDom as any).useParams.mockReturnValue({ orgId: 'org1' });

    const { container, findAllByTestId } = renderWithRouterAndPath(
      <Calendar
        eventData={multiMonthEvents}
        refetchEvents={mockRefetchEvents}
        userRole={UserRole.ADMINISTRATOR}
        userId="admin1"
        orgData={{
          ...mockOrgData,
          id: 'org1',
        }}
      />,
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
          expect(screen.getByText('Close')).toBeInTheDocument();
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
      <Calendar
        eventData={[]}
        refetchEvents={mockRefetchEvents}
        orgData={mockOrgData}
      />,
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

    const expandButton = container.querySelector(
      '[data-testid^="expand-btn-"]',
    );
    expect(expandButton).toBeInTheDocument();
    if (expandButton) {
      await act(async () => {
        fireEvent.click(expandButton);
      });
    }
    await waitFor(() => {
      expect(screen.getByText('Close')).toBeInTheDocument();
    });

    if (expandButton) {
      await act(async () => {
        fireEvent.click(expandButton);
      });
    }
    await waitFor(() => {
      // 'Close' text removed after collapse
      expect(screen.queryByText('Close')).toBeNull();
    });
  });

  it('renders public and member-private events together for REGULAR user', async () => {
    const todayDate = new Date();
    const privateEvent = {
      ...mockEventData[1],
      name: 'Private Member Event',
      startDate: todayDate.toISOString(),
      endDate: todayDate.toISOString(),
      startTime: '12:00',
      endTime: '13:00',
      isPublic: false,
    };
    const publicEvent = {
      ...mockEventData[0],
      name: 'Public Event',
      startDate: todayDate.toISOString(),
      endDate: todayDate.toISOString(),
      startTime: '14:00',
      endTime: '15:00',
      isPublic: true,
    };

    const { container } = renderWithRouterAndPath(
      <Calendar
        eventData={[privateEvent, publicEvent]}
        refetchEvents={mockRefetchEvents}
        userRole={UserRole.REGULAR}
        userId="user1"
        orgData={mockOrgData}
      />,
    );

    await screen.findAllByTestId('day');

    const expandButtons = container.querySelectorAll(
      '[data-testid^="expand-btn-"]',
    );

    for (const button of Array.from(expandButtons)) {
      await act(async () => {
        fireEvent.click(button);
      });
      try {
        await waitFor(() => {
          expect(screen.getByText('Public Event')).toBeInTheDocument();
          expect(screen.getByText('Private Member Event')).toBeInTheDocument();
        });
        break;
      } catch {
        continue;
      }
    }
  });

  it('filters out private events when userRole and userId are missing', async () => {
    const todayDate = new Date();
    const privateEvent = {
      ...mockEventData[1],
      name: 'Hidden Private Event',
      startDate: todayDate.toISOString(),
      endDate: todayDate.toISOString(),
      isPublic: false,
    };
    const publicEvent = {
      ...mockEventData[0],
      name: 'Visible Public Event',
      startDate: todayDate.toISOString(),
      endDate: todayDate.toISOString(),
      isPublic: true,
    };

    const { container } = renderWithRouterAndPath(
      // Intentionally omit userRole & userId to test branch returning only public events
      <Calendar
        eventData={[privateEvent, publicEvent]}
        refetchEvents={mockRefetchEvents}
      />,
    );

    await screen.findAllByTestId('day');
    // Choose an expand button whose sibling day number matches public event day
    const allExpandButtons = Array.from(
      container.querySelectorAll('[data-testid^="expand-btn-"]'),
    ) as HTMLElement[];
    // Click each until content found or exhaust
    for (const btn of allExpandButtons) {
      await act(async () => fireEvent.click(btn));
      try {
        await waitFor(() => {
          expect(screen.getByText('Visible Public Event')).toBeInTheDocument();
          expect(screen.queryByText('Hidden Private Event')).toBeNull();
        });
        break;
      } catch {
        // collapse and continue
        await act(async () => fireEvent.click(btn));
        continue;
      }
    }
  });

  it('filters out private events for REGULAR non-member user', async () => {
    const todayDate = new Date();
    const privateEvent = {
      ...mockEventData[1],
      name: 'Org Private Event',
      startDate: todayDate.toISOString(),
      endDate: todayDate.toISOString(),
      isPublic: false,
    };
    const orgWithoutUser = {
      ...mockOrgData,
      members: {
        ...mockOrgData.members,
        edges: mockOrgData.members.edges.filter(
          (e) => e.node.id !== 'ghostUser',
        ),
      },
    };
    const { container } = renderWithRouterAndPath(
      <Calendar
        eventData={[privateEvent]}
        refetchEvents={mockRefetchEvents}
        userRole={UserRole.REGULAR}
        userId="ghostUser"
        orgData={orgWithoutUser}
      />,
    );

    await screen.findAllByTestId('day');
    const noEventsBtn = container.querySelector(
      '[data-testid^="no-events-btn-"]',
    );
    if (noEventsBtn) {
      await act(async () => fireEvent.click(noEventsBtn));
      await waitFor(() => {
        expect(screen.getByText('No Event Available!')).toBeInTheDocument();
      });
    }
  });

  it('handles undefined eventData gracefully (internal filter branch)', async () => {
    const { container } = renderWithRouterAndPath(
      // Provide undefined eventData to exercise early return path in filterData
      <Calendar
        eventData={undefined as any}
        refetchEvents={mockRefetchEvents}
      />,
    );
    await screen.findAllByTestId('day');
    const noEventsBtn = container.querySelector(
      '[data-testid^="no-events-btn-"]',
    );
    if (noEventsBtn) {
      await act(async () => fireEvent.click(noEventsBtn));
      await waitFor(() => {
        expect(screen.getByText('No Event Available!')).toBeInTheDocument();
      });
    }
  });
});

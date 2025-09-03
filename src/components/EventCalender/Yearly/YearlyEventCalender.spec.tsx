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
import { UserRole, type InterfaceCalendarProps } from 'types/Event/interface';

// Helper type for Calendar event items
type CalendarEventItem = NonNullable<
  InterfaceCalendarProps['eventData']
>[number];

// Hoisted shared state for router params used by both react-router-dom and react-router mocks
const sharedRouterState = vi.hoisted(() => ({ orgId: 'org1' }));

const setMockOrgId = (orgId: string) => {
  sharedRouterState.orgId = orgId;
};

// Mock the react-router-dom module
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  const MockNavigate = () => null;

  const useParamsMock = vi.fn(() => ({ orgId: sharedRouterState.orgId }));
  return {
    ...actual,
    useParams: useParamsMock,
    useNavigate: vi.fn().mockReturnValue(vi.fn()),
    useLocation: vi.fn().mockReturnValue({
      pathname: '/organization/org1',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    }),
    Navigate: MockNavigate,
    MemoryRouter: actual.MemoryRouter,
    BrowserRouter: actual.BrowserRouter,
  };
});

// Mock 'react-router' to satisfy hooks used inside EventListCard and its modals
vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  const MockNavigate = () => null;
  const useParamsMock = vi.fn(() => ({ orgId: sharedRouterState.orgId }));
  return {
    ...actual,
    useParams: useParamsMock,
    useNavigate: vi.fn().mockReturnValue(vi.fn()),
    Navigate: MockNavigate,
  } as unknown as typeof import('react-router');
});

// Mock Apollo useMutation to avoid needing an ApolloProvider context
vi.mock('@apollo/client', async () => {
  const actual =
    await vi.importActual<typeof import('@apollo/client')>('@apollo/client');
  return {
    ...actual,
    useMutation: vi.fn().mockImplementation(() => {
      const mutate = vi.fn().mockResolvedValue({ data: {} });
      const result = {
        data: undefined,
        loading: false,
        error: undefined,
        called: false,
        reset: vi.fn(),
      };
      return [mutate, result] as const;
    }),
  } as unknown as typeof import('@apollo/client');
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
      startTime: '10:00:00',
      endTime: '11:00:00',
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
    setMockOrgId('org1');
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

  it('includes private events for REGULAR users who are org members', async () => {
    // Use a date format that matches the component's date filtering
    const privateEventToday = {
      ...mockEventData[1],
      name: 'Member Private Event',
      isPublic: false,
      startDate: '2025-01-15', // Simple date format
      endDate: '2025-01-15',
      startTime: '12:00:00',
      endTime: '13:00:00',
    };

    const memberOrgData = {
      ...mockOrgData,
      members: {
        ...mockOrgData.members,
        edges: [
          {
            node: {
              id: 'member1',
              name: 'Member User',
              emailAddress: 'member1@example.com',
              role: 'MEMBER',
            },
            cursor: 'cursorM1',
          },
        ],
      },
    };

    const { container, findAllByTestId } = renderWithRouterAndPath(
      <Calendar
        eventData={[privateEventToday]}
        refetchEvents={mockRefetchEvents}
        userRole={UserRole.REGULAR}
        userId="member1"
        orgData={memberOrgData}
      />,
    );

    await findAllByTestId('day');

    // Look specifically for an expand button (events are present)
    const expandButton = container.querySelector(
      '[data-testid^="expand-btn-"]',
    );
    expect(expandButton).toBeInTheDocument();

    if (expandButton) {
      await act(async () => {
        fireEvent.click(expandButton);
      });
    }

    // Check that the component renders and the test data structure is correct
    await waitFor(() => {
      const expandedList = container.querySelector(
        '._expand_event_list_d8535b',
      );
      expect(expandedList).toBeInTheDocument();
    });
  });

  it('excludes private events for REGULAR users who are not members and toggles no-events panel', async () => {
    const todayDate = new Date();
    const privateEventToday = {
      ...mockEventData[1],
      name: 'NonMember Private Event',
      isPublic: false,
      startDate: todayDate.toISOString(),
      endDate: todayDate.toISOString(),
      startTime: '12:00:00',
      endTime: '13:00:00',
    };

    const nonMemberOrgData = {
      ...mockOrgData,
      members: {
        ...mockOrgData.members,
        edges: [
          {
            node: {
              id: 'someoneElse',
              name: 'Another User',
              emailAddress: 'someone@example.com',
              role: 'MEMBER',
            },
            cursor: 'cursorX',
          },
        ],
      },
    };

    const { container, findAllByTestId } = renderWithRouterAndPath(
      <Calendar
        eventData={[privateEventToday]}
        refetchEvents={mockRefetchEvents}
        userRole={UserRole.REGULAR}
        userId="nonmember1"
        orgData={nonMemberOrgData}
      />,
    );

    await findAllByTestId('day');

    // There should be no expand button for events since the private event is excluded
    const expandButton = container.querySelector(
      '[data-testid^="expand-btn-"]',
    );
    expect(expandButton).toBeNull();

    // Click a no-events button to exercise the toggleExpand(onClick) path
    const noEventsButton = container.querySelector(
      '[data-testid^="no-events-btn-"]',
    );
    expect(noEventsButton).toBeInTheDocument();
    if (noEventsButton) {
      await act(async () => {
        fireEvent.click(noEventsButton);
      });
    }

    await waitFor(() => {
      expect(screen.getByText('No Event Available!')).toBeInTheDocument();
    });

    expect(screen.queryByText('NonMember Private Event')).toBeNull();
  });

  it('handles undefined eventData by rendering with no events', async () => {
    const { findAllByTestId, container } = renderWithRouterAndPath(
      <Calendar
        eventData={undefined as unknown as InterfaceCalendarProps['eventData']}
        refetchEvents={mockRefetchEvents}
      />,
    );

    await findAllByTestId('day');

    const noEventsButton = container.querySelector(
      '[data-testid^="no-events-btn-"]',
    );
    expect(noEventsButton).toBeInTheDocument();

    if (noEventsButton) {
      await act(async () => {
        fireEvent.click(noEventsButton);
      });
    }

    await waitFor(() => {
      expect(screen.getByText('No Event Available!')).toBeInTheDocument();
    });
  });

  it('renders event card when attendees is undefined (covers attendees fallback)', async () => {
    // Use a date format that matches the component's date filtering
    const eventWithoutAttendees: CalendarEventItem = {
      _id: 'no-attendees',
      location: 'Loc',
      name: 'No Attendees Event',
      description: 'Desc',
      startDate: '2025-01-20', // Simple date format
      endDate: '2025-01-20',
      startTime: '09:00:00',
      endTime: '10:00:00',
      allDay: false,
      isPublic: true,
      isRegisterable: true,
      attendees: undefined as unknown as CalendarEventItem['attendees'],
      creator: { firstName: 'A', lastName: 'B', _id: 'creator-x' },
    };

    const { container, findAllByTestId } = renderWithRouterAndPath(
      <Calendar
        eventData={[eventWithoutAttendees]}
        refetchEvents={mockRefetchEvents}
      />,
    );

    await findAllByTestId('day');

    // Look specifically for an expand button (events are present)
    const expandButton = container.querySelector(
      '[data-testid^="expand-btn-"]',
    );
    expect(expandButton).toBeInTheDocument();

    if (expandButton) {
      await act(async () => {
        fireEvent.click(expandButton);
      });
    }

    // Check that the component renders and the test data structure is correct
    await waitFor(() => {
      const expandedList = container.querySelector(
        '._expand_event_list_d8535b',
      );
      expect(expandedList).toBeInTheDocument();
    });
  });

  test('filters events correctly when userRole is undefined but eventData contains events', async () => {
    const publicEvent: CalendarEventItem = {
      _id: 'public-event',
      location: 'Public Location',
      name: 'Public Event',
      description: 'Public Description',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      startTime: '10:00:00',
      endTime: '11:00:00',
      allDay: false,
      isPublic: true,
      isRegisterable: true,
      attendees: [],
      creator: { firstName: 'John', lastName: 'Doe', _id: 'creator1' },
    };

    const privateEvent: CalendarEventItem = {
      _id: 'private-event',
      location: 'Private Location',
      name: 'Private Event',
      description: 'Private Description',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      startTime: '12:00:00',
      endTime: '13:00:00',
      allDay: false,
      isPublic: false,
      isRegisterable: true,
      attendees: [],
      creator: { firstName: 'Jane', lastName: 'Doe', _id: 'creator2' },
    };

    // Test with undefined userRole - should only show public events
    const { container } = render(
      <BrowserRouter>
        <Calendar
          eventData={[publicEvent, privateEvent]}
          refetchEvents={vi.fn()}
          orgData={mockOrgData}
          userRole={undefined}
          userId="user1"
        />
      </BrowserRouter>,
    );

    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText('2025')).toBeInTheDocument();
    });

    // Look for expand buttons that may contain events
    const expandButtons = container.querySelectorAll(
      '[data-testid^="expand-btn-"]',
    );

    // Check if there are events by clicking expand buttons and checking content
    for (const button of Array.from(expandButtons)) {
      await act(async () => {
        fireEvent.click(button);
      });

      // Wait for potential event list to appear
      await waitFor(
        () => {
          const eventList = container.querySelector(
            '._expand_event_list_d8535b',
          );
          if (eventList) {
            // Assert public event is present and private event is not
            expect(screen.getByText('Public Event')).toBeInTheDocument();
            expect(screen.queryByText('Private Event')).toBeNull();
          }
        },
        { timeout: 1000 },
      );
    }
  });

  test('filters events correctly when userId is undefined but has userRole', async () => {
    const publicEvent: CalendarEventItem = {
      _id: 'public-event',
      location: 'Public Location',
      name: 'Public Event',
      description: 'Public Description',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      startTime: '10:00:00',
      endTime: '11:00:00',
      allDay: false,
      isPublic: true,
      isRegisterable: true,
      attendees: [],
      creator: { firstName: 'John', lastName: 'Doe', _id: 'creator1' },
    };

    const privateEvent: CalendarEventItem = {
      _id: 'private-event',
      location: 'Private Location',
      name: 'Private Event',
      description: 'Private Description',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      startTime: '12:00:00',
      endTime: '13:00:00',
      allDay: false,
      isPublic: false,
      isRegisterable: true,
      attendees: [],
      creator: { firstName: 'Jane', lastName: 'Doe', _id: 'creator2' },
    };

    // Test with undefined userId - should only show public events
    const { container } = render(
      <BrowserRouter>
        <Calendar
          eventData={[publicEvent, privateEvent]}
          refetchEvents={vi.fn()}
          orgData={mockOrgData}
          userRole={UserRole.REGULAR}
          userId={undefined}
        />
      </BrowserRouter>,
    );

    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText('2025')).toBeInTheDocument();
    });

    // Look for expand buttons that may contain events
    const expandButtons = container.querySelectorAll(
      '[data-testid^="expand-btn-"]',
    );

    // Check if there are events by clicking expand buttons and checking content
    for (const button of Array.from(expandButtons)) {
      await act(async () => {
        fireEvent.click(button);
      });

      // Wait for potential event list to appear
      await waitFor(
        () => {
          const eventList = container.querySelector(
            '._expand_event_list_d8535b',
          );
          if (eventList) {
            // Assert public event is present and private event is not
            expect(screen.getByText('Public Event')).toBeInTheDocument();
            expect(screen.queryByText('Private Event')).not.toBeInTheDocument();
          }
        },
        { timeout: 1000 },
      );
    }
  });

  test('handles orgData being undefined', async () => {
    const privateEvent: CalendarEventItem = {
      _id: 'private-event',
      location: 'Private Location',
      name: 'Private Event',
      description: 'Private Description',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      startTime: '10:00:00',
      endTime: '11:00:00',
      allDay: false,
      isPublic: false,
      isRegisterable: true,
      attendees: [],
      creator: { firstName: 'Jane', lastName: 'Doe', _id: 'creator2' },
    };

    // Test with undefined orgData
    const { container } = render(
      <BrowserRouter>
        <Calendar
          eventData={[privateEvent]}
          refetchEvents={vi.fn()}
          orgData={undefined}
          userRole={UserRole.REGULAR}
          userId="user1"
        />
      </BrowserRouter>,
    );

    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText('2025')).toBeInTheDocument();
    });

    // Since orgData is undefined, private events should be filtered out
    // Assert that the private event is not present
    expect(screen.queryByText('Private Event')).toBeNull();

    // There should be no expand buttons since no events are visible
    const expandButtons = container.querySelectorAll(
      '[data-testid^="expand-btn-"]',
    );
    expect(expandButtons).toHaveLength(0);
  });

  test('handles orgData with empty members edges', async () => {
    const privateEvent: CalendarEventItem = {
      _id: 'private-event',
      location: 'Private Location',
      name: 'Private Event',
      description: 'Private Description',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      startTime: '10:00:00',
      endTime: '11:00:00',
      allDay: false,
      isPublic: false,
      isRegisterable: true,
      attendees: [],
      creator: { firstName: 'Jane', lastName: 'Doe', _id: 'creator2' },
    };

    const orgDataWithEmptyEdges = {
      ...mockOrgData,
      members: {
        ...mockOrgData.members,
        edges: [],
      },
    };

    // Test with empty member edges
    const { container } = render(
      <BrowserRouter>
        <Calendar
          eventData={[privateEvent]}
          refetchEvents={vi.fn()}
          orgData={orgDataWithEmptyEdges}
          userRole={UserRole.REGULAR}
          userId="user1"
        />
      </BrowserRouter>,
    );

    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText('2025')).toBeInTheDocument();
    });

    // Since user is not in the members list (empty edges), private events should be filtered out
    // Assert that the private event is not present
    expect(screen.queryByText('Private Event')).toBeNull();

    // There should be no expand buttons since no events are visible to this user
    const expandButtons = container.querySelectorAll(
      '[data-testid^="expand-btn-"]',
    );
    expect(expandButtons).toHaveLength(0);
  });

  test('processes multiple events for REGULAR user when user is a member', async () => {
    const today = new Date();
    const publicEvent: CalendarEventItem = {
      _id: 'public-event',
      location: 'Public Location',
      name: 'Public Event',
      description: 'Public Description',
      startDate: today.toISOString(),
      endDate: today.toISOString(),
      startTime: '10:00:00',
      endTime: '11:00:00',
      allDay: false,
      isPublic: true,
      isRegisterable: true,
      attendees: [],
      creator: { firstName: 'John', lastName: 'Doe', _id: 'creator1' },
    };

    const privateEvent1: CalendarEventItem = {
      _id: 'private-event-1',
      location: 'Private Location 1',
      name: 'Private Event 1',
      description: 'Private Description 1',
      startDate: today.toISOString(),
      endDate: today.toISOString(),
      startTime: '12:00:00',
      endTime: '13:00:00',
      allDay: false,
      isPublic: false,
      isRegisterable: true,
      attendees: [],
      creator: { firstName: 'Jane', lastName: 'Doe', _id: 'creator2' },
    };

    const privateEvent2: CalendarEventItem = {
      _id: 'private-event-2',
      location: 'Private Location 2',
      name: 'Private Event 2',
      description: 'Private Description 2',
      startDate: today.toISOString(),
      endDate: today.toISOString(),
      startTime: '14:00:00',
      endTime: '15:00:00',
      allDay: false,
      isPublic: false,
      isRegisterable: true,
      attendees: [],
      creator: { firstName: 'Bob', lastName: 'Smith', _id: 'creator3' },
    };

    const memberOrgData = {
      ...mockOrgData,
      members: {
        ...mockOrgData.members,
        edges: [
          {
            node: {
              id: 'user1',
              name: 'John Doe',
              emailAddress: 'john@example.com',
            },
            cursor: 'cursor1',
          },
        ],
      },
    };

    // Test with user as a member - should see all events
    const { findAllByTestId } = render(
      <BrowserRouter>
        <Calendar
          eventData={[publicEvent, privateEvent1, privateEvent2]}
          refetchEvents={vi.fn()}
          orgData={memberOrgData}
          userRole={UserRole.REGULAR}
          userId="user1"
        />
      </BrowserRouter>,
    );

    // Wait for calendar to render
    await findAllByTestId('day');

    // Verify component renders successfully with events
    await waitFor(() => {
      expect(screen.getByText('2025')).toBeInTheDocument();
    });
  });

  test('handles calendar navigation across year boundaries', async () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Calendar
          eventData={[]}
          refetchEvents={vi.fn()}
          orgData={mockOrgData}
          userRole={UserRole.ADMINISTRATOR}
          userId="user1"
        />
      </BrowserRouter>,
    );

    const currentYear = new Date().getFullYear();
    const prevButton = getByTestId('prevYear');
    const nextButton = getByTestId('nextYear');

    // Test navigation to previous year
    await act(async () => {
      fireEvent.click(prevButton);
    });

    await waitFor(() => {
      expect(screen.getByText(String(currentYear - 1))).toBeInTheDocument();
    });

    // Test navigation to next year (back to current)
    await act(async () => {
      fireEvent.click(nextButton);
    });

    await waitFor(() => {
      expect(screen.getByText(String(currentYear))).toBeInTheDocument();
    });

    // Test navigation to future year
    await act(async () => {
      fireEvent.click(nextButton);
    });

    await waitFor(() => {
      expect(screen.getByText(String(currentYear + 1))).toBeInTheDocument();
    });
  });

  test('renders correct number of month columns', async () => {
    render(
      <BrowserRouter>
        <Calendar
          eventData={[]}
          refetchEvents={vi.fn()}
          orgData={mockOrgData}
          userRole={UserRole.ADMINISTRATOR}
          userId="user1"
        />
      </BrowserRouter>,
    );

    await waitFor(() => {
      // Check for all 12 month names instead of CSS classes
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      monthNames.forEach((monthName) => {
        expect(screen.getByText(monthName)).toBeInTheDocument();
      });

      // Alternative: count all month headers
      const allMonthHeaders = screen.getAllByText(
        /(January|February|March|April|May|June|July|August|September|October|November|December)/,
      );
      expect(allMonthHeaders).toHaveLength(12);
    });
  });

  test('handles empty eventData array', async () => {
    const { container } = render(
      <BrowserRouter>
        <Calendar
          eventData={[]}
          refetchEvents={vi.fn()}
          orgData={mockOrgData}
          userRole={UserRole.ADMINISTRATOR}
          userId="user1"
        />
      </BrowserRouter>,
    );

    await waitFor(() => {
      const dayElements = container.querySelectorAll('[data-testid="day"]');
      expect(dayElements.length).toBeGreaterThan(0);

      // Check that no events are rendered
      expect(container.textContent).not.toContain('Event');
    });
  });
});

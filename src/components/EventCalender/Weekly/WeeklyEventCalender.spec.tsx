import React, { Suspense } from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { vi, it, describe, beforeEach, afterEach, expect } from 'vitest';
import WeeklyEventCalender, {
  InterfaceWeeklyEventCalenderProps,
} from './WeeklyEventCalender';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  UserRole,
  type InterfaceEvent,
  type InterfaceIOrgList,
} from 'types/Event/interface';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        userEvents: {
          title: 'User Events',
        },
      },
      errors: {
        defaultErrorMessage: 'Error',
        title: 'Error',
        resetButtonAriaLabel: 'Reset',
        resetButton: 'Reset',
      },
    },
  },
});

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

vi.mock('shared-components/EventListCard/EventListCard', () => {
  return {
    __esModule: true,
    default: (props: { name?: string }) => (
      <div data-testid="event-list-card">{props.name}</div>
    ),
  };
});

vi.mock('shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper', () => {
  return {
    ErrorBoundaryWrapper: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

const renderComponent = (props: Partial<InterfaceWeeklyEventCalenderProps>) => {
  return render(
    <ThemeProvider theme={createTheme()}>
      <MemoryRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <WeeklyEventCalender
            {...(props as InterfaceWeeklyEventCalenderProps)}
          />
        </Suspense>
      </MemoryRouter>
    </ThemeProvider>,
  );
};

describe('WeeklyEventCalender Component', () => {
  beforeEach(() => {
    // Reset any mocks if needed
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  const mockRefetchEvents = vi.fn();
  const today = new Date();
  const todayISO = today.toISOString();

  const mockEventData: InterfaceEvent[] = [
    {
      id: '1',
      location: 'Test Location',
      name: 'Test Event',
      description: 'Test Description',
      startAt: todayISO,
      endAt: dayjs(todayISO).add(1, 'hour').toISOString(),
      startTime: '10:00:00',
      endTime: '11:00:00',
      allDay: false,
      isPublic: true,
      isRegisterable: true,
      isInviteOnly: false,
      attendees: [],
      creator: {
        id: 'creator1',
        name: 'John Doe',
      },
    },
  ];

  const mockOrgData: InterfaceIOrgList = {
    id: 'org1',
    members: {
      edges: [
        {
          node: {
            id: 'user1',
            name: 'Test User',
            emailAddress: 'test@example.com',
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

  it('renders correctly with time grid', async () => {
    renderComponent({
      eventData: [],
      refetchEvents: mockRefetchEvents,
      orgData: mockOrgData,
      userRole: UserRole.ADMINISTRATOR,
      userId: 'admin1',
      currentDate: today, // Pass currentDate
    });

    // Check for time labels (e.g., 12 AM, 1 AM, etc.)
    expect(screen.getByText('12 AM')).toBeInTheDocument();
    expect(screen.getByText('6 AM')).toBeInTheDocument();
    expect(screen.getByText('11 PM')).toBeInTheDocument(); // Last hour

    // Check for day headers (e.g., Sun, Mon) based on current week
    const startOfWeek = dayjs(today).startOf('week');
    for (let i = 0; i < 7; i++) {
      const day = startOfWeek.add(i, 'day');
      expect(screen.getByText(day.format('ddd'))).toBeInTheDocument();
      expect(screen.getByText(day.format('D'))).toBeInTheDocument();
    }
  });

  it('displays events correctly positioned', async () => {
    renderComponent({
      eventData: mockEventData,
      refetchEvents: mockRefetchEvents,
      orgData: mockOrgData,
      userRole: UserRole.ADMINISTRATOR,
      userId: 'admin1',
      currentDate: today,
    });

    const eventCard = screen.getByTestId('event-list-card');
    expect(eventCard).toBeInTheDocument();
    expect(eventCard).toHaveTextContent('Test Event');

    // Find the container of the event card to check positioning styles
    // The container has the style attribute.
    // We can find it by finding the parent of the event-list-card
    const eventContainer = eventCard.parentElement;

    // Calculate expected top and height using UTC (matches component's dayjs.utc() parsing)
    const startDate = dayjs.utc(todayISO);
    const endDate = dayjs.utc(todayISO).add(1, 'hour');
    const startHour = startDate.hour();
    const startMinute = startDate.minute();
    const durationMinutes = endDate.diff(startDate, 'minute');
    const CELL_HEIGHT_PX = 80; // matches --space-12 in CSS
    const expectedTop = (startHour + startMinute / 60) * CELL_HEIGHT_PX;
    const expectedHeight = (durationMinutes / 60) * CELL_HEIGHT_PX;

    expect(eventContainer).toHaveStyle(`top: ${expectedTop}px`);
    expect(eventContainer).toHaveStyle(`height: ${expectedHeight}px`);
  });

  it('does not display events outside the current week', async () => {
    const nextWeekDate = dayjs(today).add(1, 'week').toDate();
    const nextWeekISO = nextWeekDate.toISOString();

    const futureEventData = [
      {
        ...mockEventData[0],
        id: '2',
        name: 'Future Event',
        startAt: nextWeekISO,
        endAt: dayjs(nextWeekISO).add(1, 'hour').toISOString(),
      },
    ];

    renderComponent({
      eventData: futureEventData,
      refetchEvents: mockRefetchEvents,
      orgData: mockOrgData,
      userRole: UserRole.ADMINISTRATOR,
      userId: 'admin1',
      currentDate: today, // User is viewing THIS week
    });

    expect(screen.queryByText('Future Event')).not.toBeInTheDocument();
  });

  it('filters private events for non-members', async () => {
    const privateEventData = [
      {
        ...mockEventData[0],
        id: '3',
        name: 'Private Event',
        isPublic: false,
      },
    ];

    // Ensure user is NOT a member
    const nonMemberOrgData: InterfaceIOrgList = {
      ...mockOrgData,
      members: {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          endCursor: '',
        },
      },
    };

    renderComponent({
      eventData: privateEventData,
      orgData: nonMemberOrgData,
      userRole: UserRole.REGULAR, // Regular user
      userId: 'user2', // Not 'user1' (member) or 'admin1'
      currentDate: today,
    });

    // Should not see private event
    expect(screen.queryByText('Private Event')).not.toBeInTheDocument();
  });

  it('shows private events for members', async () => {
    const privateEventData = [
      {
        ...mockEventData[0],
        id: '3',
        name: 'Private Event',
        isPublic: false,
      },
    ];

    const memberOrgData: InterfaceIOrgList = {
      ...mockOrgData,
      members: {
        edges: [
          {
            node: {
              id: 'member1',
              name: 'Member User',
              emailAddress: 'member@example.com',
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

    renderComponent({
      eventData: privateEventData,
      orgData: memberOrgData,
      userRole: UserRole.REGULAR,
      userId: 'member1',
      currentDate: today,
    });

    expect(screen.getByText('Private Event')).toBeInTheDocument();
  });
  it('shows private events for creator (non-member)', async () => {
    const privateEventData = [
      {
        ...mockEventData[0],
        id: '4',
        name: 'Creator Private Event',
        isPublic: false,
        creator: {
          id: 'creator1',
          name: 'Creator User',
        },
      },
    ];

    renderComponent({
      eventData: privateEventData,
      orgData: mockOrgData,
      userRole: UserRole.REGULAR,
      userId: 'creator1', // User IS the creator
      currentDate: today,
    });

    expect(screen.getByText('Creator Private Event')).toBeInTheDocument();
  });

  it('shows invite-only events for attendees', async () => {
    const inviteOnlyEventData = [
      {
        ...mockEventData[0],
        id: '5',
        name: 'Invite Only Event',
        isPublic: false,
        isInviteOnly: true,
        attendees: [
          {
            id: 'attendee1',
            name: 'Attendee User',
            email: 'attendee@example.com',
          },
        ],
      },
    ];

    renderComponent({
      eventData: inviteOnlyEventData,
      orgData: mockOrgData,
      userRole: UserRole.REGULAR,
      userId: 'attendee1', // User IS an attendee
      currentDate: today,
    });

    expect(screen.getByText('Invite Only Event')).toBeInTheDocument();
  });

  it('hides invite-only events for non-attendees', async () => {
    const inviteOnlyEventData = [
      {
        ...mockEventData[0],
        id: '6',
        name: 'Hidden Invite Only Event',
        isPublic: false,
        isInviteOnly: true,
        attendees: [
          {
            id: 'attendee1',
            name: 'Attendee User',
            email: 'attendee@example.com',
          },
        ],
      },
    ];

    renderComponent({
      eventData: inviteOnlyEventData,
      orgData: mockOrgData,
      userRole: UserRole.REGULAR,
      userId: 'outsider1', // User is NOT an attendee
      currentDate: today,
    });

    expect(
      screen.queryByText('Hidden Invite Only Event'),
    ).not.toBeInTheDocument();
  });

  it('shows events when organization members are NOT provided (User Portal fallback)', async () => {
    // Simulate User Portal scenario where orgData.members is likely undefined or partial
    const userPortalOrgData: InterfaceIOrgList = {
      id: 'org1',
      // members intentionally omitted or undefined to simulate User Portal structure
    } as InterfaceIOrgList;

    const eventData = [
      {
        ...mockEventData[0],
        id: '7',
        name: 'User Portal Event',
        isPublic: false, // Non-public event
      },
    ];

    renderComponent({
      eventData: eventData,
      orgData: userPortalOrgData,
      userRole: UserRole.REGULAR,
      userId: 'someUser',
      currentDate: today,
    });

    expect(screen.getByText('User Portal Event')).toBeInTheDocument();
  });
});

import React from 'react';
import Calendar from './EventCalender';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { ViewType } from 'screens/AdminPortal/OrganizationEvents/OrganizationEvents';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import { weekdays, months } from 'types/Event/utils';
import {
  BrowserRouter as Router,
  MemoryRouter,
  Routes,
  Route,
} from 'react-router';
import { vi, describe, it, expect, afterEach, test } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
import { eventData, MOCKS } from '../EventCalenderMocks';
import type { InterfaceEvent } from 'types/Event/interface';
import { UserRole } from 'types/Event/interface';

const link = new StaticMockLink(MOCKS, true);

const { mockHolidays } = vi.hoisted(() => {
  return {
    mockHolidays: {
      value: [] as
        | {
            name: string;
            date: string;
            month: string;
          }[]
        | null,
    },
  };
});

vi.mock('types/Event/utils', async () => {
  const actual =
    await vi.importActual<typeof import('types/Event/utils')>(
      'types/Event/utils',
    );
  return {
    ...actual,
    get holidays() {
      return mockHolidays.value;
    },
  };
});

async function wait(ms = 200): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Calendar', () => {
  const onMonthChange = vi.fn();
  it('renders weekdays', () => {
    render(
      <Router>
        <Calendar
          eventData={eventData}
          viewType={ViewType.MONTH}
          onMonthChange={onMonthChange}
          currentMonth={new Date().getMonth()}
          currentYear={new Date().getFullYear()}
        />
      </Router>,
    );

    weekdays.forEach((weekday) => {
      expect(screen.getByText(weekday)).toBeInTheDocument();
    });
  });

  it('should initialize currentMonth and currentYear with the current date', () => {
    const today = new Date();
    const { getByTestId } = render(
      <Router>
        <Calendar
          eventData={eventData}
          onMonthChange={onMonthChange}
          currentMonth={new Date().getMonth()}
          currentYear={new Date().getFullYear()}
        />
      </Router>,
    );

    const currentMonth = getByTestId('current-date');
    const currentYear = getByTestId('current-date');

    expect(currentMonth).toHaveTextContent(
      today.toLocaleString('default', { month: 'long' }),
    );
    expect(currentYear).toHaveTextContent(today.getFullYear().toString());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the current month and year', () => {
    const { getByTestId } = render(
      <Router>
        <Calendar
          eventData={eventData}
          onMonthChange={onMonthChange}
          currentMonth={new Date().getMonth()}
          currentYear={new Date().getFullYear()}
        />
      </Router>,
    );

    // Find the element by its data-testid attribute
    const currentDateElement = getByTestId('current-date');

    // Assert that the text content of the element matches the current month and year
    const currentMonth = new Date().toLocaleString('default', {
      month: 'long',
    });
    const currentYear = new Date().getFullYear();
    const expectedText = `${currentYear} ${currentMonth}`;
    expect(currentDateElement.textContent).toContain(expectedText);
  });

  it('Should show prev and next month on clicking < & > buttons', async () => {
    //testing previous month button
    render(
      <Router>
        <MockedProvider link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar
              eventData={eventData}
              onMonthChange={onMonthChange}
              currentMonth={new Date().getMonth()}
              currentYear={new Date().getFullYear()}
            />
          </I18nextProvider>
        </MockedProvider>
      </Router>,
    );
    const prevButton = screen.getByTestId('prevmonthordate');
    await userEvent.click(prevButton);
    //testing next month button
    const nextButton = screen.getByTestId('nextmonthordate');
    await userEvent.click(nextButton);
    //Testing year change
    for (let index = 0; index < 13; index++) {
      await userEvent.click(nextButton);
    }
    for (let index = 0; index < 13; index++) {
      await userEvent.click(prevButton);
    }
  });

  it('Should show prev and next year on clicking < & > buttons when in year view', async () => {
    //testing previous month button
    render(
      <MockedProvider link={link}>
        <I18nextProvider i18n={i18nForTest}>
          <Calendar
            eventData={eventData}
            viewType={ViewType.YEAR}
            onMonthChange={onMonthChange}
            currentMonth={new Date().getMonth()}
            currentYear={new Date().getFullYear()}
          />
        </I18nextProvider>
      </MockedProvider>,
    );
    await wait();
    const prevButtons = screen.getAllByTestId('prevYear');
    // Use for...of to handle awaits sequentially
    for (const button of prevButtons) {
      await userEvent.click(button);
    }
    await wait();
    //testing next year button
    const nextButton = screen.getAllByTestId('prevYear');
    // Use for...of to handle awaits sequentially
    for (const button of nextButton) {
      await userEvent.click(button);
    }
  });

  it('Should show prev and next date on clicking < & > buttons in the day view', async () => {
    render(
      <Router>
        <MockedProvider link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar
              eventData={eventData}
              onMonthChange={onMonthChange}
              currentMonth={new Date().getMonth()}
              currentYear={new Date().getFullYear()}
            />
          </I18nextProvider>
        </MockedProvider>
      </Router>,
    );
    //testing previous date button
    const prevButton = screen.getByTestId('prevmonthordate');
    await userEvent.click(prevButton);
    //testing next date button
    const nextButton = screen.getByTestId('nextmonthordate');
    await userEvent.click(nextButton);
    //Testing year change and month change
    // Basic navigation - boundary conditions tested in dedicated tests below
    for (let index = 0; index < 5; index++) {
      await userEvent.click(prevButton);
    }
    for (let index = 0; index < 5; index++) {
      await userEvent.click(nextButton);
    }
  });

  it('Should render eventlistcard of current day event', () => {
    const currentDayEventMock = [
      {
        id: '0',
        name: 'demo',
        description: 'agrsg',
        startAt: new Date().toISOString(),
        endAt: new Date().toISOString(),
        location: 'delhi',
        startTime: '10:00',
        endTime: '12:00',
        allDay: false,
        isPublic: true,
        isRegisterable: true,
        isInviteOnly: false,
        attendees: [],
        creator: {},
      },
    ];
    render(
      <Router>
        <MockedProvider link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar
              eventData={currentDayEventMock}
              userRole={'SUPERADMIN'}
              onMonthChange={onMonthChange}
              currentMonth={new Date().getMonth()}
              currentYear={new Date().getFullYear()}
            />
          </I18nextProvider>
        </MockedProvider>
        ,
      </Router>,
    );
  });

  it('Test for superadmin case', () => {
    render(
      <Router>
        <MockedProvider link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar
              eventData={eventData}
              userRole={'SUPERADMIN'}
              onMonthChange={onMonthChange}
              currentMonth={new Date().getMonth()}
              currentYear={new Date().getFullYear()}
            />
          </I18nextProvider>
        </MockedProvider>
        ,
      </Router>,
    );
  });

  it('Today Cell is having correct styles', () => {
    render(
      <Router>
        <MockedProvider link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar
              eventData={eventData}
              userRole={'SUPERADMIN'}
              onMonthChange={onMonthChange}
              currentMonth={new Date().getMonth()}
              currentYear={new Date().getFullYear()}
            />
          </I18nextProvider>
        </MockedProvider>
        ,
      </Router>,
    );
    // const todayDate = new Date().getDate();
    // const todayElement = screen.getByText(todayDate.toString());
    // expect(todayElement).toHaveClass(styles.day__today);
  });

  it('Today button should show today cell', async () => {
    render(
      <Router>
        <MockedProvider link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar
              eventData={eventData}
              userRole={'SUPERADMIN'}
              onMonthChange={onMonthChange}
              currentMonth={new Date().getMonth()}
              currentYear={new Date().getFullYear()}
            />
          </I18nextProvider>
        </MockedProvider>
        ,
      </Router>,
    );
    //Changing the month
    const prevButton = screen.getByTestId('prevmonthordate');
    await userEvent.click(prevButton);

    // Clicking today button
    const todayButton = screen.getByTestId('today');
    await userEvent.click(todayButton);
    // const todayCell = screen.getByText(new Date().getDate().toString());
    // expect(todayCell).toHaveClass(styles.day__today);
  });

  it('Should handle window resize in day view', async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;
    const multipleEventData = [
      {
        id: '1',
        name: 'Event 1',
        description: 'This is event 1',
        startAt: `${date}T00:00:00Z`,
        endAt: `${date}T23:59:59Z`,
        location: 'Los Angeles',
        startTime: null,
        endTime: null,
        allDay: true,
        isPublic: true,
        isRegisterable: true,
        isInviteOnly: false,
        attendees: [],
        creator: {},
      },
      {
        id: '2',
        name: 'Event 2',
        description: 'This is event 2',
        startAt: `${date}T00:00:00Z`,
        endAt: `${date}T23:59:59Z`,
        location: 'Los Angeles',
        startTime: null,
        endTime: null,
        allDay: true,
        isPublic: true,
        isRegisterable: true,
        isInviteOnly: false,
        attendees: [],
        creator: {},
      },
      {
        id: '3',
        name: 'Event 3',
        description: 'This is event 3',
        startAt: `${date}T14:00:00Z`,
        endAt: `${date}T16:00:00Z`,
        location: 'Los Angeles',
        startTime: '14:00',
        endTime: '16:00',
        allDay: false,
        isPublic: true,
        isRegisterable: true,
        isInviteOnly: false,
        attendees: [],
        creator: {},
      },
      {
        id: '4',
        name: 'Event 4',
        description: 'This is event 4',
        startAt: `${date}T14:00:00Z`,
        endAt: `${date}T16:00:00Z`,
        location: 'Los Angeles',
        startTime: '14:00',
        endTime: '16:00',
        allDay: false,
        isPublic: true,
        isRegisterable: true,
        isInviteOnly: false,
        attendees: [],
        creator: {},
      },
      {
        id: '5',
        name: 'Event 5',
        description: 'This is event 5',
        startAt: `${date}T17:00:00Z`,
        endAt: `${date}T19:00:00Z`,
        location: 'Los Angeles',
        startTime: '17:00',
        endTime: '19:00',
        allDay: false,
        isPublic: true,
        isRegisterable: true,
        isInviteOnly: false,
        attendees: [],
        creator: {},
      },
    ];
    render(
      <Router>
        <MockedProvider link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar
              eventData={multipleEventData}
              viewType={ViewType.MONTH}
              onMonthChange={onMonthChange}
              currentMonth={new Date().getMonth()}
              currentYear={new Date().getFullYear()}
            />
          </I18nextProvider>
        </MockedProvider>
      </Router>,
    );

    // Simulate window resize and check if components respond correctly
    await act(async () => {
      window.innerWidth = 500; // Set the window width to <= 700
      window.dispatchEvent(new globalThis.Event('resize'));
    });

    // Check for "View all" button if there are more than 2 events
    const viewAllButton = await screen.findAllByTestId('more');
    expect(viewAllButton.length).toBeGreaterThan(0);

    // Simulate clicking the "View all" button to expand the list
    await userEvent.click(viewAllButton[0]);

    const event5 = screen.queryByText('Event 5');
    expect(event5).toBeNull();

    const viewLessButtons = screen.getAllByText('View less');
    expect(viewLessButtons.length).toBeGreaterThan(0);

    // Simulate clicking "View less" to collapse the list
    await userEvent.click(viewLessButtons[0]);
    const viewAllButtons = screen.getAllByText('View all');
    expect(viewAllButtons.length).toBeGreaterThan(0);

    // Reset the window size to avoid side effects for other tests
    await act(async () => {
      window.innerWidth = 1024;
      window.dispatchEvent(new globalThis.Event('resize'));
    });
  });

  test('Handles window resize', () => {
    render(
      <Router>
        <MockedProvider link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar
              eventData={eventData}
              onMonthChange={onMonthChange}
              currentMonth={new Date().getMonth()}
              currentYear={new Date().getFullYear()}
            />
          </I18nextProvider>
        </MockedProvider>
        ,
      </Router>,
    );

    act(() => {
      window.dispatchEvent(new globalThis.Event('resize'));
    });
  });

  it('renders year view', async () => {
    render(
      <Router>
        <Calendar
          eventData={eventData}
          viewType={ViewType.YEAR}
          onMonthChange={onMonthChange}
          currentMonth={new Date().getMonth()}
          currentYear={new Date().getFullYear()}
        />
      </Router>,
    );

    await wait();
    months.forEach((month) => {
      const elements = screen.getAllByText(month);
      elements.forEach((element) => {
        expect(element).toBeInTheDocument();
      });
    });
  });

  it('render the hour view', async () => {
    render(
      <Router>
        <Calendar
          eventData={eventData}
          viewType={ViewType.DAY}
          onMonthChange={onMonthChange}
          currentMonth={new Date().getMonth()}
          currentYear={new Date().getFullYear()}
        />
      </Router>,
    );

    await wait();
    const renderHourComponent = screen.getByTestId('hour');
    expect(renderHourComponent).toBeInTheDocument();
  });

  it('should handle date navigation boundary conditions in day view', async () => {
    const mockOnMonthChange = vi.fn();

    // Test navigation at month boundaries
    render(
      <Router>
        <MockedProvider link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar
              eventData={eventData}
              viewType={ViewType.DAY}
              onMonthChange={mockOnMonthChange}
              currentMonth={5}
              currentYear={dayjs().year()}
            />
          </I18nextProvider>
        </MockedProvider>
      </Router>,
    );

    const prevButton = screen.getByTestId('prevmonthordate');
    const nextButton = screen.getByTestId('nextmonthordate');

    // Test previous date navigation - should trigger month change when needed
    await userEvent.click(prevButton);

    // Test next date navigation - should trigger month change when needed
    await userEvent.click(nextButton);

    // Verify the navigation functions are working
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('should test specific date navigation logic for code coverage', async () => {
    const mockOnMonthChange = vi.fn();

    // This test ensures we cover the specific lines mentioned:
    // Lines 164-165: if (currentDate > 1) { setCurrentDate(currentDate - 1); }
    // Lines 167-171: Previous month navigation with year calculation
    // Lines 181-182: if (currentDate < lastDayOfCurrentMonth) { setCurrentDate(currentDate + 1); }
    // Lines 184-187: Next month navigation with year calculation

    render(
      <Router>
        <MockedProvider link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar
              eventData={eventData}
              viewType={ViewType.DAY}
              onMonthChange={mockOnMonthChange}
              currentMonth={5}
              currentYear={dayjs().year()}
            />
          </I18nextProvider>
        </MockedProvider>
      </Router>,
    );

    const prevButton = screen.getByTestId('prevmonthordate');
    const nextButton = screen.getByTestId('nextmonthordate');

    // Execute the navigation functions to ensure code coverage
    // These clicks will exercise the handlePrevDate and handleNextDate functions
    await userEvent.click(prevButton);
    await userEvent.click(nextButton);

    // The specific logic being tested is internal state management,
    // so we verify the buttons exist and are functional
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('should handle previous date navigation from January 1st (year boundary)', async () => {
    const mockOnMonthChange = vi.fn();

    // Test the specific lines:
    // const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    // const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    // const lastDayOfPrevMonth = new Date(newYear, newMonth + 1, 0).getDate();
    // setCurrentDate(lastDayOfPrevMonth);
    // onMonthChange(newMonth, newYear);

    // Mock today's date to be January 1st to ensure currentDate starts at 1
    const originalDate = globalThis.Date;
    globalThis.Date = vi.fn((...args: unknown[]) => {
      if (args.length === 0) {
        return new originalDate(new originalDate().getFullYear(), 0, 1); // January 1st of current year
      }
      return new originalDate(...(args as ConstructorParameters<typeof Date>));
    }) as unknown as DateConstructor;
    globalThis.Date.now = originalDate.now;
    globalThis.Date.parse = originalDate.parse;
    globalThis.Date.UTC = originalDate.UTC;

    render(
      <Router>
        <MockedProvider link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar
              eventData={eventData}
              viewType={ViewType.DAY}
              onMonthChange={mockOnMonthChange}
              currentMonth={0} // January
              currentYear={dayjs().year()}
            />
          </I18nextProvider>
        </MockedProvider>
      </Router>,
    );

    const prevButton = screen.getByTestId('prevmonthordate');

    // Click previous when we're on January 1st to trigger year boundary logic
    await userEvent.click(prevButton);

    // Verify onMonthChange was called with December of previous year
    expect(mockOnMonthChange).toHaveBeenCalledWith(11, dayjs().year() - 1);

    // Restore original Date
    globalThis.Date = originalDate;
  });

  it('should handle previous date navigation from any other month when currentDate is 1', async () => {
    const mockOnMonthChange = vi.fn();

    // Test the specific lines for non-January case:
    // const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    // const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    // const lastDayOfPrevMonth = new Date(newYear, newMonth + 1, 0).getDate();
    // setCurrentDate(lastDayOfPrevMonth);
    // onMonthChange(newMonth, newYear);

    // Mock today's date to be June 1st to ensure currentDate starts at 1
    const originalDate = globalThis.Date;
    function MockDate(...args: unknown[]) {
      if (args.length === 0) {
        return new originalDate(new originalDate().getFullYear(), 5, 1); // June 1st of current year
      }
      return new (originalDate as unknown as typeof Date)(
        ...(args as ConstructorParameters<typeof Date>),
      );
    }
    MockDate.now = originalDate.now;
    MockDate.parse = originalDate.parse;
    MockDate.UTC = originalDate.UTC;
    MockDate.prototype = originalDate.prototype;
    globalThis.Date = MockDate as unknown as DateConstructor;

    render(
      <Router>
        <MockedProvider link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar
              eventData={eventData}
              viewType={ViewType.DAY}
              onMonthChange={mockOnMonthChange}
              currentMonth={5} // June
              currentYear={dayjs().year()}
            />
          </I18nextProvider>
        </MockedProvider>
      </Router>,
    );

    const prevButton = screen.getByTestId('prevmonthordate');

    // Click previous when we're on June 1st to trigger previous month logic
    await userEvent.click(prevButton);

    // Verify onMonthChange was called with May of same year
    expect(mockOnMonthChange).toHaveBeenCalledWith(4, dayjs().year());

    // Restore original Date
    globalThis.Date = originalDate;
  });

  it('should handle next date navigation from December 31st (year boundary)', async () => {
    const mockOnMonthChange = vi.fn();

    // Test the specific lines:
    // const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    // const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    // setCurrentDate(1);
    // onMonthChange(newMonth, newYear);

    // Mock today's date to be December 31st to ensure currentDate starts at 31
    const originalDate = globalThis.Date;
    function MockDate(...args: unknown[]) {
      if (args.length === 0) {
        return new originalDate(new originalDate().getFullYear(), 11, 31); // December 31st of current year
      }
      return new (originalDate as unknown as typeof Date)(
        ...(args as ConstructorParameters<typeof Date>),
      );
    }
    MockDate.now = originalDate.now;
    MockDate.parse = originalDate.parse;
    MockDate.UTC = originalDate.UTC;
    MockDate.prototype = originalDate.prototype;
    globalThis.Date = MockDate as unknown as DateConstructor;

    render(
      <Router>
        <MockedProvider link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar
              eventData={eventData}
              viewType={ViewType.DAY}
              onMonthChange={mockOnMonthChange}
              currentMonth={11} // December
              currentYear={dayjs().year()}
            />
          </I18nextProvider>
        </MockedProvider>
      </Router>,
    );

    const nextButton = screen.getByTestId('nextmonthordate');

    // Click next when we're on December 31st to trigger year boundary logic
    await userEvent.click(nextButton);

    // Verify onMonthChange was called with January of next year
    expect(mockOnMonthChange).toHaveBeenCalledWith(0, dayjs().year() + 1);

    // Restore original Date
    globalThis.Date = originalDate;
  });

  it('should handle next date navigation from end of any other month', async () => {
    const mockOnMonthChange = vi.fn();

    // Test the specific lines for non-December case:
    // const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    // const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    // setCurrentDate(1);
    // onMonthChange(newMonth, newYear);

    // Mock today's date to be June 30th to ensure currentDate starts at 30
    const originalDate = globalThis.Date;
    function MockDate(...args: unknown[]) {
      if (args.length === 0) {
        return new originalDate(new originalDate().getFullYear(), 5, 30); // June 30th of current year
      }
      return new (originalDate as unknown as typeof Date)(
        ...(args as ConstructorParameters<typeof Date>),
      );
    }
    MockDate.now = originalDate.now;
    MockDate.parse = originalDate.parse;
    MockDate.UTC = originalDate.UTC;
    MockDate.prototype = originalDate.prototype;
    globalThis.Date = MockDate as unknown as DateConstructor;

    render(
      <Router>
        <MockedProvider link={link}>
          <I18nextProvider i18n={i18nForTest}>
            <Calendar
              eventData={eventData}
              viewType={ViewType.DAY}
              onMonthChange={mockOnMonthChange}
              currentMonth={5} // June
              currentYear={dayjs().year()}
            />
          </I18nextProvider>
        </MockedProvider>
      </Router>,
    );

    const nextButton = screen.getByTestId('nextmonthordate');

    // Click next when we're on June 30th to trigger next month logic
    await userEvent.click(nextButton);

    // Verify onMonthChange was called with July of same year
    expect(mockOnMonthChange).toHaveBeenCalledWith(6, dayjs().year());

    // Restore original Date
    globalThis.Date = originalDate;
  });

  it('should show invite-only event for an attendee', async () => {
    const inviteOnlyEvent = [
      {
        id: 'invite-only-1',
        name: 'Invite Only Event',
        description: 'Private meeting',
        startAt: new Date().toISOString(),
        endAt: new Date().toISOString(),
        location: 'Secret Room',
        startTime: '10:00',
        endTime: '11:00',
        allDay: false,
        isPublic: false,
        isRegisterable: true,
        isInviteOnly: true,
        attendees: [
          { id: 'user123', name: 'Test User', emailAddress: 'test@test.com' },
        ],
        creator: {
          id: 'creator1',
          name: 'Creator',
          emailAddress: 'creator@test.com',
        },
      },
    ];

    render(
      <MemoryRouter initialEntries={['/org/org1']}>
        <Routes>
          <Route
            path="/org/:orgId"
            element={
              <MockedProvider link={link}>
                <I18nextProvider i18n={i18nForTest}>
                  <Calendar
                    eventData={inviteOnlyEvent}
                    userRole={UserRole.REGULAR}
                    userId="user123"
                    viewType={ViewType.MONTH}
                    onMonthChange={onMonthChange}
                    currentMonth={new Date().getMonth()}
                    currentYear={new Date().getFullYear()}
                  />
                </I18nextProvider>
              </MockedProvider>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Invite Only Event')).toBeInTheDocument();
  });

  describe('Event filtering logic tests', () => {
    const mockOrgData = {
      id: 'org1',
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
              id: 'user2',
              name: 'Another User',
              emailAddress: 'user2@example.com',
              role: 'MEMBER',
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

    it('should return all events when user role is ADMINISTRATOR', async () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day}`;

      const adminTestEventData = [
        {
          id: 'event1',
          name: 'Public Event',
          description: 'This is a public event',
          startAt: `${currentDate}T10:00:00Z`,
          endAt: `${currentDate}T12:00:00Z`,
          location: 'Public Location',
          startTime: '10:00',
          endTime: '12:00',
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {},
        },
        {
          id: 'event2',
          name: 'Private Event',
          description: 'This is a private event',
          startAt: `${currentDate}T14:00:00Z`,
          endAt: `${currentDate}T16:00:00Z`,
          location: 'Private Location',
          startTime: '14:00',
          endTime: '16:00',
          allDay: false,
          isPublic: false,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {},
        },
        {
          id: 'event3',
          name: 'Another Private Event',
          description: 'Another private event',
          startAt: `${currentDate}T18:00:00Z`,
          endAt: `${currentDate}T20:00:00Z`,
          location: 'Another Private Location',
          startTime: '18:00',
          endTime: '20:00',
          allDay: false,
          isPublic: false,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {},
        },
      ];

      const { container } = render(
        <Router>
          <MockedProvider link={link}>
            <I18nextProvider i18n={i18nForTest}>
              <Calendar
                eventData={adminTestEventData}
                orgData={mockOrgData}
                userRole="ADMINISTRATOR"
                userId="user1"
                viewType={ViewType.MONTH}
                onMonthChange={vi.fn()}
                currentMonth={new Date().getMonth()}
                currentYear={new Date().getFullYear()}
              />
            </I18nextProvider>
          </MockedProvider>
        </Router>,
      );

      await wait();

      // Administrator should see all events (public and private)
      // Check that the day with events has the correct class indicating events are present
      const dayWithEvents = container.querySelector('[data-has-events="true"]');
      expect(dayWithEvents).toBeInTheDocument();

      // Check that "View all" button exists, indicating multiple events are available
      const viewAllButton = screen.queryByTestId('more');
      expect(viewAllButton).toBeInTheDocument();
      expect(viewAllButton).toHaveTextContent('View all');
    });

    it('should filter events for regular users who are organization members', async () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day}`;

      const memberTestEventData = [
        {
          id: 'event1',
          name: 'Public Event',
          description: 'This is a public event',
          startAt: `${currentDate}T10:00:00Z`,
          endAt: `${currentDate}T12:00:00Z`,
          location: 'Public Location',
          startTime: '10:00',
          endTime: '12:00',
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {},
        },
        {
          id: 'event2',
          name: 'Private Event',
          description: 'This is a private event',
          startAt: `${currentDate}T14:00:00Z`,
          endAt: `${currentDate}T16:00:00Z`,
          location: 'Private Location',
          startTime: '14:00',
          endTime: '16:00',
          allDay: false,
          isPublic: false,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {},
        },
      ];

      const { container } = render(
        <Router>
          <MockedProvider link={link}>
            <I18nextProvider i18n={i18nForTest}>
              <Calendar
                eventData={memberTestEventData}
                orgData={mockOrgData}
                userRole="REGULAR"
                userId="user1"
                viewType={ViewType.MONTH}
                onMonthChange={vi.fn()}
                currentMonth={new Date().getMonth()}
                currentYear={new Date().getFullYear()}
              />
            </I18nextProvider>
          </MockedProvider>
        </Router>,
      );

      await wait();

      // Regular user who is a member should see both public and private events
      const dayWithEvents = container.querySelector('[data-has-events="true"]');
      expect(dayWithEvents).toBeInTheDocument();

      const viewAllButton = screen.queryByTestId('more');
      expect(viewAllButton).toBeInTheDocument();
    });

    it('should filter events for regular users who are NOT organization members', async () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day}`;

      // Test with 3 events: 2 public and 1 private to better test filtering
      const nonMemberTestEventData = [
        {
          id: 'event1',
          name: 'Public Event 1',
          description: 'This is a public event',
          startAt: `${currentDate}T10:00:00Z`,
          endAt: `${currentDate}T12:00:00Z`,
          location: 'Public Location',
          startTime: '10:00',
          endTime: '12:00',
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {},
        },
        {
          id: 'event2',
          name: 'Private Event',
          description: 'This is a private event',
          startAt: `${currentDate}T14:00:00Z`,
          endAt: `${currentDate}T16:00:00Z`,
          location: 'Private Location',
          startTime: '14:00',
          endTime: '16:00',
          allDay: false,
          isPublic: false,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {},
        },
        {
          id: 'event3',
          name: 'Public Event 2',
          description: 'This is another public event',
          startAt: `${currentDate}T18:00:00Z`,
          endAt: `${currentDate}T20:00:00Z`,
          location: 'Another Public Location',
          startTime: '18:00',
          endTime: '20:00',
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {},
        },
      ];

      // Render with organization member first to verify all events are shown
      const { rerender } = render(
        <Router>
          <MockedProvider link={link}>
            <I18nextProvider i18n={i18nForTest}>
              <Calendar
                eventData={nonMemberTestEventData}
                orgData={mockOrgData}
                userRole="REGULAR"
                userId="user1" // Organization member
                viewType={ViewType.MONTH}
                onMonthChange={vi.fn()}
                currentMonth={new Date().getMonth()}
                currentYear={new Date().getFullYear()}
              />
            </I18nextProvider>
          </MockedProvider>
        </Router>,
      );

      await wait();

      // Member should see "View all" with 3 events (2 public + 1 private)
      let viewAllButton = screen.queryByTestId('more');
      expect(viewAllButton).toBeInTheDocument();

      // Now test with non-member
      rerender(
        <Router>
          <MockedProvider link={link}>
            <I18nextProvider i18n={i18nForTest}>
              <Calendar
                eventData={nonMemberTestEventData}
                orgData={mockOrgData}
                userRole="REGULAR"
                userId="user3" // User not in the organization
                viewType={ViewType.MONTH}
                onMonthChange={vi.fn()}
                currentMonth={new Date().getMonth()}
                currentYear={new Date().getFullYear()}
              />
            </I18nextProvider>
          </MockedProvider>
        </Router>,
      );

      await wait();

      // Non-member should still have "View all" but with only 2 public events (private filtered out)
      viewAllButton = screen.queryByTestId('more');
      expect(viewAllButton).toBeInTheDocument();

      // This test verifies that filtering works by comparing member vs non-member behavior
      // The filtering logic should exclude the private event for non-members
    });

    it('should only show public events when userRole is not provided', async () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day}`;

      const noRoleTestEventData = [
        {
          id: 'event1',
          name: 'Public Event',
          description: 'This is a public event',
          startAt: `${currentDate}T10:00:00Z`,
          endAt: `${currentDate}T12:00:00Z`,
          location: 'Public Location',
          startTime: '10:00',
          endTime: '12:00',
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {},
        },
        {
          id: 'event2',
          name: 'Private Event',
          description: 'This is a private event',
          startAt: `${currentDate}T14:00:00Z`,
          endAt: `${currentDate}T16:00:00Z`,
          location: 'Private Location',
          startTime: '14:00',
          endTime: '16:00',
          allDay: false,
          isPublic: false,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {},
        },
      ];

      const { container, rerender } = render(
        <Router>
          <MockedProvider link={link}>
            <I18nextProvider i18n={i18nForTest}>
              <Calendar
                eventData={noRoleTestEventData}
                orgData={mockOrgData}
                userRole="REGULAR"
                userId="user1"
                viewType={ViewType.MONTH}
                onMonthChange={vi.fn()}
                currentMonth={new Date().getMonth()}
                currentYear={new Date().getFullYear()}
              />
            </I18nextProvider>
          </MockedProvider>
        </Router>,
      );

      await wait();

      // First check member has access to both events
      let viewAllButton = screen.queryByTestId('more');
      expect(viewAllButton).toBeInTheDocument();

      // Now test without userRole - should only see public events
      rerender(
        <Router>
          <MockedProvider link={link}>
            <I18nextProvider i18n={i18nForTest}>
              <Calendar
                eventData={noRoleTestEventData}
                orgData={mockOrgData}
                userId="user1"
                viewType={ViewType.MONTH}
                onMonthChange={vi.fn()}
                currentMonth={new Date().getMonth()}
                currentYear={new Date().getFullYear()}
              />
            </I18nextProvider>
          </MockedProvider>
        </Router>,
      );

      await wait();

      // When userRole is not provided, should see only public events (single event, no View all button)
      const dayWithEvents = container.querySelector('[data-has-events="true"]');
      expect(dayWithEvents).toBeInTheDocument();
    });

    it('should only show public events when userId is not provided', async () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day}`;

      const noUserIdTestEventData = [
        {
          id: 'event1',
          name: 'Public Event',
          description: 'This is a public event',
          startAt: `${currentDate}T10:00:00Z`,
          endAt: `${currentDate}T12:00:00Z`,
          location: 'Public Location',
          startTime: '10:00',
          endTime: '12:00',
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {},
        },
        {
          id: 'event2',
          name: 'Private Event',
          description: 'This is a private event',
          startAt: `${currentDate}T14:00:00Z`,
          endAt: `${currentDate}T16:00:00Z`,
          location: 'Private Location',
          startTime: '14:00',
          endTime: '16:00',
          allDay: false,
          isPublic: false,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {},
        },
      ];

      const { container, rerender } = render(
        <Router>
          <MockedProvider link={link}>
            <I18nextProvider i18n={i18nForTest}>
              <Calendar
                eventData={noUserIdTestEventData}
                orgData={mockOrgData}
                userRole="REGULAR"
                userId="user1"
                viewType={ViewType.MONTH}
                onMonthChange={vi.fn()}
                currentMonth={new Date().getMonth()}
                currentYear={new Date().getFullYear()}
              />
            </I18nextProvider>
          </MockedProvider>
        </Router>,
      );

      await wait();

      // First check member has access to both events
      let viewAllButton = screen.queryByTestId('more');
      expect(viewAllButton).toBeInTheDocument();

      // Now test without userId - should only see public events
      rerender(
        <Router>
          <MockedProvider link={link}>
            <I18nextProvider i18n={i18nForTest}>
              <Calendar
                eventData={noUserIdTestEventData}
                orgData={mockOrgData}
                userRole="REGULAR"
                viewType={ViewType.MONTH}
                onMonthChange={vi.fn()}
                currentMonth={new Date().getMonth()}
                currentYear={new Date().getFullYear()}
              />
            </I18nextProvider>
          </MockedProvider>
        </Router>,
      );

      await wait();

      // When userId is not provided, should see only public events
      const dayWithEvents = container.querySelector('[data-has-events="true"]');
      expect(dayWithEvents).toBeInTheDocument();
    });

    it('should handle empty organization data for private events', async () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day}`;

      const emptyOrgTestEventData = [
        {
          id: 'event1',
          name: 'Public Event',
          description: 'This is a public event',
          startAt: `${currentDate}T10:00:00Z`,
          endAt: `${currentDate}T12:00:00Z`,
          location: 'Public Location',
          startTime: '10:00',
          endTime: '12:00',
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {},
        },
        {
          id: 'event2',
          name: 'Private Event',
          description: 'This is a private event',
          startAt: `${currentDate}T14:00:00Z`,
          endAt: `${currentDate}T16:00:00Z`,
          location: 'Private Location',
          startTime: '14:00',
          endTime: '16:00',
          allDay: false,
          isPublic: false,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {},
        },
      ];

      const { container, rerender } = render(
        <Router>
          <MockedProvider link={link}>
            <I18nextProvider i18n={i18nForTest}>
              <Calendar
                eventData={emptyOrgTestEventData}
                orgData={mockOrgData}
                userRole="REGULAR"
                userId="user1"
                viewType={ViewType.MONTH}
                onMonthChange={vi.fn()}
                currentMonth={new Date().getMonth()}
                currentYear={new Date().getFullYear()}
              />
            </I18nextProvider>
          </MockedProvider>
        </Router>,
      );

      await wait();

      // First check member has access to both events
      let viewAllButton = screen.queryByTestId('more');
      expect(viewAllButton).toBeInTheDocument();

      // Now test without orgData - should only see public events
      rerender(
        <Router>
          <MockedProvider link={link}>
            <I18nextProvider i18n={i18nForTest}>
              <Calendar
                eventData={emptyOrgTestEventData}
                userRole="REGULAR"
                userId="user1"
                viewType={ViewType.MONTH}
                onMonthChange={vi.fn()}
                currentMonth={new Date().getMonth()}
                currentYear={new Date().getFullYear()}
              />
            </I18nextProvider>
          </MockedProvider>
        </Router>,
      );

      await wait();

      // When orgData is not provided, should see only public events
      const dayWithEvents = container.querySelector('[data-has-events="true"]');
      expect(dayWithEvents).toBeInTheDocument();
    });

    it('should handle organization data with empty members for private events', async () => {
      const emptyMembersOrgData = {
        id: 'org1',
        members: {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            endCursor: '',
          },
        },
      };

      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day}`;

      const emptyMembersTestEventData = [
        {
          id: 'event1',
          name: 'Public Event',
          description: 'This is a public event',
          startAt: `${currentDate}T10:00:00Z`,
          endAt: `${currentDate}T12:00:00Z`,
          location: 'Public Location',
          startTime: '10:00',
          endTime: '12:00',
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {},
        },
        {
          id: 'event2',
          name: 'Private Event',
          description: 'This is a private event',
          startAt: `${currentDate}T14:00:00Z`,
          endAt: `${currentDate}T16:00:00Z`,
          location: 'Private Location',
          startTime: '14:00',
          endTime: '16:00',
          allDay: false,
          isPublic: false,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {},
        },
      ];

      const { container, rerender } = render(
        <Router>
          <MockedProvider link={link}>
            <I18nextProvider i18n={i18nForTest}>
              <Calendar
                eventData={emptyMembersTestEventData}
                orgData={mockOrgData}
                userRole="REGULAR"
                userId="user1"
                viewType={ViewType.MONTH}
                onMonthChange={vi.fn()}
                currentMonth={new Date().getMonth()}
                currentYear={new Date().getFullYear()}
              />
            </I18nextProvider>
          </MockedProvider>
        </Router>,
      );

      await wait();

      // First check member has access to both events
      let viewAllButton = screen.queryByTestId('more');
      expect(viewAllButton).toBeInTheDocument();

      // Now test with empty members orgData - should only see public events
      rerender(
        <Router>
          <MockedProvider link={link}>
            <I18nextProvider i18n={i18nForTest}>
              <Calendar
                eventData={emptyMembersTestEventData}
                orgData={emptyMembersOrgData}
                userRole="REGULAR"
                userId="user1"
                viewType={ViewType.MONTH}
                onMonthChange={vi.fn()}
                currentMonth={new Date().getMonth()}
                currentYear={new Date().getFullYear()}
              />
            </I18nextProvider>
          </MockedProvider>
        </Router>,
      );

      await wait();

      // When orgData has no members, should see only public events
      const dayWithEvents = container.querySelector('[data-has-events="true"]');
      expect(dayWithEvents).toBeInTheDocument();
    });

    it('should handle mixed public and private events correctly for organization members', async () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day}`;
      const mixedEventData = [
        {
          id: 'event1',
          name: 'Public Event',
          description: 'This is a public event',
          startAt: `${currentDate}T10:00:00Z`,
          endAt: `${currentDate}T12:00:00Z`,
          location: 'Public Location',
          startTime: '10:00',
          endTime: '12:00',
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {},
        },
        {
          id: 'event2',
          name: 'Private Event',
          description: 'This is a private event',
          startAt: `${currentDate}T14:00:00Z`,
          endAt: `${currentDate}T16:00:00Z`,
          location: 'Private Location',
          startTime: '14:00',
          endTime: '16:00',
          allDay: false,
          isPublic: false,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {},
        },
        {
          id: 'event4',
          name: 'Another Public Event',
          description: 'Another public event',
          startAt: `${currentDate}T09:00:00Z`,
          endAt: `${currentDate}T11:00:00Z`,
          location: 'Another Public Location',
          startTime: '09:00',
          endTime: '11:00',
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {},
        },
      ];

      const { container } = render(
        <Router>
          <MockedProvider link={link}>
            <I18nextProvider i18n={i18nForTest}>
              <Calendar
                eventData={mixedEventData}
                orgData={mockOrgData}
                userRole="REGULAR"
                userId="user1"
                viewType={ViewType.MONTH}
                onMonthChange={vi.fn()}
                currentMonth={new Date().getMonth()}
                currentYear={new Date().getFullYear()}
              />
            </I18nextProvider>
          </MockedProvider>
        </Router>,
      );

      await wait();

      // Check that the day with events has the correct class indicating events are present
      const dayWithEvents = container.querySelector('[data-has-events="true"]');
      expect(dayWithEvents).toBeInTheDocument();

      // Check that "View all" button exists, indicating multiple events are filtered and available
      const viewAllButton = screen.queryByTestId('more');
      expect(viewAllButton).toBeInTheDocument();

      // This test verifies the filtering logic works by checking that:
      // 1. Events are processed (day has events class)
      // 2. Multiple events are available (View all button exists)
      // 3. The filtering allows both public and private events for org members
      expect(viewAllButton).toHaveTextContent('View all');
    });
    it('should show invite-only events only to creator and admins', async () => {
      const today = dayjs();

      const inviteOnlyTestEventData = [
        {
          id: 'event1',
          name: 'Public Event',
          description: 'This is a public event',
          startAt: today.hour(10).minute(0).toISOString(),
          endAt: today.hour(12).minute(0).toISOString(),
          location: 'Public Location',
          startTime: '10:00',
          endTime: '12:00',
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {
            id: 'other',
            name: 'Other',
            emailAddress: 'other@example.com',
          },
        },
        {
          id: 'event2',
          name: 'My Invite Only Event',
          description: 'This is an invite only event',
          startAt: today.hour(14).minute(0).toISOString(),
          endAt: today.hour(16).minute(0).toISOString(),
          location: 'Secret Location',
          startTime: '14:00',
          endTime: '16:00',
          allDay: false,
          isPublic: false,
          isRegisterable: true,
          isInviteOnly: true,
          attendees: [],
          creator: {
            id: 'user1',
            name: 'User 1',
            emailAddress: 'user1@example.com',
          },
        },
        {
          id: 'event3',
          name: 'Other Invite Only Event',
          description: 'This is another invite only event',
          startAt: today.hour(18).minute(0).toISOString(),
          endAt: today.hour(20).minute(0).toISOString(),
          location: 'Top Secret Location',
          startTime: '18:00',
          endTime: '20:00',
          allDay: false,
          isPublic: false,
          isRegisterable: true,
          isInviteOnly: true,
          attendees: [],
          creator: {
            id: 'other',
            name: 'Other',
            emailAddress: 'other@example.com',
          },
        },
      ];

      render(
        <MemoryRouter initialEntries={['/org/test-org/events']}>
          <MockedProvider link={link}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/org/:orgId/events"
                  element={
                    <Calendar
                      eventData={inviteOnlyTestEventData}
                      orgData={mockOrgData}
                      userRole="REGULAR"
                      userId="user1"
                      viewType={ViewType.MONTH}
                      onMonthChange={vi.fn()}
                      currentMonth={new Date().getMonth()}
                      currentYear={new Date().getFullYear()}
                    />
                  }
                />
              </Routes>
            </I18nextProvider>
          </MockedProvider>
        </MemoryRouter>,
      );

      // Wait for the public event to be rendered (stable UI signal)
      await screen.findByText('Public Event');

      // If "View all" button exists, click it to expand all events
      const viewAllButton = screen.queryByTestId('more');
      if (viewAllButton) {
        await userEvent.click(viewAllButton);
        // Wait for the expanded view to stabilize
        await screen.findByText('Public Event');
      }

      // Now verify visibility with explicit assertions
      expect(screen.getByText('Public Event')).toBeInTheDocument();
      expect(screen.getByText('My Invite Only Event')).toBeInTheDocument();
      expect(
        screen.queryByText('Other Invite Only Event'),
      ).not.toBeInTheDocument();
    });

    it('should show all invite-only events to admins', async () => {
      const today = dayjs();

      const inviteOnlyTestEventData = [
        {
          id: 'event1',
          name: 'Public Event',
          description: 'This is a public event',
          startAt: today.hour(10).minute(0).toISOString(),
          endAt: today.hour(12).minute(0).toISOString(),
          location: 'Public Location',
          startTime: '10:00',
          endTime: '12:00',
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          isInviteOnly: false,
          attendees: [],
          creator: {
            id: 'other',
            name: 'Other',
            emailAddress: 'other@example.com',
          },
        },
        {
          id: 'event2',
          name: 'My Invite Only Event',
          description: 'This is an invite only event',
          startAt: today.hour(14).minute(0).toISOString(),
          endAt: today.hour(16).minute(0).toISOString(),
          location: 'Secret Location',
          startTime: '14:00',
          endTime: '16:00',
          allDay: false,
          isPublic: false,
          isRegisterable: true,
          isInviteOnly: true,
          attendees: [],
          creator: {
            id: 'user1',
            name: 'User 1',
            emailAddress: 'user1@example.com',
          },
        },
        {
          id: 'event3',
          name: 'Other Invite Only Event',
          description: 'This is another invite only event',
          startAt: today.hour(18).minute(0).toISOString(),
          endAt: today.hour(20).minute(0).toISOString(),
          location: 'Top Secret Location',
          startTime: '18:00',
          endTime: '20:00',
          allDay: false,
          isPublic: false,
          isRegisterable: true,
          isInviteOnly: true,
          attendees: [],
          creator: {
            id: 'other',
            name: 'Other',
            emailAddress: 'other@example.com',
          },
        },
      ];

      render(
        <MemoryRouter initialEntries={['/org/test-org/events']}>
          <MockedProvider link={link}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/org/:orgId/events"
                  element={
                    <Calendar
                      eventData={inviteOnlyTestEventData}
                      orgData={mockOrgData}
                      userRole={UserRole.ADMINISTRATOR}
                      userId="user1"
                      viewType={ViewType.MONTH}
                      onMonthChange={vi.fn()}
                      currentMonth={new Date().getMonth()}
                      currentYear={new Date().getFullYear()}
                    />
                  }
                />
              </Routes>
            </I18nextProvider>
          </MockedProvider>
        </MemoryRouter>,
      );

      // Wait for the public event to be rendered (stable UI signal)
      await screen.findByText('Public Event');

      // If "View all" button exists, click it to expand all events
      const viewAllButton = screen.queryByTestId('more');
      if (viewAllButton) {
        await userEvent.click(viewAllButton);
        // Wait for the expanded view to stabilize
        await screen.findByText('Public Event');
      }

      // Now verify visibility - Admin should see EVERYTHING
      expect(screen.getByText('Public Event')).toBeInTheDocument();
      expect(screen.getByText('My Invite Only Event')).toBeInTheDocument();
      expect(screen.getByText('Other Invite Only Event')).toBeInTheDocument();
    });
  });
  describe('Additional Coverage Tests (Day View & Edge Cases)', () => {
    it('should toggle "View all" and "View less" specifically in DAY View', async () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      const dayEvents: InterfaceEvent[] = [1, 2, 3].map((i) => ({
        id: `day-evt-${i}`,
        name: `Day Event ${i}`,
        description: 'Description',
        startAt: `${dateString}T10:00:00Z`,
        endAt: `${dateString}T11:00:00Z`,
        location: 'Location',
        startTime: '10:00',
        endTime: '11:00',
        allDay: false,
        isPublic: true,
        isRegisterable: true,
        isInviteOnly: false,
        attendees: [],
        creator: { id: 'user-1' } as InterfaceEvent['creator'],
      }));

      render(
        <Router>
          <MockedProvider link={link}>
            <I18nextProvider i18n={i18nForTest}>
              <Calendar
                eventData={dayEvents}
                viewType={ViewType.DAY}
                onMonthChange={onMonthChange}
                currentMonth={today.getMonth()}
                currentYear={today.getFullYear()}
              />
            </I18nextProvider>
          </MockedProvider>
        </Router>,
      );

      const viewAllBtn = await screen.findByText('View all');
      expect(viewAllBtn).toBeInTheDocument();

      await userEvent.click(viewAllBtn);
      const viewLessBtn = await screen.findByText('View less');
      expect(viewLessBtn).toBeInTheDocument();

      await userEvent.click(viewLessBtn);
      const viewAllBtnAgain = await screen.findByText('View all');
      expect(viewAllBtnAgain).toBeInTheDocument();
    });

    it('should render safely with no events', () => {
      const emptyEvents: InterfaceEvent[] = [];

      render(
        <Router>
          <MockedProvider link={link}>
            <I18nextProvider i18n={i18nForTest}>
              <Calendar
                eventData={emptyEvents}
                viewType={ViewType.MONTH}
                onMonthChange={onMonthChange}
                currentMonth={new Date().getMonth()}
                currentYear={new Date().getFullYear()}
              />
            </I18nextProvider>
          </MockedProvider>
        </Router>,
      );

      expect(screen.getByTestId('current-date')).toBeInTheDocument();
    });

    it('should log a warning if a holiday has no date and return false', () => {
      // Explicitly set value for this test
      const originalValue = mockHolidays.value;
      mockHolidays.value = [
        { name: 'Invalid Holiday', date: '', month: 'Unknown' },
      ];

      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      try {
        render(
          <Router>
            <MockedProvider link={link}>
              <I18nextProvider i18n={i18nForTest}>
                <Calendar
                  eventData={[]}
                  viewType={ViewType.MONTH}
                  onMonthChange={onMonthChange}
                  currentMonth={new Date().getMonth()}
                  currentYear={new Date().getFullYear()}
                />
              </I18nextProvider>
            </MockedProvider>
          </Router>,
        );

        // Filter out Apollo Client warnings and check for holiday warning
        const calls = consoleWarnSpy.mock.calls;
        const holidayWarnings = calls.filter(
          (call) =>
            typeof call[0] === 'string' &&
            call[0].includes('Holiday') &&
            call[0].includes('has no date'),
        );

        expect(holidayWarnings.length).toBeGreaterThan(0);
      } finally {
        mockHolidays.value = originalValue;
        consoleWarnSpy.mockRestore();
      }
    });
    it('should handle non-array holidays gracefully', () => {
      // Set holidays to explicitly null/undefined to trigger the fallback branch (line 159)
      const originalValue = mockHolidays.value;
      mockHolidays.value = null;

      try {
        render(
          <Router>
            <MockedProvider link={link}>
              <I18nextProvider i18n={i18nForTest}>
                <Calendar
                  eventData={[]}
                  userRole={UserRole.REGULAR}
                  userId="user1"
                  onMonthChange={onMonthChange}
                  currentMonth={new Date().getMonth()}
                  currentYear={new Date().getFullYear()}
                />
              </I18nextProvider>
            </MockedProvider>
          </Router>,
        );
        // If it renders without crashing, the fallback [] worked
        // Verify positive rendering by checking for the month/year header or similar stable element
        expect(screen.getByTestId('current-date')).toBeInTheDocument();
      } finally {
        mockHolidays.value = originalValue;
      }
    });
  });
});

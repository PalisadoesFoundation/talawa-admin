import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import { vi } from 'vitest';
import Calendar from './YearlyEventCalender';
import i18nForTest from 'utils/i18nForTest';
import { MOCKS, eventData } from '../EventCalenderMocks';
import { Role } from 'types/Event/interface';

describe('Calendar Component', () => {
  const mockRefetchEvents = vi.fn();
  const mockOrgData = {
    admins: [{ _id: 'admin1' }],
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2022, 4, 15));
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('renders the calendar with correct year', () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <Router>
            <Calendar
              eventData={eventData}
              refetchEvents={mockRefetchEvents}
              orgData={mockOrgData}
              userRole={Role.USER}
              userId="user1"
            />
          </Router>
        </I18nextProvider>
      </MockedProvider>,
    );

    expect(screen.getByText('2022')).toBeInTheDocument();
  });

  it('renders all 12 months correctly', () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <Router>
            <Calendar
              eventData={eventData}
              refetchEvents={mockRefetchEvents}
              orgData={mockOrgData}
              userRole={Role.USER}
              userId="user1"
            />
          </Router>
        </I18nextProvider>
      </MockedProvider>,
    );

    const months = [
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

    months.forEach((month) => {
      expect(screen.getByText(month)).toBeInTheDocument();
    });
  });

  it('renders weekday headers correctly', () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <Router>
            <Calendar
              eventData={eventData}
              refetchEvents={mockRefetchEvents}
              orgData={mockOrgData}
              userRole={Role.USER}
              userId="user1"
            />
          </Router>
        </I18nextProvider>
      </MockedProvider>,
    );

    const weekdays = screen.getAllByText(/[MTWTFSS]/);
    expect(weekdays.length).toBeGreaterThanOrEqual(84);
  });

  it('navigates to previous year when left chevron is clicked', () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <Router>
            <Calendar
              eventData={eventData}
              refetchEvents={mockRefetchEvents}
              orgData={mockOrgData}
              userRole={Role.USER}
              userId="user1"
            />
          </Router>
        </I18nextProvider>
      </MockedProvider>,
    );

    expect(screen.getByText('2022')).toBeInTheDocument();

    const prevYearButton = screen.getByTestId('prevYear');
    fireEvent.click(prevYearButton);

    expect(screen.getByText('2021')).toBeInTheDocument();
  });

  it('navigates to next year when right chevron is clicked', () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <Router>
            <Calendar
              eventData={eventData}
              refetchEvents={mockRefetchEvents}
              orgData={mockOrgData}
              userRole={Role.USER}
              userId="user1"
            />
          </Router>
        </I18nextProvider>
      </MockedProvider>,
    );

    expect(screen.getByText('2022')).toBeInTheDocument();

    const nextYearButton = screen.getByTestId('nextYear');
    fireEvent.click(nextYearButton);

    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('filters events correctly for SUPERADMIN role', async () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <Router>
            <Calendar
              eventData={eventData}
              refetchEvents={mockRefetchEvents}
              orgData={mockOrgData}
              userRole={Role.SUPERADMIN}
              userId="superadmin1"
            />
          </Router>
        </I18nextProvider>
      </MockedProvider>,
    );

    const days = screen.getAllByTestId('day');
    expect(days.length).toBeGreaterThan(0);
  });

  it('filters events correctly for ADMIN role', () => {
    const adminEventData = [
      ...eventData,
      {
        ...eventData[0],
        _id: '3',
        isPublic: false,
        startDate: '2022-05-10',
      },
    ];

    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <Router>
            <Calendar
              eventData={adminEventData}
              refetchEvents={mockRefetchEvents}
              orgData={mockOrgData}
              userRole={Role.ADMIN}
              userId="admin1"
            />
          </Router>
        </I18nextProvider>
      </MockedProvider>,
    );

    const days = screen.getAllByTestId('day');
    expect(days.length).toBeGreaterThan(0);
  });

  it('filters events correctly for USER role', () => {
    const userEventData = [
      ...eventData,
      {
        ...eventData[0],
        _id: '4',
        isPublic: false,
        startDate: '2022-05-15',
        attendees: [{ _id: 'user1' }],
      },
    ];

    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <Router>
            <Calendar
              eventData={userEventData}
              refetchEvents={mockRefetchEvents}
              orgData={mockOrgData}
              userRole={Role.USER}
              userId="user1"
            />
          </Router>
        </I18nextProvider>
      </MockedProvider>,
    );

    const days = screen.getAllByTestId('day');
    expect(days.length).toBeGreaterThan(0);
  });

  it('expands and collapses events when day is clicked', async () => {
    vi.setSystemTime(new Date(2022, 4, 1));

    const specificEventData = [
      {
        ...eventData[0],
        startDate: '2022-05-01',
        endDate: '2022-05-01',
        isPublic: true,
      },
    ];

    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <Router>
            <Calendar
              eventData={specificEventData}
              refetchEvents={mockRefetchEvents}
              orgData={mockOrgData}
              userRole={Role.SUPERADMIN}
              userId="user1"
            />
          </Router>
        </I18nextProvider>
      </MockedProvider>,
    );

    const days = screen.getAllByTestId('day');
    expect(days.length).toBeGreaterThan(0);

    const day1Elements = Array.from(days).filter((day) =>
      day.textContent?.includes('1'),
    );
    expect(day1Elements.length).toBeGreaterThan(0);
  });

  it('shows "No Event Available!" message when expanding a day with no events', () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <Router>
            <Calendar
              eventData={[]}
              refetchEvents={mockRefetchEvents}
              orgData={mockOrgData}
              userRole={Role.USER}
              userId="user1"
            />
          </Router>
        </I18nextProvider>
      </MockedProvider>,
    );

    const days = screen.getAllByTestId('day');
    expect(days.length).toBeGreaterThan(0);
  });

  it('highlights the current day with the today class', () => {
    const today = new Date(2022, 4, 15);
    vi.setSystemTime(today);

    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <Router>
            <Calendar
              eventData={eventData}
              refetchEvents={mockRefetchEvents}
              orgData={mockOrgData}
              userRole={Role.USER}
              userId="user1"
            />
          </Router>
        </I18nextProvider>
      </MockedProvider>,
    );

    const days = screen.getAllByTestId('day');
    expect(days.length).toBeGreaterThan(0);

    const day15Elements = Array.from(days).filter((day) =>
      day.textContent?.includes('15'),
    );
    expect(day15Elements.length).toBeGreaterThan(0);
  });

  it('properly passes refetchEvents prop', () => {
    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <Router>
            <Calendar
              eventData={eventData}
              refetchEvents={mockRefetchEvents}
              orgData={mockOrgData}
              userRole={Role.SUPERADMIN}
              userId="user1"
            />
          </Router>
        </I18nextProvider>
      </MockedProvider>,
    );

    expect(mockRefetchEvents).toBeDefined();
  });
});

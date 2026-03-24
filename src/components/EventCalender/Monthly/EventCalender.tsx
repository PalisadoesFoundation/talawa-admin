/**
 * Calendar Component
 *
 * This component renders a calendar view that supports multiple view types
 * (day, month, and year) and displays events and holidays. It provides
 * navigation between dates and months, and allows users to view event details.
 *
 * @param props - The props for the Calendar component.
 * @param eventData - Array of event data to display.
 * @param refetchEvents - Function to refetch events.
 * @param orgData - Organization data for filtering events.
 * @param userRole - Role of the current user (ADMINISTRATOR or REGULAR).
 * @param userId - ID of the current user.
 * @param viewType - The current view type (DAY, MONTH, YEAR).
 *
 * @returns The rendered Calendar component.
 *
 * @remarks
 * - The component dynamically adjusts its layout based on the screen width.
 * - Events are filtered based on user role and organization data.
 * - Holidays are displayed for the current month.
 *
 * @example
 * ```tsx
 * <Calendar
 *   eventData={events}
 *   refetchEvents={fetchEvents}
 *   orgData={organizationData}
 *   userRole={UserRole.ADMINISTRATOR}
 *   userId="12345"
 *   viewType={ViewType.MONTH}
 * />
 * ```
 *
 */
import EventListCard from 'shared-components/EventListCard/EventListCard';
import dayjs from 'dayjs';
import React, { useState, useEffect, useMemo } from 'react';
import type { JSX } from 'react';
import { useLazyQuery } from '@apollo/client';
import Button from 'shared-components/Button';
import styles from './EventCalender.module.css';
import MonthlyCalendarDays from './MonthlyCalendarDays';
import CalendarInfoCards from './CalendarInfoCards';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { ViewType } from 'screens/AdminPortal/OrganizationEvents/OrganizationEvents';
import { GET_ORGANIZATION_EVENTS_PG } from 'GraphQl/Queries/Queries';
import { holidays, weekdays, filterEvents } from 'types/Event/utils';
import YearlyEventCalender from '../Yearly/YearlyEventCalender';
import WeeklyEventCalender from '../Weekly/WeeklyEventCalender';
import type {
  InterfaceEvent,
  InterfaceEventEdge,
  InterfaceCalendarProps,
} from 'types/Event/interface';
import { useTranslation } from 'react-i18next';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { useParams } from 'react-router';

const Calendar: React.FC<
  InterfaceCalendarProps & {
    onMonthChange: (month: number, year: number) => void;
    currentMonth: number;
    currentYear: number;
  }
> = ({
  eventData,
  refetchEvents,
  orgData,
  userRole,
  userId,
  viewType,
  dayEventsResetKey,
  dayHasMoreMap = {},
  isMonthChangeDisabled = false,
  onMonthChange,
  onCurrentDateChange,
  currentMonth,
  currentYear,
  currentDateOfMonth,
}) => {
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'eventCalendar',
  });
  const { t: tErrors } = useTranslation('errors');
  const { orgId: currentUrl } = useParams();
  const [selectedDate] = useState<Date | null>(null);
  const [internalCurrentDate, setInternalCurrentDate] = useState(() =>
    new Date().getDate(),
  );
  const [events, setEvents] = useState<InterfaceEvent[] | null>(null);
  const [expanded, setExpanded] = useState<number>(-1);
  const [loadingDayKey, setLoadingDayKey] = useState<string | null>(null);
  const [dayEventsMap, setDayEventsMap] = useState<
    Record<string, InterfaceEvent[]>
  >({});
  const [windowWidth, setWindowWidth] = useState<number>(window.screen.width);
  const [fetchDayEvents] = useLazyQuery(GET_ORGANIZATION_EVENTS_PG, {
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    errorPolicy: 'all',
  });

  const currentDate = currentDateOfMonth ?? internalCurrentDate;

  const updateCurrentDate = (dayOfMonth: number): void => {
    if (onCurrentDateChange) {
      onCurrentDateChange(dayOfMonth);
      return;
    }
    setInternalCurrentDate(dayOfMonth);
  };

  const mapEdgeToEvent = (edge: InterfaceEventEdge): InterfaceEvent => {
    return {
      id: edge.node.id,
      name: edge.node.name,
      description: edge.node.description || '',
      startAt: edge.node.startAt,
      endAt: edge.node.endAt,
      startDate: edge.node.startDate,
      endDate: edge.node.endDate,
      startTime: edge.node.allDay
        ? null
        : edge.node.startAt
          ? dayjs(edge.node.startAt).format('HH:mm:ss')
          : null,
      endTime: edge.node.allDay
        ? null
        : edge.node.endAt
          ? dayjs(edge.node.endAt).format('HH:mm:ss')
          : null,
      allDay: edge.node.allDay,
      location: edge.node.location || '',
      isPublic: edge.node.isPublic,
      isRegisterable: edge.node.isRegisterable,
      isInviteOnly: edge.node.isInviteOnly,
      isRecurringEventTemplate: edge.node.isRecurringEventTemplate,
      baseEvent: edge.node.baseEvent,
      sequenceNumber: edge.node.sequenceNumber,
      totalCount: edge.node.totalCount,
      hasExceptions: edge.node.hasExceptions,
      progressLabel: edge.node.progressLabel,
      recurrenceDescription: edge.node.recurrenceDescription,
      recurrenceRule: edge.node.recurrenceRule,
      creator: {
        id: edge.node.creator?.id || '',
        name: edge.node.creator?.name || '',
      },
      attendees: edge.node.attendees || [],
    };
  };

  const buildUtcDayRange = (
    dayKey: string,
  ): { startDate: string; endDate: string } => {
    // Keep day keys stable across timezones for onlyStartOnDay filtering.
    const [year, month, day] = dayKey.split('-').map(Number);
    const startDate = new Date(
      Date.UTC(year, month - 1, day, 0, 0, 0, 0),
    ).toISOString();
    const endDate = new Date(
      Date.UTC(year, month - 1, day, 23, 59, 59, 999),
    ).toISOString();

    return { startDate, endDate };
  };

  const resetDayExpansionState = (): void => {
    setExpanded(-1);
    setLoadingDayKey(null);
    setDayEventsMap({});
  };

  const fetchFullDayEvents = async (dayKey: string): Promise<void> => {
    if (!currentUrl || loadingDayKey || dayKey in dayEventsMap) {
      return;
    }

    setLoadingDayKey(dayKey);

    try {
      const { startDate, endDate } = buildUtcDayRange(dayKey);

      const { data } = await fetchDayEvents({
        variables: {
          id: currentUrl,
          first: 25,
          after: null,
          startDate,
          endDate,
          includeRecurring: true,
          onlyStartOnDay: true,
        },
      });

      const fetchedEvents = (data?.organization?.events?.edges || []).map(
        (edge: InterfaceEventEdge) => mapEdgeToEvent(edge),
      );

      setDayEventsMap((prev) => ({
        ...prev,
        [dayKey]: fetchedEvents,
      }));
    } catch {
      // Keep preview events visible when lazy day expansion fetch fails.
    } finally {
      setLoadingDayKey(null);
    }
  };

  useEffect(() => {
    function handleResize(): void {
      setWindowWidth(window.screen.width);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const filteredEvents = filterEvents(
      eventData || [],
      orgData,
      userRole,
      userId,
    );
    setEvents(filteredEvents);
  }, [eventData, orgData, userRole, userId]);

  useEffect(() => {
    resetDayExpansionState();
  }, [currentMonth, currentYear, eventData]);

  useEffect(() => {
    if (typeof dayEventsResetKey !== 'number') {
      return;
    }
    resetDayExpansionState();
  }, [dayEventsResetKey]);

  /**
   * Moves the calendar view to the previous month.
   */
  const handlePrevMonth = (): void => {
    resetDayExpansionState();

    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    onMonthChange(newMonth, newYear);
  };

  const filteredHolidays = useMemo(() => {
    return Array.isArray(holidays)
      ? holidays.filter((holiday) => {
          if (!holiday.date) {
            console.warn(`Holiday "${holiday.name}" has no date specified.`);
            return false;
          }
          const holidayMonth = dayjs(holiday.date, 'MM-DD', true).month();
          return holidayMonth === currentMonth;
        })
      : [];
  }, [holidays, currentMonth]);

  const handleNextMonth = (): void => {
    resetDayExpansionState();

    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    onMonthChange(newMonth, newYear);
  };

  const handlePrevDate = (): void => {
    resetDayExpansionState();

    if (viewType === ViewType.WEEK) {
      const newDate = new Date(currentYear, currentMonth, currentDate - 7);
      updateCurrentDate(newDate.getDate());
      onMonthChange(newDate.getMonth(), newDate.getFullYear());
    } else if (currentDate > 1) {
      updateCurrentDate(currentDate - 1);
    } else {
      const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const lastDayOfPrevMonth = new Date(newYear, newMonth + 1, 0).getDate();
      updateCurrentDate(lastDayOfPrevMonth);
      onMonthChange(newMonth, newYear);
    }
  };

  const handleNextDate = (): void => {
    resetDayExpansionState();

    if (viewType === ViewType.WEEK) {
      const newDate = new Date(currentYear, currentMonth, currentDate + 7);
      updateCurrentDate(newDate.getDate());
      onMonthChange(newDate.getMonth(), newDate.getFullYear());
    } else {
      const lastDayOfCurrentMonth = new Date(
        currentYear,
        currentMonth + 1,
        0,
      ).getDate();
      if (currentDate < lastDayOfCurrentMonth) {
        updateCurrentDate(currentDate + 1);
      } else {
        const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        updateCurrentDate(1);
        onMonthChange(newMonth, newYear);
      }
    }
  };

  const handleTodayButton = (): void => {
    resetDayExpansionState();

    const today = new Date();
    onMonthChange(today.getMonth(), today.getFullYear());
    updateCurrentDate(today.getDate());
  };

  const timezoneString = `UTC${new Date().getTimezoneOffset() > 0 ? '-' : '+'}${String(
    Math.floor(Math.abs(new Date().getTimezoneOffset()) / 60),
  ).padStart(
    2,
    '0',
  )}:${String(Math.abs(new Date().getTimezoneOffset()) % 60).padStart(2, '0')}`;

  const renderHours = (): JSX.Element => {
    const toggleExpand = (index: number): void => {
      if (expanded === index) setExpanded(-1);
      else setExpanded(index);
    };

    // Filter events for the current date
    const currentDateEvents =
      events?.filter((datas) => {
        const currDate = new Date(currentYear, currentMonth, currentDate);
        const currDateStr = dayjs(currDate).format('YYYY-MM-DD');

        // For all-day events, use startDate
        if (datas.allDay && datas.startDate) {
          return datas.startDate === currDateStr;
        }

        // For timed events, use startAt
        if (datas.startAt) {
          return dayjs(datas.startAt).format('YYYY-MM-DD') === currDateStr;
        }

        return false;
      }) || [];

    // Map events to EventListCard components
    const allDayEventsList: JSX.Element[] = currentDateEvents.map(
      (datas: InterfaceEvent) => (
        <EventListCard
          refetchEvents={refetchEvents}
          userRole={userRole}
          key={datas.id}
          id={datas.id}
          location={datas.location}
          name={datas.name}
          description={datas.description}
          startAt={datas.startAt}
          endAt={datas.endAt}
          startDate={datas.startDate}
          endDate={datas.endDate}
          startTime={datas.startTime}
          endTime={datas.endTime}
          allDay={datas.allDay}
          isPublic={datas.isPublic}
          isRegisterable={datas.isRegisterable}
          isInviteOnly={Boolean(datas.isInviteOnly)}
          isRecurringEventTemplate={datas.isRecurringEventTemplate}
          baseEvent={datas.baseEvent}
          sequenceNumber={datas.sequenceNumber}
          totalCount={datas.totalCount}
          hasExceptions={datas.hasExceptions}
          progressLabel={datas.progressLabel}
          recurrenceDescription={datas.recurrenceDescription}
          recurrenceRule={datas.recurrenceRule}
          creator={datas.creator}
          attendees={datas.attendees}
        />
      ),
    );

    const shouldShowViewMore =
      allDayEventsList.length > 2 ||
      (windowWidth <= 700 && allDayEventsList.length > 0);

    const handleExpandClick: () => void = () => {
      toggleExpand(-100);
    };

    return (
      <>
        <div className={styles.calendar_hour_block} data-testid="hour">
          <div className={styles.calendar_hour_text_container}>
            <p className={styles.calendar_timezone_text}>{timezoneString}</p>
          </div>
          <div className={styles.dummyWidth}></div>
          <div
            className={
              allDayEventsList?.length > 0
                ? styles.event_list_parent_current
                : styles.event_list_parent
            }
          >
            <div
              className={
                expanded === -100
                  ? styles.expand_list_container_day
                  : styles.list_container
              }
            >
              <div
                className={
                  expanded === -100
                    ? styles.expand_event_list
                    : styles.event_list_hour
                }
              >
                {Array.isArray(allDayEventsList) &&
                allDayEventsList.length > 0 ? (
                  expanded === -100 ? (
                    allDayEventsList // Show all events when expanded
                  ) : (
                    allDayEventsList.slice(0, 2) // Show up to 2 events when not expanded
                  )
                ) : (
                  <p className={styles.no_events_message}>
                    {t('noEventsAvailable')}
                  </p>
                )}
              </div>
              {Array.isArray(allDayEventsList) && shouldShowViewMore && (
                <Button
                  variant="primary"
                  className={styles.btn__more}
                  onClick={handleExpandClick}
                  data-testid="view-more-button"
                >
                  {expanded === -100 ? t('viewLess') : t('viewAll')}
                </Button>
              )}
            </div>
          </div>
        </div>

        <CalendarInfoCards
          filteredHolidays={filteredHolidays}
          currentYear={currentYear}
          language={i18n.language}
        />
      </>
    );
  };

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <div className={styles.calendar}>
        {viewType !== ViewType.YEAR && (
          <div className={styles.calendar__header}>
            <div className={styles.calender_month}>
              <div className={styles.navigation_buttons}>
                <Button
                  variant="outlined"
                  className={styles.buttonEventCalendar}
                  disabled={isMonthChangeDisabled}
                  onClick={
                    viewType === ViewType.DAY || viewType === ViewType.WEEK
                      ? handlePrevDate
                      : handlePrevMonth
                  }
                  data-testid="prevmonthordate"
                >
                  <ChevronLeft />
                </Button>

                <Button
                  variant="outlined"
                  className={styles.buttonEventCalendar}
                  disabled={isMonthChangeDisabled}
                  onClick={
                    viewType === ViewType.DAY || viewType === ViewType.WEEK
                      ? handleNextDate
                      : handleNextMonth
                  }
                  data-testid="nextmonthordate"
                >
                  <ChevronRight />
                </Button>
                <div
                  className={styles.calendar__header_month}
                  data-testid="current-date"
                >
                  {viewType === ViewType.DAY ? `${currentDate} ` : ''}
                  {currentYear}{' '}
                  {dayjs()
                    .month(currentMonth)
                    .locale(i18n.language)
                    .format('MMMM')}
                </div>
              </div>
            </div>
            <div>
              <Button
                className={styles.editButton}
                disabled={isMonthChangeDisabled}
                onClick={handleTodayButton}
                data-testid="today"
              >
                {t('today')}
              </Button>
            </div>
          </div>
        )}
        <div>
          {viewType === ViewType.MONTH ? (
            <>
              <div className={styles.calendar__weekdays}>
                {weekdays.map((weekday, index) => (
                  <div key={index} className={styles.weekday}>
                    {weekday}
                  </div>
                ))}
              </div>
              <div className={styles.calendar__days}>
                <MonthlyCalendarDays
                  currentYear={currentYear}
                  currentMonth={currentMonth}
                  selectedDate={selectedDate}
                  expanded={expanded}
                  loadingDayKey={loadingDayKey}
                  windowWidth={windowWidth}
                  events={events}
                  dayEventsMap={dayEventsMap}
                  dayHasMoreMap={dayHasMoreMap}
                  filteredHolidays={filteredHolidays}
                  userRole={userRole}
                  userId={userId}
                  refetchEvents={refetchEvents}
                  toggleExpand={(index) => {
                    if (expanded === index) setExpanded(-1);
                    else setExpanded(index);
                  }}
                  fetchFullDayEvents={fetchFullDayEvents}
                />
              </div>
              <CalendarInfoCards
                filteredHolidays={filteredHolidays}
                currentYear={currentYear}
                language={i18n.language}
              />
            </>
          ) : viewType === ViewType.YEAR ? (
            <YearlyEventCalender
              eventData={eventData}
              refetchEvents={refetchEvents}
              orgData={orgData}
              userRole={userRole}
              userId={userId}
            />
          ) : viewType === ViewType.WEEK ? (
            <WeeklyEventCalender
              eventData={eventData}
              refetchEvents={refetchEvents}
              orgData={orgData}
              userRole={userRole}
              userId={userId}
              currentDate={new Date(currentYear, currentMonth, currentDate)}
            />
          ) : (
            <div className={styles.calendar__hours}>{renderHours()}</div>
          )}
        </div>
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default Calendar;

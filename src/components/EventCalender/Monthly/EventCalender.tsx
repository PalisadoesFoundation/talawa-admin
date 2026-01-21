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
import EventListCard from 'components/EventListCard/EventListCard';
import dayjs from 'dayjs';
import React, { useState, useEffect, useMemo } from 'react';
import type { JSX } from 'react';
import Button from 'shared-components/Button';
import styles from './EventCalender.module.css';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { ViewType } from 'screens/AdminPortal/OrganizationEvents/OrganizationEvents';
import HolidayCard from '../../HolidayCards/HolidayCard';
import { holidays, months, weekdays } from 'types/Event/utils';
import YearlyEventCalender from '../Yearly/YearlyEventCalender';
import type {
  InterfaceEvent,
  InterfaceCalendarProps,
  InterfaceIOrgList,
} from 'types/Event/interface';
import { UserRole } from 'types/Event/interface';
import { useTranslation } from 'react-i18next';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';

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
  onMonthChange,
  currentMonth,
  currentYear,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'eventCalendar' });
  const { t: tErrors } = useTranslation('errors');
  const [selectedDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(() => new Date().getDate());
  const [events, setEvents] = useState<InterfaceEvent[] | null>(null);
  const [expanded, setExpanded] = useState<number>(-1);
  const [windowWidth, setWindowWidth] = useState<number>(window.screen.width);

  useEffect(() => {
    function handleResize(): void {
      setWindowWidth(window.screen.width);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filterData = (
    eventData: InterfaceEvent[],
    orgData?: InterfaceIOrgList,
    userRole?: string,
    userId?: string,
  ): InterfaceEvent[] => {
    // If no user info, only show public events
    if (!userRole || !userId) {
      return eventData.filter((event) => event.isPublic);
    }

    // Admins see everything
    if (userRole === UserRole.ADMINISTRATOR) {
      return eventData;
    }

    // For regular users:
    // - Backend already filters Organization Members events based on membership
    // - We need to check Invite Only events for creator OR attendee status
    // - All other events returned by backend should be shown
    return eventData.filter((event) => {
      // Creator always sees their own events
      if (event.creator && event.creator.id === userId) {
        return true;
      }

      // Public events - always visible (backend returns them)
      if (event.isPublic) {
        return true;
      }

      // Invite Only events - visible to creator OR attendees
      if (event.isInviteOnly) {
        const isCreator = event.creator && event.creator.id === userId;
        const isAttendee = event.attendees?.some(
          (attendee) => attendee.id === userId,
        );
        return isCreator || isAttendee;
      }

      // Organization Members events - check membership
      // If not public and not invite-only, it must be an organization event
      // Check if user is a member of the organization
      const isMember =
        orgData?.members?.edges?.some((edge) => edge.node.id === userId) ||
        !orgData?.members ||
        false;

      return isMember || false;
    });
  };

  useEffect(() => {
    const filteredEvents = filterData(
      eventData || [],
      orgData,
      userRole,
      userId,
    );
    setEvents(filteredEvents);
  }, [eventData, orgData, userRole, userId]);

  /**
   * Moves the calendar view to the previous month.
   */
  const handlePrevMonth = (): void => {
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
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    onMonthChange(newMonth, newYear);
  };

  const handlePrevDate = (): void => {
    if (currentDate > 1) {
      setCurrentDate(currentDate - 1);
    } else {
      const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const lastDayOfPrevMonth = new Date(newYear, newMonth + 1, 0).getDate();
      setCurrentDate(lastDayOfPrevMonth);
      onMonthChange(newMonth, newYear);
    }
  };

  const handleNextDate = (): void => {
    const lastDayOfCurrentMonth = new Date(
      currentYear,
      currentMonth + 1,
      0,
    ).getDate();
    if (currentDate < lastDayOfCurrentMonth) {
      setCurrentDate(currentDate + 1);
    } else {
      const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      setCurrentDate(1);
      onMonthChange(newMonth, newYear);
    }
  };

  const handleTodayButton = (): void => {
    const today = new Date();
    onMonthChange(today.getMonth(), today.getFullYear());
    setCurrentDate(today.getDate());
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
        return (
          dayjs(datas.startAt).format('YYYY-MM-DD') ===
          dayjs(currDate).format('YYYY-MM-DD')
        );
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
                  ? styles.expand_list_container
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
                <button
                  className={styles.btn__more}
                  onClick={handleExpandClick}
                  data-testid="view-more-button"
                >
                  {expanded === -100 ? 'View less' : 'View all'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={styles.calendar_infocards}>
          <div
            className={styles.holidays_card}
            role="region"
            aria-label={t('holidays')}
          >
            <h3 className={styles.card_title}>{t('holidays')}</h3>
            <ul className={styles.card_list}>
              {filteredHolidays.map((holiday, index) => (
                <li className={styles.card_list_item} key={index}>
                  <span className={styles.holiday_date}>
                    {months[parseInt(holiday.date.slice(0, 2), 10) - 1]}{' '}
                    {holiday.date.slice(3)}
                  </span>
                  <span className={styles.holiday_name}>{holiday.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={styles.events_card}
            role="region"
            aria-label={t('events')}
          >
            <h3 className={styles.card_title}>{t('events')}</h3>
            <div className={styles.legend}>
              <div className={styles.eventsLegend}>
                <span className={styles.organizationIndicator}></span>
                <span className={styles.legendText}>
                  {t('eventsCreatedByOrganization')}
                </span>
              </div>
              <div className={styles.list_container_holidays}>
                <span className={styles.holidayIndicator}></span>
                <span className={styles.holidayText}>{t('holidays')}</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderDays = (): JSX.Element[] => {
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth(),
      monthStart.getDate() - monthStart.getDay(),
    );
    const endDate = new Date(
      monthEnd.getFullYear(),
      monthEnd.getMonth(),
      monthEnd.getDate() + (6 - monthEnd.getDay()),
    );
    const days = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      days.push(currentDate);
      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1,
      );
    }

    return days.map((date, index) => {
      const today = new Date();
      const className = [
        date.getDay() === 0 || date.getDay() === 6 ? styles.day_weekends : '',
        date.toLocaleDateString() === today.toLocaleDateString()
          ? styles.day__today
          : '',
        date.getMonth() !== currentMonth ? styles.day__outside : '',
        selectedDate?.getTime() === date.getTime() ? styles.day__selected : '',
        styles.day,
      ].join(' ');
      const toggleExpand = (index: number): void => {
        if (expanded === index) setExpanded(-1);
        else setExpanded(index);
      };

      const allEventsList: JSX.Element[] =
        events
          ?.filter(
            (datas) =>
              dayjs(datas.startAt).format('YYYY-MM-DD') ===
              dayjs(date).format('YYYY-MM-DD'),
          )
          .map((datas: InterfaceEvent) => (
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
              startTime={datas.startTime}
              endTime={datas.endTime}
              allDay={datas.allDay}
              isPublic={datas.isPublic}
              isRegisterable={datas.isRegisterable}
              isInviteOnly={Boolean(datas.isInviteOnly)}
              attendees={datas.attendees || []}
              creator={datas.creator}
              userId={userId}
              // Recurring event fields
              isRecurringEventTemplate={datas.isRecurringEventTemplate}
              baseEvent={datas.baseEvent}
              sequenceNumber={datas.sequenceNumber}
              totalCount={datas.totalCount}
              hasExceptions={datas.hasExceptions}
              progressLabel={datas.progressLabel}
              recurrenceDescription={datas.recurrenceDescription}
              recurrenceRule={datas.recurrenceRule}
            />
          )) || [];

      const holidayList: JSX.Element[] = filteredHolidays
        .filter((holiday) => holiday.date === dayjs(date).format('MM-DD'))
        .map((holiday) => (
          <HolidayCard key={holiday.name} holidayName={holiday.name} />
        ));

      const shouldShowViewMore =
        allEventsList.length > 2 ||
        (windowWidth <= 700 && allEventsList.length > 0);

      return (
        <div
          key={index}
          className={`${className} ${allEventsList?.length > 0 ? styles.day__events : ''}`}
          data-testid="day"
          data-has-events={allEventsList?.length > 0}
        >
          {date.getDate()}
          {date.getMonth() !== currentMonth ? null : (
            <div
              className={expanded === index ? styles.expand_list_container : ''}
            >
              <div
                className={
                  expanded === index
                    ? styles.expand_event_list
                    : styles.event_list
                }
              >
                <div>{holidayList}</div>
                {expanded === index
                  ? allEventsList
                  : holidayList?.length > 0
                    ? allEventsList?.slice(0, 1)
                    : allEventsList?.slice(0, 2)}
              </div>
              {shouldShowViewMore && (
                <button
                  className={styles.btn__more}
                  data-testid="more"
                  onClick={() => toggleExpand(index)}
                >
                  {expanded === index ? 'View less' : 'View all'}
                </button>
              )}
            </div>
          )}
        </div>
      );
    });
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
                  onClick={
                    viewType === ViewType.DAY ? handlePrevDate : handlePrevMonth
                  }
                  data-testid="prevmonthordate"
                >
                  <ChevronLeft />
                </Button>

                <Button
                  variant="outlined"
                  className={styles.buttonEventCalendar}
                  onClick={
                    viewType === ViewType.DAY ? handleNextDate : handleNextMonth
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
                  {currentYear} {months[currentMonth]}
                </div>
              </div>
            </div>
            <div>
              <Button
                className={styles.editButton}
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
              <div className={styles.calendar__days}>{renderDays()}</div>
            </>
          ) : viewType === ViewType.YEAR ? (
            <YearlyEventCalender
              eventData={eventData}
              refetchEvents={refetchEvents}
              orgData={orgData}
              userRole={userRole}
              userId={userId}
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

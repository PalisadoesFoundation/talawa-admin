/**
 * Yearly Event Calendar Component
 *
 * This component renders a yearly calendar view with events displayed
 * for each day. It allows navigation between years and provides
 * functionality to expand and view events for specific days.
 *
 * @param  props - The props for the calendar component.
 * @param eventData - Array of event data to display.
 * @param refetchEvents - Function to refetch events.
 * @param orgData - Organization data for filtering events.
 * @param userRole - Role of the user for access control.
 * @param userId - ID of the user for filtering events they are attending.
 *
 * @returns JSX.Element The rendered yearly calendar component.
 *
 * @remarks
 * - The calendar supports filtering events based on user role, organization data, and user ID.
 * - Events can be expanded to view more details or collapsed for a compact view.
 * - Navigation buttons allow switching between years.
 *
 * @example
 * ```tsx
 * <Calendar
 *   eventData={eventData}
 *   refetchEvents={refetchEvents}
 *   orgData={orgData}
 *   userRole={UserRole.ADMINISTRATOR}
 *   userId="12345"
 * />
 * ```
 *
 */
import EventListCard from 'components/EventListCard/EventListCard';
import dayjs from 'dayjs';
import Button from 'shared-components/Button';
import React, { useState, useEffect, type JSX } from 'react';
import styles from './YearlyEventCalender.module.css';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  type InterfaceEvent,
  type InterfaceCalendarProps,
  type InterfaceIOrgList,
  UserRole,
} from 'types/Event/interface';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { useTranslation } from 'react-i18next';

const Calendar: React.FC<InterfaceCalendarProps> = ({
  eventData,
  refetchEvents,
  orgData,
  userRole,
  userId,
}) => {
  const { t: tErrors } = useTranslation('errors');
  const { t: tCommon } = useTranslation('common');
  const { t } = useTranslation('translation', { keyPrefix: 'userEvents' });
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<InterfaceEvent[] | null>(null);
  const [expandedY, setExpandedY] = useState<string | null>(null);

  const weekdaysShorthand = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
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

  /**
   * Filters events based on user role, organization data, and user ID.
   *
   * @param eventData - Array of event data to filter.
   * @param orgData - Organization data for filtering events (includes members).
   * @param userRole - Role of the user for access control (ADMINISTRATOR or REGULAR).
   * @param userId - ID of the user for filtering events they are attending.
   * @returns Filtered array of event data.
   */
  const filterData = (
    eventData: InterfaceEvent[],
    orgData?: InterfaceIOrgList,
    userRole?: UserRole,
    userId?: string,
  ): InterfaceEvent[] => {
    const filteredEvents: InterfaceEvent[] = [];

    if (!eventData) return filteredEvents;

    if (!userRole || !userId) {
      return eventData.filter((event) => event.isPublic);
    }

    if (userRole === UserRole.ADMINISTRATOR) {
      return eventData; // Administrators see all events
    }

    // For REGULAR users
    eventData.forEach((event) => {
      if (event.isPublic) {
        filteredEvents.push(event);
        return;
      }

      const isMember = orgData?.members?.edges.some(
        (edge) => edge.node.id === userId,
      );
      if (isMember) {
        filteredEvents.push(event);
      }
    });

    return filteredEvents;
  };

  useEffect(() => {
    const filteredEvents = filterData(
      eventData,
      orgData,
      userRole as UserRole | undefined,
      userId,
    );
    setEvents(filteredEvents);
  }, [eventData, orgData, userRole, userId]);

  const handlePrevYear = (): void => {
    setCurrentYear((prevYear) => prevYear - 1);
  };

  const handleNextYear = (): void => {
    setCurrentYear((prevYear) => prevYear + 1);
  };

  const renderMonthDays = (): JSX.Element[] => {
    const renderedMonths: JSX.Element[] = [];

    for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
      const monthStart = new Date(currentYear, monthIdx, 1);
      const monthEnd = new Date(currentYear, monthIdx + 1, 0);

      const startDate = new Date(monthStart);
      const dayOfWeek = startDate.getDay();
      const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate.setDate(diff);

      const endDate = new Date(monthEnd);
      const endDayOfWeek = endDate.getDay();
      const diffEnd =
        endDate.getDate() + (6 - endDayOfWeek) + (endDayOfWeek === 0 ? 1 : 0);
      endDate.setDate(diffEnd);

      const days: Date[] = [];
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const renderedDays = days.map((date, dayIdx) => {
        const isToday =
          date.toLocaleDateString() === today.toLocaleDateString();
        const isOutsideMonth = date.getMonth() !== monthIdx;
        const className = [
          isToday ? styles.day__today : '',
          isOutsideMonth ? styles.day__outside : '',
          styles.day__yearly,
        ].join(' ');

        const eventsForDate =
          events?.filter((event) => dayjs(event.startAt).isSame(date, 'day')) ||
          [];

        const toggleExpand = (index: string): void => {
          setExpandedY((prev) => (prev === index ? null : index));
        };

        const renderedEvents = eventsForDate.map((event) => (
          <EventListCard
            refetchEvents={refetchEvents}
            userRole={userRole}
            key={event.id}
            id={event.id}
            location={event.location}
            name={event.name}
            description={event.description}
            startAt={event.startAt}
            endAt={event.endAt}
            startTime={event.startTime}
            endTime={event.endTime}
            allDay={event.allDay}
            isPublic={event.isPublic}
            isRegisterable={event.isRegisterable}
            isInviteOnly={event.isInviteOnly}
            attendees={event.attendees || []}
            creator={event.creator}
            userId={userId}
          />
        ));

        const expandKey = `${monthIdx}-${dayIdx}`;

        return (
          <div
            key={expandKey}
            className={`${className} ${eventsForDate.length > 0 ? styles.day__events : ''}`}
            data-testid="day"
          >
            {date.getDate()}
            <div
              className={
                expandedY === expandKey ? styles.expand_list_container : ''
              }
            >
              <div
                className={
                  expandedY === expandKey
                    ? styles.expand_event_list
                    : styles.event_list
                }
              >
                {expandedY === expandKey && renderedEvents}
              </div>
              {eventsForDate.length > 0 ? (
                <button
                  className={styles.btn__more}
                  onClick={() => toggleExpand(expandKey)}
                  data-testid={`expand-btn-${expandKey}`}
                >
                  {expandedY === expandKey ? (
                    <div className={styles.closebtnYearlyEventCalender}>
                      <br />
                      <p>{tCommon('close')}</p>
                    </div>
                  ) : (
                    <div className={styles.circularButton}></div>
                  )}
                </button>
              ) : (
                <button
                  className={styles.btn__more}
                  onClick={() => toggleExpand(expandKey)}
                  data-testid={`no-events-btn-${expandKey}`}
                >
                  {expandedY === expandKey ? (
                    <div className={styles.closebtnYearlyEventCalender}>
                      <br />
                      <br />
                      {t('noEventAvailable')}
                      <br />
                      <p>{tCommon('close')}</p>
                    </div>
                  ) : (
                    <div className={styles.circularButton}></div>
                  )}
                </button>
              )}
            </div>
          </div>
        );
      });

      renderedMonths.push(
        <div className={styles.columnYearlyEventCalender} key={monthIdx}>
          <div className={styles.cardYearlyEventCalender}>
            <h6 className={styles.cardHeaderYearlyEventCalender}>
              {months[monthIdx]}
            </h6>
            <div className={styles.calendar__weekdays}>
              {weekdaysShorthand.map((weekday, idx) => (
                <div key={idx} className={styles.weekday__yearly}>
                  {weekday}
                </div>
              ))}
            </div>
            <div className={styles.calendar__days}>{renderedDays}</div>
          </div>
        </div>,
      );
    }

    return renderedMonths;
  };

  /**
   * Renders the yearly calendar with navigation buttons.
   *
   * @returns JSX.Element - The rendered yearly calendar component.
   */
  const renderYearlyCalendar = (): JSX.Element => {
    return (
      <div className={styles.yearlyCalendar}>
        <div className={styles.yearlyCalendarHeader}>
          <Button
            variant="outlined"
            className={styles.buttonEventCalendar}
            onClick={handlePrevYear}
            data-testid="prevYear"
          >
            <ChevronLeft />
          </Button>
          <div className={styles.year}>{currentYear}</div>
          <Button
            variant="outlined"
            className={styles.buttonEventCalendar}
            onClick={handleNextYear}
            data-testid="nextYear"
          >
            <ChevronRight />
          </Button>
        </div>
        <div className={styles.rowYearlyEventCalender}>{renderMonthDays()}</div>
      </div>
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
        <div className={styles.yearlyCalender}>{renderYearlyCalendar()}</div>
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default Calendar;

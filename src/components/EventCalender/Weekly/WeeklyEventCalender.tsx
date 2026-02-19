/**
 * Weekly Event Calendar Component
 *
 * This component renders a weekly calendar view with events displayed
 * for each day and time slot. It allows users to view events scheduled
 * for the current week, filtered by organization and user role.
 *
 * @param props - The props for the calendar component.
 * @param eventData - Array of event data to display in the weekly view.
 * @param refetchEvents - Function to refetch events.
 * @param orgData - Organization data for filtering events.
 * @param userRole - Role of the user for access control.
 * @param userId - ID of the user for filtering events they are attending.
 * @param currentDate - The current date to determine the week to display.
 *
 * @returns JSX.Element The rendered weekly calendar component.
 *
 * @remarks
 * - The calendar supports filtering events based on user role, organization data, and user ID.
 * - Displays a grid for each day of the week with time slots.
 * - Events are positioned based on their start time and duration.
 *
 * @example
 * ```tsx
 * <WeeklyEventCalender
 *   eventData={eventData}
 *   refetchEvents={refetchEvents}
 *   orgData={orgData}
 *   userRole={UserRole.ADMINISTRATOR}
 *   userId="12345"
 *   currentDate={new Date()}
 * />
 * ```
 */
import React, { type JSX, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
// Parse event times as UTC to match how EventForm stores them
import styles from './WeeklyEventCalender.module.css';
dayjs.extend(utc);
import EventListCard from 'shared-components/EventListCard/EventListCard';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import { filterEvents } from 'types/Event/utils';
import type { InterfaceCalendarProps } from 'types/Event/interface';

export interface InterfaceWeeklyEventCalenderProps extends InterfaceCalendarProps {
  currentDate: Date;
}

const WeeklyEventCalender: React.FC<InterfaceWeeklyEventCalenderProps> = ({
  eventData,
  refetchEvents,
  orgData,
  userRole,
  userId,
  currentDate,
}) => {
  const { t: tErrors } = useTranslation('errors');
  const { t } = useTranslation('translation', {
    keyPrefix: 'weeklyEventCalender',
  });

  const getWeekStart = React.useCallback((date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // adjust when day is sunday
    return new Date(d.setDate(diff));
  }, []);

  const weekStart = useMemo(
    () => getWeekStart(currentDate),
    [currentDate, getWeekStart],
  );

  const events = useMemo(
    () => filterEvents(eventData || [], orgData, userRole, userId),
    [eventData, orgData, userRole, userId],
  );

  // Generate 24-hour time slots
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  const CELL_HEIGHT_PX = 80; // matches --space-12 (5rem = 80px) in CSS

  const getEventStyle = (start: string, end: string) => {
    // Use dayjs.utc() so hours/minutes match the UTC values stored by EventForm
    const startDate = dayjs.utc(start);
    const endDate = dayjs.utc(end);
    // Clamp to current day boundaries
    const startHour = startDate.hour();
    const startMinute = startDate.minute();
    const endOfDay = startDate.endOf('day');
    const clampedEnd = endDate.isAfter(endOfDay) ? endOfDay : endDate;
    const durationMinutes = Math.max(clampedEnd.diff(startDate, 'minute'), 15); // minimum 15min visibility

    const top = (startHour + startMinute / 60) * CELL_HEIGHT_PX;
    const height = Math.max((durationMinutes / 60) * CELL_HEIGHT_PX, 20); // min 20px so tiny events are visible

    // Google Calendar style: slight offset based on hour to allow overlapping visibility
    // Offset cycles every 3 hours (0, 2, 4... hours get different offsets)
    const offsetIndex = Math.floor(startHour / 3) % 3;
    const offsetPercent = offsetIndex * 2.5; // 0%, 2.5%, 5% offset

    return {
      top: `${top}px`,
      height: `${height}px`,
      left: `${2.5 + offsetPercent}%`,
    };
  };

  const renderTimeColumn = (): JSX.Element => {
    return (
      <div className={styles.timeColumn} role="presentation">
        <div className={styles.timeHeader} role="presentation"></div>
        {timeSlots.map((hour) => (
          <div key={hour} className={styles.timeSlot} role="presentation">
            <span className={styles.timeLabel}>
              {dayjs().hour(hour).minute(0).format('h A')}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const handleDayKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number,
  ): void => {
    const columns =
      document.querySelectorAll<HTMLDivElement>('[data-weekly-col]');
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = columns[index + 1];
      if (next) next.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = columns[index - 1];
      if (prev) prev.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      (e.currentTarget as HTMLElement).click();
    }
  };

  const renderWeekDays = (): JSX.Element[] => {
    const days: JSX.Element[] = [];
    const currentWeekStart = new Date(weekStart);

    for (let i = 0; i < 7; i++) {
      const tempDate = new Date(currentWeekStart);
      tempDate.setDate(currentWeekStart.getDate() + i);

      const eventsForDate =
        events?.filter((event) => {
          const eventStart = dayjs.utc(event.startAt).local().startOf('day');
          const eventEnd = dayjs.utc(event.endAt).local().startOf('day');
          const current = dayjs(tempDate).startOf('day');
          return (
            current.isSame(eventStart) ||
            current.isSame(eventEnd) ||
            (current.isAfter(eventStart) && current.isBefore(eventEnd))
          );
        }) || [];

      const dayLabel = dayjs(tempDate).format('dddd, MMMM D, YYYY');
      const isToday = dayjs(tempDate).isSame(dayjs(), 'day');

      days.push(
        <div
          key={i}
          className={styles.dayColumn}
          role="gridcell"
          aria-label={dayLabel}
          tabIndex={0}
          data-weekly-col={i}
          onKeyDown={(e) => handleDayKeyDown(e, i)}
        >
          <div
            className={`${styles.dayHeader} ${
              isToday ? styles.todayHighlight : ''
            }`}
            role="columnheader"
            aria-label={dayLabel}
          >
            <span className={styles.dayName} aria-hidden="true">
              {dayjs(tempDate).format('ddd')}
            </span>
            <span className={styles.dayDate} aria-hidden="true">
              {dayjs(tempDate).format('D')}
            </span>
          </div>
          <div className={styles.dayGrid} role="presentation">
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className={styles.gridCell}
                role="row"
                aria-label={dayjs().hour(hour).minute(0).format('h A')}
              ></div>
            ))}
            {eventsForDate.map((event) => {
              return (
                <div
                  key={event.id}
                  className={`${styles.eventContainer} ${styles.eventCard}`}
                  style={getEventStyle(event.startAt, event.endAt)}
                  tabIndex={0}
                >
                  <EventListCard
                    {...event}
                    refetchEvents={refetchEvents}
                    userRole={userRole}
                    userId={userId}
                  />
                  <div className={styles.eventTime}>
                    {dayjs.utc(event.startAt).local().format('h:mm A')} -{' '}
                    {dayjs.utc(event.endAt).local().format('h:mm A')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>,
      );
    }
    return days;
  };

  return (
    <ErrorBoundaryWrapper
      fallbackErrorMessage={tErrors('defaultErrorMessage')}
      fallbackTitle={tErrors('title')}
      resetButtonAriaLabel={tErrors('resetButtonAriaLabel')}
      resetButtonText={tErrors('resetButton')}
    >
      <div
        className={styles.weeklyCalendar}
        data-testid="weekly-calendar-container"
      >
        <div className={styles.calendarBody}>
          {renderTimeColumn()}
          <div
            className={styles.weekGrid}
            role="grid"
            aria-label={t('weeklyCalendarAriaLabel')}
          >
            {renderWeekDays()}
          </div>
        </div>
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default WeeklyEventCalender;

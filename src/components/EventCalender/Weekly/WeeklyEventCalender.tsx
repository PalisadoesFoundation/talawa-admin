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
import React, { type JSX, useEffect, useMemo, useRef } from 'react';
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
  const weeklyCalendarRef = useRef<HTMLDivElement | null>(null);

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
  const ALL_DAY_LANE_BASE_HEIGHT_PX = 40; // matches --space-10 (2.5rem)
  const ALL_DAY_EVENT_HEIGHT_PX = 32; // matches --space-8 (2rem)
  const ALL_DAY_LANE_PADDING_PX = 8; // top + bottom padding (2 * --space-1)
  const ALL_DAY_LANE_GAP_PX = 4; // matches --space-1

  const getTimedEventPlacement = (
    start: string,
    end: string,
    dayDate: Date,
  ) => {
    // Position timed events in the local-time grid for the rendered day.
    const startDate = dayjs.utc(start).local();
    const endDate = dayjs.utc(end).local();
    const dayStart = dayjs(dayDate).startOf('day');
    const dayEnd = dayjs(dayDate).endOf('day');

    const clampedStart = startDate.isBefore(dayStart) ? dayStart : startDate;
    const clampedEnd = endDate.isAfter(dayEnd) ? dayEnd : endDate;

    const startHour = clampedStart.hour();
    const startMinute = clampedStart.minute();
    const durationMinutes = Math.max(
      clampedEnd.diff(clampedStart, 'minute'),
      15,
    ); // minimum 15min visibility

    const top = (startHour + startMinute / 60) * CELL_HEIGHT_PX;
    const height = Math.max((durationMinutes / 60) * CELL_HEIGHT_PX, 20); // min 20px so tiny events are visible

    return {
      clampedStart,
      clampedEnd,
      top,
      height,
    };
  };

  const getTimedEventStyle = (
    top: number,
    height: number,
    columnIndex: number,
    columnCount: number,
  ): React.CSSProperties => {
    const safeColumnCount = Math.max(columnCount, 1);
    const availableWidthPercent = 96;
    const widthPercent = availableWidthPercent / safeColumnCount;
    const horizontalPaddingPercent = 2;
    const gutterPercent = 0.5;

    return {
      top: `${top}px`,
      height: `${height}px`,
      left: `${horizontalPaddingPercent + widthPercent * columnIndex}%`,
      width: `${Math.max(widthPercent - gutterPercent, 8)}%`,
      zIndex: columnIndex + 1,
    };
  };

  const weekDates = useMemo(() => {
    const dates: Date[] = [];
    const currentWeekStart = new Date(weekStart);

    for (let i = 0; i < 7; i++) {
      const tempDate = new Date(currentWeekStart);
      tempDate.setDate(currentWeekStart.getDate() + i);
      dates.push(tempDate);
    }

    return dates;
  }, [weekStart]);

  const getEventsForDate = React.useCallback(
    (date: Date) =>
      events?.filter((event) => {
        const current = dayjs(date).startOf('day');

        if (event.allDay) {
          // For all-day events, use startDate and endDate
          if (!event.startDate) return false;
          const eventStart = dayjs(event.startDate).startOf('day');
          // Backend stores all-day endDate as exclusive (RFC 5545)
          const eventEndExclusive = event.endDate
            ? dayjs(event.endDate).startOf('day')
            : eventStart.add(1, 'day');
          return (
            current.isSame(eventStart) ||
            (current.isAfter(eventStart) && current.isBefore(eventEndExclusive))
          );
        }

        // For timed events, use startAt and endAt
        if (!event.startAt || !event.endAt) return false;
        const eventStart = dayjs.utc(event.startAt).local();
        const eventEnd = dayjs.utc(event.endAt).local();
        const dayStart = current;
        const nextDayStart = dayStart.add(1, 'day');

        // Half-open interval overlap: [eventStart, eventEnd) intersects [dayStart, nextDayStart)
        // This avoids showing events on days where they only touch the midnight boundary.
        return eventEnd.isAfter(dayStart) && eventStart.isBefore(nextDayStart);
      }) || [],
    [events],
  );

  const allDayLaneHeight = useMemo(() => {
    const maxAllDayEvents = weekDates.reduce((max, date) => {
      const allDayCount = getEventsForDate(date).filter(
        (event) => event.allDay,
      ).length;
      return Math.max(max, allDayCount);
    }, 0);

    if (maxAllDayEvents === 0) {
      return ALL_DAY_LANE_BASE_HEIGHT_PX;
    }

    return Math.max(
      ALL_DAY_LANE_BASE_HEIGHT_PX,
      ALL_DAY_LANE_PADDING_PX +
        maxAllDayEvents * ALL_DAY_EVENT_HEIGHT_PX +
        (maxAllDayEvents - 1) * ALL_DAY_LANE_GAP_PX,
    );
  }, [
    weekDates,
    getEventsForDate,
    ALL_DAY_LANE_BASE_HEIGHT_PX,
    ALL_DAY_EVENT_HEIGHT_PX,
    ALL_DAY_LANE_PADDING_PX,
    ALL_DAY_LANE_GAP_PX,
  ]);

  useEffect(() => {
    if (!weeklyCalendarRef.current) return;

    weeklyCalendarRef.current.style.setProperty(
      '--all-day-lane-height',
      `${allDayLaneHeight}px`,
    );

    return () => {
      weeklyCalendarRef.current?.style.removeProperty('--all-day-lane-height');
    };
  }, [allDayLaneHeight]);

  const renderTimeColumn = (): JSX.Element => {
    return (
      <div className={styles.timeColumn} role="presentation">
        <div className={styles.timeHeader} role="presentation"></div>
        <div className={styles.allDaySpacer} role="presentation"></div>
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

    for (let i = 0; i < weekDates.length; i++) {
      const tempDate = weekDates[i];

      const eventsForDate = getEventsForDate(tempDate);

      const allDayEventsForDate = eventsForDate.filter((event) => event.allDay);
      const timedEventsForDate = eventsForDate.filter((event) => !event.allDay);

      const positionedTimedEvents = (() => {
        const withPlacement = timedEventsForDate
          .filter((event) => event.startAt && event.endAt)
          .map((event) => ({
            event,
            ...getTimedEventPlacement(
              event.startAt as string,
              event.endAt as string,
              tempDate,
            ),
          }))
          .filter((entry) => entry.clampedEnd.isAfter(entry.clampedStart))
          .sort((a, b) => {
            const startDiff =
              a.clampedStart.valueOf() - b.clampedStart.valueOf();
            if (startDiff !== 0) return startDiff;
            return a.clampedEnd.valueOf() - b.clampedEnd.valueOf();
          });

        const overlapGroups: (typeof withPlacement)[] = [];
        let currentGroup: typeof withPlacement = [];
        let currentGroupLatestEnd: dayjs.Dayjs | null = null;

        withPlacement.forEach((entry) => {
          if (
            currentGroup.length === 0 ||
            (currentGroupLatestEnd &&
              entry.clampedStart.isBefore(currentGroupLatestEnd))
          ) {
            currentGroup.push(entry);
            currentGroupLatestEnd =
              currentGroupLatestEnd &&
              currentGroupLatestEnd.isAfter(entry.clampedEnd)
                ? currentGroupLatestEnd
                : entry.clampedEnd;
            return;
          }

          overlapGroups.push(currentGroup);
          currentGroup = [entry];
          currentGroupLatestEnd = entry.clampedEnd;
        });

        if (currentGroup.length > 0) {
          overlapGroups.push(currentGroup);
        }

        return overlapGroups.flatMap((group) => {
          const columnEndTimes: dayjs.Dayjs[] = [];

          const withColumns = group.map((entry) => {
            let assignedColumn = -1;
            for (let col = 0; col < columnEndTimes.length; col++) {
              if (!entry.clampedStart.isBefore(columnEndTimes[col])) {
                assignedColumn = col;
                break;
              }
            }

            if (assignedColumn === -1) {
              assignedColumn = columnEndTimes.length;
              columnEndTimes.push(entry.clampedEnd);
            } else {
              columnEndTimes[assignedColumn] = entry.clampedEnd;
            }

            return {
              ...entry,
              columnIndex: assignedColumn,
            };
          });

          const columnCount = Math.max(columnEndTimes.length, 1);

          return withColumns.map((entry) => ({
            ...entry,
            columnCount,
          }));
        });
      })();

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
          <div className={styles.allDayLane} role="presentation">
            {allDayEventsForDate.map((event) => (
              <div
                key={event.id}
                className={`${styles.allDayEventCard} ${styles.eventCard}`}
                tabIndex={0}
              >
                <EventListCard
                  {...event}
                  refetchEvents={refetchEvents}
                  userRole={userRole}
                  userId={userId}
                />
                <div className={styles.eventTime}>{t('allDay')}</div>
              </div>
            ))}
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
            {positionedTimedEvents.map(
              ({ event, top, height, columnIndex, columnCount }) => {
                return (
                  <div
                    key={event.id}
                    className={`${styles.eventContainer} ${styles.eventCard}`}
                    style={getTimedEventStyle(
                      top,
                      height,
                      columnIndex,
                      columnCount,
                    )}
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
              },
            )}
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
        ref={weeklyCalendarRef}
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

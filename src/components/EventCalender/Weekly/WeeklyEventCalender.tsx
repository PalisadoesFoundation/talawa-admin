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
import { UserRole } from 'types/Event/interface';
dayjs.extend(utc);
import EventListCard from 'shared-components/EventListCard/EventListCard';
import { ErrorBoundaryWrapper } from 'shared-components/ErrorBoundaryWrapper/ErrorBoundaryWrapper';
import type {
  InterfaceEvent,
  InterfaceCalendarProps,
  InterfaceIOrgList,
} from 'types/Event/interface';

export interface InterfaceWeeklyEventCalenderProps extends InterfaceCalendarProps {
  currentDate: Date;
}

const filterData = (
  data: InterfaceEvent[],
  organization?: InterfaceIOrgList,
  role?: string,
  uid?: string, // user id
): InterfaceEvent[] => {
  if (!data) return [];

  if (!role || !uid) {
    return data.filter((event) => event.isPublic);
  }

  if (role === UserRole.ADMINISTRATOR) {
    return data;
  }

  return data.filter((event) => {
    // Creator always sees their own events
    if (event.creator && event.creator.id === uid) {
      return true;
    }

    // Public events - always visible
    if (event.isPublic) {
      return true;
    }

    // Invite Only events - visible to creator OR attendees
    if (event.isInviteOnly) {
      const isCreator = event.creator && event.creator.id === uid;
      const isAttendee = event.attendees?.some(
        (attendee) => attendee.id === uid,
      );
      return isCreator || isAttendee;
    }

    // Organization Members events - check membership
    // If not public and not invite-only, it must be an organization event
    // Check if user is a member of the organization
    const isMember =
      organization?.members?.edges?.some((edge) => edge.node.id === uid) ||
      !organization?.members ||
      false;

    return isMember || false;
  });
};

const WeeklyEventCalender: React.FC<InterfaceWeeklyEventCalenderProps> = ({
  eventData,
  refetchEvents,
  orgData,
  userRole,
  userId,
  currentDate,
}) => {
  const { t: tErrors } = useTranslation('errors');

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
    () => filterData(eventData || [], orgData, userRole, userId),
    [eventData, orgData, userRole, userId],
  );

  // Generate 24-hour time slots
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  const CELL_HEIGHT_PX = 80; // matches --space-12 (5rem = 80px) in CSS

  const getEventStyle = (
    start: string,
    end: string,
    colIndex = 0,
    colCount = 1,
  ) => {
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

    // Divide the column width evenly; leave a small gap between columns
    const GAP = 2; // px gap between side-by-side events
    const totalWidth = 95; // % of day column used
    const colWidth = (totalWidth - GAP * (colCount - 1)) / colCount;
    const left = colIndex * (colWidth + GAP) + 2.5; // 2.5% left margin

    return {
      top: `${top}px`,
      height: `${height}px`,
      width: `${colWidth}%`,
      left: `${left}%`,
    };
  };

  /**
   * Groups events that overlap in time and assigns each a column index.
   * @returns a Map from event id → `{ colIndex, colCount }`.
   */
  const computeColumns = (
    evts: InterfaceEvent[],
  ): Map<string, { colIndex: number; colCount: number }> => {
    // Sort by start time
    const sorted = [...evts].sort((a, b) =>
      dayjs(a.startAt).diff(dayjs(b.startAt)),
    );

    // Each "cluster" is a group of events that all overlap with at least one other
    const result = new Map<string, { colIndex: number; colCount: number }>();
    // columns[i] = end time of the last event placed in column i
    const columns: number[] = [];

    for (const evt of sorted) {
      const start = dayjs(evt.startAt).valueOf();
      const end = dayjs(evt.endAt).valueOf();

      // Find the first column whose last event ends at or before this event starts
      let placed = false;
      for (let c = 0; c < columns.length; c++) {
        if (columns[c] <= start) {
          columns[c] = end;
          result.set(evt.id, { colIndex: c, colCount: 0 }); // colCount filled later
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push(end);
        result.set(evt.id, { colIndex: columns.length - 1, colCount: 0 });
      }
    }

    // colCount = total number of columns in use (all events in the same cluster share it)
    // Simple approach: colCount = columns.length for all events in this day
    const colCount = columns.length;
    for (const [id, info] of result) {
      result.set(id, { ...info, colCount });
    }

    return result;
  };

  const renderTimeColumn = (): JSX.Element => {
    return (
      <div className={styles.timeColumn}>
        <div className={styles.timeHeader}></div>
        {timeSlots.map((hour) => (
          <div key={hour} className={styles.timeSlot}>
            <span className={styles.timeLabel}>
              {dayjs().hour(hour).minute(0).format('h A')}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderWeekDays = (): JSX.Element[] => {
    const days: JSX.Element[] = [];
    const currentWeekStart = new Date(weekStart);

    for (let i = 0; i < 7; i++) {
      const tempDate = new Date(currentWeekStart);
      tempDate.setDate(currentWeekStart.getDate() + i);

      const eventsForDate =
        events?.filter((event) => {
          const eventStart = dayjs(event.startAt).startOf('day');
          const eventEnd = dayjs(event.endAt).startOf('day');
          const current = dayjs(tempDate).startOf('day');
          return (
            current.isSame(eventStart) ||
            current.isSame(eventEnd) ||
            (current.isAfter(eventStart) && current.isBefore(eventEnd))
          );
        }) || [];

      // Compute side-by-side column layout for overlapping events
      const columnMap = computeColumns(eventsForDate);

      days.push(
        <div key={i} className={styles.dayColumn}>
          <div
            className={`${styles.dayHeader} ${
              dayjs(tempDate).isSame(dayjs(), 'day')
                ? styles.todayHighlight
                : ''
            }`}
          >
            <span className={styles.dayName}>
              {dayjs(tempDate).format('ddd')}
            </span>
            <span className={styles.dayDate}>
              {dayjs(tempDate).format('D')}
            </span>
          </div>
          <div className={styles.dayGrid}>
            {timeSlots.map((hour) => (
              <div key={hour} className={styles.gridCell}></div>
            ))}
            {eventsForDate.map((event) => {
              const col = columnMap.get(event.id) ?? {
                colIndex: 0,
                colCount: 1,
              };
              return (
                <div
                  key={event.id}
                  className={styles.eventContainer}
                  style={getEventStyle(
                    event.startAt,
                    event.endAt,
                    col.colIndex,
                    col.colCount,
                  )}
                >
                  <EventListCard
                    {...event}
                    refetchEvents={refetchEvents}
                    userRole={userRole}
                    userId={userId}
                  />
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
      <div className={styles.weeklyCalendar}>
        <div className={styles.calendarBody}>
          {renderTimeColumn()}
          <div className={styles.weekGrid}>{renderWeekDays()}</div>
        </div>
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default WeeklyEventCalender;

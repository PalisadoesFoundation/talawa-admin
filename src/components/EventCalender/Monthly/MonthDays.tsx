import EventListCard from 'components/EventListCard/EventListCard';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import type { JSX } from 'react';
import styles from './EventCalender.module.css';
import HolidayCard from '../../HolidayCards/HolidayCard';
import { months } from 'types/Event/utils';
import type { InterfaceHoliday } from 'types/Event/utils';
import type { InterfaceEvent } from 'types/Event/interface';

interface MonthDaysProps {
  events: InterfaceEvent[] | null;
  currentYear: number;
  currentMonth: number;
  selectedDate: Date | null;
  refetchEvents?: () => void;
  userRole?: string;
  userId?: string;
  filteredHolidays: InterfaceHoliday[];
  windowWidth: number;
  t: (key: string) => string;
}

/**
 * Renders the grid of day cells for the monthly calendar view.
 *
 * Each cell displays the day number, any matching holidays, and a filtered
 * list of events for that date. Events are filtered by the parent based on
 * user role and organisation membership before being passed in.
 *
 * @param props - The component props.
 * @param props.events - Pre-filtered events to display (may be null while loading).
 * @param props.currentYear - The year currently being viewed.
 * @param props.currentMonth - Zero-based month index currently being viewed.
 * @param props.selectedDate - The date the user has explicitly selected, if any.
 * @param props.refetchEvents - Callback forwarded to EventListCard to refresh data after mutations.
 * @param props.userRole - Role of the current user, forwarded to EventListCard.
 * @param props.userId - ID of the current user, forwarded to EventListCard.
 * @param props.filteredHolidays - Holidays that fall within the current month.
 * @param props.windowWidth - Current viewport width used to adjust the visible event count.
 * @param props.t - i18n translation function scoped to the eventCalendar namespace.
 *
 * @returns A fragment of day-cell `div` elements forming the month grid.
 */
const MonthDays: React.FC<MonthDaysProps> = ({
  events,
  currentYear,
  currentMonth,
  selectedDate,
  refetchEvents,
  userRole,
  userId,
  filteredHolidays,
  windowWidth,
  t,
}) => {
  const [expanded, setExpanded] = useState<number>(-1);

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
  const days: Date[] = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    days.push(currentDate);
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1,
    );
  }

  const toggleExpand = (index: number): void => {
    if (expanded === index) setExpanded(-1);
    else setExpanded(index);
  };

  return (
    <>
      {days.map((date, index) => {
        const today = new Date();
        const isOutsideMonth = date.getMonth() !== currentMonth;
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const className = [
          isWeekend && !isOutsideMonth ? styles.day_weekends : '',
          date.toLocaleDateString() === today.toLocaleDateString()
            ? styles.day__today
            : '',
          isOutsideMonth ? styles.day__outside : '',
          selectedDate?.getTime() === date.getTime()
            ? styles.day__selected
            : '',
          styles.day,
        ].join(' ');

        const allEventsList: JSX.Element[] =
          events
            ?.filter(
              (event) =>
                dayjs(event.startAt).format('YYYY-MM-DD') ===
                dayjs(date).format('YYYY-MM-DD'),
            )
            .map((event: InterfaceEvent) => (
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
                isInviteOnly={Boolean(event.isInviteOnly)}
                attendees={event.attendees || []}
                creator={event.creator}
                userId={userId}
                isRecurringEventTemplate={event.isRecurringEventTemplate}
                baseEvent={event.baseEvent}
                sequenceNumber={event.sequenceNumber}
                totalCount={event.totalCount}
                hasExceptions={event.hasExceptions}
                progressLabel={event.progressLabel}
                recurrenceDescription={event.recurrenceDescription}
                recurrenceRule={event.recurrenceRule}
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
            <span
              className={`${styles.day_number} ${isOutsideMonth ? styles.day_number_outside : ''}`}
            >
              {date.getDate()}
              {isOutsideMonth && (index === 0 || date.getDate() === 1) && (
                <span className={styles.day_month}>
                  {' '}
                  {months[date.getMonth()]}
                </span>
              )}
            </span>
            {isOutsideMonth ? null : (
              <div
                className={
                  expanded === index ? styles.expand_list_container : ''
                }
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
                    type="button"
                    className={styles.btn__more}
                    data-testid="more"
                    onClick={() => toggleExpand(index)}
                  >
                    {expanded === index ? t('viewLess') : t('viewAll')}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default MonthDays;

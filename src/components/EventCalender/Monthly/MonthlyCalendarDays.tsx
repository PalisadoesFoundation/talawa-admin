import React from 'react';
import type { JSX } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import Button from 'shared-components/Button';
import EventListCard from 'shared-components/EventListCard/EventListCard';
import HolidayCard from '../../HolidayCards/HolidayCard';
import type { InterfaceEvent } from 'types/Event/interface';
import styles from './MonthlyCalendarDays.module.css';

type Holiday = {
  name: string;
  date: string;
};

/**
 * Props for {@link MonthlyCalendarDays}.
 */
type MonthlyCalendarDaysProps = {
  /** Current calendar year displayed in the month grid. */
  currentYear: number;
  /** Current calendar month displayed in the month grid (0-indexed). */
  currentMonth: number;
  /** Currently selected date in month view, if any. */
  selectedDate: Date | null;
  /** Expanded day index in the rendered grid (-1 when none). */
  expanded: number;
  /** Day key currently being lazy-loaded for "View All". */
  loadingDayKey: string | null;
  /** Window width used to adjust "View All" behavior on small screens. */
  windowWidth: number;
  /** Base event list for the visible date range. */
  events: InterfaceEvent[] | null;
  /** Cached fully-fetched event lists keyed by day string. */
  dayEventsMap: Record<string, InterfaceEvent[]>;
  /** Map of day keys indicating that preview data has more events. */
  dayHasMoreMap: Record<string, boolean>;
  /** Holidays available for the current month. */
  filteredHolidays: Holiday[];
  /** Current user role used by event cards. */
  userRole?: string;
  /** Current user id used by event cards. */
  userId?: string;
  /** Callback for refetching events after card actions. */
  refetchEvents?: (() => void) | undefined;
  /** Expands or collapses the event list for a given day index. */
  toggleExpand: (index: number) => void;
  /** Lazy-loads full day events when preview indicates there are more. */
  fetchFullDayEvents: (dayKey: string) => Promise<void>;
};

/**
 * Renders the month grid day cells with holidays, preview events,
 * and lazy "View All" support for days with additional events.
 *
 * @param props - Grid rendering state, data, and callbacks from the parent calendar.
 * @returns JSX elements representing all visible day cells for the current month view.
 */
const MonthlyCalendarDays: React.FC<MonthlyCalendarDaysProps> = ({
  currentYear,
  currentMonth,
  selectedDate,
  expanded,
  loadingDayKey,
  windowWidth,
  events,
  dayEventsMap,
  dayHasMoreMap,
  filteredHolidays,
  userRole,
  userId,
  refetchEvents,
  toggleExpand,
  fetchFullDayEvents,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'eventCalendar',
  });

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

  const today = new Date();

  return (
    <>
      {days.map((date, index) => {
        const className = [
          date.getDay() === 0 || date.getDay() === 6 ? styles.day_weekends : '',
          date.toLocaleDateString() === today.toLocaleDateString()
            ? styles.day__today
            : '',
          date.getMonth() !== currentMonth ? styles.day__outside : '',
          selectedDate?.getTime() === date.getTime()
            ? styles.day__selected
            : '',
          styles.day,
        ].join(' ');

        const dayKey = dayjs.utc(date).local().format('YYYY-MM-DD');
        const baseEventsForDay: InterfaceEvent[] =
          events?.filter((event) => {
            const dateStr = dayjs.utc(date).local().format('YYYY-MM-DD');

            if (event.allDay && event.startDate) {
              return event.startDate === dateStr;
            }

            if (event.startAt) {
              return (
                dayjs.utc(event.startAt).local().format('YYYY-MM-DD') ===
                dateStr
              );
            }

            return false;
          }) || [];

        const fetchedEventsForDay = dayEventsMap[dayKey];
        const resolvedEventsForDay: InterfaceEvent[] =
          fetchedEventsForDay && fetchedEventsForDay.length > 0
            ? fetchedEventsForDay
            : baseEventsForDay;

        const allEventsList: JSX.Element[] = resolvedEventsForDay.map(
          (event) => (
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
              startDate={event.startDate}
              endDate={event.endDate}
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
          ),
        );

        const holidayList: JSX.Element[] = filteredHolidays
          .filter((holiday) => holiday.date === dayjs(date).format('MM-DD'))
          .map((holiday) => (
            <HolidayCard key={holiday.name} holidayName={holiday.name} />
          ));

        const shouldShowViewMore =
          allEventsList.length > 2 ||
          (windowWidth <= 700 && allEventsList.length > 0) ||
          Boolean(dayHasMoreMap[dayKey]);

        const handleViewToggle = async (): Promise<void> => {
          if (expanded === index) {
            toggleExpand(index);
            return;
          }

          if (dayHasMoreMap[dayKey] && dayEventsMap[dayKey] === undefined) {
            await fetchFullDayEvents(dayKey);
          }

          toggleExpand(index);
        };

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
                  <Button
                    variant="primary"
                    className={styles.btn__more}
                    data-testid="more"
                    disabled={loadingDayKey === dayKey}
                    onClick={() => {
                      void handleViewToggle();
                    }}
                  >
                    {loadingDayKey === dayKey
                      ? t('loading')
                      : expanded === index
                        ? t('viewLess')
                        : t('viewAll')}
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default MonthlyCalendarDays;

import EventListCard from 'components/EventListCard/EventListCard';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import type { JSX } from 'react';
import styles from './EventCalender.module.css';
import HolidayCard from '../../HolidayCards/HolidayCard';
import { months } from 'types/Event/utils';
import type { InterfaceEvent } from 'types/Event/interface';

interface Holiday {
  name: string;
  date: string;
  month: string;
}

interface MonthDaysProps {
  events: InterfaceEvent[] | null;
  currentYear: number;
  currentMonth: number;
  selectedDate: Date | null;
  refetchEvents?: () => void;
  userRole?: string;
  userId?: string;
  filteredHolidays: Holiday[];
  windowWidth: number;
}

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
      })}
    </>
  );
};

export default MonthDays;
